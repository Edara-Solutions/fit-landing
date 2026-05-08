import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { normalizeApiError } from '../lib/apiClient';
import { authService, LoginPayload, RegisterPayload } from '../services/auth.service';
import { Address, Customer } from '../types';

interface AuthState {
  customer: Customer | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  updateProfile: (payload: Partial<Customer>) => Promise<void>;
  changePassword: (payload: { currentPassword: string; newPassword: string }) => Promise<void>;
  addAddress: (payload: Address) => Promise<void>;
  updateAddress: (addressId: string, payload: Address) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  setDefaultAddress: (addressId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      customer: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      async login(email: string, password: string) {
        set({ loading: true, error: null });
        try {
          const { customer, token } = await authService.login({ email, password } satisfies LoginPayload);
          set({ customer, token, isAuthenticated: true, loading: false });
        } catch (error) {
          const apiError = normalizeApiError(error);
          set({ error: apiError.message, loading: false });
          throw apiError;
        }
      },
      async register(payload: RegisterPayload) {
        set({ loading: true, error: null });
        try {
          const { customer, token } = await authService.register(payload);
          set({ customer, token, isAuthenticated: true, loading: false });
        } catch (error) {
          const apiError = normalizeApiError(error);
          set({ error: apiError.message, loading: false });
          throw apiError;
        }
      },
      logout() {
        set({ customer: null, token: null, isAuthenticated: false, loading: false, error: null });
      },
      async fetchMe() {
        if (!get().token) return;
        set({ loading: true, error: null });
        try {
          const { customer } = await authService.me();
          set({ customer, isAuthenticated: true, loading: false });
        } catch (error) {
          const apiError = normalizeApiError(error);
          if (apiError.status === 401) get().logout();
          set({ error: apiError.message, loading: false });
          throw apiError;
        }
      },
      async updateProfile(payload: Partial<Customer>) {
        set({ loading: true, error: null });
        try {
          const { customer } = await authService.updateProfile(payload);
          set({ customer, loading: false });
        } catch (error) {
          const apiError = normalizeApiError(error);
          set({ error: apiError.message, loading: false });
          throw apiError;
        }
      },
      async changePassword(payload) {
        set({ loading: true, error: null });
        try {
          await authService.changePassword(payload);
          set({ loading: false });
        } catch (error) {
          const apiError = normalizeApiError(error);
          set({ error: apiError.message, loading: false });
          throw apiError;
        }
      },
      async addAddress(payload) {
        const { customer } = await authService.addAddress(payload);
        set({ customer });
      },
      async updateAddress(addressId, payload) {
        const { customer } = await authService.updateAddress(addressId, payload);
        set({ customer });
      },
      async deleteAddress(addressId) {
        const { customer } = await authService.deleteAddress(addressId);
        set({ customer });
      },
      async setDefaultAddress(addressId) {
        const { customer } = await authService.setDefaultAddress(addressId);
        set({ customer });
      },
    }),
    {
      name: 'fox-customer-auth',
      partialize: (state) => ({ customer: state.customer, token: state.token, isAuthenticated: state.isAuthenticated }),
    },
  ),
);
