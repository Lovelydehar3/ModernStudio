import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="relative border-t border-[var(--accent-pink)]/15 bg-gradient-to-b from-[var(--surface)] to-[var(--bg-primary)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-8 py-16 text-sm text-[var(--text-muted)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-heading text-xl uppercase tracking-[0.1em] text-[var(--text-primary)]">
            Modern<span className="text-[var(--accent-pink)]">.</span>Wedding<span className="text-[var(--accent-pink)]">.</span>Studios
          </p>
          <p className="mt-2">Wedding Films & Portrait Photography by Arun</p>
        </div>
        <div className="flex flex-col gap-1 md:items-end">
          <p>modernweddingstudios@gmail.com</p>
          <div className="flex gap-4 mt-2">
            <Link to="/privacy-policy" className="hover:text-[var(--accent-pink)] transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-[var(--accent-pink)] transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
          <p className="mt-2 text-[var(--accent-pink)]">Crafting stories since 2020</p>
        </div>
      </div>
      <div className="h-[2px] bg-gradient-to-r from-[var(--accent-pink)] via-[var(--accent-purple)] to-[var(--accent-light)]" />
    </footer>
  );
}

export default Footer;
