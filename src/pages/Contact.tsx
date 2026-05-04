import { motion } from 'motion/react';
import { Headset, Truck, HelpCircle, ChevronDown } from 'lucide-react';

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
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-zinc-950 p-10 border border-zinc-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
            <h2 className="text-3xl font-black uppercase text-white mb-10 tracking-tight">Send Transmission</h2>
            <form className="flex flex-col gap-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">First Name</label>
                  <input className="bg-black border border-zinc-800 text-white p-4 focus:border-primary focus:ring-0 outline-none transition-all placeholder-zinc-700" placeholder="JOHN" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Last Name</label>
                  <input className="bg-black border border-zinc-800 text-white p-4 focus:border-primary focus:ring-0 outline-none transition-all placeholder-zinc-700" placeholder="DOE" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Email Address</label>
                <input className="bg-black border border-zinc-800 text-white p-4 focus:border-primary focus:ring-0 outline-none transition-all placeholder-zinc-700" placeholder="JOHNDOE@EXAMPLE.COM" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Inquiry Type</label>
                <select className="bg-black border border-zinc-800 text-white p-4 focus:border-primary outline-none transition-all appearance-none uppercase text-xs font-bold tracking-widest">
                  <option>Order Support</option>
                  <option>Wholesale / Distribution</option>
                  <option>Athlete Sponsorship</option>
                  <option>General Transmission</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Message</label>
                <textarea className="bg-black border border-zinc-800 text-white p-4 focus:border-primary outline-none transition-all placeholder-zinc-700 resize-none min-h-[150px]" placeholder="ENTER YOUR TRANSMISSION..." />
              </div>
              <button className="bg-primary text-white font-black uppercase py-5 px-12 rounded-full hover:bg-primary-hover shadow-xl shadow-primary/20 transition-all self-start tracking-widest">
                Transmit Message
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 flex flex-col gap-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              <div className="bg-zinc-900/50 p-8 border-l-4 border-primary group hover:bg-zinc-900 transition-colors">
                <Headset className="text-primary w-10 h-10 mb-4" />
                <h3 className="text-xl font-black uppercase text-white mb-2">Support</h3>
                <p className="text-sm text-zinc-500 mb-4">Issues with an order? We resolve them with zero downtime.</p>
                <a href="mailto:support@foxsupps.com" className="text-sm font-black text-primary hover:text-white transition-colors uppercase tracking-widest">support@foxsupps.com</a>
              </div>
              <div className="bg-zinc-900/50 p-8 border-l-4 border-primary group hover:bg-zinc-900 transition-colors">
                <Truck className="text-primary w-10 h-10 mb-4" />
                <h3 className="text-xl font-black uppercase text-white mb-2">Wholesale</h3>
                <p className="text-sm text-zinc-500 mb-4">Stock FOX in your facility. Aggressive margins available.</p>
                <a href="mailto:wholesale@foxsupps.com" className="text-sm font-black text-primary hover:text-white transition-colors uppercase tracking-widest">wholesale@foxsupps.com</a>
              </div>
            </div>

            <div className="bg-zinc-950 p-8 border border-zinc-800">
               <div className="flex items-center gap-3 border-b border-zinc-800 pb-6 mb-6">
                  <HelpCircle className="text-white w-6 h-6" />
                  <h2 className="text-xl font-black uppercase text-white tracking-widest">Intel / FAQ</h2>
               </div>
               <div className="space-y-4">
                  {[
                    { q: "Are FOX stacks safe for tested athletes?", a: "All CORE series products are strictly third-party tested. Our EXTREME line contains stimulants. Check federation lists." },
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
