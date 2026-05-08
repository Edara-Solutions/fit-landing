import { apiClient } from '../lib/apiClient';
import { Pagination, Review } from '../types';

export const reviewsService = {
  async list(productId: string) {
    return apiClient<{ reviews: Review[]; pagination: Pagination }>(`/api/reviews/products/${productId}`, { auth: false });
  },
  async create(productId: string, payload: { rating: number; comment?: string; order?: string }) {
    return apiClient<{ review: Review }>(`/api/reviews/products/${productId}`, { method: 'POST', body: payload });
  },
  async update(id: string, payload: { rating: number; comment?: string }) {
    return apiClient<{ review: Review }>(`/api/reviews/${id}`, { method: 'PATCH', body: payload });
  },
  async remove(id: string) {
    return apiClient<null>(`/api/reviews/${id}`, { method: 'DELETE' });
  },
};
