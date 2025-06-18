import { baseFetcher } from './fetcher';
import { buildQueryString } from './utils';

export interface Tenant {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  employment_info: any[];
  references: any[];
  documents: any[];
  status: string;
  property?: any;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface TenantFilters {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  order_by?: string;
  order?: 'asc' | 'desc';
}

export interface CreateTenantData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  employment_info: any[];
  references: any[];
  documents: any[];
}

export interface UpdateTenantData extends CreateTenantData {
  id: number;
}

// Get all tenants with filters
export const getTenants = async (filters: TenantFilters = {}) => {
  const queryString = buildQueryString(filters);
  const endpoint = `/api/tenants${queryString ? `?${queryString}` : ''}`;
  return baseFetcher(endpoint);
};

// Get single tenant
export const getTenant = async (id: number) => {
  return baseFetcher(`/api/tenants/${id}`);
};

// Create new tenant
export const createTenant = async (data: CreateTenantData) => {
  return baseFetcher('/api/tenants', {
    method: 'POST',
    body: data
  });
};

// Update tenant
export const updateTenant = async (id: number, data: UpdateTenantData) => {
  return baseFetcher(`/api/tenants/${id}`, {
    method: 'POST', // As per your controller
    body: data
  });
};

// Delete tenant
export const deleteTenant = async (id: number) => {
  return baseFetcher(`/api/tenants/${id}`, {
    method: 'DELETE'
  });
};
