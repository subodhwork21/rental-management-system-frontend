'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
// Import API functions and hooks
import { useProperties } from '@/hooks/useProperties';
import { 
  createProperty, 
  updateProperty, 
  deleteProperty,
  Property,
  PropertyFormData,
  PropertyFilters
} from '@/lib/properties';
import { PropertiesError } from '@/components/properties/properties-error';
import { PropertiesStats } from '@/components/properties/property-stats';
import { PropertiesFilters } from '@/components/properties/properties-filter';
import { PropertiesLoading } from '@/components/properties/properties-loading';
import { PropertiesList } from '@/components/properties/propery-list';
import { PropertiesPagination } from '@/components/properties/properties-pagination';
import { PropertiesEmptyState } from '@/components/properties/properties-empty-state';
import { PropertyFormModal } from '@/components/properties/propery-form-modal';
import { PropertyDeleteModal } from '@/components/properties/delete-confirmation-modal';

// Import components

export default function Properties() {
  // State for filters
  const [filters, setFilters] = useState<PropertyFilters>({
    page: 1,
    per_page: 15,
    search: '',
    status: 'all',
    property_type: 'all'
  });

  // State for UI
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [submitting, setSubmitting] = useState(false);


  // Use SWR hook for data fetching
  const { properties, pagination, loading, error, mutate } = useProperties(filters);

  // Form state - Initialize with proper default values
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    property_type: '',
    bedrooms: 0,
    bathrooms: 0,
    square_feet: 1,
    rent_amount: 0,
    deposit_amount: 0,
    status: 'available',
    amenities: ''
  });

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: prev.search, page: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Handle filter changes
  const handleFilterChange = useCallback((key: keyof PropertyFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      ...(key !== 'page' && { page: 1 })
    }));
  }, []);

  // Handle form input changes
  const handleInputChange = useCallback((field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Handle file input change
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      description: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      property_type: '',
      bedrooms: 0,
      bathrooms: 0,
      square_feet: 1,
      rent_amount: 0,
      deposit_amount: 0,
      status: 'available',
      amenities: ''
    });
  }, []);

  // Validate form
  const validateForm = () => {
    const requiredFields = ['title', 'address', 'city', 'state', 'zip_code', 'property_type'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof PropertyFormData]);
    
    if (missingFields.length > 0) {
      toast( `Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    if (formData.square_feet < 1) {
      toast("Square feet must be at least 1");
      return false;
    }

    return true;
  };

  // Create property
  const handleCreateProperty = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const response = await createProperty(formData);
      
      if (response.success) {
        toast( "Property created successfully"
);
        setIsAddDialogOpen(false);
        resetForm();
        mutate();
      } else {
        throw new Error(response.message || 'Failed to create property');
      }
    } catch (error: any) {
      console.error('Create property error:', error);
      toast(error.message || "Failed to create property",
       );
    } finally {
      setSubmitting(false);
    }
  };

  // Update property
  const handleUpdateProperty = async () => {
    if (!selectedProperty || !validateForm()) return;

    try {
      setSubmitting(true);
      const response = await updateProperty(selectedProperty.id, formData);
      
      if (response.success) {
        toast(
          "Property updated successfully");
        setIsEditDialogOpen(false);
        setSelectedProperty(null);
        resetForm();
        mutate();
      } else {
        throw new Error(response.message || 'Failed to update property');
      }
    } catch (error: any) {
      console.error('Update property error:', error);
      toast(error.message || "Failed to update property");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete property
  const handleDeleteProperty = async () => {
    if (!selectedProperty) return;

    try {
      setSubmitting(true);
      const response = await deleteProperty(selectedProperty.id);
      
      if (response.success) {
        toast("Property deleted successfully");
        setIsDeleteDialogOpen(false);
        setSelectedProperty(null);
        mutate();
      } else {
        throw new Error(response.message || 'Failed to delete property');
      }
    } catch (error: any) {
      console.error('Delete property error:', error);
      toast( error.message || "Failed to delete property");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (property: Property) => {
    setSelectedProperty(property);
    setFormData({
      title: property.title,
      description: property.description || '',
      address: property.address,
      city: property.city,
      state: property.state,
      zip_code: property.zip_code,
      property_type: property.property_type,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      square_feet: property.square_feet,
      rent_amount: property.rent_amount,
      deposit_amount: property.deposit_amount,
      status: property.status,
      amenities: Array.isArray(property.amenities) ? property.amenities.join(', ') : ''
    });
    setIsEditDialogOpen(true);
  };

  // Handle delete
  const handleDelete = (property: Property) => {
    setSelectedProperty(property);
    setIsDeleteDialogOpen(true);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    handleFilterChange('page', page);
  };

  // Handle add property dialog
  const handleAddProperty = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
            <p className="text-gray-600 mt-2">Manage your rental properties</p>
          </div>
        </div>
        <PropertiesError error={error} onRetry={() => mutate()} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Properties
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">Manage your rental properties portfolio</p>
          </div>
          
          {/* Add Property Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={handleAddProperty}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Property
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

        {/* Stats */}
        {!loading && properties && (
          <PropertiesStats 
            properties={properties} 
            totalCount={pagination?.total || 0} 
          />
        )}

        {/* Filters */}
        <PropertiesFilters 
          filters={filters} 
          onFilterChange={handleFilterChange} 
        />

        {/* Loading State */}
        {loading && <PropertiesLoading />}

        {/* Properties List */}
        {!loading && properties.length > 0 && (
          <PropertiesList
            properties={properties}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* Pagination */}
        {!loading && pagination && (
          <PropertiesPagination
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        )}

        {/* Empty State */}
        {!loading && properties.length === 0 && (
          <PropertiesEmptyState
            filters={filters}
            onAddProperty={handleAddProperty}
          />
        )}

        {/* Add Property Modal */}
        <PropertyFormModal
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSubmit={handleCreateProperty}
          formData={formData}
          onInputChange={handleInputChange}
          onFileChange={handleFileChange}
          isSubmitting={submitting}
          isEdit={false}
          title="Add New Property"
          description="Create a new property listing with all the essential details."
        />

        {/* Edit Property Modal */}
        <PropertyFormModal
          isOpen={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) {
              setSelectedProperty(null);
              resetForm();
            }
          }}
          onSubmit={handleUpdateProperty}
          formData={formData}
          onInputChange={handleInputChange}
          onFileChange={handleFileChange}
          isSubmitting={submitting}
          isEdit={true}
          title="Edit Property"
          description="Update property details and information."
        />

        {/* Delete Confirmation Modal */}
        <PropertyDeleteModal
          isOpen={isDeleteDialogOpen}
          onOpenChange={(open) => {
            setIsDeleteDialogOpen(open);
            if (!open) {
              setSelectedProperty(null);
            }
          }}
          onConfirm={handleDeleteProperty}
          property={selectedProperty}
          isSubmitting={submitting}
        />
      </div>
    </div>
  );
}
