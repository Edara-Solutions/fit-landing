import { apiClient } from '../lib/apiClient';
import { Address, Order, Pagination } from '../types';

export interface CreateOrderPayload {
  shippingDetails: Address;
  paymentMethod: 'vodafone_cash' | 'instapay';
  couponCode?: string;
  notes?: string;
}

export const ordersService = {
  async create(payload: CreateOrderPayload) {
    return apiClient<{ order: Order }>('/api/orders', { method: 'POST', body: payload });
  },
  async mine(page = 1, limit = 12) {
    return apiClient<{ orders: Order[]; pagination: Pagination }>(`/api/orders/my-orders?page=${page}&limit=${limit}`);
  },
  async details(id: string) {
    return apiClient<{ order: Order }>(`/api/orders/my-orders/${id}`);
  },
  async cancel(id: string) {
    return apiClient<{ order: Order }>(`/api/orders/my-orders/${id}/cancel`, { method: 'PATCH' });
  },
};
