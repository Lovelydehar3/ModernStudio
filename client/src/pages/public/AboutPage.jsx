import { useEffect, useMemo, useState } from "react";
import SectionHeading from "../../components/common/SectionHeading";
import FadeUpReveal from "../../components/motion/FadeUpReveal";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { homeApi } from "../../services/homeApi";
import { inquiryApi } from "../../services/inquiryApi";
import { extractApiError } from "../../lib/formatters";
import SEO from "../../components/common/SEO";

const brandStatements = [
  "I don't just record weddings -- I tell love stories through film.",
  "Every portrait session is an opportunity to reveal something real.",
  "Based in India, available for destination weddings across the country."
];

function AboutPage() {
  const [homeContent, setHomeContent] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const response = await homeApi.getPublic();
        setHomeContent(response.data.data);
      } catch (_error) {
        setHomeContent(null);
      }
    };
    fetchHome();
  }, []);

  const statements = useMemo(() => {
    const items = homeContent?.sectionBlocks?.brandStatements;
    return Array.isArray(items) && items.length ? items : brandStatements;
  }, [homeContent]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      await inquiryApi.create({ ...form, sourcePage: "about" });
      setForm({ name: "", email: "", phone: "", message: "" });
      window.alert("Message sent successfully.");
    } catch (error) {
      window.alert(extractApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section-space px-8">
      <SEO title="About Arun" description="Meet Arun — freelance wedding cinematographer and portrait photographer. Crafting timeless love stories through film." />
      <div className="mx-auto max-w-7xl">
        <FadeUpReveal>
          <SectionHeading
            eyebrow="About"
            title="About Arun | Modern Wedding Studios"
            description={
              homeContent?.aboutSnippet ||
              "I'm Arun, a freelance wedding cinematographer and portrait photographer. Modern Wedding Studios is my creative practice -- where every wedding film and model portfolio is crafted with cinematic intent."
            }
          />
        </FadeUpReveal>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <FadeUpReveal>
            <div className="space-y-6">
              {statements.map((statement) => (
                <Card key={statement}>
                  <p data-reveal className="text-lg text-[var(--text-secondary)]">
                    {statement}
                  </p>
                </Card>
              ))}
            </div>
          </FadeUpReveal>

          <FadeUpReveal>
            <Card className="bg-[var(--surface)] border-[var(--accent-pink)]/10 backdrop-blur-2xl">
              <h3 className="font-heading text-4xl uppercase text-[var(--text-primary)]">Get in Touch</h3>
              <p className="mt-3 text-sm text-[var(--text-muted)]">modernweddingstudios@gmail.com</p>
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <Input
                  label="Name"
                  name="name"
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
                  }
                />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
                  }
                />
                <Input
                  label="Phone"
                  name="phone"
                  value={form.phone}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
                  }
                />
                <label className="flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
                  <span className="font-medium">Message</span>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
                    }
                    className="rounded-xl border border-[var(--accent-pink)]/[0.15] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-all duration-400 focus:border-[var(--accent-pink)] focus:ring-2 focus:ring-[var(--accent-pink)]/15"
                  />
                </label>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Card>
          </FadeUpReveal>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
