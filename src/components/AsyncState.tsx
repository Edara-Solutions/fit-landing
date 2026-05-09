import GlobalLoader from './GlobalLoader';

export function LoadingGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="col-span-full border border-zinc-800 bg-zinc-950">
      <GlobalLoader label={count > 1 ? 'Loading products' : 'Loading'} />
    </div>
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
