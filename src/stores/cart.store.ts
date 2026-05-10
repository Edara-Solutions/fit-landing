import { create } from 'zustand';
import { normalizeApiError } from '../lib/apiClient';
import { cartService } from '../services/cart.service';
import { Cart } from '../types';

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity: number, selectedFlavor?: string) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  resetCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  loading: false,
  error: null,
  async fetchCart() {
    set({ loading: true, error: null });
    try {
      const { cart } = await cartService.get();
      set({ cart, loading: false });
    } catch (error) {
      const apiError = normalizeApiError(error);
      set({ error: apiError.message, loading: false });
      throw apiError;
    }
  },
  async addItem(productId, quantity, selectedFlavor) {
    set({ loading: true, error: null });
    try {
      const { cart } = await cartService.addItem(productId, quantity, selectedFlavor);
      set({ cart, loading: false });
      await get().fetchCart();
    } catch (error) {
      const apiError = normalizeApiError(error);
      set({ error: apiError.message, loading: false });
      throw apiError;
    }
  },
  async updateItem(itemId, quantity) {
    const previous = get().cart;
    set((state) => ({
      cart: state.cart ? { ...state.cart, items: state.cart.items?.map((item) => ((item._id || item.id) === itemId ? { ...item, quantity } : item)) } : state.cart,
      loading: true,
      error: null,
    }));
    try {
      const { cart } = await cartService.updateItem(itemId, quantity);
      set({ cart, loading: false });
      await get().fetchCart();
    } catch (error) {
      const apiError = normalizeApiError(error);
      set({ cart: previous, error: apiError.message, loading: false });
      throw apiError;
    }
  },
  async removeItem(itemId) {
    const previous = get().cart;
    set((state) => ({
      cart: state.cart ? { ...state.cart, items: state.cart.items?.filter((item) => (item._id || item.id) !== itemId) } : state.cart,
      loading: true,
      error: null,
    }));
    try {
      const { cart } = await cartService.removeItem(itemId);
      set({ cart, loading: false });
      await get().fetchCart();
    } catch (error) {
      const apiError = normalizeApiError(error);
      set({ cart: previous, error: apiError.message, loading: false });
      throw apiError;
    }
  },
  async clearCart() {
    const previous = get().cart;
    set({ cart: { items: [] }, loading: true, error: null });
    try {
      await cartService.clear();
      set({ cart: { items: [] }, loading: false });
    } catch (error) {
      const apiError = normalizeApiError(error);
      set({ cart: previous, error: apiError.message, loading: false });
      throw apiError;
    }
  },
  resetCart() {
    set({ cart: null, loading: false, error: null });
  },
}));
