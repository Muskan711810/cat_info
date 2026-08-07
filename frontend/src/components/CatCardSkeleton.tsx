export default function CatCardSkeleton() {
  return (
    <div className="border-2 border-ink/10 bg-parchment animate-pulse">
      <div className="aspect-[4/3] bg-ink/10" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-12 bg-ink/10" />
        <div className="h-5 w-2/3 bg-ink/10" />
        <div className="h-3 w-1/3 bg-ink/10" />
      </div>
    </div>
  );
}