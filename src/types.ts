export type IdLike = string | { _id?: string; id?: string; name?: string; slug?: string };

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ShippingCity {
  name: string;
  shippingFee: number;
  isActive?: boolean;
}

export interface Category {
  _id?: string;
  id?: string;
  name?: string;
  slug?: string;
  image?: string;
  description?: string;
}

export interface Brand {
  _id?: string;
  id?: string;
  name?: string;
  slug?: string;
  logo?: string;
  image?: string;
  description?: string;
}

export interface Product {
  _id?: string;
  id?: string;
  slug?: string;
  name?: string;
  price?: number;
  discountPrice?: number;
  originalPrice?: number;
  category?: Category | IdLike;
  brand?: Brand | IdLike;
  images?: string[];
  image?: string;
  description?: string;
  shortDescription?: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isSale?: boolean;
  isStack?: boolean;
  stock?: number;
  status?: string;
  isSoldOut?: boolean;
  flavors?: string[];
  servings?: number[];
  ingredients?: { name?: string; amount?: string }[];
  nutritionFacts?: Record<string, string | number | boolean | null | undefined>;
  usageInstructions?: string | string[];
  warnings?: string | string[];
  includedItems?: string[];
  averageRating?: number;
  reviewCount?: number;
}

export interface Address {
  _id?: string;
  id?: string;
  fullName?: string;
  phone?: string;
  city?: string;
  area?: string;
  street?: string;
  buildingNumber?: string;
  apartmentNumber?: string;
  notes?: string;
  isDefault?: boolean;
}

export interface Customer {
  _id?: string;
  id?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  addresses?: Address[];
}

export interface CartItem {
  _id?: string;
  id?: string;
  product?: Product;
  productId?: string;
  quantity?: number;
  selectedFlavor?: string;
  price?: number;
  name?: string;
}

export interface Cart {
  _id?: string;
  id?: string;
  items?: CartItem[];
  subtotal?: number;
  total?: number;
}

export interface Review {
  _id?: string;
  id?: string;
  customer?: Customer | string;
  rating?: number;
  comment?: string;
  createdAt?: string;
}

export interface Order {
  _id?: string;
  id?: string;
  orderNumber?: string;
  items?: CartItem[];
  total?: number;
  subtotal?: number;
  shippingFee?: number;
  discount?: number;
  orderStatus?: string;
  paymentStatus?: string;
  paymentMethod?: 'vodafone_cash' | 'instapay';
  rejectionReason?: string;
  payment?: unknown;
  shippingDetails?: Address;
  createdAt?: string;
  notes?: string;
}
