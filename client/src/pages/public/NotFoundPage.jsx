import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-4">
      <div className="text-center">
        <p className="font-heading text-8xl text-[var(--accent-purple)]">404</p>
        <h1 className="mt-4 font-heading text-3xl text-[var(--text-primary)]">Page not found</h1>
        <p className="mt-3 text-[var(--text-muted)]">The page you are looking for does not exist.</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-full bg-[var(--accent-purple)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
