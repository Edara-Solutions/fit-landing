import foxLoader from '../assets/images/fox-loader.png';

export default function GlobalLoader({
  label = 'Loading',
  className = '',
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={`flex min-h-64 w-full flex-col items-center justify-center gap-5 ${className}`}>
      <div className="relative flex h-36 w-36 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-zinc-800" />
        <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin shadow-[0_0_30px_rgba(163,20,28,0.35)]" />
        <div className="absolute inset-3 rounded-full bg-black/80 blur-sm" />
        <img src={foxLoader} alt="" className="relative h-24 w-24 object-contain" />
      </div>
      <div className="text-center">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-white">{label}</p>
        <div className="mx-auto mt-3 h-1 w-20 overflow-hidden rounded-full bg-zinc-800">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}
