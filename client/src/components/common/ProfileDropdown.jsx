import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import clsx from "clsx";
import { userAuthStore } from "../../store/userAuthStore";
import { useToast } from "../ui/ToastContext";
import { authApi } from "../../services/authApi";

function ProfileDropdown({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore server errors, still clear locally
    }
    userAuthStore.clearUser();
    showToast("Logged out successfully.", "success");
    navigate("/");
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Profile Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 rounded-full border border-[var(--accent-pink)]/20 bg-[var(--surface)] px-3 py-2 transition-all duration-300 hover:border-[var(--accent-pink)]/40 hover:bg-[var(--surface-hover)]"
      >
        {user?.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="h-7 w-7 rounded-full object-cover ring-2 ring-[var(--accent-pink)]/20" 
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-pink)] to-[var(--accent-purple)]">
            <User className="h-4 w-4 text-white" />
          </div>
        )}
        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] max-w-[80px] truncate">
          {user?.name?.split(" ")[0] || "Profile"}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg border border-[var(--card-border)] bg-[var(--bg-primary)]/95 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-200">
          {/* User Info Header */}
          <div className="border-b border-[var(--card-border)] px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Account</p>
            <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
              {user?.name || "User"}
            </p>
            {user?.email && (
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                {user.email}
              </p>
            )}
          </div>

          {/* Menu Items */}
          <div className="space-y-1 p-2">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-all duration-300 hover:bg-[var(--accent-pink)]/10 hover:text-[var(--accent-pink)]"
            >
              <User className="h-4 w-4" />
              <span>My Profile</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-red-400 transition-all duration-300 hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
