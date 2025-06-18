'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLeases } from '@/hooks/useLeases';
import { useTenants } from '@/hooks/useTenants';
import { useProperties } from '@/hooks/useProperties';
import { LeaseFilters, createLease, updateLease, deleteLease, CreateLeaseData, UpdateLeaseData } from '@/lib/leases';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search, 
  Calendar,
  DollarSign,
  Eye,
  Edit,
  MoreHorizontal,
  Trash2,
  FileText,
  Home,
  User,
  File
} from 'lucide-react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function Leases() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLease, setSelectedLease] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [filters, setFilters] = useState<LeaseFilters>({
    page: 1,
    per_page: 15,
    search: searchTerm,
    status: 'all'
  });

  const { leases, pagination, loading, error, mutate } = useLeases(filters);
  
  // Get tenants and properties for dropdowns
  const { tenants } = useTenants({ page: 1, per_page: 100 });
  const { properties } = useProperties({ page: 1, per_page: 100 });

  // Form state
  const [formData, setFormData] = useState<CreateLeaseData>({
    property_id: 0,
    tenant_id: 0,
    lease_start_date: '',
    lease_end_date: '',
    monthly_rent: 0,
    security_deposit: 0,
    status: 'active',
    lease_terms: '',
    signed_date: ''
  });

  // Update search filters
  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      property_id: 0,
      tenant_id: 0,
      lease_start_date: '',
      lease_end_date: '',
      monthly_rent: 0,
      security_deposit: 0,
      status: 'active',
      lease_terms: '',
      signed_date: ''
    });
  };

  // Handle form input changes
  const handleInputChange = (field: keyof CreateLeaseData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle create lease
  const handleCreateLease = async () => {
    // Validation
    if (!formData.property_id || !formData.tenant_id || !formData.lease_start_date || 
        !formData.lease_end_date || !formData.monthly_rent || !formData.security_deposit) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createLease(formData);
      if (response.success !== false) {
        toast({
          title: "Success",
          description: "Lease created successfully",
        });
        setIsAddDialogOpen(false);
        resetForm();
        mutate();
      } else {
        throw new Error(response.message || 'Failed to create lease');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create lease",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle update lease
  const handleUpdateLease = async () => {
    if (!selectedLease) return;
    
    setIsSubmitting(true);
    try {
      const updateData: UpdateLeaseData = { ...formData, id: selectedLease.id };
      const response = await updateLease(selectedLease.id, updateData);
      
      toast({
        title: "Success",
        description: "Lease updated successfully",
      });
      setIsEditDialogOpen(false);
      setSelectedLease(null);
      resetForm();
      mutate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update lease",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete lease
  const handleDeleteLease = async () => {
    if (!selectedLease) return;
    
    setIsSubmitting(true);
    try {
      const response = await deleteLease(selectedLease.id);
      if (response.success !== false) {
        toast({
          title: "Success",
          description: "Lease deleted successfully",
        });
        setIsDeleteDialogOpen(false);
        setSelectedLease(null);
        mutate();
      } else {
        throw new Error(response.message || 'Failed to delete lease');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete lease",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit dialog
  const openEditDialog = (lease: any) => {
    setSelectedLease(lease);
    
    // Format dates for input fields
    const formatDateForInput = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    setFormData({
      property_id: lease.property_id || 0,
      tenant_id: lease.tenant_id || 0,
      lease_start_date: formatDateForInput(lease.lease_start_date),
      lease_end_date: formatDateForInput(lease.lease_end_date),
      monthly_rent: lease.monthly_rent || 0,
      security_deposit: lease.security_deposit || 0,
      status: lease.status || 'active',
      lease_terms: lease.lease_terms || '',
      signed_date: formatDateForInput(lease.signed_date)
    });

    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (lease: any) => {
    setSelectedLease(lease);
    setIsDeleteDialogOpen(true);
  };

  if (loading) {
    return <div>Loading leases...</div>;
  }

  if (error) {
    console.error('Error loading leases:', error);
    return (
      <div>
        <h3>Error loading leases</h3>
        <p>{error.message}</p>
        <button onClick={() => mutate()}>Try Again</button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'terminated':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateDaysRemaining = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leases</h1>
          <p className="text-gray-600 mt-2">Manage lease agreements and rental contracts</p>
        </div>
        
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Lease
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search leases by tenant or property..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => setFilters(prev => ({ ...prev, status: value, page: 1 }))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Leases List */}
      <div className="grid grid-cols-1 gap-4">
        {leases?.map((lease: any) => {
          const daysRemaining = calculateDaysRemaining(lease.lease_end_date);
          
          return (
            <Card key={lease.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Lease #{lease.id}
                      </h3>
                      <Badge className={getStatusColor(lease.status)}>
                        {lease.status}
                      </Badge>
                      {lease.status === 'active' && daysRemaining <= 30 && daysRemaining > 0 && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Expires in {daysRemaining} days
                        </Badge>
                      )}
                      {lease.status === 'active' && daysRemaining <= 0 && (
                        <Badge className="bg-red-100 text-red-800">
                          Overdue
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        <span>
                          {lease.tenant ? 
                            `${lease.tenant.first_name} ${lease.tenant.last_name}` : 
                            'Tenant not found'
                          }
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Home className="w-4 h-4 mr-2" />
                        <span>
                          {lease.property ? 
                            lease.property.title || lease.property.address : 
                            'Property not found'
                          }
                        </span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        <span>${lease.monthly_rent?.toLocaleString()}/month</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          {new Date(lease.lease_start_date).toLocaleDateString()} - {new Date(lease.lease_end_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <strong>Security Deposit:</strong> ${lease.security_deposit?.toLocaleString()}
                      </div>
                      {lease.signed_date && (
                        <div>
                          <strong>Signed Date:</strong> {new Date(lease.signed_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    
                    {lease.lease_terms && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="text-sm text-gray-600">
                          <strong>Lease Terms:</strong>
                          <p className="mt-1 text-gray-500 line-clamp-2">{lease.lease_terms}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditDialog(lease)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Lease
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="w-4 h-4 mr-2" />
                        Generate Contract
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => openDeleteDialog(lease)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Lease
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {leases?.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leases found</h3>
            <p className="text-gray-600">Try adjusting your search to find what you're looking for.</p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {pagination && pagination.total > pagination.per_page && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }))}
            disabled={pagination.current_page <= 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {pagination.current_page} of {pagination.last_page}
          </span>
          <Button
            variant="outline"
            onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
            disabled={pagination.current_page >= pagination.last_page}
          >
            Next
          </Button>
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Lease</DialogTitle>
            <DialogDescription>
              Create a new lease agreement between tenant and property.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <Label htmlFor="property">Property *</Label>
              <Select
                value={formData.property_id.toString()}
                onValueChange={(value) => handleInputChange('property_id', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {properties?.map((property: any) => (
                    <SelectItem key={property.id} value={property.id.toString()}>
                      {property.title || property.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="tenant">Tenant *</Label>
              <Select
                value={formData.tenant_id.toString()}
                onValueChange={(value) => handleInputChange('tenant_id', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenants?.map((tenant: any) => (
                    <SelectItem key={tenant.id} value={tenant.id.toString()}>
                      {tenant.first_name} {tenant.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="leaseStartDate">Lease Start Date *</Label>
              <Input 
                id="leaseStartDate" 
                type="date"
                value={formData.lease_start_date}
                onChange={(e) => handleInputChange('lease_start_date', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="leaseEndDate">Lease End Date *</Label>
              <Input 
                id="leaseEndDate" 
                type="date"
                value={formData.lease_end_date}
                onChange={(e) => handleInputChange('lease_end_date', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="monthlyRent">Monthly Rent *</Label>
              <Input 
                id="monthlyRent" 
                type="number"
                placeholder="Enter monthly rent"
                value={formData.monthly_rent}
                onChange={(e) => handleInputChange('monthly_rent', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div>
              <Label htmlFor="securityDeposit">Security Deposit *</Label>
              <Input 
                id="securityDeposit" 
                type="number"
                placeholder="Enter security deposit"
                value={formData.security_deposit}
                onChange={(e) => handleInputChange('security_deposit', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="signedDate">Signed Date</Label>
              <Input 
                id="signedDate" 
                type="date"
                value={formData.signed_date}
                onChange={(e) => handleInputChange('signed_date', e.target.value)}
              />
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="leaseTerms">Lease Terms</Label>
              <Textarea 
                id="leaseTerms" 
                placeholder="Enter lease terms and conditions"
                value={formData.lease_terms}
                onChange={(e) => handleInputChange('lease_terms', e.target.value)}
                rows={4}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateLease} disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Lease'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Lease</DialogTitle>
            <DialogDescription>
              Update lease agreement information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <Label htmlFor="editProperty">Property *</Label>
              <Select
                value={formData.property_id.toString()}
                onValueChange={(value) => handleInputChange('property_id', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {properties?.map((property: any) => (
                    <SelectItem key={property.id} value={property.id.toString()}>
                      {property.title || property.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="editTenant">Tenant *</Label>
              <Select
                value={formData.tenant_id.toString()}
                onValueChange={(value) => handleInputChange('tenant_id', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenants?.map((tenant: any) => (
                    <SelectItem key={tenant.id} value={tenant.id.toString()}>
                      {tenant.first_name} {tenant.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="editLeaseStartDate">Lease Start Date *</Label>
              <Input 
                id="editLeaseStartDate" 
                type="date"
                value={formData.lease_start_date}
                onChange={(e) => handleInputChange('lease_start_date', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="editLeaseEndDate">Lease End Date *</Label>
              <Input 
                id="editLeaseEndDate" 
                type="date"
                value={formData.lease_end_date}
                onChange={(e) => handleInputChange('lease_end_date', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="editMonthlyRent">Monthly Rent *</Label>
              <Input 
                id="editMonthlyRent" 
                type="number"
                placeholder="Enter monthly rent"
                value={formData.monthly_rent}
                onChange={(e) => handleInputChange('monthly_rent', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div>
              <Label htmlFor="editSecurityDeposit">Security Deposit *</Label>
              <Input 
                id="editSecurityDeposit" 
                type="number"
                placeholder="Enter security deposit"
                value={formData.security_deposit}
                onChange={(e) => handleInputChange('security_deposit', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div>
              <Label htmlFor="editStatus">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="editSignedDate">Signed Date</Label>
              <Input 
                id="editSignedDate" 
                type="date"
                value={formData.signed_date}
                onChange={(e) => handleInputChange('signed_date', e.target.value)}
              />
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="editLeaseTerms">Lease Terms</Label>
              <Textarea 
                id="editLeaseTerms" 
                placeholder="Enter lease terms and conditions"
                value={formData.lease_terms}
                onChange={(e) => handleInputChange('lease_terms', e.target.value)}
                rows={4}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateLease} disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Lease'}
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
              This action cannot be undone. This will permanently delete the lease
              {selectedLease && ` #${selectedLease.id}`} 
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteLease}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
