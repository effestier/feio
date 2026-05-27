export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
      {/* Hero skeleton */}
      <div className="text-center py-16 sm:py-24 space-y-6">
        <div className="h-5 w-48 bg-cream-dark rounded-full mx-auto" />
        <div className="space-y-3">
          <div className="h-12 w-96 bg-cream-dark rounded mx-auto" />
          <div className="h-12 w-72 bg-cream-dark rounded mx-auto" />
        </div>
        <div className="h-4 w-80 bg-cream-dark rounded mx-auto" />
        <div className="h-12 max-w-xl bg-cream-dark rounded mx-auto" />
      </div>

      {/* Section skeletons */}
      {[...Array(2)].map((_, i) => (
        <div key={i} className="mb-14 space-y-4">
          <div className="h-6 w-40 bg-cream-dark rounded" />
          <div className="flex gap-3">
            {[...Array(6)].map((_, j) => (
              <div key={j} className="w-[120px] sm:w-[140px] flex-shrink-0">
                <div className="aspect-[2/3] bg-cream-dark rounded-md mb-1.5" />
                <div className="h-3 bg-cream-dark rounded w-3/4" />
                <div className="h-2 bg-cream-dark rounded w-1/2 mt-1" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
