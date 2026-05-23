import SEO from "../../components/common/SEO";
import FadeUpReveal from "../../components/motion/FadeUpReveal";

function TermsPage() {
  return (
    <div className="section-space px-8">
      <SEO
        title="Terms of Service"
        description="Terms of Service for Modern Wedding Studios. Read our terms and conditions for using our services."
      />
      <div className="mx-auto max-w-3xl">
        <FadeUpReveal>
          <h1 className="font-heading text-5xl md:text-6xl text-[var(--text-primary)] mb-8">
            Terms of Service
          </h1>

          <div className="prose prose-neutral max-w-none space-y-8 text-[var(--text-secondary)] leading-relaxed">
            <p className="text-sm text-[var(--text-muted)]">
              Last updated: May 2026
            </p>

            {/* TODO: Add your terms of service content below */}
            <section>
              <h2 className="font-heading text-2xl text-[var(--text-primary)] mb-4">Services</h2>
              <p>[Your content here]</p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-[var(--text-primary)] mb-4">Bookings & Payments</h2>
              <p>[Your content here]</p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-[var(--text-primary)] mb-4">Cancellations & Refunds</h2>
              <p>[Your content here]</p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-[var(--text-primary)] mb-4">Intellectual Property</h2>
              <p>[Your content here]</p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-[var(--text-primary)] mb-4">Limitation of Liability</h2>
              <p>[Your content here]</p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-[var(--text-primary)] mb-4">Changes to Terms</h2>
              <p>[Your content here]</p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-[var(--text-primary)] mb-4">Contact</h2>
              <p>[Your content here]</p>
            </section>
          </div>
        </FadeUpReveal>
      </div>
    </div>
  );
}

export default TermsPage;
