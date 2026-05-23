import { useEffect, useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { homeApi } from "../../services/homeApi";
import { extractApiError } from "../../lib/formatters";
import { useToast } from "../../components/ui/ToastContext";
import { CardSkeleton } from "../../components/ui/Skeleton";

function HomeContentPage() {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    heroTitle: "",
    heroSubtitle: "",
    heroBackgroundMedia: "",
    aboutSnippet: "",
    ctaText: "",
    ctaLink: "",
    statsText: "[]",
    sectionBlocksText: "{}"
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await homeApi.getAdmin();
        const data = response.data.data || {};
        setForm({
          heroTitle: data.heroTitle || "",
          heroSubtitle: data.heroSubtitle || "",
          heroBackgroundMedia: data.heroBackgroundMedia || "",
          aboutSnippet: data.aboutSnippet || "",
          ctaText: data.ctaText || "",
          ctaLink: data.ctaLink || "",
          statsText: JSON.stringify(data.stats || [], null, 2),
          sectionBlocksText: JSON.stringify(data.sectionBlocks || {}, null, 2)
        });
      } catch (error) {
        showToast(extractApiError(error), "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [showToast]);

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      setIsSaving(true);
      const payload = {
        heroTitle: form.heroTitle,
        heroSubtitle: form.heroSubtitle,
        heroBackgroundMedia: form.heroBackgroundMedia,
        aboutSnippet: form.aboutSnippet,
        ctaText: form.ctaText,
        ctaLink: form.ctaLink,
        stats: JSON.parse(form.statsText || "[]"),
        sectionBlocks: JSON.parse(form.sectionBlocksText || "{}")
      };

      await homeApi.update(payload);
      showToast("Home content updated successfully", "success");
    } catch (error) {
      if (error instanceof SyntaxError) {
        showToast("Invalid JSON in stats or sectionBlocks.", "error");
      } else {
        showToast(extractApiError(error), "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <h2 className="font-heading text-5xl uppercase">Manage Homepage Content</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">All homepage text and section blocks are editable here.</p>
        <div className="mt-6">
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-heading text-5xl uppercase">Manage Homepage Content</h2>
      <p className="mt-1 text-sm text-[var(--text-muted)]">All homepage text and section blocks are editable here.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSave}>
        <Input
          label="Hero Title"
          value={form.heroTitle}
          onChange={(event) => setForm((prev) => ({ ...prev, heroTitle: event.target.value }))}
          required
        />
        <Input
          label="Hero Subtitle"
          value={form.heroSubtitle}
          onChange={(event) => setForm((prev) => ({ ...prev, heroSubtitle: event.target.value }))}
          required
        />
        <Input
          label="Hero Background URL"
          value={form.heroBackgroundMedia}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, heroBackgroundMedia: event.target.value }))
          }
        />
        <Input
          label="CTA Text"
          value={form.ctaText}
          onChange={(event) => setForm((prev) => ({ ...prev, ctaText: event.target.value }))}
        />
        <Input
          label="CTA Link"
          value={form.ctaLink}
          onChange={(event) => setForm((prev) => ({ ...prev, ctaLink: event.target.value }))}
        />

        <label className="flex flex-col gap-2 text-sm text-[var(--text-muted)]">
          <span className="font-medium">About Snippet</span>
          <textarea
            rows={4}
            value={form.aboutSnippet}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, aboutSnippet: event.target.value }))
            }
            className="rounded-xl border border-[var(--accent-pink)]/10 bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition-all duration-300 focus:border-[var(--accent-purple)] focus:ring-2 focus:ring-[var(--accent-purple)]/30"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-[var(--text-muted)]">
          <span className="font-medium">Stats JSON</span>
          <textarea
            rows={6}
            value={form.statsText}
            onChange={(event) => setForm((prev) => ({ ...prev, statsText: event.target.value }))}
            className="rounded-xl border border-[var(--accent-pink)]/10 bg-[var(--surface)] px-4 py-3 font-mono text-sm text-[var(--text-primary)] outline-none transition-all duration-300 focus:border-[var(--accent-purple)] focus:ring-2 focus:ring-[var(--accent-purple)]/30"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-[var(--text-muted)]">
          <span className="font-medium">Section Blocks JSON</span>
          <textarea
            rows={8}
            value={form.sectionBlocksText}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, sectionBlocksText: event.target.value }))
            }
            className="rounded-xl border border-[var(--accent-pink)]/10 bg-[var(--surface)] px-4 py-3 font-mono text-sm text-[var(--text-primary)] outline-none transition-all duration-300 focus:border-[var(--accent-purple)] focus:ring-2 focus:ring-[var(--accent-purple)]/30"
          />
        </label>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Homepage Content"}
        </Button>
      </form>
    </div>
  );
}

export default HomeContentPage;
