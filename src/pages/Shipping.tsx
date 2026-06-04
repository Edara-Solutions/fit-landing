import { motion } from 'motion/react';
import { Truck, RotateCcw } from 'lucide-react';
import ContactActions from '../components/ContactActions';

export default function Shipping() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-24 pb-32">
      <div className="mb-16">
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4">
          Shipping & Returns
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl">
          Everything you need to know about delivery inside Egypt and how returns work when an item is not quite right.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section className="bg-zinc-950 border border-zinc-800 p-10 flex flex-col gap-10">
          <div className="flex items-center gap-4 border-b border-zinc-900 pb-6">
            <Truck className="text-primary w-10 h-10" fill="currentColor" fillOpacity={0.1} />
            <h2 className="text-3xl font-black uppercase text-white tracking-tight">Shipping Information</h2>
          </div>
          <div className="space-y-6">
            <div className="p-8 bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
              <h3 className="font-black text-white uppercase tracking-widest mb-2">Delivery Inside Egypt</h3>
              <p className="text-zinc-400 text-sm">Orders are delivered through local shipping companies across Egypt. Delivery fees are calculated at checkout based on your selected city.</p>
            </div>
            <div className="p-8 bg-zinc-900 border-l-4 border-primary">
              <h3 className="font-black text-primary uppercase tracking-widest mb-2">Estimated Timing</h3>
              <p className="text-zinc-300 text-sm">Cairo and Giza orders usually arrive within 1-3 business days. Other governorates usually arrive within 2-5 business days, depending on the courier and location.</p>
            </div>
            <div className="p-8 bg-zinc-900/50 border border-zinc-800">
              <h3 className="font-black text-white uppercase tracking-widest mb-2">No Free Delivery</h3>
              <p className="text-zinc-400 text-sm">We currently do not offer free delivery. The shipping cost is shown before you create your order.</p>
            </div>
          </div>
        </section>

        <section className="bg-zinc-950 border border-zinc-800 p-10 flex flex-col gap-10">
          <div className="flex items-center gap-4 border-b border-zinc-900 pb-6">
            <RotateCcw className="text-primary w-10 h-10" />
            <h2 className="text-3xl font-black uppercase text-white tracking-tight">Returns Policy</h2>
          </div>
          <p className="text-zinc-400 leading-relaxed">
            Returns are accepted within 14 days of receiving the order, provided the item is in the same condition, unused, unopened, and with its original packaging.
          </p>
          <div className="space-y-8 mt-4">
            <Step number="1" title="Contact Support" text="Send us your order number, phone number, and the reason for return within 14 days of delivery." />
            <Step number="2" title="Condition Check" text="The product must be in the same condition you received it: unused, unopened, and in its original packaging." />
            <Step number="3" title="Courier Return" text="After approval, we will guide you through returning the package with the shipping company. Return delivery fees may apply." />
          </div>
          <ContactActions />
        </section>
      </div>

      {/* <div className="mt-20 bg-zinc-950 border border-zinc-800 p-12 flex flex-col md:flex-row items-center justify-between gap-10">
        <div>
          <h2 className="text-3xl font-black text-white uppercase mb-2 tracking-tight">Track Your Order</h2>
          <p className="text-zinc-400">Enter your order number and email to see live tracking updates.</p>
        </div>
        <form className="flex w-full md:w-auto gap-4">
          <input className="bg-black border border-zinc-800 text-white p-4 focus:border-primary outline-none flex-grow md:w-64" placeholder="Order #" />
          <button className="bg-primary text-white font-black uppercase px-10 py-4 rounded-full hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all whitespace-nowrap tracking-widest">
            Track Now
          </button>
        </form>
      </div> */}
    </div>
  );
}

function Step({ number, title, text }: { number: string, title: string, text: string }) {
  return (
    <div className="flex gap-6 items-start">
      <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-black shrink-0 shadow-lg shadow-primary/20">
        {number}
      </div>
      <div>
        <h3 className="text-lg font-black uppercase text-white mb-2">{title}</h3>
        <p className="text-sm text-zinc-500 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
