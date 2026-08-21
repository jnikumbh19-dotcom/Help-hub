import {
  User,
  ServiceProvider,
  CityData,
  ComplaintTicket,
  AuditLogEntry,
  EmergencyCategory,
  UserRole,
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

let authToken: string | null = localStorage.getItem('helphub_token');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('helphub_token', token);
  } else {
    localStorage.removeItem('helphub_token');
  }
};

export const getAuthToken = () => authToken;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'API request failed');
  }

  return data.data;
}

// ================= AUTH APIs =================
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const data = await request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    setAuthToken(data.token);
    return data;
  },

  register: async (payload: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role?: 'user' | 'business';
    city?: string;
    businessName?: string;
    businessCategory?: string;
    iceName?: string;
    icePhone?: string;
  }) => {
    const data = await request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setAuthToken(data.token);
    return data;
  },

  getMe: () => request<User>('/auth/me'),

  logout: () => {
    setAuthToken(null);
  },
};

// ================= CITIES APIs =================
export const citiesApi = {
  getAll: () => request<CityData[]>('/cities'),
  create: (city: Omit<CityData, 'id' | 'isActive'>) =>
    request<CityData>('/cities', {
      method: 'POST',
      body: JSON.stringify(city),
    }),
  toggleActive: (id: string) =>
    request<CityData>(`/cities/${id}/toggle`, {
      method: 'PUT',
    }),
};

// ================= PROVIDERS APIs =================
export const providersApi = {
  getAll: (params?: { category?: EmergencyCategory; city?: string; isVerified?: boolean; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.city) query.append('city', params.city);
    if (params?.isVerified !== undefined) query.append('isVerified', String(params.isVerified));
    if (params?.search) query.append('search', params.search);
    const qs = query.toString();
    return request<ServiceProvider[]>(`/providers${qs ? `?${qs}` : ''}`);
  },

  getById: (id: string) => request<ServiceProvider>(`/providers/${id}`),

  create: (provider: Partial<ServiceProvider>) =>
    request<ServiceProvider>('/providers', {
      method: 'POST',
      body: JSON.stringify(provider),
    }),

  update: (id: string, provider: Partial<ServiceProvider>) =>
    request<ServiceProvider>(`/providers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(provider),
    }),

  delete: (id: string) =>
    request<{ message: string }>(`/providers/${id}`, {
      method: 'DELETE',
    }),

  verify: (id: string) =>
    request<ServiceProvider>(`/providers/${id}/verify`, {
      method: 'PUT',
    }),

  approve: (id: string) =>
    request<ServiceProvider>(`/providers/${id}/approve`, {
      method: 'PUT',
    }),

  reject: (id: string, reason: string) =>
    request<ServiceProvider>(`/providers/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    }),

  toggleActive: (id: string) =>
    request<ServiceProvider>(`/providers/${id}/toggle-active`, {
      method: 'PUT',
    }),
};

// ================= COMPLAINTS APIs =================
export const complaintsApi = {
  getAll: (params?: { status?: string; city?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>);
    const qs = query.toString();
    return request<ComplaintTicket[]>(`/complaints${qs ? `?${qs}` : ''}`);
  },

  create: (complaint: {
    providerName?: string;
    category: EmergencyCategory;
    subject: string;
    description: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  }) =>
    request<ComplaintTicket>('/complaints', {
      method: 'POST',
      body: JSON.stringify(complaint),
    }),

  updateStatus: (id: string, payload: { status: ComplaintTicket['status']; adminResponse?: string }) =>
    request<ComplaintTicket>(`/complaints/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
};

// ================= USERS APIs =================
export const usersApi = {
  getAll: () => request<User[]>('/users'),

  updateProfile: (id: string, profile: Partial<User>) =>
    request<User>(`/users/${id}/profile`, {
      method: 'PUT',
      body: JSON.stringify(profile),
    }),

  updateRole: (id: string, role: UserRole) =>
    request<User>(`/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    }),
};

// ================= AUDIT LOGS APIs =================
export const auditLogsApi = {
  getAll: (params?: { action?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>);
    const qs = query.toString();
    return request<AuditLogEntry[]>(`/audit-logs${qs ? `?${qs}` : ''}`);
  },
};
