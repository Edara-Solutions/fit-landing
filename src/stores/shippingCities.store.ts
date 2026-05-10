import { create } from 'zustand';
import { normalizeApiError } from '../lib/apiClient';
import { shippingCitiesService } from '../services/shippingCities.service';
import { Pagination, ShippingCity } from '../types';

interface ShippingCitiesState {
  cities: ShippingCity[];
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  fetchShippingCities: () => Promise<void>;
}

const defaultPagination = { page: 1, limit: 100, total: 0, pages: 0 };

export const useShippingCitiesStore = create<ShippingCitiesState>((set) => ({
  cities: [],
  pagination: defaultPagination,
  loading: false,
  error: null,
  async fetchShippingCities() {
    set({ loading: true, error: null });
    try {
      const { cities, pagination } = await shippingCitiesService.list();
      set({ cities, pagination: pagination || defaultPagination, loading: false });
    } catch (error) {
      set({ error: normalizeApiError(error).message, loading: false });
    }
  },
}));
