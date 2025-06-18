import useSWR from 'swr';
import { getProperties, Property, PropertyFilters } from '@/lib/properties';

interface UsePropertiesReturn {
  properties: Property[];
  pagination: any;
  loading: boolean;
  error: any;
  mutate: () => void;
}

export function useProperties(filters: PropertyFilters): UsePropertiesReturn {
  const { data, error, mutate, isLoading } = useSWR(
    ['api/properties', filters],
    () => getProperties(filters),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    properties: data?.data || [],
    pagination: data?.pagination,
    loading: isLoading,
    error,
    mutate,
  };
}
