export interface ApiError extends Error {
  status?: number;
  errors?: unknown;
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  auth?: boolean;
  isFormData?: boolean;
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
const TOKEN_KEY = 'fox-customer-auth';

function getToken() {
  try {
    const persisted = localStorage.getItem(TOKEN_KEY);
    if (!persisted) return null;
    const parsed = JSON.parse(persisted);
    return parsed?.state?.token || null;
  } catch {
    return null;
  }
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof Error) return error as ApiError;
  const apiError = new Error('Something went wrong') as ApiError;
  apiError.errors = error;
  return apiError;
}

export async function apiClient<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const token = getToken();

  if (!options.isFormData) headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');
  if (options.auth !== false && token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body
      ? options.isFormData
        ? options.body as BodyInit
        : JSON.stringify(options.body)
      : undefined,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok || payload?.success === false) {
    const error = new Error(payload?.message || response.statusText || 'Request failed') as ApiError;
    error.status = response.status;
    error.errors = payload?.errors;
    throw error;
  }

  return payload?.data as T;
}

export { API_BASE_URL };
