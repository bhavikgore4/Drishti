import { apiRequest, clearAccessToken, setAccessToken } from './client';

const USER_KEY = 'drishti.auth_user';

export interface AuthUser {
  id: string;
  role: 'citizen' | 'officer' | 'admin';
  name: string;
  email?: string;
  mobile?: string;
  username?: string;
}
interface AuthResponse { access_token: string; token_type: string; user: AuthUser }

const persist = (response: AuthResponse) => {
  setAccessToken(response.access_token);
  localStorage.setItem(USER_KEY, JSON.stringify(response.user));
  return response.user;
};

export const loginCitizen = (identifier: string, password: string) =>
  apiRequest<AuthResponse>('/api/v1/auth/login', { method: 'POST', body: JSON.stringify({ identifier, password }) }).then(persist);

export const loginOfficer = (username: string, password: string) =>
  apiRequest<AuthResponse>('/api/v1/auth/officer/login', { method: 'POST', body: JSON.stringify({ username, password }) }).then(persist);

export const registerCitizen = (payload: Record<string, string | null>) =>
  apiRequest<AuthResponse>('/api/v1/auth/register', { method: 'POST', body: JSON.stringify(payload) }).then(persist);

export const getCurrentUser = () => apiRequest<AuthUser>('/api/v1/auth/me');

export const getPersistedUser = (): AuthUser | null => {
  try {
    const value = localStorage.getItem(USER_KEY);
    return value ? JSON.parse(value) as AuthUser : null;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const persistCurrentUser = (user: AuthUser) => localStorage.setItem(USER_KEY, JSON.stringify(user));

export const logout = () => {
  clearAccessToken();
  localStorage.removeItem(USER_KEY);
};
