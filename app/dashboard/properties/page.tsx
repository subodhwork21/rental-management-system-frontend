'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { 
  Plus, 
  Search, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  DollarSign,
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
  Loader2
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

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

  const { toast } = useToast();

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
    square_feet: 0,
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
      ...(key !== 'page' && { page: 1 }) // Reset to first page when changing filters
    }));
  }, []);

  // Handle form input changes - Optimized with useCallback
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
      square_feet: 0,
      rent_amount: 0,
      deposit_amount: 0,
      status: 'available',
      amenities: ''
    });
  }, []);

  // Create property
  const handleCreateProperty = async () => {
    try {
      setSubmitting(true);
      const response = await createProperty(formData);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Property created successfully"
        });
        setIsAddDialogOpen(false);
        resetForm();
        mutate(); // Revalidate data
      } else {
        throw new Error(response.message || 'Failed to create property');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create property",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Update property
  const handleUpdateProperty = async () => {
    if (!selectedProperty) return;

    try {
      setSubmitting(true);
      const response = await updateProperty(selectedProperty.id, formData);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Property updated successfully"
        });
        setIsEditDialogOpen(false);
        setSelectedProperty(null);
        resetForm();
        mutate(); // Revalidate data
      } else {
        throw new Error(response.message || 'Failed to update property');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update property",
        variant: "destructive"
      });
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
        toast({
          title: "Success",
          description: "Property deleted successfully"
        });
        setIsDeleteDialogOpen(false);
        setSelectedProperty(null);
        mutate(); // Revalidate data
      } else {
        throw new Error(response.message || 'Failed to delete property');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete property",
        variant: "destructive"
      });
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
      amenities: property.amenities?.join(', ') || ''
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-medium text-red-600 mb-2">Error loading properties</h3>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <Button onClick={() => mutate()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 mt-2">Manage your rental properties</p>
        </div>
        
        {/* Add Property Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                resetForm();
                setIsAddDialogOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Add New Property</DialogTitle>
              <DialogDescription>
                Create a new property listing with all the essential details.
              </DialogDescription>
            </DialogHeader>
            
            {/* Property Form - Moved outside to prevent re-rendering issues */}
            <div className="overflow-y-auto max-h-[60vh] pr-2">
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="col-span-2">
                  <Label htmlFor="add-title">Property Title *</Label>
                  <Input 
                    id="add-title"
                    name="title"
                    placeholder="Enter property title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    autoComplete="off"
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="add-description">Description</Label>
                  <Textarea 
                    id="add-description"
                    name="description"
                    placeholder="Describe the property" 
                    className="min-h-[80px]"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="add-address">Address *</Label>
                  <Input 
                    id="add-address"
                    name="address"
                    placeholder="Street address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    autoComplete="off"
                  />
                </div>
                
                <div>
                  <Label htmlFor="add-city">City *</Label>
                  <Input 
                    id="add-city"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    autoComplete="off"
                  />
                </div>
                
                <div>
                  <Label htmlFor="add-state">State *</Label>
                  <Input 
                    id="add-state"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    autoComplete="off"
                  />
                </div>
                
                <div>
                  <Label htmlFor="add-zipCode">Zip Code *</Label>
                  <Input 
                    id="add-zipCode"
                    name="zipCode"
                    placeholder="Zip code"
                    value={formData.zip_code}
                    onChange={(e) => handleInputChange('zip_code', e.target.value)}
                    autoComplete="off"
                  />
                </div>
                
                <div>
                  <Label htmlFor="add-propertyType">Property Type *</Label>
                  <Select 
                    value={formData.property_type} 
                    onValueChange={(value) => handleInputChange('property_type', value)}
                  >
                    <SelectTrigger id="add-propertyType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="add-bedrooms">Bedrooms</Label>
                  <Input 
                    id="add-bedrooms"
                    name="bedrooms"
                    type="number" 
                    min="0"
                    placeholder="0"
                    value={formData.bedrooms || ''}
                    onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="add-bathrooms">Bathrooms</Label>
                  <Input 
                    id="add-bathrooms"
                    name="bathrooms"
                    type="number" 
                    min="0"
                    step="0.5"
                    placeholder="0"
                    value={formData.bathrooms || ''}
                    onChange={(e) => handleInputChange('bathrooms', parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="add-squareFeet">Square Feet</Label>
                  <Input 
                    id="add-squareFeet"
                    name="squareFeet"
                    type="number" 
                    min="0"
                    placeholder="0"
                    value={formData.square_feet || ''}
                    onChange={(e) => handleInputChange('square_feet', parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="add-rent">Monthly Rent *</Label>
                  <Input 
                    id="add-rent"
                    name="rent"
                    type="number" 
                    min="0"
                    step="0.01"
                    placeholder="0"
                    value={formData.rent_amount || ''}
                    onChange={(e) => handleInputChange('rent_amount', parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="add-deposit">Security Deposit</Label>
                  <Input 
                    id="add-deposit"
                    name="deposit"
                    type="number" 
                    min="0"
                    step="0.01"
                    placeholder="0"
                    value={formData.deposit_amount || ''}
                    onChange={(e) => handleInputChange('deposit_amount', parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="add-status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger id="add-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="add-image">Property Image</Label>
                  <Input 
                    id="add-image"
                    name="image"
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="add-amenities">Amenities</Label>
                  <Input 
                    id="add-amenities"
                    name="amenities"
                    placeholder="Enter amenities separated by commas"
                    value={formData.amenities}
                    onChange={(e) => handleInputChange('amenities', e.target.value)}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateProperty} 
                disabled={submitting || !formData.title || !formData.address}
              >
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Property
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
            <DialogDescription>
              Update property details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto max-h-[60vh] pr-2">
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2">
                <Label htmlFor="edit-title">Property Title *</Label>
                <Input 
                  id="edit-title"
                  name="title"
                  placeholder="Enter property title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  autoComplete="off"
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea 
                  id="edit-description"
                  name="description"
                  placeholder="Describe the property" 
                  className="min-h-[80px]"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="edit-address">Address *</Label>
                <Input 
                  id="edit-address"
                  name="address"
                  placeholder="Street address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  autoComplete="off"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-city">City *</Label>
                <Input 
                  id="edit-city"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  autoComplete="off"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-state">State *</Label>
                <Input 
                  id="edit-state"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  autoComplete="off"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-zipCode">Zip Code *</Label>
                <Input 
                  id="edit-zipCode"
                  name="zipCode"
                  placeholder="Zip code"
                  value={formData.zip_code}
                  onChange={(e) => handleInputChange('zip_code', e.target.value)}
                  autoComplete="off"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-propertyType">Property Type *</Label>
                <Select 
                  value={formData.property_type} 
                  onValueChange={(value) => handleInputChange('property_type', value)}
                >
                  <SelectTrigger id="edit-propertyType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-bedrooms">Bedrooms</Label>
                <Input 
                  id="edit-bedrooms"
                  name="bedrooms"
                  type="number" 
                  min="0"
                  placeholder="0"
                  value={formData.bedrooms || ''}
                  onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-bathrooms">Bathrooms</Label>
                <Input 
                  id="edit-bathrooms"
                  name="bathrooms"
                  type="number" 
                  min="0"
                  step="0.5"
                  placeholder="0"
                  value={formData.bathrooms || ''}
                  onChange={(e) => handleInputChange('bathrooms', parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-squareFeet">Square Feet</Label>
                <Input 
                  id="edit-squareFeet"
                  name="squareFeet"
                  type="number" 
                  min="0"
                  placeholder="0"
                  value={formData.square_feet || ''}
                  onChange={(e) => handleInputChange('square_feet', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-rent">Monthly Rent *</Label>
                <Input 
                  id="edit-rent"
                  name="rent"
                  type="number" 
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={formData.rent_amount || ''}
                  onChange={(e) => handleInputChange('rent_amount', parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-deposit">Security Deposit</Label>
                <Input 
                  id="edit-deposit"
                  name="deposit"
                  type="number" 
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={formData.deposit_amount || ''}
                  onChange={(e) => handleInputChange('deposit_amount', parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-image">Property Image</Label>
                <Input 
                  id="edit-image"
                  name="image"
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="edit-amenities">Amenities</Label>
                <Input 
                  id="edit-amenities"
                  name="amenities"
                  placeholder="Enter amenities separated by commas"
                  value={formData.amenities}
                  onChange={(e) => handleInputChange('amenities', e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedProperty(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateProperty} 
              disabled={submitting || !formData.title || !formData.address}
            >
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Property
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the property
              "{selectedProperty?.title}" and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedProperty(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProperty}
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete Property
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search properties..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select 
              value={filters.status || 'all'} 
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select 
              value={filters.property_type || 'all'} 
              onValueChange={(value) => handleFilterChange('property_type', value)}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      )}

      {/* Properties Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={property.image || 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <Badge
                  className={`absolute top-3 right-3 ${getStatusColor(property.status)}`}
                >
                  {property.status}
                </Badge>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg leading-tight">{property.title}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(property)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Property
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(property)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Property
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  {property.address}, {property.city}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  {property.property_type !== 'commercial' && (
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-1 text-gray-400" />
                      {property.bedrooms} bed
                    </div>
                  )}
                  <div className="flex items-center">
                    <Bath className="w-4 h-4 mr-1 text-gray-400" />
                    {property.bathrooms} bath
                  </div>
                  <div className="flex items-center">
                    <Square className="w-4 h-4 mr-1 text-gray-400" />
                    {property.square_feet} ft²
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-xl font-bold text-green-600">
                      {property.rent_amount.toLocaleString()}
                    </span>
                    <span className="text-gray-500 ml-1">/mo</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {property.amenities?.slice(0, 2).map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {property.amenities && property.amenities.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{property.amenities.length - 2} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination && pagination.last_page > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.current_page - 1)}
            disabled={pagination.current_page === 1}
          >
            Previous
          </Button>
          
          {/* Page numbers */}
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
              const pageNumber = Math.max(1, pagination.current_page - 2) + i;
              if (pageNumber > pagination.last_page) return null;
              
              return (
                <Button
                  key={pageNumber}
                  variant={pageNumber === pagination.current_page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.current_page + 1)}
            disabled={pagination.current_page === pagination.last_page}
          >
            Next
          </Button>
        </div>
      )}

      {/* Results summary */}
      {!loading && pagination && (
        <div className="text-center text-sm text-gray-600">
          Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
          {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{' '}
          {pagination.total} properties
        </div>
      )}

      {/* No Properties Found */}
      {!loading && properties.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-4">
              {filters.search || filters.status !== 'all' || filters.property_type !== 'all'
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Get started by adding your first property."
              }
            </p>
            {(!filters.search && filters.status === 'all' && filters.property_type === 'all') && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Property
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
