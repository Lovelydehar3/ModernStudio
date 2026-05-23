import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { adminNavLinks } from "../constants/navLinks";
import { authStore } from "../store/authStore";
import Button from "../components/ui/Button";
import {
  LayoutDashboard,
  CalendarCheck,
  Package,
  Image,
  Clapperboard,
  Home,
  PlusCircle,
  MessageSquare,
  LogOut,
  Menu,
  X
} from "lucide-react";

const iconMap = {
  LayoutDashboard,
  CalendarCheck,
  Package,
  Image,
  Clapperboard,
  Home,
  PlusCircle,
  MessageSquare
};

function AdminLayout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    authStore.clearUser();
    navigate("/admin/login");
  };

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="px-2">
        <h1 className="font-heading text-4xl leading-none tracking-tight text-[var(--text-primary)]">
          MODERN
        </h1>
        <p className="mt-1 bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-purple)] bg-clip-text text-[10px] font-bold uppercase tracking-[0.3em] text-transparent">
          Studio Admin
        </p>
      </div>

      {/* Nav */}
      <nav className="mt-10 flex flex-col gap-1">
        {adminNavLinks.map((link) => {
          const Icon = iconMap[link.icon] || LayoutDashboard;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/admin"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                clsx(
                  "relative flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-300",
                  isActive
                    ? "bg-[#c26dba]/[0.08] text-[#c26dba] shadow-[inset_0_0_20px_rgba(194,109,186,0.08)]"
                    : "text-[var(--text-muted)] hover:bg-[#c26dba]/[0.04] hover:text-[#c26dba]"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-[var(--accent-pink)] to-[var(--accent-purple)] shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                  )}
                  <Icon
                    className={clsx(
                      "h-4 w-4 flex-shrink-0 transition-colors",
                      isActive ? "text-[var(--accent-purple)]" : "text-[var(--text-muted)]"
                    )}
                  />
                  <span>{link.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-6">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl border border-[#c26dba]/10 bg-[var(--surface)] px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] transition-all duration-300 hover:border-red-500/20 hover:bg-red-500/5 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Exit Dashboard
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Mobile header */}
      <div className="flex items-center justify-between border-b border-[#c26dba]/10 bg-[var(--bg-primary)]/95 px-4 py-3 backdrop-blur-xl md:hidden">
        <div>
          <h1 className="font-heading text-xl leading-none text-[var(--text-primary)]">MODERN</h1>
          <p className="bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-purple)] bg-clip-text text-[8px] font-bold uppercase tracking-[0.2em] text-transparent">
            Studio Admin
          </p>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg bg-[#c26dba]/[0.06] p-2 transition-colors hover:bg-[#c26dba]/[0.1]"
        >
          {mobileOpen ? <X className="h-5 w-5 text-[var(--text-primary)]" /> : <Menu className="h-5 w-5 text-[var(--text-primary)]" />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 gap-0 md:grid-cols-[260px_1fr] md:gap-6 md:px-4 md:py-6">
        {/* Sidebar — Desktop */}
        <aside className="hidden overflow-y-auto rounded-[2rem] border border-[#c26dba]/10 bg-gradient-to-b from-[var(--surface)] to-[var(--bg-primary)] p-6 shadow-lg backdrop-blur-xl md:flex md:flex-col">
          {sidebarContent}
        </aside>

        {/* Sidebar — Mobile */}
        <aside
          className={clsx(
            "fixed left-0 top-0 z-50 flex h-full w-[280px] flex-col overflow-y-auto border-r border-[#c26dba]/10 bg-[var(--bg-primary)]/98 p-6 backdrop-blur-2xl transition-transform duration-300 md:hidden",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebarContent}
        </aside>

        {/* Main content */}
        <section className="min-h-screen overflow-y-auto rounded-none border-[#c26dba]/10 bg-gradient-to-br from-[var(--surface)] to-[var(--bg-primary)] p-4 shadow-lg md:rounded-[2rem] md:border md:p-10">
          <Outlet />
        </section>
      </div>
    </div>
  );
}

export default AdminLayout;
