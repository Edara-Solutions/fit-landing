import { apiClient } from '../lib/apiClient';
import { Brand, Pagination } from '../types';

export const brandsService = {
  async list() {
    return apiClient<{ brands: Brand[]; pagination: Pagination }>('/api/brands?limit=100', { auth: false });
  },
  async bySlug(slug: string) {
    return apiClient<{ brand: Brand }>(`/api/brands/${slug}`, { auth: false });
  },
};
