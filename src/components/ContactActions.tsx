import { ArrowUpRight, PhoneCall } from 'lucide-react';
import { SITE_CONTACT } from '../config/contact';

type ContactActionsProps = {
  variant?: 'inline' | 'footer' | 'floating';
  onNavigate?: () => void;
};

const CONTACT_ACTIONS = [
  {
    ...SITE_CONTACT.whatsapp,
    icon: WhatsAppIcon,
    description: 'Fast order support and product questions.',
    cta: 'Chat now',
    accent: 'from-emerald-400 to-green-600',
    iconClassName: 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/20',
    className: 'hover:border-emerald-500/70 hover:bg-emerald-500/10',
  },
  {
    ...SITE_CONTACT.phone,
    icon: PhoneCall,
    description: 'Direct calls for urgent help and wholesale.',
    cta: 'Call now',
    accent: 'from-primary to-primary-hover',
    iconClassName: 'bg-primary/10 text-primary-hover ring-primary/20',
    className: 'hover:border-primary/80 hover:bg-primary/10',
  },
  {
    ...SITE_CONTACT.facebook,
    icon: FacebookIcon,
    description: 'Follow updates, offers, and new arrivals.',
    cta: 'Open page',
    accent: 'from-blue-400 to-blue-700',
    iconClassName: 'bg-blue-500/10 text-blue-300 ring-blue-500/20',
    className: 'hover:border-blue-500/70 hover:bg-blue-500/10',
  },
] as const;

export default function ContactActions({ variant = 'inline', onNavigate }: ContactActionsProps) {
  if (variant === 'floating') {
    return (
      <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-2">
        {CONTACT_ACTIONS.map((action) => {
          const Icon = action.icon;

          return (
            <a
              key={action.label}
              href={action.href}
              target={action.href.startsWith('http') ? '_blank' : undefined}
              rel={action.href.startsWith('http') ? 'noreferrer' : undefined}
              aria-label={`${action.label}: ${action.display}`}
              title={`${action.label}: ${action.display}`}
              className={`group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-zinc-800 bg-zinc-950/95 text-white shadow-xl shadow-black/30 backdrop-blur transition-all hover:-translate-y-0.5 ${action.className}`}
            >
              <span className={`absolute inset-x-3 top-0 h-px bg-gradient-to-r ${action.accent}`} />
              <Icon className="relative h-5 w-5 transition-transform group-hover:scale-110" />
            </a>
          );
        })}
      </div>
    );
  }

  const isFooter = variant === 'footer';

  return (
    <div className={`grid w-full gap-3 ${isFooter ? 'max-w-4xl sm:grid-cols-3' : 'sm:grid-cols-3'}`}>
      {CONTACT_ACTIONS.map((action) => {
        const Icon = action.icon;

        return (
          <a
            key={action.label}
            href={action.href}
            target={action.href.startsWith('http') ? '_blank' : undefined}
            rel={action.href.startsWith('http') ? 'noreferrer' : undefined}
            onClick={onNavigate}
            className={`group relative min-w-0 overflow-hidden border border-zinc-800 bg-gradient-to-b from-zinc-950 to-black p-4 text-left text-white shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5 ${action.className}`}
          >
            <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${action.accent}`} />
            <span className="flex items-start justify-between gap-3">
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-1 ${action.iconClassName}`}>
                <Icon className="h-5 w-5" />
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-600 transition-colors group-hover:text-white" />
            </span>
            <span className="mt-4 block min-w-0">
              <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-500">{action.label}</span>
              <span className="mt-1 block truncate text-sm font-black tracking-tight text-white">{action.display}</span>
              <span className="mt-2 block text-xs leading-5 text-zinc-500">{action.description}</span>
              <span className="mt-4 inline-flex text-[10px] font-black uppercase tracking-widest text-primary transition-colors group-hover:text-white">
                {action.cta}
              </span>
            </span>
          </a>
        );
      })}
    </div>
  );
}

function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12.04 2.5A9.43 9.43 0 0 0 3.9 16.68L2.75 21.5l4.94-1.11a9.45 9.45 0 1 0 4.35-17.89Zm0 1.78a7.67 7.67 0 1 1-3.82 14.32l-.31-.18-2.79.63.65-2.72-.2-.32a7.67 7.67 0 0 1 6.47-11.73Zm-3.2 3.94c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.09s.9 2.43 1.03 2.6c.13.17 1.74 2.79 4.32 3.8 2.14.84 2.58.67 3.04.63.47-.04 1.5-.61 1.71-1.2.21-.59.21-1.1.15-1.2-.06-.1-.23-.17-.49-.3-.26-.13-1.5-.74-1.74-.82-.23-.09-.4-.13-.57.13-.17.25-.65.82-.8.99-.15.17-.29.19-.55.06-.26-.13-1.08-.4-2.06-1.27-.76-.68-1.28-1.52-1.43-1.78-.15-.25-.02-.39.11-.52.12-.12.26-.3.39-.45.13-.15.17-.25.26-.42.09-.17.04-.32-.02-.45-.06-.13-.57-1.38-.78-1.89-.2-.49-.41-.42-.57-.43h-.49Z" />
    </svg>
  );
}

function FacebookIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22C18.34 21.24 22 17.08 22 12.06Z" />
    </svg>
  );
}
