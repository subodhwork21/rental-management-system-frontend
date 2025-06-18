import useSWR from 'swr';
import { getLeaseStatistics } from '@/lib/leases';

interface LeaseStatistics {
  total_leases: number;
  active_leases: number;
  expired_leases: number;
  terminated_leases: number;
  total_monthly_revenue: number;
  expiring_soon: number;
}

export function useLeaseStatistics() {
  const { data, error, mutate, isLoading } = useSWR(
    'api/leases/statistics',
    getLeaseStatistics,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    statistics: data?.data as LeaseStatistics,
    loading: isLoading,
    error,
    mutate,
  };
}
