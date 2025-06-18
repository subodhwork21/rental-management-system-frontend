import useSWR from 'swr';
import { getLeases, LeaseFilters, Lease } from '@/lib/leases';

interface UseLeasesReturn {
  leases: Lease[];
  pagination?: any;
  loading: boolean;
  error: any;
  mutate: () => void;
}

export function useLeases(filters: LeaseFilters): UseLeasesReturn {
  const { data, error, mutate, isLoading } = useSWR(
    ['api/leases', filters],
    () => getLeases(filters),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    leases: data?.data || [],
    pagination: data?.pagination,
    loading: isLoading,
    error,
    mutate,
  };
}
