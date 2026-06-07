export default function Loading() {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      <div className="grid gap-4 sm:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-muted rounded-none" />
        ))}
      </div>
      <div className="h-96 bg-muted rounded-none" />
    </div>
  );
}
