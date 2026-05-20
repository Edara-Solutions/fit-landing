import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, XCircle, Upload, CheckCircle, Loader, Image as ImageIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { EmptyState } from '../components/AsyncState';
import GlobalLoader from '../components/GlobalLoader';
import { cartItems, formatPrice, getId, productImage, productPrice, productSlug } from '../lib/format';
import { useToast } from '../lib/toast';
import { useCheckoutStore } from '../stores/checkout.store';
import { Product } from '../types';

const ORDER_STATUS_STYLES: Record<string, string> = {
  pending_payment: 'bg-amber-950 text-amber-200 border-amber-700/60',
  payment_submitted: 'bg-sky-950 text-sky-200 border-sky-700/60',
  confirmed: 'bg-emerald-950 text-emerald-200 border-emerald-700/60',
  processing: 'bg-indigo-950 text-indigo-200 border-indigo-700/60',
  shipped: 'bg-blue-950 text-blue-200 border-blue-700/60',
  delivered: 'bg-green-950 text-green-200 border-green-700/60',
  cancelled: 'bg-zinc-900 text-zinc-300 border-zinc-700',
  refunded: 'bg-purple-950 text-purple-200 border-purple-700/60',
  payment_rejected: 'bg-red-950 text-red-200 border-red-700/60',
};

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-950 text-amber-200 border-amber-700/60',
  awaiting_review: 'bg-sky-950 text-sky-200 border-sky-700/60',
  paid: 'bg-emerald-950 text-emerald-200 border-emerald-700/60',
  rejected: 'bg-red-950 text-red-200 border-red-700/60',
  failed: 'bg-rose-950 text-rose-200 border-rose-700/60',
  refunded: 'bg-purple-950 text-purple-200 border-purple-700/60',
};

const BADGE_BASE = 'inline-flex items-center rounded-full border px-4 py-2 text-xs font-black uppercase tracking-widest';

