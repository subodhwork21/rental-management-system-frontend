import useSWR from 'swr';
import { defaultFetcher } from '@/lib/fetcher';
import { PropertyFilters } from '@/lib/properties';

export const useProperties = (filters: PropertyFilters = {}) => {
  const queryString = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      queryString.append(key, value.toString());
    }
  });
  
  const endpoint = `/api/properties${queryString.toString() ? `?${queryString.toString()}` : ''}`;
  
  const { data, error, mutate, isLoading } = useSWR(
    endpoint,
    defaultFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  return {
    properties: data?.data || [],
    pagination: data?.pagination,
    loading: isLoading,
    error,
    mutate
  };
};

export const useProperty = (id: number | null) => {
  const { data, error, mutate, isLoading } = useSWR(
    id ? `/properties/${id}` : null,
    defaultFetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    property: data?.data,
    loading: isLoading,
    error,
    mutate
  };
};
