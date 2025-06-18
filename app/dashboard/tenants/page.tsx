'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTenants } from '@/hooks/useTenants';
import { TenantFilters, createTenant, updateTenant, deleteTenant, CreateTenantData, UpdateTenantData } from '@/lib/tenants';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  Eye,
  Edit,
  MoreHorizontal,
  User,
  Trash2,
  X,
  Upload,
  File
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EmploymentInfo {
  company: string;
  position: string;
  income: number;
}

interface Reference {
  name: string;
  relationship: string;
  phone: string;
}

interface Document {
  type: string;
  url: string;
  file?: File;
}

export default function Tenants() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [filters, setFilters] = useState<TenantFilters>({
    page: 1,
    per_page: 15,
    search: searchTerm,
    status: 'all'
  });

  const { tenants, pagination, loading, error, mutate } = useTenants(filters);

  // Form state
  const [formData, setFormData] = useState<CreateTenantData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    employment_info: [],
    references: [],
    documents: []
  });

  // Employment info state
  const [employmentInfo, setEmploymentInfo] = useState<EmploymentInfo>({
    company: '',
    position: '',
    income: 0
  });

  // References state
  const [references, setReferences] = useState<Reference[]>([]);
  const [newReference, setNewReference] = useState<Reference>({
    name: '',
    relationship: '',
    phone: ''
  });

  // Documents state
  const [documents, setDocuments] = useState<Document[]>([]);
  const [newDocument, setNewDocument] = useState<Document>({
    type: '',
    url: ''
  });

  // Helper function to safely parse JSON strings
  const safeJsonParse = (jsonString: string | any[], fallback: any = []) => {
    if (Array.isArray(jsonString)) {
      return jsonString;
    }
    if (typeof jsonString === 'string') {
      try {
        return JSON.parse(jsonString);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return fallback;
      }
    }
    return fallback;
  };

  // Helper function to get parsed employment info
  const getParsedEmploymentInfo = (tenant: any): EmploymentInfo => {
    const empInfo = safeJsonParse(tenant.employment_info, {});
    return {
      company: empInfo.company || '',
      position: empInfo.position || '',
      income: empInfo.income || 0
    };
  };

  // Helper function to get parsed references
  const getParsedReferences = (tenant: any): Reference[] => {
    return safeJsonParse(tenant.references, []);
  };

  // Helper function to get parsed documents
  const getParsedDocuments = (tenant: any): Document[] => {
    return safeJsonParse(tenant.documents, []);
  };

  // Update search filters
  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      employment_info: [],
      references: [],
      documents: []
    });
    setEmploymentInfo({ company: '', position: '', income: 0 });
    setReferences([]);
    setNewReference({ name: '', relationship: '', phone: '' });
    setDocuments([]);
    setNewDocument({ type: '', url: '' });
  };

  // Handle form input changes
  const handleInputChange = (field: keyof CreateTenantData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle employment info changes
  const handleEmploymentChange = (field: keyof EmploymentInfo, value: string | number) => {
    setEmploymentInfo(prev => ({ ...prev, [field]: value }));
  };

  // Handle file upload
  const handleFileUpload = async (file: File): Promise<string> => {
    // This is a placeholder - implement your actual file upload logic
    // You might want to upload to your server or a cloud storage service
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Replace with your actual upload endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const result = await response.json();
      return result.url || `/uploads/${file.name}`;
    } catch (error) {
      console.error('File upload error:', error);
      // Fallback to a mock URL for now
      return `/uploads/${file.name}`;
    }
  };

  // Add reference
  const addReference = () => {
    if (newReference.name && newReference.relationship && newReference.phone) {
      setReferences(prev => [...prev, newReference]);
      setNewReference({ name: '', relationship: '', phone: '' });
    }
  };

  // Remove reference
  const removeReference = (index: number) => {
    setReferences(prev => prev.filter((_, i) => i !== index));
  };

  // Add document
  const addDocument = async () => {
    if (newDocument.type && (newDocument.url || newDocument.file)) {
      let finalUrl = newDocument.url;
      
      // If a file was selected, upload it first
      if (newDocument.file) {
        try {
          finalUrl = await handleFileUpload(newDocument.file);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to upload file",
            variant: "destructive",
          });
          return;
        }
      }
      
      setDocuments(prev => [...prev, { type: newDocument.type, url: finalUrl }]);
      setNewDocument({ type: '', url: '' });
    }
  };

  // Remove document
  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  // Handle document file selection
  const handleDocumentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewDocument(prev => ({ ...prev, file, url: '' }));
    }
  };

  // Prepare form data for submission
  const prepareFormData = () => {
    return {
      ...formData,
      employment_info: [employmentInfo],
      references: references,
      documents: documents
    };
  };

  // Handle create tenant
  const handleCreateTenant = async () => {
    setIsSubmitting(true);
    try {
      const submitData = prepareFormData();
      const response = await createTenant(submitData);
      if (response.success) {
        toast({
          title: "Success",
          description: "Tenant created successfully",
        });
        setIsAddDialogOpen(false);
        resetForm();
        mutate();
      } else {
        throw new Error(response.message || 'Failed to create tenant');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create tenant",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle update tenant
  const handleUpdateTenant = async () => {
    if (!selectedTenant) return;
    
    setIsSubmitting(true);
    try {
      const submitData = prepareFormData();
      const updateData: UpdateTenantData = { ...submitData, id: selectedTenant.id };
      const response = await updateTenant(selectedTenant.id, updateData);
      
      toast({
        title: "Success",
        description: "Tenant updated successfully",
      });
      setIsEditDialogOpen(false);
      setSelectedTenant(null);
      resetForm();
      mutate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update tenant",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete tenant
  const handleDeleteTenant = async () => {
    if (!selectedTenant) return;
    
    setIsSubmitting(true);
    try {
      const response = await deleteTenant(selectedTenant.id);
      if (response.success) {
        toast({
          title: "Success",
          description: "Tenant deleted successfully",
        });
        setIsDeleteDialogOpen(false);
        setSelectedTenant(null);
        mutate();
      } else {
        throw new Error(response.message || 'Failed to delete tenant');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete tenant",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit dialog
  const openEditDialog = (tenant: any) => {
    setSelectedTenant(tenant);
    
    // Format date for input field
    const formatDateForInput = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    setFormData({
      first_name: tenant.first_name || '',
      last_name: tenant.last_name || '',
      email: tenant.email || '',
      phone: tenant.phone || '',
      date_of_birth: formatDateForInput(tenant.date_of_birth),
      emergency_contact_name: tenant.emergency_contact_name || '',
      emergency_contact_phone: tenant.emergency_contact_phone || '',
      employment_info: [],
      references: [],
      documents: []
    });

    // Parse and set employment info
    const empInfo = getParsedEmploymentInfo(tenant);
    setEmploymentInfo(empInfo);

    // Parse and set references
    const refs = getParsedReferences(tenant);
    setReferences(refs);

    // Parse and set documents
    const docs = getParsedDocuments(tenant);
    setDocuments(docs);

    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (tenant: any) => {
    setSelectedTenant(tenant);
    setIsDeleteDialogOpen(true);
  };

  if (loading) {
    return <div>Loading tenants...</div>;
  }

  if (error) {
    console.error('Error loading tenants:', error);
    return (
      <div>
        <h3>Error loading tenants</h3>
        <p>{error.message}</p>
        <button onClick={() => mutate()}>Try Again</button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tenants</h1>
          <p className="text-gray-600 mt-2">Manage your tenant information and relationships</p>
        </div>
        
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Tenant
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search tenants by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Tenants List */}
      <div className="grid grid-cols-1 gap-4">
        {tenants?.map((tenant: any) => {
          const parsedEmploymentInfo = getParsedEmploymentInfo(tenant);
          const parsedReferences = getParsedReferences(tenant);
          const parsedDocuments = getParsedDocuments(tenant);

          return (
            <Card key={tenant.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={tenant.avatar} />
                      <AvatarFallback>
                        {tenant.first_name?.[0]}{tenant.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {tenant.first_name} {tenant.last_name}
                        </h3>
                        <Badge className={getStatusColor(tenant.status)}>
                          {tenant.status || 'active'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          {tenant.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          {tenant.phone}
                        </div>
                        {tenant.property && (
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {tenant.property}
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                        <div className="text-sm text-gray-600">
                          <strong>Emergency Contact:</strong> {tenant.emergency_contact_name} - {tenant.emergency_contact_phone}
                        </div>
                        {tenant.date_of_birth && (
                          <div className="text-sm text-gray-600">
                            <strong>Date of Birth:</strong> {new Date(tenant.date_of_birth).toLocaleDateString()}
                          </div>
                        )}
                        {parsedEmploymentInfo.company && (
                          <div className="text-sm text-gray-600">
                            <strong>Employment:</strong> {parsedEmploymentInfo.position} at {parsedEmploymentInfo.company} 
                            {parsedEmploymentInfo.income > 0 && ` (Income: $${parsedEmploymentInfo.income.toLocaleString()})`}
                          </div>
                        )}
                        {parsedReferences.length > 0 && (
                          <div className="text-sm text-gray-600">
                            <strong>References:</strong> {parsedReferences.length} reference(s)
                          </div>
                        )}
                        {parsedDocuments.length > 0 && (
                          <div className="text-sm text-gray-600">
                            <strong>Documents:</strong> {parsedDocuments.length} document(s)
                          </div>
                        )}
                      </div>
                    </div>
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
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditDialog(tenant)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Information
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <User className="w-4 h-4 mr-2" />
                        View Lease
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => openDeleteDialog(tenant)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Tenant
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {tenants?.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tenants found</h3>
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Tenant</DialogTitle>
            <DialogDescription>
              Add a new tenant with their complete information.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="references">References</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input 
                    id="firstName" 
                    placeholder="Enter first name"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Enter last name"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input 
                    id="phone" 
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input 
                    id="dateOfBirth" 
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyContactName">Emergency Contact Name *</Label>
                  <Input 
                    id="emergencyContactName" 
                    placeholder="Enter emergency contact"
                    value={formData.emergency_contact_name}
                    onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="emergencyContactPhone">Emergency Contact Phone *</Label>
                  <Input 
                    id="emergencyContactPhone" 
                    placeholder="Enter emergency contact phone"
                    value={formData.emergency_contact_phone}
                    onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="employment" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">Company *</Label>
                  <Input 
                    id="company" 
                    placeholder="Enter company name"
                    value={employmentInfo.company}
                    onChange={(e) => handleEmploymentChange('company', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position *</Label>
                  <Input 
                    id="position" 
                    placeholder="Enter job position"
                    value={employmentInfo.position}
                    onChange={(e) => handleEmploymentChange('position', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="income">Annual Income *</Label>
                  <Input 
                    id="income" 
                    type="number"
                    placeholder="Enter annual income"
                    value={employmentInfo.income}
                    onChange={(e) => handleEmploymentChange('income', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="references" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium">Add Reference</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="refName">Name</Label>
                    <Input 
                      id="refName" 
                      placeholder="Reference name"
                      value={newReference.name}
                      onChange={(e) => setNewReference(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="refRelationship">Relationship</Label>
                    <Input 
                      id="refRelationship" 
                      placeholder="Relationship"
                      value={newReference.relationship}
                      onChange={(e) => setNewReference(prev => ({ ...prev, relationship: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="refPhone">Phone</Label>
                    <Input 
                      id="refPhone" 
                      placeholder="Phone number"
                      value={newReference.phone}
                      onChange={(e) => setNewReference(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>
                <Button type="button" onClick={addReference} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Reference
                </Button>
                
                {references.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">References ({references.length})</h4>
                    {references.map((ref, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{ref.name}</p>
                          <p className="text-sm text-gray-600">{ref.relationship} - {ref.phone}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeReference(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="documents" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium">Add Document</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="docType">Document Type</Label>
                    <Input 
                      id="docType" 
                      placeholder="e.g., ID Proof, Utility Bill"
                      value={newDocument.type}
                      onChange={(e) => setNewDocument(prev => ({ ...prev, type: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="docFile">Upload Document</Label>
                    <Input 
                      id="docFile" 
                      type="file"
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={handleDocumentFileChange}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
                <div className="text-center text-gray-500">OR</div>
                <div>
                  <Label htmlFor="docUrl">Document URL</Label>
                  <Input 
                    id="docUrl" 
                    placeholder="Enter document URL"
                    value={newDocument.url}
                    onChange={(e) => setNewDocument(prev => ({ ...prev, url: e.target.value, file: undefined }))}
                  />
                </div>
                <Button type="button" onClick={addDocument} variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Add Document
                </Button>
                
                {documents.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Documents ({documents.length})</h4>
                    {documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1 flex items-center space-x-3">
                          <File className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="font-medium">{doc.type}</p>
                            <p className="text-sm text-gray-600 truncate">{doc.url}</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTenant} disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Tenant'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Tenant</DialogTitle>
            <DialogDescription>
              Update tenant information.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="references">References</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editFirstName">First Name *</Label>
                  <Input 
                    id="editFirstName" 
                    placeholder="Enter first name"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="editLastName">Last Name *</Label>
                  <Input 
                    id="editLastName" 
                    placeholder="Enter last name"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="editEmail">Email *</Label>
                  <Input 
                    id="editEmail" 
                    type="email" 
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="editPhone">Phone *</Label>
                  <Input 
                    id="editPhone" 
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="editDateOfBirth">Date of Birth *</Label>
                  <Input 
                    id="editDateOfBirth" 
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="editEmergencyContactName">Emergency Contact Name *</Label>
                  <Input 
                    id="editEmergencyContactName" 
                    placeholder="Enter emergency contact"
                    value={formData.emergency_contact_name}
                    onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="editEmergencyContactPhone">Emergency Contact Phone *</Label>
                  <Input 
                    id="editEmergencyContactPhone" 
                    placeholder="Enter emergency contact phone"
                    value={formData.emergency_contact_phone}
                    onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="employment" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editCompany">Company *</Label>
                  <Input 
                    id="editCompany" 
                    placeholder="Enter company name"
                    value={employmentInfo.company}
                    onChange={(e) => handleEmploymentChange('company', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="editPosition">Position *</Label>
                  <Input 
                    id="editPosition" 
                    placeholder="Enter job position"
                    value={employmentInfo.position}
                    onChange={(e) => handleEmploymentChange('position', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="editIncome">Annual Income *</Label>
                  <Input 
                    id="editIncome" 
                    type="number"
                    placeholder="Enter annual income"
                    value={employmentInfo.income}
                    onChange={(e) => handleEmploymentChange('income', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="references" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium">Add Reference</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="editRefName">Name</Label>
                    <Input 
                      id="editRefName" 
                      placeholder="Reference name"
                      value={newReference.name}
                      onChange={(e) => setNewReference(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editRefRelationship">Relationship</Label>
                    <Input 
                      id="editRefRelationship" 
                      placeholder="Relationship"
                      value={newReference.relationship}
                      onChange={(e) => setNewReference(prev => ({ ...prev, relationship: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editRefPhone">Phone</Label>
                    <Input 
                      id="editRefPhone" 
                      placeholder="Phone number"
                      value={newReference.phone}
                      onChange={(e) => setNewReference(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>
                <Button type="button" onClick={addReference} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Reference
                </Button>
                
                {references.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">References ({references.length})</h4>
                    {references.map((ref, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{ref.name}</p>
                          <p className="text-sm text-gray-600">{ref.relationship} - {ref.phone}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeReference(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="documents" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium">Add Document</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editDocType">Document Type</Label>
                    <Input 
                      id="editDocType" 
                      placeholder="e.g., ID Proof, Utility Bill"
                      value={newDocument.type}
                      onChange={(e) => setNewDocument(prev => ({ ...prev, type: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editDocFile">Upload Document</Label>
                    <Input 
                      id="editDocFile" 
                      type="file"
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={handleDocumentFileChange}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
                <div className="text-center text-gray-500">OR</div>
                <div>
                  <Label htmlFor="editDocUrl">Document URL</Label>
                  <Input 
                    id="editDocUrl" 
                    placeholder="Enter document URL"
                    value={newDocument.url}
                    onChange={(e) => setNewDocument(prev => ({ ...prev, url: e.target.value, file: undefined }))}
                  />
                </div>
                <Button type="button" onClick={addDocument} variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Add Document
                </Button>
                
                {documents.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Documents ({documents.length})</h4>
                    {documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1 flex items-center space-x-3">
                          <File className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="font-medium">{doc.type}</p>
                            <p className="text-sm text-gray-600 truncate">{doc.url}</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTenant} disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Tenant'}
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
              This action cannot be undone. This will permanently delete the tenant
              {selectedTenant && ` "${selectedTenant.first_name} ${selectedTenant.last_name}"`} 
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteTenant}
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
