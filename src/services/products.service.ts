import { apiClient } from '../lib/apiClient';
import { Pagination, Product } from '../types';

export interface ProductFilters {
  category?: string;
  brand?: string;
  flavor?: string;
  isStack?: boolean | string;
  isFeatured?: boolean | string;
  minPrice?: string | number;
  maxPrice?: string | number;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

function queryString(filters: ProductFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
  });
  return params.toString();
}

export const productsService = {
  async list(filters?: ProductFilters) {
    const query = queryString(filters);
    return apiClient<{ products: Product[]; pagination: Pagination }>(`/api/products${query ? `?${query}` : ''}`, { auth: false });
  },
  async bySlug(slug: string) {
    return apiClient<{ product: Product }>(`/api/products/${slug}`, { auth: false });
  },
};
