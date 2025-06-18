import useSWR from 'swr';
import { getTenants } from '@/lib/tenants';
import type { TenantFilters, Tenant } from '@/lib/tenants';

interface UseTenantReturn {
  tenants: Tenant[];
  pagination?: any;
  loading: boolean;
  error: any;
  mutate: () => void;
}

export function useTenants(filters: TenantFilters): UseTenantReturn {
  const { data, error, mutate, isLoading } = useSWR(
    ['api/tenants', filters],
    () => getTenants(filters),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    tenants: data?.data || [],
    pagination: data?.pagination,
    loading: isLoading,
    error,
    mutate,
  };
}
