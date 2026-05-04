import { ShoppingBag, Lock, Check, HelpCircle } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { motion } from 'motion/react';

export default function Checkout() {
  const cartItems = [
    { ...PRODUCTS[0], quantity: 1, flavor: 'Chocolate', servings: '2lbs' },
    { ...PRODUCTS[3], quantity: 2, flavor: 'Fruit Punch' },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const taxes = subtotal * 0.085;
  const total = subtotal + taxes;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24 flex flex-col lg:flex-row gap-16 items-start">
      {/* Left Column: Forms */}
      <div className="w-full lg:flex-1 flex flex-col gap-12">
        <section className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black uppercase text-white tracking-tight">Contact</h2>
            <button className="text-sm font-bold text-primary hover:text-primary-hover uppercase underline underline-offset-4">Log in</button>
          </div>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Email or mobile phone number"
              className="w-full bg-zinc-950 border border-zinc-800 p-4 text-white focus:outline-none focus:border-primary transition-colors"
            />
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="w-5 h-5 border border-zinc-800 bg-zinc-950 flex items-center justify-center group-hover:border-primary">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">Email me with news and offers</span>
            </label>
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <h2 className="text-3xl font-black uppercase text-white tracking-tight">Delivery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select className="col-span-full bg-zinc-950 border border-zinc-800 p-4 text-white focus:border-primary uppercase text-sm font-bold tracking-widest">
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
            </select>
            <input placeholder="First name" className="bg-zinc-950 border border-zinc-800 p-4 text-white focus:border-primary" />
            <input placeholder="Last name" className="bg-zinc-950 border border-zinc-800 p-4 text-white focus:border-primary" />
            <input placeholder="Address" className="col-span-full bg-zinc-950 border border-zinc-800 p-4 text-white focus:border-primary" />
            <input placeholder="Apartment, suite, etc. (optional)" className="col-span-full bg-zinc-950 border border-zinc-800 p-4 text-white focus:border-primary" />
            <input placeholder="City" className="bg-zinc-950 border border-zinc-800 p-4 text-white focus:border-primary" />
            <select className="bg-zinc-950 border border-zinc-800 p-4 text-white focus:border-primary">
              <option>State</option>
              <option>California</option>
              <option>New York</option>
            </select>
            <input placeholder="ZIP code" className="bg-zinc-950 border border-zinc-800 p-4 text-white focus:border-primary" />
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <div>
            <h2 className="text-3xl font-black uppercase text-white tracking-tight">Payment</h2>
            <p className="text-zinc-500 text-sm mt-1">All transactions are secure and encrypted.</p>
          </div>
          <div className="border border-zinc-800 bg-zinc-950 overflow-hidden">
            <div className="p-4 bg-zinc-900/50 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-primary bg-primary" />
                <span className="font-bold uppercase text-white">Credit Card</span>
              </div>
              <ShoppingBag size={20} className="text-zinc-600" />
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="relative">
                <input placeholder="Card number" className="w-full bg-zinc-900 border border-zinc-800 p-4 pr-12" />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Expiration (MM/YY)" className="bg-zinc-900 border border-zinc-800 p-4" />
                <div className="relative">
                  <input placeholder="CVV" className="w-full bg-zinc-900 border border-zinc-800 p-4 pr-12" />
                  <HelpCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
                </div>
              </div>
              <input placeholder="Name on card" className="bg-zinc-900 border border-zinc-800 p-4 uppercase font-bold text-sm tracking-widest" />
            </div>
            <div className="p-4 border-t border-zinc-800 flex items-center gap-3 bg-zinc-950 hover:bg-zinc-900 cursor-pointer transition-colors">
              <div className="w-5 h-5 rounded-full border-2 border-zinc-800" />
              <span className="font-bold uppercase text-zinc-400">PayPal</span>
            </div>
          </div>
        </section>
      </div>

      {/* Right Column: Order Summary */}
      <aside className="w-full lg:w-[450px] shrink-0 sticky top-32">
        <div className="bg-zinc-950 border border-zinc-800 p-8 flex flex-col gap-8">
          <h3 className="text-xl font-black uppercase text-white border-b border-zinc-800 pb-4">Order Summary</h3>
          
          <div className="flex flex-col gap-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 relative shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2 grayscale" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center text-[10px] font-bold text-white border border-zinc-700">
                    {item.quantity}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold uppercase text-white text-sm">{item.name}</h4>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
                    {item.flavor} {item.servings ? `/ ${item.servings}` : ''}
                  </p>
                </div>
                <span className="font-bold text-zinc-100">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <input 
              placeholder="Discount code" 
              className="flex-1 bg-zinc-900 border border-zinc-800 p-3 uppercase text-xs font-bold tracking-widest" 
            />
            <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 uppercase font-bold text-xs transition-colors">Apply</button>
          </div>

          <div className="space-y-3 pt-6 border-t border-zinc-800">
            <div className="flex justify-between text-sm text-zinc-400">
              <span>Subtotal</span>
              <span className="text-white">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-zinc-400">
              <span>Shipping</span>
              <span className="uppercase text-[10px] font-bold tracking-widest">Calculated at next step</span>
            </div>
            <div className="flex justify-between text-sm text-zinc-400">
              <span>Taxes</span>
              <span className="text-white">${taxes.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline pt-6 border-t border-zinc-800">
            <span className="text-xl font-black uppercase text-white">Total</span>
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 uppercase font-black mr-2">USD</span>
              <span className="text-3xl font-black text-white">${total.toFixed(2)}</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-primary text-white font-black uppercase py-6 rounded-full tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:bg-primary-hover transition-all"
          >
            <Lock size={18} />
            Complete Purchase
          </motion.button>
          <p className="text-center text-[10px] text-zinc-600 uppercase tracking-widest">Secure, encrypted checkout</p>
        </div>
      </aside>
    </div>
  );
}
