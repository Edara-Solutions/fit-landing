import { motion } from 'motion/react';
import { ChevronDown, Clock3, HelpCircle, MessageCircle, PackageCheck, Store } from 'lucide-react';
import ContactActions from '../components/ContactActions';
import { SITE_CONTACT } from '../config/contact';

const CONTACT_HELP_CARDS = [
  {
    title: 'Order Support',
    text: 'Send your order number and the issue so we can check it quickly.',
    icon: PackageCheck,
  },
  {
    title: 'Stack Advice',
    text: 'Tell us your goal, budget, and training level before you buy.',
    icon: MessageCircle,
  },
  {
    title: 'Wholesale',
    text: 'Call directly for product availability, pricing, and margins.',
    icon: Store,
  },
] as const;

export default function Contact() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-24 md:py-32 px-6 md:px-10 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background z-0 pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl flex flex-col gap-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white"
          >
            Dominate Your Inquiries
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-zinc-400"
          >
            Need support, wholesale details, or have questions about our stacks? Send a transmission directly to HQ. We are built to perform, and built to respond.
          </motion.p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Actions */}
          <div className="lg:col-span-8 bg-zinc-950 p-6 md:p-10 border border-zinc-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
            <div className="relative z-10 flex flex-col gap-8">
              <div>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MessageCircle className="h-7 w-7" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black uppercase text-white mb-4 tracking-tight">Talk To FIT</h2>
                <p className="max-w-2xl text-zinc-400">
                  Order help, product questions, stacks, shipping, and wholesale requests all start here. Choose the channel that is easiest for you and we will respond directly.
                </p>
              </div>

              <ContactActions />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-zinc-800 pt-8">
                {CONTACT_HELP_CARDS.map((card) => {
                  const Icon = card.icon;

                  return (
                    <div key={card.title} className="border border-zinc-900 bg-black/50 p-5 transition-colors hover:border-zinc-700">
                      <Icon className="mb-4 h-6 w-6 text-primary" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-white">{card.title}</h3>
                      <p className="mt-3 text-xs leading-5 text-zinc-500">{card.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="border border-zinc-800 bg-zinc-950 p-8">
              <div className="flex items-center gap-3 border-b border-zinc-800 pb-6">
                <Clock3 className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-black uppercase text-white tracking-widest">Response Guide</h2>
              </div>
              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Fastest Channel</p>
                  <a href={SITE_CONTACT.whatsapp.href} target="_blank" rel="noreferrer" className="mt-1 block text-lg font-black text-white transition-colors hover:text-primary">
                    {SITE_CONTACT.whatsapp.display}
                  </a>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Urgent Calls</p>
                  <a href={SITE_CONTACT.phone.href} className="mt-1 block text-lg font-black text-white transition-colors hover:text-primary">
                    {SITE_CONTACT.phone.display}
                  </a>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Social Updates</p>
                  <a href={SITE_CONTACT.facebook.href} target="_blank" rel="noreferrer" className="mt-1 block text-lg font-black text-white transition-colors hover:text-primary">
                    {SITE_CONTACT.facebook.display}
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-zinc-950 p-8 border border-zinc-800">
               <div className="flex items-center gap-3 border-b border-zinc-800 pb-6 mb-6">
                  <HelpCircle className="text-white w-6 h-6" />
                  <h2 className="text-xl font-black uppercase text-white tracking-widest">Intel / FAQ</h2>
               </div>
               <div className="space-y-4">
                  {[
                    { q: "Are FIT stacks safe for tested athletes?", a: "All CORE series products are strictly third-party tested. Our EXTREME line contains stimulants. Check federation lists." },
                    { q: "How fast is shipping?", a: "Domestic orders process within 24 hours. Standard transit is 2-4 business days." },
                    { q: "What is the return policy?", a: "Unopened products can be returned within 30 days. Open tubs are final for safety." }
                  ].map((faq, i) => (
                    <details key={i} className="group border-b border-zinc-900 pb-4">
                      <summary className="font-bold text-white cursor-pointer list-none flex justify-between items-center hover:text-primary transition-colors pr-2">
                        {faq.q}
                        <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                      </summary>
                      <p className="text-sm text-zinc-500 mt-3 italic">{faq.a}</p>
                    </details>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
