import { baseFetcher } from '@/lib/fetcher';

export interface Property {
  id: number;
  title: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  property_type: 'apartment' | 'house' | 'commercial';
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  rent_amount: number;
  deposit_amount: number;
  status: 'available' | 'occupied' | 'maintenance';
  image_path?: string;
  amenities?: string[];
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface PropertyFormData {
  title: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  rent_amount: number;
  deposit_amount: number;
  status: string;
  amenities?: string;
  image?: File;
}

export interface PropertyFilters {
  search?: string;
  status?: string;
  property_type?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Build query string from filters
const buildQueryString = (filters: PropertyFilters): string => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      params.append(key, value.toString());
    }
  });
  
  return params.toString();
};

// Get properties list - GET /api/properties
export const getProperties = async (filters: PropertyFilters = {}) => {
  const queryString = buildQueryString(filters);
  const endpoint = `/api/properties${queryString ? `?${queryString}` : ''}`;
  return baseFetcher<Property[]>(endpoint);
};

// Get single property - GET /api/properties/{id}
export const getProperty = async (id: number) => {
  return baseFetcher<Property>(`/api/properties/${id}`);
};

// Create property - POST /api/properties
export const createProperty = async (data: PropertyFormData) => {
  const formData = new FormData();
  
  // Convert amenities string to array for Laravel
  const amenitiesArray = data.amenities 
    ? data.amenities.split(',').map(item => item.trim()).filter(item => item.length > 0)
    : [];
  
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'image' && value instanceof File) {
      formData.append(key, value);
    } else if (key === 'amenities') {
      // Send amenities as individual array items to match Laravel validation
      amenitiesArray.forEach((amenity, index) => {
        formData.append(`amenities[]`, amenity);
      });
    } else if (value !== null && value !== undefined && value !== '') {
      formData.append(key, value.toString());
    }
  });

  return baseFetcher<Property>('/api/properties', {
    method: 'POST',
    body: formData,
    isFormData: true
  });
};

// Update property - POST /api/properties/{id} (with _method=PUT)
export const updateProperty = async (id: number, data: PropertyFormData) => {
  const formData = new FormData();
  
  // Convert amenities string to array for Laravel
  const amenitiesArray = data.amenities 
    ? data.amenities.split(',').map(item => item.trim()).filter(item => item.length > 0)
    : [];
  
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'image' && value instanceof File) {
      formData.append(key, value);
    } else if (key === 'amenities') {
      // Send amenities as individual array items
      amenitiesArray.forEach((amenity, index) => {
        formData.append(`amenities[${index}]`, amenity);
      });
    } else if (value !== null && value !== undefined && value !== '') {
      formData.append(key, value.toString());
    }
  });

  // Add method for Laravel to handle PUT request via POST
  formData.append('_method', 'POST');

  return baseFetcher<Property>(`/api/properties/${id}`, {
    method: 'POST',
    body: formData,
    isFormData: true
  });
};

// Delete property - DELETE /api/properties/{id}
export const deleteProperty = async (id: number) => {
  return baseFetcher(`/api/properties/${id}`, {
    method: 'DELETE'
  });
};

// Update property status - PATCH /api/properties/{id}/status
export const updatePropertyStatus = async (id: number, status: string) => {
  return baseFetcher<Property>(`/api/properties/${id}/status`, {
    method: 'PATCH',
    body: { status }
  });
};

// Get property statistics - GET /api/properties/statistics
export const getPropertyStatistics = async () => {
  return baseFetcher('/api/properties/statistics');
};