export default function OrderDetails() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { notify } = useToast();
  const { currentOrder: order, loading, error, fetchOrderDetails, cancelOrder } = useCheckoutStore();
  const [isProofOpen, setIsProofOpen] = useState(false);

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

  if (loading && !order) return <div className="max-w-7xl mx-auto px-6 md:px-10 py-24"><GlobalLoader label="Loading order" /></div>;
  if (!order) return <div className="max-w-7xl mx-auto px-6 md:px-10 py-24"><EmptyState title="Order not found" body={error || 'We could not find this order.'} /></div>;

  const proofImage = typeof order.payment === 'object' && order.payment && 'proofImage' in order.payment
    ? String((order.payment as { proofImage?: string }).proofImage || '')
    : '';
  const rejectionReason = order.paymentStatus === 'rejected'
    ? getPaymentRejectionReason(order)
    : '';

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 pb-32">
      <Link to="/orders" className="inline-flex items-center gap-2 text-zinc-400 hover:text-primary transition-colors mb-12 group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold uppercase tracking-widest text-sm">Back to Orders</span>
      </Link>

      <div className="mb-16 overflow-hidden border border-zinc-800 bg-zinc-950">
        <div className="flex flex-col gap-8 p-8 md:p-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-primary">Order Details</p>
          <h1 className="break-words text-4xl md:text-3xl font-black text-white uppercase tracking-tighter mb-4">Order #{order.orderNumber || getId(order).slice(-8)}</h1>
          <p className="text-base text-zinc-400">Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <StatusBadge label="Order" status={order.orderStatus || 'pending_payment'} styles={ORDER_STATUS_STYLES} />
            <StatusBadge label="Payment" status={order.paymentStatus || 'pending'} styles={PAYMENT_STATUS_STYLES} />
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 lg:w-auto lg:min-w-80">
          <div className="flex flex-wrap justify-start gap-3 lg:justify-end">
            {order.orderStatus === 'pending_payment' ? <button onClick={cancel} className="bg-zinc-900 text-white font-black uppercase py-3 px-6 rounded-full border border-zinc-700 hover:border-primary hover:text-primary transition-all flex items-center gap-2 cursor-pointer"><XCircle size={18} />Cancel</button> : null}
            {order.paymentStatus === 'pending' || order.paymentStatus === 'rejected' ? <button onClick={() => navigate(`/payment/${getId(order)}`)} className="bg-primary text-white font-black uppercase py-3 px-6 rounded-full hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all flex items-center gap-2 cursor-pointer"><Upload size={18} />Upload Receipt</button> : null}
            {/* {order.paymentStatus === 'awaiting_review' ? <div className="flex items-center gap-2 rounded-full border border-sky-700/60 bg-sky-950 px-4 py-2 font-black uppercase text-sky-200"><Loader size={12} />Processing</div> : null}
            {order.orderStatus === 'cancelled' ? <div className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 font-black uppercase text-zinc-300"><XCircle size={12} />Canceled</div> : null}
            {order.paymentStatus === 'paid' ? <div className="flex items-center gap-2 rounded-full border border-emerald-700/60 bg-emerald-950 px-4 py-2 font-black uppercase text-emerald-200"><CheckCircle size={12} />Paid</div> : null} */}
          </div>

          {proofImage ? (
            <button
              type="button"
              onClick={() => setIsProofOpen(true)}
              className="cursor-pointer group flex items-center gap-4 rounded-xl border border-zinc-800 bg-black p-3 text-left transition-all hover:border-primary"
            >
              <img src={proofImage} alt="Payment proof thumbnail" className="h-20 w-20 shrink-0 rounded-lg border border-zinc-800 object-cover" />
              <span className="min-w-0">
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white"><ImageIcon size={15} className="text-primary" />Payment Proof</span>
                <span className="mt-1 block text-xs text-zinc-500 group-hover:text-zinc-300">Click to preview receipt</span>
              </span>
            </button>
          ) : null}

          {rejectionReason ? (
            <div className="rounded-xl border border-red-800/70 bg-red-950/30 p-4 text-sm text-red-100">
              <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-200">
                <XCircle size={15} />
                Payment Rejected
              </div>
              <p className="leading-relaxed text-red-50">{rejectionReason}</p>
            </div>
          ) : null}
        </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          {/* <section className="bg-zinc-950 p-10 border border-zinc-800">
            <h2 className="text-2xl font-black text-white uppercase mb-6 tracking-tight">Status</h2>
            <div className="flex flex-wrap gap-3">
              <StatusBadge label="Order" status={order.orderStatus || 'pending_payment'} styles={ORDER_STATUS_STYLES} />
              <StatusBadge label="Payment" status={order.paymentStatus || 'pending'} styles={PAYMENT_STATUS_STYLES} />
            </div>
          </section> */}

          <section className="bg-zinc-950 p-5 sm:p-8 lg:p-10 border border-zinc-800">
            <h2 className="text-2xl font-black text-white uppercase mb-8 border-b border-zinc-800 pb-5 tracking-tight">Items</h2>
            <div className="space-y-6">
              {cartItems(order).map((item) => {
                const product = (item) as Product;
                return (
                  <div key={item._id || item.id || item.productId} className="group flex flex-col gap-5 border-b border-zinc-900 pb-6 last:border-b-0 last:pb-0 sm:flex-row sm:items-start">
                    <div className="h-28 w-full bg-black border border-zinc-900 overflow-hidden sm:h-24 sm:w-24 sm:shrink-0">
                      <img src={productImage(product)} alt={product?.name || 'Product'} className="w-full h-full object-contain p-4 grayscale group-hover:grayscale-0 transition-all" />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
                      <div className="min-w-0">
                        <h3 className="break-words text-base sm:text-lg font-black text-white uppercase mb-2 group-hover:text-primary transition-colors cursor-pointer" onClick={() => product && navigate(`/product/${productSlug(product)}`)}>{product?.name || 'Product'}</h3>
                        {item.selectedFlavor ? <p className="text-sm text-zinc-500 uppercase font-bold tracking-widest mb-1">Flavor: {item.selectedFlavor}</p> : null}
                        <p className="text-sm text-zinc-500 uppercase font-bold tracking-widest">Qty: {item.quantity || 1}</p>
                      </div>
                      <span className="shrink-0 text-left text-xl font-black text-white sm:text-right">{formatPrice(productPrice(product) * Number(item.quantity || 1))}</span>
                    </div>
                  </div>
                );
              })}
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

      {isProofOpen && proofImage ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4" onClick={() => setIsProofOpen(false)}>
          <div className="relative max-h-[90vh] w-full max-w-4xl" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => setIsProofOpen(false)}
              className="cursor-pointer absolute -right-2 -top-12 rounded-full border border-zinc-700 bg-zinc-950 px-4 py-2 text-xs font-black uppercase tracking-widest text-white hover:border-primary hover:text-primary"
            >
              Close
            </button>
            <img src={proofImage} alt="Payment proof" className="max-h-[90vh] w-full rounded-xl border border-zinc-800 bg-zinc-950 object-contain" />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StatusBadge({ label, status, styles }: { label: string; status: string; styles: Record<string, string> }) {
  return (
    <span className={`${BADGE_BASE} ${styles[status] || 'bg-zinc-900 text-zinc-300 border-zinc-700'}`}>
      {label}: {status.replace(/_/g, ' ')}
    </span>
  );
}

function getPaymentRejectionReason(order: { rejectionReason?: string; payment?: unknown }) {
  if (typeof order.rejectionReason === 'string' && order.rejectionReason.trim()) {
    return order.rejectionReason.trim();
  }

  if (typeof order.payment === 'object' && order.payment && 'rejectionReason' in order.payment) {
    const reason = (order.payment as { rejectionReason?: unknown }).rejectionReason;
    return typeof reason === 'string' ? reason.trim() : '';
  }

  return '';
}

function SummaryRow({ label, value }: { label: string; value?: number }) {
  return (
    <div className="mb-4 flex justify-between items-center text-sm">
      <span className="text-zinc-400 font-medium">{label}</span>
      <span className="text-white font-bold">{formatPrice(value)}</span>
    </div>
  );
}
