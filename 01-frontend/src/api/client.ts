const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');
const TOKEN_KEY = 'drishti.access_token';
export const AUTH_EXPIRED_EVENT = 'drishti:auth-expired';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
export const setAccessToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearAccessToken = () => localStorage.removeItem(TOKEN_KEY);

const errorMessage = (status: number, body: unknown) => {
  const detail = typeof body === 'object' && body !== null ? (body as { detail?: unknown }).detail : undefined;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => typeof item?.msg === 'string' ? item.msg : null).filter(Boolean).join(' ')
      || 'Please check the submitted information and try again.';
  }

  return ({
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource could not be found.',
    422: 'Please check the submitted information and try again.',
    500: 'The DRISHTI service encountered an error. Please try again shortly.',
  } as Record<number, string>)[status] || 'Request could not be completed.';
};

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const token = getAccessToken();
  const hadSession = Boolean(token);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError(0, 'Unable to reach the DRISHTI service. Please try again shortly.');
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    if (response.status === 401) {
      clearAccessToken();
      if (hadSession) window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    throw new ApiError(response.status, errorMessage(response.status, body));
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export { API_BASE_URL };
