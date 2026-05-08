export function LoadingGrid({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse border border-zinc-800 bg-zinc-950">
          <div className="aspect-[4/5] bg-zinc-900" />
          <div className="space-y-4 p-8">
            <div className="h-4 w-3/4 bg-zinc-800" />
            <div className="h-4 w-1/3 bg-zinc-800" />
            <div className="h-11 rounded-full bg-zinc-900" />
          </div>
        </div>
      ))}
    </>
  );
}

export function EmptyState({ title, body }: { title: string; body?: string }) {
  return (
    <div className="border border-zinc-800 bg-zinc-950 p-10 text-center">
      <h3 className="text-xl font-black uppercase text-white">{title}</h3>
      {body ? <p className="mt-3 text-sm text-zinc-400">{body}</p> : null}
    </div>
  );
}
