import { Lock, Check, ChevronDown, BadgePercent, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../components/AsyncState';
import instapayLogo from '../assets/images/instapay.png';
import vodafoneCashLogo from '../assets/images/vodafonecash.jpg';
import { cartItems, cartSubtotal, formatPrice, getId, productImage, productPrice } from '../lib/format';
import { useToast } from '../lib/toast';
import { useAuthStore } from '../stores/auth.store';
import { useCartStore } from '../stores/cart.store';
import { useCheckoutStore } from '../stores/checkout.store';
import { useShippingCitiesStore } from '../stores/shippingCities.store';
import { Address } from '../types';

const emptyAddress: Address = { fullName: '', phone: '', city: '', area: '', street: '', buildingNumber: '', apartmentNumber: '', notes: '' };
const normalizeCity = (value?: string) => value?.trim().toLowerCase() || '';
const PAYMENT_METHODS = [
  {
    value: 'vodafone_cash',
    label: 'Vodafone Cash',
    image: vodafoneCashLogo,
    detail: 'Pay from any Vodafone Cash wallet.',
  },
  {
    value: 'instapay',
    label: 'InstaPay',
    image: instapayLogo,
    detail: 'Transfer instantly through InstaPay.',
  },
] as const;

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
  const depositAmount = total * 0.1;
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
            <div className="relative">
              <select
                value={addressId}
                onChange={(event) => {
                  const next = addresses.find((item) => getId(item) === event.target.value);
                  setAddressId(event.target.value);
                  if (next) setAddress(next);
                }}
                className="w-full appearance-none bg-zinc-950 border border-zinc-800 py-4 pl-4 pr-12 text-white outline-none focus:border-primary"
              >
                {addresses.map((item) => <option key={getId(item)} value={getId(item)}>{item.fullName} - {item.city}, {item.area}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
            </div>
          ) : null}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={address.fullName || ''} onChange={(event) => updateAddress('fullName', event.target.value)} placeholder="Full name" className="bg-zinc-950 border border-zinc-800 p-4 text-white focus:border-primary" />
            <input value={address.phone || ''} onChange={(event) => updateAddress('phone', event.target.value)} placeholder="Phone" className="bg-zinc-950 border border-zinc-800 p-4 text-white focus:border-primary" />
            <div className="relative">
              <select value={address.city || ''} onChange={(event) => updateAddress('city', event.target.value)} className="w-full appearance-none bg-zinc-950 border border-zinc-800 py-4 pl-4 pr-12 text-white outline-none focus:border-primary">
                <option value="">Choose city</option>
                {cities.map((city) => <option key={city.name} value={city.name}>{city.name}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
            </div>
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
            <p className="text-zinc-500 text-sm mt-1">Choose one manual payment method. You will pay a 10% minimum deposit after creating the order.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {PAYMENT_METHODS.map((method) => {
              const isSelected = paymentMethod === method.value;

              return (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setPaymentMethod(method.value)}
                  className={`group cursor-pointer rounded-xl border p-5 text-left transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-xl shadow-primary/10'
                      : 'border-zinc-800 bg-zinc-950 hover:border-zinc-600'
                  }`}
                >
                  <span className="flex items-start gap-4">
                    <span className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${isSelected ? 'border-primary bg-primary' : 'border-zinc-700 bg-black'}`}>
                      {isSelected ? <Check size={14} className="text-white" /> : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex h-16 w-20 items-center justify-center rounded-xl border border-white/10 bg-white p-3 shadow-lg shadow-black/20 ring-1 ring-black/5">
                        <img src={method.image} alt={method.label} className="max-h-full max-w-full object-contain" />
                      </span>
                      <span className="mt-4 block text-sm font-black uppercase tracking-widest text-white">{method.label}</span>
                      <span className="mt-1 block text-xs font-medium leading-5 text-zinc-500">{method.detail}</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="overflow-hidden border border-primary/40 bg-gradient-to-br from-primary/15 via-zinc-950 to-emerald-950/30 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary/50 bg-black text-primary">
                  <BadgePercent size={22} />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Required deposit</p>
                  <h3 className="mt-1 text-lg font-black uppercase text-white">Pay 10% now to confirm review</h3>
                  <p className="mt-1 text-sm leading-6 text-zinc-400">
                    After creating the order, upload proof for at least 10% of the total. The remaining balance can be handled after review.
                  </p>
                </div>
              </div>
              <div className="shrink-0 border border-white/10 bg-black/60 p-4 text-left sm:text-right">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Minimum due</span>
                <strong className="mt-1 block text-2xl font-black text-white">{formatPrice(depositAmount)}</strong>
                <span className="mt-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-300 sm:justify-end">
                  <ShieldCheck size={13} />
                  10% of {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <aside className="w-full lg:w-[450px] shrink-0 lg:sticky lg:top-32">
        <div className="bg-zinc-950 border border-zinc-800 p-5 sm:p-8 flex flex-col gap-8">
          <h3 className="text-xl font-black uppercase text-white border-b border-zinc-800 pb-4">Order Summary</h3>
          <div className="flex flex-col gap-6">
            {items.map((item) => (
              <div key={item._id || item.id} className="grid grid-cols-[72px_minmax(0,1fr)] gap-4 sm:grid-cols-[80px_minmax(0,1fr)_auto] sm:items-start">
                <div className="relative h-18 w-18 shrink-0 bg-zinc-900 border border-zinc-800 sm:h-20 sm:w-20">
                  <img src={productImage(item.product)} alt={item.product?.name || 'Product'} className="w-full h-full object-contain p-2 grayscale" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center text-[10px] font-bold text-white border border-zinc-700">{item.quantity || 1}</div>
                </div>
                <div className="min-w-0">
                  <h4 className="break-words font-bold uppercase text-white text-sm leading-5">{item.product?.name || 'Product'}</h4>
                  {item.selectedFlavor ? <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{item.selectedFlavor}</p> : null}
                </div>
                <span className="col-start-2 font-bold text-zinc-100 sm:col-start-auto sm:text-right">{formatPrice(productPrice(item.product) * Number(item.quantity || 1))}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <input
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
              placeholder="Discount code"
              disabled={isCouponVerified}
              className="min-w-0 bg-zinc-900 border border-zinc-800 p-3 uppercase text-xs font-bold tracking-widest disabled:cursor-not-allowed disabled:opacity-60"
            />
            {isCouponVerified ? (
              <button type="button" onClick={resetCoupon} className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 uppercase font-bold text-xs transition-colors">Clear</button>
            ) : (
              <button type="button" onClick={applyCoupon} className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 uppercase font-bold text-xs transition-colors">Apply</button>
            )}
          </div>

          <div className="space-y-4 pt-6 border-t border-zinc-800">
            <SummaryRow label="Subtotal" value={subtotal} />
            <SummaryRow label="Shipping" value={shippingFee} />
            {discount ? <SummaryRow label="Discount" value={-discount} /> : null}
          </div>

          <div className="rounded-xl border border-primary/40 bg-gradient-to-br from-primary/15 via-zinc-950 to-black p-5 shadow-xl shadow-primary/10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">Order Total</span>
                <p className="mt-1 text-xs font-medium text-zinc-500">Includes shipping and applied discounts.</p>
              </div>
              <span className="break-words text-3xl font-black leading-none text-white sm:text-right">{formatPrice(total)}</span>
            </div>
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
