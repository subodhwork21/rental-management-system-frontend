import { baseFetcher } from './fetcher';
import { buildQueryString } from './utils';

export interface Lease {
  id: number;
  property_id: number;
  tenant_id: number;
  lease_start_date: string;
  lease_end_date: string;
  monthly_rent: number;
  security_deposit: number;
  status: 'active' | 'expired' | 'terminated';
  lease_terms?: string;
  signed_date?: string;
  property?: any;
  tenant?: any;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateLeaseData {
  property_id: number;
  tenant_id: number;
  lease_start_date: string;
  lease_end_date: string;
  monthly_rent: number;
  security_deposit: number;
  status: 'active' | 'expired' | 'terminated';
  lease_terms?: string;
  signed_date?: string;
}

export interface UpdateLeaseData extends CreateLeaseData {
  id: number;
}

export interface LeaseFilters {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  property_id?: number;
  tenant_id?: number;
}

// Get all leases
export const getLeases = async (filters: LeaseFilters = {}) => {
  const queryString = buildQueryString(filters);
  const endpoint = `/api/leases${queryString ? `?${queryString}` : ''}`;
  return baseFetcher<Lease[]>(endpoint);
};

// Get single lease
export const getLease = async (id: number) => {
  return baseFetcher<Lease>(`/api/leases/${id}`);
};

// Create lease
export const createLease = async (data: CreateLeaseData) => {
  return baseFetcher<Lease>('/api/leases', {
    method: 'POST',
    body: data
  });
};

// Update lease
export const updateLease = async (id: number, data: UpdateLeaseData) => {
  return baseFetcher<Lease>(`/api/leases/${id}`, {
    method: 'POST', // Using POST as per your requirement
    body: data
  });
};

// Delete lease
export const deleteLease = async (id: number) => {
  return baseFetcher(`/api/leases/${id}`, {
    method: 'DELETE'
  });
};

// Get lease statistics
export const getLeaseStatistics = async () => {
  return baseFetcher('/api/leases/statistics');
};
