import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useEffect } from 'react';
import { EmptyState } from '../components/AsyncState';
import { cartItemId, cartItems, cartSubtotal, formatPrice, productImage, productPrice, productSlug } from '../lib/format';
import { useToast } from '../lib/toast';
import { useCartStore } from '../stores/cart.store';

export default function Cart() {
  const navigate = useNavigate();
  const { notify } = useToast();
  const { cart, loading, error, fetchCart, updateItem, removeItem, clearCart } = useCartStore();
  const items = cartItems(cart);

  useEffect(() => {
    fetchCart().catch(() => undefined);
  }, [fetchCart]);

  const run = async (action: () => Promise<void>, message: string) => {
    try {
      await action();
      notify(message, 'success');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Cart action failed.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Cart</h1>
          <p className="text-zinc-400 mt-2">Review your stack before checkout.</p>
        </div>
        {items.length ? <button disabled={loading} onClick={() => run(clearCart, 'Cart cleared.')} className="flex items-center gap-2 rounded-full border border-zinc-700 px-6 py-3 font-black uppercase text-white hover:border-primary hover:text-primary"><Trash2 size={16} />Clear</button> : null}
      </div>

      {error ? <EmptyState title="Could not load cart" body={error} /> : null}
      {!items.length && !loading ? (
        <EmptyState title="Your cart is empty" body="Add products from the shop to start checkout." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => {
              const product = item.product;
              const id = cartItemId(item);
              return (
                <div key={id} className="border border-zinc-800 bg-zinc-950 p-5 flex flex-col md:flex-row gap-5">
                  <Link to={`/product/${productSlug(product)}`} className="h-28 w-28 shrink-0 bg-zinc-900 border border-zinc-800">
                    <img src={productImage(product)} alt={product?.name || 'Product'} className="h-full w-full object-contain p-3" />
                  </Link>
                  <div className="flex-1">
                    <h3 className="font-black uppercase text-white">{product?.name || 'Product'}</h3>
                    {item.selectedFlavor ? <p className="mt-1 text-xs font-bold uppercase tracking-widest text-zinc-500">Flavor: {item.selectedFlavor}</p> : null}
                    <p className="mt-3 text-primary font-black">{formatPrice(productPrice(product))}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-28 items-center rounded-full border border-zinc-800 bg-black px-2">
                      <button disabled={loading || Number(item.quantity || 1) <= 1} onClick={() => run(() => updateItem(id, Number(item.quantity || 1) - 1), 'Cart updated.')} className="flex-1 flex justify-center text-white disabled:opacity-40"><Minus size={14} /></button>
                      <span className="flex-1 text-center font-bold">{item.quantity || 1}</span>
                      <button disabled={loading} onClick={() => run(() => updateItem(id, Number(item.quantity || 1) + 1), 'Cart updated.')} className="flex-1 flex justify-center text-white"><Plus size={14} /></button>
                    </div>
                    <button disabled={loading} onClick={() => run(() => removeItem(id), 'Item removed.')} className="text-zinc-500 hover:text-primary"><Trash2 size={18} /></button>
                  </div>
                </div>
              );
            })}
          </div>
          <aside className="lg:col-span-4">
            <div className="sticky top-32 border border-zinc-800 bg-zinc-950 p-8">
              <h2 className="text-xl font-black uppercase text-white border-b border-zinc-800 pb-4">Summary</h2>
              <div className="py-6 flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span className="font-black text-white">{formatPrice(cartSubtotal(cart))}</span>
              </div>
              <button onClick={() => navigate('/checkout')} disabled={!items.length || loading} className="w-full rounded-full bg-primary py-4 font-black uppercase tracking-widest text-white hover:bg-primary-hover disabled:opacity-50 flex items-center justify-center gap-2">
                <ShoppingBag size={18} /> Checkout
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
