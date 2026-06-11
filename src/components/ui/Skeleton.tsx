export function SkeletonCard() {
  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="skeleton w-10 h-10 rounded-xl" />
        <div className="skeleton w-8 h-8 rounded-lg" />
      </div>
      <div className="space-y-2">
        <div className="skeleton w-3/4 h-4" />
        <div className="skeleton w-full h-3" />
        <div className="skeleton w-2/3 h-3" />
      </div>
      <div className="flex gap-2">
        <div className="skeleton w-12 h-5 rounded-full" />
        <div className="skeleton w-16 h-5 rounded-full" />
        <div className="skeleton w-10 h-5 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonList() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="card p-4 flex items-center gap-4">
          <div className="skeleton w-8 h-8 rounded-lg" />
          <div className="flex-1 space-y-1">
            <div className="skeleton w-48 h-4" />
            <div className="skeleton w-96 h-3" />
          </div>
          <div className="skeleton w-16 h-5 rounded-full" />
          <div className="skeleton w-5 h-5 rounded" />
        </div>
      ))}
    </div>
  );
}
