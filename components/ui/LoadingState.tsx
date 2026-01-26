/**
 * Loading State Components
 * Skeleton loaders for various content types
 */

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-purple-600 dark:border-gray-700 dark:border-t-purple-400`}
      />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="space-y-4">
        <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
      </div>
    </div>
  );
}

export function MeditationCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      {/* Image placeholder */}
      <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700" />

      {/* Content */}
      <div className="p-6 space-y-3">
        <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-800" />

        {/* Duration badge */}
        <div className="flex items-center gap-2 pt-2">
          <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </div>
  );
}

export function ProgramCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      {/* Cover image */}
      <div className="h-40 bg-gradient-to-br from-purple-200 to-blue-200 dark:from-purple-900 dark:to-blue-900" />

      {/* Content */}
      <div className="p-6 space-y-3">
        <div className="h-6 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-4/5 rounded bg-gray-200 dark:bg-gray-800" />

        {/* Stats */}
        <div className="flex gap-4 pt-3">
          <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({
  count = 6,
  type = "card"
}: {
  count?: number;
  type?: "card" | "meditation" | "program";
}) {
  const SkeletonComponent =
    type === "meditation" ? MeditationCardSkeleton :
    type === "program" ? ProgramCardSkeleton :
    CardSkeleton;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-64 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-6 w-96 rounded bg-gray-200 dark:bg-gray-800" />
        </div>

        {/* Content grid */}
        <GridSkeleton count={6} />
      </div>
    </div>
  );
}
