import { create } from 'zustand';
import { normalizeApiError } from '../lib/apiClient';
import { couponsService } from '../services/coupons.service';
import { CreateOrderPayload, ordersService } from '../services/orders.service';
import { paymentsService } from '../services/payments.service';
import { Address, Order, Pagination } from '../types';

interface CheckoutState {
  coupon: unknown;
  discount: number;
  freeShipping: boolean;
  selectedAddress: Address | null;
  shippingDetails: Address | null;
  paymentMethod: 'vodafone_cash' | 'instapay';
  orders: Order[];
  currentOrder: Order | null;
  paymentInstructions: Record<string, unknown> | null;
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  setShippingDetails: (address: Address | null) => void;
  setPaymentMethod: (method: 'vodafone_cash' | 'instapay') => void;
  validateCoupon: (code: string, orderTotal: number) => Promise<void>;
  clearCoupon: () => void;
  createOrder: (payload: CreateOrderPayload) => Promise<Order>;
  fetchMyOrders: () => Promise<void>;
  fetchOrderDetails: (id: string) => Promise<void>;
  cancelOrder: (id: string) => Promise<void>;
  fetchPaymentInstructions: (orderId: string) => Promise<void>;
  submitPaymentProof: (orderId: string, formData: FormData) => Promise<void>;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  coupon: null,
  discount: 0,
  freeShipping: false,
  selectedAddress: null,
  shippingDetails: null,
  paymentMethod: 'vodafone_cash',
  orders: [],
  currentOrder: null,
  paymentInstructions: null,
  pagination: { page: 1, limit: 12, total: 0, pages: 0 },
  loading: false,
  error: null,
  setShippingDetails(address) {
    set({ selectedAddress: address, shippingDetails: address });
  },
  setPaymentMethod(method) {
    set({ paymentMethod: method });
  },
  async validateCoupon(code, orderTotal) {
    set({ loading: true, error: null });
    try {
      const data = await couponsService.validate(code, orderTotal);
      set({ coupon: data.coupon, discount: data.discount || 0, freeShipping: Boolean(data.freeShipping), loading: false });
    } catch (error) {
      const apiError = normalizeApiError(error);
      set({ error: apiError.message, loading: false });
      throw apiError;
    }
  },
  clearCoupon() {
    set({ coupon: null, discount: 0, freeShipping: false, error: null });
  },
  async createOrder(payload) {
    set({ loading: true, error: null });
    try {
      const { order } = await ordersService.create(payload);
      set({ currentOrder: order, loading: false });
      return order;
    } catch (error) {
      const apiError = normalizeApiError(error);
      set({ error: apiError.message, loading: false });
      throw apiError;
    }
  },
  async fetchMyOrders() {
    set({ loading: true, error: null });
    try {
      const { orders, pagination } = await ordersService.mine();
      set({ orders, pagination, loading: false });
    } catch (error) {
      const apiError = normalizeApiError(error);
      set({ error: apiError.message, loading: false });
    }
  },
  async fetchOrderDetails(id) {
    set({ loading: true, error: null });
    try {
      const { order } = await ordersService.details(id);
      set({ currentOrder: order, loading: false });
    } catch (error) {
      const apiError = normalizeApiError(error);
      set({ error: apiError.message, loading: false });
    }
  },
  async cancelOrder(id) {
    set({ loading: true, error: null });
    try {
      const { order } = await ordersService.cancel(id);
      set((state) => ({
        currentOrder: order,
        orders: state.orders.map((item) => ((item._id || item.id) === id ? order : item)),
        loading: false,
      }));
    } catch (error) {
      const apiError = normalizeApiError(error);
      set({ error: apiError.message, loading: false });
      throw apiError;
    }
  },
  async fetchPaymentInstructions(orderId) {
    set({ loading: true, error: null });
    try {
      const { instructions } = await paymentsService.instructions(orderId);
      set({ paymentInstructions: instructions, loading: false });
    } catch (error) {
      const apiError = normalizeApiError(error);
      set({ error: apiError.message, loading: false });
    }
  },
  async submitPaymentProof(orderId, formData) {
    set({ loading: true, error: null });
    try {
      await paymentsService.submitProof(orderId, formData);
      set({ loading: false });
    } catch (error) {
      const apiError = normalizeApiError(error);
      set({ error: apiError.message, loading: false });
      throw apiError;
    }
  },
}));
