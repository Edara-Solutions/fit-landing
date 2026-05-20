import { Lock, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../components/AsyncState';
import { cartItems, cartSubtotal, formatPrice, getId, productImage, productPrice } from '../lib/format';
import { useToast } from '../lib/toast';
import { useAuthStore } from '../stores/auth.store';
import { useCartStore } from '../stores/cart.store';
import { useCheckoutStore } from '../stores/checkout.store';
import { useShippingCitiesStore } from '../stores/shippingCities.store';
import { Address } from '../types';

const emptyAddress: Address = { fullName: '', phone: '', city: '', area: '', street: '', buildingNumber: '', apartmentNumber: '', notes: '' };
const normalizeCity = (value?: string) => value?.trim().toLowerCase() || '';

export default function Checkout() {
  const navigate = useNavigate();
  const { notify } = useToast();
  const { customer } = useAuthStore();
  const { cart, fetchCart } = useCartStore();
  const { coupon, discount, freeShipping, paymentMethod, loading, validateCoupon, clearCoupon, createOrder, setPaymentMethod } = useCheckoutStore();
  const { cities, fetchShippingCities } = useShippingCitiesStore();
  const [addressId, setAddressId] = useState('');
  const [address, setAddress] = useState<Address>(emptyAddress);
  const [couponCode, setCouponCode] = useState('');
  const [notes, setNotes] = useState('');
  const items = cartItems(cart);
  const subtotal = cartSubtotal(cart);
  const selectedShippingCity = cities.find((city) => normalizeCity(city.name) === normalizeCity(address.city));
  const shippingFee = freeShipping || subtotal <= 0 ? 0 : selectedShippingCity?.shippingFee || 0;
  const total = Math.max(0, subtotal + shippingFee - discount);
  const isCouponVerified = Boolean(couponCode.trim() && coupon);

  const addresses = useMemo(() => customer?.addresses || [], [customer?.addresses]);

  useEffect(() => {
    fetchCart().catch(() => undefined);
  }, [fetchCart]);

  useEffect(() => {
    fetchShippingCities();
  }, [fetchShippingCities]);

  useEffect(() => {
    const defaultAddress = addresses.find((item) => item.isDefault) || addresses[0];
    if (defaultAddress && !addressId) {
      setAddressId(getId(defaultAddress));
      setAddress(defaultAddress);
    }
  }, [addressId, addresses]);

  const updateAddress = (key: keyof Address, value: string) => setAddress((current) => ({ ...current, [key]: value }));

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      await validateCoupon(couponCode.trim(), subtotal);
      notify('Coupon applied.', 'success');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Coupon is not valid.', 'error');
    }
  };

  const resetCoupon = () => {
    setCouponCode('');
    clearCoupon();
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!items.length) {
      notify('Your cart is empty.', 'error');
      return;
    }
    if (!address.fullName || !address.phone || !address.city || !address.area || !address.street) {
      notify('Please complete your shipping details.', 'error');
      return;
    }
    if (cities.length > 0 && !selectedShippingCity) {
      notify('Please choose an available shipping city.', 'error');
      return;
    }
    try {
      const order = await createOrder({
        shippingDetails: address,
        paymentMethod,
        couponCode: couponCode || undefined,
        notes: notes || undefined,
      });
      await fetchCart().catch(() => undefined);
      notify('Order created. Continue with payment proof.', 'success');
      navigate(`/payment/${order._id || order.id}`);
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Could not create order.', 'error');
    }
  };

  if (!items.length) {
    return <div className="max-w-7xl mx-auto px-6 md:px-10 py-24"><EmptyState title="Your cart is empty" body="Add items before checkout." /></div>;
  }

  return (
    <form onSubmit={submit} className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24 flex flex-col lg:flex-row gap-16 items-start">
      <div className="w-full lg:flex-1 flex flex-col gap-12">
        <section className="flex flex-col gap-8">
          <h2 className="text-3xl font-black uppercase text-white tracking-tight">Delivery</h2>
          {addresses.length ? (
            <select
              value={addressId}
              onChange={(event) => {
                const next = addresses.find((item) => getId(item) === event.target.value);
                setAddressId(event.target.value);
                if (next) setAddress(next);
              }}
              className="bg-zinc-950 border border-zinc-800 p-4 text-white focus:border-primary"
            >
              {addresses.map((item) => <option key={getId(item)} value={getId(item)}>{item.fullName} - {item.city}, {item.area}</option>)}
            </select>
          ) : null}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={address.fullName || ''} onChange={(event) => updateAddress('fullName', event.target.value)} placeholder="Full name" className="bg-zinc-950 border border-zinc-800 p-4 text-white focus:border-primary" />
            <input value={address.phone || ''} onChange={(event) => updateAddress('phone', event.target.value)} placeholder="Phone" className="bg-zinc-950 border border-zinc-800 p-4 text-white focus:border-primary" />
            <select value={address.city || ''} onChange={(event) => updateAddress('city', event.target.value)} className="bg-zinc-950 border border-zinc-800 p-4 text-white focus:border-primary">
              <option value="">Choose city</option>
              {cities.map((city) => <option key={city.name} value={city.name}>{city.name}</option>)}
            </select>
            <input value={address.area || ''} onChange={(event) => updateAddress('area', event.target.value)} placeholder="Area" className="bg-zinc-950 border border-zinc-800 p-4 text-white focus:border-primary" />
            <input value={address.street || ''} onChange={(event) => updateAddress('street', event.target.value)} placeholder="Street" className="col-span-full bg-zinc-950 border border-zinc-800 p-4 text-white focus:border-primary" />
            <input value={address.buildingNumber || ''} onChange={(event) => updateAddress('buildingNumber', event.target.value)} placeholder="Building number" className="bg-zinc-950 border border-zinc-800 p-4 text-white focus:border-primary" />
            <input value={address.apartmentNumber || ''} onChange={(event) => updateAddress('apartmentNumber', event.target.value)} placeholder="Apartment number" className="bg-zinc-950 border border-zinc-800 p-4 text-white focus:border-primary" />
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Order notes" className="col-span-full min-h-24 bg-zinc-950 border border-zinc-800 p-4 text-white focus:border-primary" />
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <div>
            <h2 className="text-3xl font-black uppercase text-white tracking-tight">Payment</h2>
            <p className="text-zinc-500 text-sm mt-1">Choose one of the supported manual payment methods.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['vodafone_cash', 'instapay'] as const).map((method) => (
              <button key={method} type="button" onClick={() => setPaymentMethod(method)} className={`cursor-pointer rounded-lg border p-5 text-left uppercase font-black ${paymentMethod === method ? 'border-primary bg-primary/10 text-white' : 'border-zinc-800 bg-zinc-950 text-zinc-400'}`}>
                <span className="flex items-center gap-3"><span className={`h-5 w-5 rounded-full border-2 ${paymentMethod === method ? 'border-primary bg-primary' : 'border-zinc-700'}`} />{method.replace('_', ' ')}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <aside className="w-full lg:w-[450px] shrink-0 sticky top-32">
        <div className="bg-zinc-950 border border-zinc-800 p-8 flex flex-col gap-8">
          <h3 className="text-xl font-black uppercase text-white border-b border-zinc-800 pb-4">Order Summary</h3>
          <div className="flex flex-col gap-6">
            {items.map((item) => (
              <div key={item._id || item.id} className="flex gap-4">
                <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 relative shrink-0">
                  <img src={productImage(item.product)} alt={item.product?.name || 'Product'} className="w-full h-full object-contain p-2 grayscale" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center text-[10px] font-bold text-white border border-zinc-700">{item.quantity || 1}</div>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold uppercase text-white text-sm">{item.product?.name || 'Product'}</h4>
                  {item.selectedFlavor ? <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{item.selectedFlavor}</p> : null}
                </div>
                <span className="font-bold text-zinc-100">{formatPrice(productPrice(item.product) * Number(item.quantity || 1))}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <input
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
              placeholder="Discount code"
              disabled={isCouponVerified}
              className="flex-1 bg-zinc-900 border border-zinc-800 p-3 uppercase text-xs font-bold tracking-widest disabled:cursor-not-allowed disabled:opacity-60"
            />
            {isCouponVerified ? (
              <button type="button" onClick={resetCoupon} className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 uppercase font-bold text-xs transition-colors">Clear</button>
            ) : (
              <button type="button" onClick={applyCoupon} className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 uppercase font-bold text-xs transition-colors">Apply</button>
            )}
          </div>

          <div className="space-y-3 pt-6 border-t border-zinc-800">
            <SummaryRow label="Subtotal" value={subtotal} />
            <SummaryRow label="Shipping" value={shippingFee} />
            {discount ? <SummaryRow label="Discount" value={-discount} /> : null}
          </div>

          <div className="flex justify-between items-baseline pt-6 border-t border-zinc-800">
            <span className="text-xl font-black uppercase text-white">Total</span>
            <span className="text-3xl font-black text-white">{formatPrice(total)}</span>
          </div>

          <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading} className="cursor-pointer w-full bg-primary text-white font-black uppercase py-6 rounded-full tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:bg-primary-hover transition-all disabled:opacity-60">
            <Lock size={18} />
            {loading ? 'Creating...' : 'Create Order'}
          </motion.button>
          <p className="flex items-center justify-center gap-2 text-center text-[10px] text-zinc-600 uppercase tracking-widest"><Check size={14} /> Secure checkout</p>
        </div>
      </aside>
    </form>
  );
}

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-sm text-zinc-400">
      <span>{label}</span>
      <span className="text-white">{formatPrice(value)}</span>
    </div>
  );
}
