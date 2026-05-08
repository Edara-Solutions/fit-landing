import { apiClient } from '../lib/apiClient';
import { Address, Customer } from '../types';

export interface LoginPayload { email: string; password: string }
export interface RegisterPayload extends LoginPayload { fullName: string; phone: string }

export const authService = {
  async login(payload: LoginPayload) {
    return apiClient<{ customer: Customer; token: string }>('/api/customers/auth/login', { method: 'POST', body: payload, auth: false });
  },
  async register(payload: RegisterPayload) {
    return apiClient<{ customer: Customer; token: string }>('/api/customers/auth/register', { method: 'POST', body: payload, auth: false });
  },
  async me() {
    return apiClient<{ customer: Customer }>('/api/customers/me');
  },
  async updateProfile(payload: Partial<Customer>) {
    return apiClient<{ customer: Customer }>('/api/customers/me', { method: 'PATCH', body: payload });
  },
  async changePassword(payload: { currentPassword: string; newPassword: string }) {
    return apiClient<null>('/api/customers/me/password', { method: 'PATCH', body: payload });
  },
  async addAddress(payload: Address) {
    return apiClient<{ customer: Customer }>('/api/customers/me/addresses', { method: 'POST', body: payload });
  },
  async updateAddress(addressId: string, payload: Address) {
    return apiClient<{ customer: Customer }>(`/api/customers/me/addresses/${addressId}`, { method: 'PATCH', body: payload });
  },
  async deleteAddress(addressId: string) {
    return apiClient<{ customer: Customer }>(`/api/customers/me/addresses/${addressId}`, { method: 'DELETE' });
  },
  async setDefaultAddress(addressId: string) {
    return apiClient<{ customer: Customer }>(`/api/customers/me/addresses/${addressId}/default`, { method: 'PATCH' });
  },
};
