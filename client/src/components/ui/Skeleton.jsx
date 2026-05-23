import clsx from "clsx";

function Skeleton({ className = "", ...props }) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-lg bg-[var(--card-border)]/40",
        className
      )}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--surface)] p-8">
      <Skeleton className="mb-4 h-5 w-24" />
      <Skeleton className="mb-3 h-8 w-3/4" />
      <Skeleton className="mb-6 h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

export function GallerySkeleton({ count = 6 }) {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          className={clsx(
            "mb-4 w-full break-inside-avoid",
            i % 3 === 0 ? "h-72" : i % 3 === 1 ? "h-56" : "h-64"
          )}
        />
      ))}
    </div>
  );
}

export function PackageCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--surface)] p-8">
      <Skeleton className="mb-2 h-4 w-20" />
      <Skeleton className="mb-4 h-7 w-40" />
      <Skeleton className="mb-6 h-10 w-28" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
      <Skeleton className="mt-8 h-12 w-full rounded-xl" />
    </div>
  );
}

export function BookingFormSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-full rounded-xl" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
      <Skeleton className="h-10 w-full rounded-xl" />
      <Skeleton className="h-10 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-12 w-48 rounded-xl" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--surface)] p-6">
      <Skeleton className="mb-2 h-4 w-20" />
      <Skeleton className="mb-1 h-8 w-16" />
      <Skeleton className="h-3 w-28" />
    </div>
  );
}

export function TableRowSkeleton({ columns = 4 }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

export default Skeleton;
