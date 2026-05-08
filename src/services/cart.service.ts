import { apiClient } from '../lib/apiClient';
import { Cart } from '../types';

export const cartService = {
  async get() {
    return apiClient<{ cart: Cart }>('/api/cart');
  },
  async addItem(productId: string, quantity: number, selectedFlavor?: string) {
    return apiClient<{ cart: Cart }>('/api/cart/items', { method: 'POST', body: { productId, quantity, selectedFlavor } });
  },
  async updateItem(itemId: string, quantity: number) {
    return apiClient<{ cart: Cart }>(`/api/cart/items/${itemId}`, { method: 'PATCH', body: { quantity } });
  },
  async removeItem(itemId: string) {
    return apiClient<{ cart: Cart }>(`/api/cart/items/${itemId}`, { method: 'DELETE' });
  },
  async clear() {
    return apiClient<null>('/api/cart', { method: 'DELETE' });
  },
};
