import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import clsx from "clsx";
import useNavbarBlurOnScroll from "../../hooks/useNavbarBlurOnScroll";
import { publicNavLinks } from "../../constants/navLinks";
import { userAuthStore } from "../../store/userAuthStore";
import ProfileDropdown from "./ProfileDropdown";

function Navbar() {
  const isScrolled = useNavbarBlurOnScroll();
  const [isOpen, setIsOpen] = useState(false);

  // Re-read on every render so logout/login is reactive
  const user = userAuthStore.getUser();

  return (
    <>
      <style>{`
        @keyframes navShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes logoGlow {
          0%, 100% { text-shadow: 0 0 8px rgba(216,167,177,0.0); }
          50% { text-shadow: 0 0 20px rgba(216,167,177,0.25); }
        }
        @keyframes pillPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(216,167,177,0.2); }
          50% { box-shadow: 0 0 12px 2px rgba(216,167,177,0.1); }
        }
        .nav-link-active::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, #D8A7B1, #8B7AA8, #C98C9C);
          border-radius: 2px;
          animation: navShimmer 2s ease-in-out infinite;
          background-size: 200% 100%;
        }
        .logo-animate {
          animation: logoGlow 4s ease-in-out infinite;
        }
        .book-pill {
          animation: pillPulse 3s ease-in-out infinite;
        }
      `}</style>

      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          isScrolled
            ? "border-b border-[var(--card-border)] bg-[var(--bg-primary)]/95 backdrop-blur-2xl shadow-[0_4px_30px_rgba(31,31,31,0.04)]"
            : "bg-[var(--bg-primary)]/60 backdrop-blur-xl"
        )}
      >
        {/* Top gradient accent bar */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[var(--accent-pink)] via-[var(--accent-purple)] to-[var(--accent-light)]" />

        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-4">
          {/* Logo */}
          <Link to="/" className="logo-animate font-heading text-3xl uppercase tracking-[0.12em] text-[var(--text-primary)] transition-all duration-500 hover:text-[var(--accent-pink)]">
            Modern<span className="text-[var(--accent-pink)]">.</span>Wedding<span className="text-[var(--accent-pink)]">.</span>Stories
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-2 md:flex">
            {publicNavLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  clsx(
                    "relative px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-400 rounded-full",
                    isActive
                      ? "text-[var(--accent-pink)] bg-[var(--accent-pink)]/[0.08] nav-link-active"
                      : "text-[var(--text-muted)] hover:text-[var(--accent-pink)] hover:bg-[var(--accent-pink)]/[0.04]"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <span className="nav-link-active" />
                    )}
                  </>
                )}
              </NavLink>
            ))}

            {/* CTA / User Section */}
            {user ? (
              <div className="ml-6 flex items-center gap-4">
                <Link
                  to="/booking"
                  className="book-pill inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-purple)] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white shadow-[0_4px_20px_rgba(216,167,177,0.25)] transition-all duration-400 hover:shadow-[0_6px_28px_rgba(216,167,177,0.35)] hover:scale-[1.04] whitespace-nowrap"
                >
                  Book Now
                </Link>
                <ProfileDropdown user={user} />
              </div>
            ) : (
              <div className="ml-6 flex items-center gap-3">
                <Link
                  to="/login"
                  className="rounded-full border border-[var(--accent-pink)]/[0.15] bg-[var(--surface)] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] transition-all duration-400 hover:border-[var(--accent-pink)]/30 hover:text-[var(--accent-pink)]"
                >
                  Sign In
                </Link>
                <Link
                  to="/booking"
                  className="book-pill inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-purple)] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white shadow-[0_4px_20px_rgba(216,167,177,0.25)] transition-all duration-400 hover:shadow-[0_6px_28px_rgba(216,167,177,0.35)] hover:scale-[1.04] whitespace-nowrap"
                >
                  Book Now
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/booking"
              className="book-pill inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-purple)] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white shadow-[0_4px_20px_rgba(216,167,177,0.25)] transition-all duration-400 hover:shadow-[0_6px_28px_rgba(216,167,177,0.35)] hover:scale-[1.04] whitespace-nowrap"
            >
              Book Now
            </Link>
            <button
              type="button"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-nav-menu"
              className="flex items-center justify-center rounded-full border border-[var(--card-border)] bg-[var(--surface)] p-2.5 text-[var(--text-primary)] transition-all duration-300 hover:bg-[var(--surface-hover)]"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-nav-menu"
          role="navigation"
          aria-label="Mobile navigation"
          className={clsx(
            "overflow-hidden transition-all duration-500 md:hidden",
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="border-t border-[var(--card-border)] bg-[var(--bg-primary)]/98 backdrop-blur-2xl px-8 py-8">
            <nav className="flex flex-col gap-2">
              {publicNavLinks.map((link, index) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    clsx(
                      "rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-400",
                      isActive
                        ? "bg-[var(--accent-pink)]/[0.08] text-[var(--accent-pink)]"
                        : "text-[var(--text-muted)] hover:bg-[var(--accent-pink)]/[0.04] hover:text-[var(--accent-pink)]"
                    )
                  }
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {link.label}
                </NavLink>
              ))}

              {user ? (
                <>
                  <div className="mt-3 flex items-center gap-3 rounded-xl bg-[var(--surface)] px-4 py-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-pink)] to-[var(--accent-purple)]">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <span className="block text-sm font-bold text-[var(--text-secondary)]">
                        {user.name || "User"}
                      </span>
                      {user.email && (
                        <span className="block text-xs text-[var(--text-muted)]">
                          {user.email}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="mt-2 inline-flex items-center justify-center rounded-full border border-[var(--accent-pink)]/20 bg-[var(--surface)] px-5 py-3 text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] transition-all hover:text-[var(--accent-pink)]"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/booking"
                    onClick={() => setIsOpen(false)}
                    className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-purple)] px-5 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-[0_4px_20px_rgba(216,167,177,0.25)] whitespace-nowrap"
                  >
                    Book Now
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="mt-3 inline-flex items-center justify-center rounded-full border border-[var(--accent-pink)]/20 bg-[var(--surface)] px-5 py-3 text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] transition-all hover:text-[var(--accent-pink)]"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/booking"
                    onClick={() => setIsOpen(false)}
                    className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-purple)] px-5 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-[0_4px_20px_rgba(216,167,177,0.25)] whitespace-nowrap"
                  >
                    Book Now
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
