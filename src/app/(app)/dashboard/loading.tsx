export default function Loading() {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-muted rounded-none" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-72 bg-muted rounded-none" />
        <div className="h-72 bg-muted rounded-none" />
      </div>
      <div className="h-64 bg-muted rounded-none" />
    </div>
  );
}
