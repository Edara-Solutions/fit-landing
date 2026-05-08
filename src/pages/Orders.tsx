import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { EmptyState } from '../components/AsyncState';
import { formatPrice, getId } from '../lib/format';
import { useCheckoutStore } from '../stores/checkout.store';

export default function Orders() {
  const navigate = useNavigate();
  const { orders, loading, error, fetchMyOrders } = useCheckoutStore();

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">Order History</h1>
        <p className="text-lg text-zinc-400">Review your past performance fuel.</p>
      </div>

      {error ? <EmptyState title="Could not load orders" body={error} /> : null}
      {!orders.length && !loading ? <EmptyState title="No orders yet" body="Your completed checkouts will appear here." /> : null}
      <div className="space-y-6">
        {loading ? <EmptyState title="Loading orders..." /> : orders.map((order, index) => (
          <motion.div key={getId(order)} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.06 }} className="group relative bg-black border border-zinc-800 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-primary transition-all duration-300">
            <div className="flex flex-col gap-4 w-full md:w-auto">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-black text-white uppercase">#{order.orderNumber || getId(order).slice(-8)}</h3>
                <span className="px-3 py-1 rounded-sm font-black text-[10px] uppercase tracking-widest bg-zinc-800 text-zinc-300">{order.orderStatus || 'pending'}</span>
              </div>
              <div className="flex flex-wrap gap-x-12 gap-y-2 text-sm text-zinc-400 font-medium">
                <span>Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</span>
                <span>Total: {formatPrice(order.total)}</span>
                <span>Items: {order.items?.length || 0}</span>
              </div>
            </div>
            <button onClick={() => navigate(`/order/${getId(order)}`)} className="w-full md:w-auto bg-transparent text-white border border-zinc-700 hover:border-primary hover:text-primary px-8 py-3 rounded-full font-black uppercase text-xs tracking-widest transition-all">
              View Details
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
