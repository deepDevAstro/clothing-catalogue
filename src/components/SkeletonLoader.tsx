export function SkeletonCard() {
  return (
    <div className="bg-bg-secondary rounded-lg overflow-hidden shadow-md animate-shimmer">
      {/* Image skeleton */}
      <div className="w-full h-64 bg-gradient-to-r from-bg-secondary via-bg-tertiary to-bg-secondary" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title skeleton */}
        <div className="h-5 bg-gradient-to-r from-bg-secondary via-bg-tertiary to-bg-secondary rounded w-3/4" />

        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-3 bg-gradient-to-r from-bg-secondary via-bg-tertiary to-bg-secondary rounded w-full" />
          <div className="h-3 bg-gradient-to-r from-bg-secondary via-bg-tertiary to-bg-secondary rounded w-5/6" />
        </div>

        {/* Price skeleton */}
        <div className="h-4 bg-gradient-to-r from-bg-secondary via-bg-tertiary to-bg-secondary rounded w-1/3" />

        {/* Button skeleton */}
        <div className="h-10 bg-gradient-to-r from-bg-secondary via-bg-tertiary to-bg-secondary rounded w-full" />
      </div>
    </div>
  );
}

export function SkeletonCardGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonInput() {
  return (
    <div className="h-12 bg-gradient-to-r from-bg-secondary via-bg-tertiary to-bg-secondary rounded animate-shimmer" />
  );
}

export function SkeletonButton() {
  return (
    <div className="h-10 bg-gradient-to-r from-primary via-blue-500 to-primary rounded animate-shimmer" />
  );
}

export function SkeletonText({ lines = 1 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-gradient-to-r from-bg-secondary via-bg-tertiary to-bg-secondary rounded animate-shimmer ${
            i === lines - 1 ? "w-5/6" : "w-full"
          }`}
        />
      ))}
    </div>
  );
}
