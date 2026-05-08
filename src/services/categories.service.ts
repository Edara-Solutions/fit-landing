import { apiClient } from '../lib/apiClient';
import { Category, Pagination } from '../types';

export const categoriesService = {
  async list() {
    return apiClient<{ categories: Category[]; pagination: Pagination }>('/api/categories?limit=100', { auth: false });
  },
  async bySlug(slug: string) {
    return apiClient<{ category: Category }>(`/api/categories/${slug}`, { auth: false });
  },
};
