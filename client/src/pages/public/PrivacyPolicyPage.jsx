import SEO from "../../components/common/SEO";
import FadeUpReveal from "../../components/motion/FadeUpReveal";

function PrivacyPolicyPage() {
  return (
    <div className="section-space px-8">
      <SEO
        title="Privacy Policy"
        description="Privacy Policy for Modern Wedding Studios. Learn how we collect, use, and protect your personal information."
      />
      <div className="mx-auto max-w-3xl">
        <FadeUpReveal>
          <h1 className="font-heading text-5xl md:text-6xl text-[var(--text-primary)] mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-neutral max-w-none space-y-8 text-[var(--text-secondary)] leading-relaxed">
            <p className="text-sm text-[var(--text-muted)]">
              Last updated: May 2026
            </p>

            {/* TODO: Add your privacy policy content below */}
            <section>
              <h2 className="font-heading text-2xl text-[var(--text-primary)] mb-4">Information We Collect</h2>
              <p>[Your content here]</p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-[var(--text-primary)] mb-4">How We Use Your Information</h2>
              <p>[Your content here]</p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-[var(--text-primary)] mb-4">Data Security</h2>
              <p>[Your content here]</p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-[var(--text-primary)] mb-4">Cookies</h2>
              <p>[Your content here]</p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-[var(--text-primary)] mb-4">Third-Party Services</h2>
              <p>[Your content here]</p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-[var(--text-primary)] mb-4">Your Rights</h2>
              <p>[Your content here]</p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-[var(--text-primary)] mb-4">Contact Us</h2>
              <p>[Your content here]</p>
            </section>
          </div>
        </FadeUpReveal>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;
