import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-4">
          <div className="text-center">
            <h1 className="font-heading text-4xl text-[var(--text-primary)]">Something went wrong</h1>
            <p className="mt-4 text-[var(--text-muted)]">An unexpected error occurred.</p>
            <a
              href="/"
              className="mt-6 inline-block rounded-full bg-[var(--accent-purple)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Go Home
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
