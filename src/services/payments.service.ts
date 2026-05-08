import { apiClient } from '../lib/apiClient';

export const paymentsService = {
  async instructions(orderId: string) {
    return apiClient<{ instructions: Record<string, unknown> }>(`/api/payments/instructions/${orderId}`);
  },
  async submitProof(orderId: string, formData: FormData) {
    return apiClient<{ payment: unknown }>(`/api/payments/${orderId}/proof`, { method: 'POST', body: formData, isFormData: true });
  },
};
