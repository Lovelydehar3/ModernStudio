
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Loader from "../../components/common/Loader";
import Skeleton, { StatCardSkeleton } from "../../components/ui/Skeleton";
import StatusPill from "../../components/admin/StatusPill";
import { dashboardApi } from "../../services/dashboardApi";
import { formatDateTime } from "../../lib/formatters";
import {
  Package,
  Image,
  Clapperboard,
  CalendarCheck,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  PlusCircle,
  TrendingUp
} from "lucide-react";

const statConfig = [
  { key: "totalPackages", label: "Packages", icon: Package, color: "from-violet-500 to-purple-600" },
  { key: "totalMedia", label: "Media Assets", icon: Image, color: "from-blue-500 to-cyan-500" },
  { key: "totalFilms", label: "Films", icon: Clapperboard, color: "from-amber-500 to-orange-500" },
  { key: "totalBookings", label: "Total Bookings", icon: CalendarCheck, color: "from-emerald-500 to-green-500" },
  { key: "pendingBookings", label: "Pending", icon: Clock, color: "from-yellow-500 to-amber-500" },
  { key: "acceptedBookings", label: "Accepted", icon: CheckCircle, color: "from-green-500 to-emerald-500" },
  { key: "rejectedBookings", label: "Rejected", icon: XCircle, color: "from-red-500 to-rose-500" },
  { key: "unresolvedInquiries", label: "Open Inquiries", icon: MessageSquare, color: "from-pink-500 to-rose-500" },
  { key: "totalAddons", label: "Add-ons", icon: PlusCircle, color: "from-indigo-500 to-violet-500" }
];

const quickActions = [
  { label: "New Booking", path: "/admin/bookings", icon: CalendarCheck },
  { label: "Upload Media", path: "/admin/media", icon: Image },
  { label: "Add Package", path: "/admin/packages", icon: Package },
  { label: "Add Film", path: "/admin/films", icon: Clapperboard }
];

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardApi.getStats();
        setStats(response.data.data);
      } catch (_error) {
        setStats({});
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div>
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Skeleton className="mb-4 h-4 w-28" />
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-11 w-36 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const recentBookings = stats?.recentBookings || [];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-xl bg-gradient-to-br from-[var(--accent-pink)] to-[var(--accent-purple)] p-2.5">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="font-heading text-5xl uppercase">Dashboard</h2>
          <p className="mt-0.5 text-sm text-[var(--text-muted)]">
            Overview of your platform content and lead pipeline.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {statConfig.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.key} className="group relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
                    {item.label}
                  </p>
                  <p className="mt-2 font-heading text-5xl text-[var(--text-primary)]">
                    {stats?.[item.key] ?? 0}
                  </p>
                </div>
                <div
                  className={`rounded-xl bg-gradient-to-br ${item.color} p-2.5 shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
              {/* Subtle gradient glow */}
              <div
                className={`absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-gradient-to-br ${item.color} opacity-[0.07] blur-2xl transition-opacity duration-300 group-hover:opacity-[0.15]`}
              />
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.path}
                to={action.path}
                className="flex items-center gap-2.5 rounded-xl border border-[var(--accent-pink)]/10 bg-[var(--surface)] px-5 py-3 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent-purple)]/40 hover:bg-[var(--accent-pink)]/[0.04] hover:text-[var(--accent-pink)] hover:shadow-[0_4px_20px_rgba(194,109,186,0.15)]"
              >
                <Icon className="h-4 w-4 text-[var(--accent-purple)]" />
                {action.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Bookings */}
      {recentBookings.length > 0 && (
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
              Recent Bookings
            </h3>
            <Link
              to="/admin/bookings"
              className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent-purple)] transition-colors hover:text-[var(--accent-pink)]"
            >
              View All →
            </Link>
          </div>

          <Card className="overflow-hidden !p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--accent-pink)]/10">
                    <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                      Client
                    </th>
                    <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                      Package
                    </th>
                    <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                      Status
                    </th>
                    <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                      Payment
                    </th>
                    <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => (
                    <tr
                      key={b._id}
                      className="border-b border-[var(--accent-pink)]/10 transition-colors hover:bg-[var(--accent-pink)]/[0.04]"
                    >
                      <td className="px-5 py-3 text-sm text-[var(--text-primary)]">
                        <div>{b.name}</div>
                        <div className="text-[10px] text-[var(--text-muted)]">{b.email}</div>
                      </td>
                      <td className="px-5 py-3 text-sm text-[var(--text-secondary)]">
                        {b.selectedPackage?.name || "-"}
                      </td>
                      <td className="px-5 py-3">
                        <StatusPill value={b.status} />
                      </td>
                      <td className="px-5 py-3">
                        <span className="rounded-md bg-[var(--accent-pink)]/[0.06] px-2 py-0.5 text-[10px] font-bold uppercase text-[var(--text-muted)]">
                          {b.paymentStatus || "unpaid"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs text-[var(--text-muted)]">
                        {formatDateTime(b.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
