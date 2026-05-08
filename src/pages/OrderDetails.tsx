import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, XCircle, Upload } from 'lucide-react';
import { useEffect } from 'react';
import { EmptyState } from '../components/AsyncState';
import { cartItems, formatPrice, getId, productImage, productPrice, productSlug } from '../lib/format';
import { useToast } from '../lib/toast';
import { useCheckoutStore } from '../stores/checkout.store';

export default function OrderDetails() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { notify } = useToast();
  const { currentOrder: order, loading, error, fetchOrderDetails, cancelOrder } = useCheckoutStore();

  useEffect(() => {
    fetchOrderDetails(id);
  }, [fetchOrderDetails, id]);

  const cancel = async () => {
    try {
      await cancelOrder(id);
      notify('Order cancelled.', 'success');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not cancel order.', 'error');
    }
  };

  if (loading && !order) return <div className="max-w-7xl mx-auto px-6 md:px-10 py-24"><EmptyState title="Loading order..." /></div>;
  if (!order) return <div className="max-w-7xl mx-auto px-6 md:px-10 py-24"><EmptyState title="Order not found" body={error || 'We could not find this order.'} /></div>;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 pb-32">
      <Link to="/orders" className="inline-flex items-center gap-2 text-zinc-400 hover:text-primary transition-colors mb-12 group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold uppercase tracking-widest text-sm">Back to Orders</span>
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-800 pb-12 mb-16">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">Order #{order.orderNumber || getId(order).slice(-8)}</h1>
          <p className="text-lg text-zinc-400">Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {order.orderStatus === 'pending_payment' ? <button onClick={cancel} className="bg-zinc-900 text-white font-black uppercase py-4 px-8 rounded-full border border-zinc-700 hover:border-primary hover:text-primary transition-all flex items-center gap-2"><XCircle size={18} />Cancel</button> : null}
          <button onClick={() => navigate(`/payment/${getId(order)}`)} className="bg-primary text-white font-black uppercase py-4 px-8 rounded-full hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all flex items-center gap-2"><Upload size={18} />Payment</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <section className="bg-zinc-950 p-10 border border-zinc-800">
            <h2 className="text-2xl font-black text-white uppercase mb-6 tracking-tight">Status</h2>
            <div className="flex flex-wrap gap-3">
              <span className="bg-zinc-900 border border-zinc-800 px-4 py-2 text-xs font-black uppercase tracking-widest text-white">{order.orderStatus}</span>
              <span className="bg-zinc-900 border border-zinc-800 px-4 py-2 text-xs font-black uppercase tracking-widest text-white">{order.paymentStatus}</span>
            </div>
          </section>

          <section className="bg-zinc-950 p-10 border border-zinc-800">
            <h2 className="text-2xl font-black text-white uppercase mb-10 border-b border-zinc-800 pb-6 tracking-tight">Items</h2>
            <div className="space-y-8">
              {cartItems(order).map((item) => (
                <div key={item._id || item.id || item.productId} className="flex gap-6 group">
                  <div className="w-24 h-24 bg-black border border-zinc-900 shrink-0 overflow-hidden">
                    <img src={productImage(item.product)} alt={item.product?.name || 'Product'} className="w-full h-full object-contain p-4 grayscale group-hover:grayscale-0 transition-all" />
                  </div>
                  <div className="flex-1 flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-lg font-black text-white uppercase mb-2 group-hover:text-primary transition-colors cursor-pointer" onClick={() => item.product && navigate(`/product/${productSlug(item.product)}`)}>{item.product?.name || 'Product'}</h3>
                      {item.selectedFlavor ? <p className="text-sm text-zinc-500 uppercase font-bold tracking-widest mb-1">Flavor: {item.selectedFlavor}</p> : null}
                      <p className="text-sm text-zinc-500 uppercase font-bold tracking-widest">Qty: {item.quantity || 1}</p>
                    </div>
                    <span className="text-xl font-black text-white">{formatPrice(productPrice(item.product) * Number(item.quantity || 1))}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <section className="bg-zinc-950 p-8 border border-zinc-800">
            <h2 className="text-2xl font-black text-white uppercase mb-8 border-b border-zinc-800 pb-6 tracking-tight">Summary</h2>
            <SummaryRow label="Subtotal" value={order.subtotal} />
            <SummaryRow label="Shipping" value={order.shippingFee} />
            <SummaryRow label="Discount" value={-(order.discount || 0)} />
            <div className="flex justify-between items-baseline mt-8 pt-8 border-t border-zinc-800">
              <span className="text-lg font-black text-white uppercase">Total</span>
              <span className="text-3xl font-black text-white">{formatPrice(order.total)}</span>
            </div>
          </section>

          <section className="bg-zinc-950 p-8 border border-zinc-800">
            <div className="flex items-center gap-3 mb-6"><MapPin className="text-primary w-5 h-5" /><h3 className="font-black text-white uppercase text-sm tracking-widest">Shipping Address</h3></div>
            <div className="text-zinc-400 leading-relaxed font-medium">
              <p className="text-white font-black mb-1">{order.shippingDetails?.fullName}</p>
              <p>{order.shippingDetails?.street}</p>
              <p>{order.shippingDetails?.area}, {order.shippingDetails?.city}</p>
              <p>{order.shippingDetails?.phone}</p>
            </div>
          </section>

          <section className="bg-zinc-950 p-8 border border-zinc-800">
            <div className="flex items-center gap-3 mb-6"><CreditCard className="text-primary w-5 h-5" /><h3 className="font-black text-white uppercase text-sm tracking-widest">Payment Method</h3></div>
            <span className="bg-zinc-900 px-4 py-2 border border-zinc-800 text-xs font-black uppercase text-white tracking-widest rounded-sm">{order.paymentMethod?.replace('_', ' ') || 'N/A'}</span>
          </section>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value?: number }) {
  return (
    <div className="mb-4 flex justify-between items-center text-sm">
      <span className="text-zinc-400 font-medium">{label}</span>
      <span className="text-white font-bold">{formatPrice(value)}</span>
    </div>
  );
}
