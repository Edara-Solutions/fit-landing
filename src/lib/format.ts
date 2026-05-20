import { Brand, Cart, CartItem, Category, IdLike, Product } from '../types';

export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=1200&auto=format&fit=crop';

export function getId(value?: IdLike | null) {
  if (!value) return '';
  return typeof value === 'string' ? value : value._id || value.id || '';
}

export function getName(value?: Category | Brand | IdLike | null) {
  if (!value) return '';
  return typeof value === 'string' ? value : value.name || value.slug || '';
}

export function productId(product?: Product | null) {
  return product?._id || product?.id || '';
}

export function productSlug(product?: Product | null) {
  return product?.slug || productId(product);
}

export function productImage(product?: Product | null) {
  return product?.images?.find(Boolean) || product?.image || FALLBACK_IMAGE;
}

export function productPrice(product?: Product | null) {
  return Number(product?.discountPrice ?? product?.price ?? 0);
}

export function productOriginalPrice(product?: Product | null) {
  const price = Number(product?.price ?? 0);
  const discount = product?.discountPrice;
  return discount && discount < price ? price : product?.originalPrice;
}

export function isSoldOut(product?: Product | null) {
  return Boolean(product?.isSoldOut || product?.stock === 0 || product?.status === 'out_of_stock');
}

export function productTextList(value?: string | string[] | null) {
  if (!value) return [];
  const items = Array.isArray(value) ? value : value.split(/\r?\n|\. /);

  return items
    .map((item) => String(item).trim().replace(/\.$/, ''))
    .filter(Boolean);
}

export function formatPrice(value?: number | string | null) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EGP', maximumFractionDigits: 2 }).format(Number(value || 0));
}

export function cartItems(cart?: Cart | null): CartItem[] {
  return Array.isArray(cart?.items) ? cart.items : [];
}

export function cartItemId(item?: CartItem | null) {
  return item?._id || item?.id || '';
}

export function cartSubtotal(cart?: Cart | null) {
  if (typeof cart?.subtotal === 'number') return cart.subtotal;
  return cartItems(cart).reduce((sum, item) => sum + productPrice(item.product) * Number(item.quantity || 0), 0);
}
