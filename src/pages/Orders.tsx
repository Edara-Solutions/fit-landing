import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const MOCK_ORDERS = [
  { id: 'FOX-10293', date: 'Oct 24, 2023', total: 145.50, items: 3, status: 'Shipped' },
  { id: 'FOX-10292', date: 'Oct 20, 2023', total: 89.99, items: 1, status: 'Processing' },
  { id: 'FOX-10255', date: 'Sep 12, 2023', total: 210.00, items: 4, status: 'Delivered' },
];

export default function Orders() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
          Order History
        </h1>
        <p className="text-lg text-zinc-400">Review your past performance fuel.</p>
      </div>

      <div className="space-y-6">
        {MOCK_ORDERS.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-black border border-zinc-800 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-primary transition-all duration-300"
          >
            <div className="flex flex-col gap-4 w-full md:w-auto">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-black text-white uppercase">#{order.id}</h3>
                <span className={`px-3 py-1 rounded-sm font-black text-[10px] uppercase tracking-widest ${
                  order.status === 'Shipped' ? 'bg-primary text-white' :
                  order.status === 'Processing' ? 'bg-zinc-700 text-white' :
                  'bg-zinc-800 text-zinc-400'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-12 gap-y-2 text-sm text-zinc-400 font-medium">
                <span>Date: {order.date}</span>
                <span>Total: ${order.total.toFixed(2)}</span>
                <span>Items: {order.items}</span>
              </div>
            </div>
            
            <button 
              onClick={() => navigate(`/order/${order.id}`)}
              className="w-full md:w-auto bg-transparent text-white border border-zinc-700 hover:border-primary hover:text-primary px-8 py-3 rounded-full font-black uppercase text-xs tracking-widest transition-all"
            >
              View Details
            </button>
            
            {/* Subtle glow effect */}
            <div className="absolute inset-0 border border-transparent group-hover:border-primary/30 shadow-[0_0_15px_rgba(163,20,28,0)] group-hover:shadow-[0_0_30px_rgba(163,20,28,0.1)] pointer-events-none transition-all" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
