export default function Loading() {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      <div className="flex justify-end">
        <div className="h-9 w-28 bg-muted rounded-none" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-80 bg-muted rounded-none" />
        ))}
      </div>
    </div>
  );
}
