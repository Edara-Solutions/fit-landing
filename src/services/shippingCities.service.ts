import { apiClient } from '../lib/apiClient';
import { Pagination, ShippingCity } from '../types';

export const shippingCitiesService = {
  async list(page = 1, limit = 100) {
    return apiClient<{ cities: ShippingCity[]; pagination: Pagination }>(`/api/shipping-cities?page=${page}&limit=${limit}`, { auth: false });
  },
};
