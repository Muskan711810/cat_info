export default function CatCardSkeleton() {
  return (
    <div className="flex gap-3 p-3 border border-ink/15 bg-parchment animate-pulse">
      <div className="w-16 h-16 flex-shrink-0 bg-box" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-4 w-1/2 bg-box" />
        <div className="h-3 w-1/3 bg-box" />
        <div className="h-3 w-full bg-box" />
      </div>
    </div>
  );
}