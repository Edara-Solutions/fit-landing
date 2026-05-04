import { motion } from 'motion/react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, Truck, Home, RotateCcw, MapPin, CreditCard } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { ReactNode } from 'react';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data matching the design
  const orderData = {
    id: id || 'FX-92847',
    date: 'October 24, 2024',
    status: 'Shipped',
    items: [
      { ...PRODUCTS[0], quantity: 2, flavor: 'Blood Orange' },
      { ...PRODUCTS[1], quantity: 1, flavor: 'Dark Chocolate' },
    ],
    summary: {
      subtotal: 154.98,
      shipping: 10.00,
      taxes: 12.40,
      total: 177.38
    },
    shipping: {
      name: 'John Doe',
      address: '123 Iron Street, Suite B',
      city: 'Los Angeles, CA 90001',
      country: 'United States'
    },
    payment: {
      type: 'Visa',
      last4: '4242'
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 pb-32">
      <Link 
        to="/orders" 
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-primary transition-colors mb-12 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold uppercase tracking-widest text-sm">Back to Orders</span>
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-800 pb-12 mb-16">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
            Order #{orderData.id}
          </h1>
          <p className="text-lg text-zinc-400">Placed on {orderData.date}</p>
        </div>
        <button className="bg-primary text-white font-black uppercase py-4 px-10 rounded-full hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all">
          Track Shipment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-12">
          {/* Status Tracker */}
          <section className="bg-zinc-950 p-10 border border-zinc-800">
            <h2 className="text-2xl font-black text-white uppercase mb-10 tracking-tight">Delivery Status</h2>
            <div className="relative pt-4 overflow-x-auto hide-scrollbar">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-800 -translate-y-1/2 z-0 min-w-[600px]" />
              <div className="absolute top-1/2 left-0 w-3/4 h-1 bg-primary -translate-y-1/2 z-0 min-w-[600px]" />
              
              <div className="relative z-10 flex justify-between gap-12 min-w-[600px]">
                <StatusStep label="Ordered" completed />
                <StatusStep label="Processed" completed />
                <StatusStep label="Shipped" current icon={<Truck className="w-4 h-4" />} />
                <StatusStep label="Delivered" icon={<Home className="w-4 h-4" />} disabled />
              </div>
            </div>
          </section>

          {/* Items */}
          <section className="bg-zinc-950 p-10 border border-zinc-800">
            <h2 className="text-2xl font-black text-white uppercase mb-10 border-b border-zinc-800 pb-6 tracking-tight">Items</h2>
            <div className="space-y-10">
              {orderData.items.map((item) => (
                <div key={item.id} className="flex gap-8 group">
                  <div className="w-28 h-28 bg-black border border-zinc-900 shrink-0 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-contain p-4 mix-blend-luminosity grayscale group-hover:mix-blend-normal group-hover:grayscale-0 transition-all"
                    />
                  </div>
                  <div className="flex-1 flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-black text-white uppercase mb-2 group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                        {item.name}
                      </h3>
                      <p className="text-sm text-zinc-500 uppercase font-bold tracking-widest mb-1">Flavor: {item.flavor}</p>
                      <p className="text-sm text-zinc-500 uppercase font-bold tracking-widest">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xl font-black text-white">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-12">
          {/* Summary */}
          <section className="bg-zinc-950 p-10 border border-zinc-800 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -z-0" />
             <h2 className="text-2xl font-black text-white uppercase mb-10 border-b border-zinc-800 pb-6 tracking-tight relative z-10">Summary</h2>
             
             <div className="space-y-4 mb-10 pb-10 border-b border-zinc-800 relative z-10">
                <SummaryRow label="Subtotal" value={orderData.summary.subtotal} />
                <SummaryRow label="Shipping" value={orderData.summary.shipping} />
                <SummaryRow label="Taxes" value={orderData.summary.taxes} />
             </div>

             <div className="flex justify-between items-baseline mb-12 relative z-10">
                <span className="text-lg font-black text-white uppercase">Total</span>
                <span className="text-4xl font-black text-white">${orderData.summary.total.toFixed(2)}</span>
             </div>

             <button className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-black uppercase py-4 px-8 rounded-full flex items-center justify-center gap-3 transition-all tracking-widest">
                <RotateCcw className="w-5 h-5" />
                Reorder Items
             </button>
          </section>

          {/* Shipping & Payment */}
          <div className="space-y-6">
            <section className="bg-zinc-950 p-10 border border-zinc-800">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="text-primary w-5 h-5" />
                <h3 className="font-black text-white uppercase text-sm tracking-widest">Shipping Address</h3>
              </div>
              <div className="text-zinc-400 leading-relaxed font-medium">
                <p className="text-white font-black mb-1">{orderData.shipping.name}</p>
                <p>{orderData.shipping.address}</p>
                <p>{orderData.shipping.city}</p>
                <p>{orderData.shipping.country}</p>
              </div>
            </section>

            <section className="bg-zinc-950 p-10 border border-zinc-800">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="text-primary w-5 h-5" />
                <h3 className="font-black text-white uppercase text-sm tracking-widest">Payment Method</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-zinc-900 px-4 py-2 border border-zinc-800 text-xs font-black uppercase text-white tracking-widest rounded-sm">
                  {orderData.payment.type}
                </div>
                <span className="text-zinc-400 font-medium tracking-widest">Ending in {orderData.payment.last4}</span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusStep({ label, completed, current, disabled, icon }: { label: string, completed?: boolean, current?: boolean, disabled?: boolean, icon?: ReactNode }) {
  return (
    <div className={`flex flex-col items-center gap-4 text-center ${disabled ? 'opacity-30' : 'opacity-100'}`}>
      <div className={`w-12 h-12 rounded-full border-4 border-zinc-950 flex items-center justify-center relative z-10 transition-all ${
        completed || current ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-zinc-900'
      } ${current ? 'ring-4 ring-primary/20 ring-offset-4 ring-offset-zinc-950' : ''}`}>
        {completed ? <Check className="text-white w-6 h-6" /> : icon ? <span className="text-white">{icon}</span> : null}
      </div>
      <span className={`text-xs font-black uppercase tracking-widest ${completed || current ? 'text-white' : 'text-zinc-600'}`}>
        {label}
      </span>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string, value: number }) {
  return (
    <div className="flex justify-between items-center text-sm">
       <span className="text-zinc-400 font-medium">{label}</span>
       <span className="text-white font-bold">${value.toFixed(2)}</span>
    </div>
  );
}
