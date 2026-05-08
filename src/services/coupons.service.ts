import { apiClient } from '../lib/apiClient';

export const couponsService = {
  async validate(code: string, orderTotal: number) {
    return apiClient<{ coupon: unknown; discount: number; freeShipping: boolean }>('/api/coupons/validate', {
      method: 'POST',
      body: { code, orderTotal },
    });
  },
};
