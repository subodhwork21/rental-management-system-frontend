'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Search, 
  FileText, 
  Calendar,
  DollarSign,
  User,
  Home,
  Eye,
  Edit,
  MoreHorizontal
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function Leases() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const leases = [
    {
      id: 1,
      property: 'Sunset Apartments Unit 4B',
      tenant: 'John Smith',
      leaseStartDate: '2024-01-01',
      leaseEndDate: '2024-12-31',
      monthlyRent: 1200,
      securityDeposit: 1200,
      status: 'active',
      signedDate: '2023-12-15',
      leaseTerms: 'Standard 12-month residential lease with pet clause',
      daysUntilExpiry: 330
    },
    {
      id: 2,
      property: 'Oak Street House',
      tenant: 'Sarah Johnson',
      leaseStartDate: '2023-08-01',
      leaseEndDate: '2024-07-31',
      monthlyRent: 2500,
      securityDeposit: 2500,
      status: 'active',
      signedDate: '2023-07-20',
      leaseTerms: 'Standard 12-month residential lease',
      daysUntilExpiry: 180
    },
    {
      id: 3,
      property: 'Downtown Loft 12A',
      tenant: 'Michael Brown',
      leaseStartDate: '2024-03-01',
      leaseEndDate: '2025-02-28',
      monthlyRent: 2200,
      securityDeposit: 2200,
      status: 'active',
      signedDate: '2024-02-15',
      leaseTerms: 'Standard 12-month residential lease with parking',
      daysUntilExpiry: 390
    },
    {
      id: 4,
      property: 'Garden View Apartment',
      tenant: 'Emily Davis',
      leaseStartDate: '2023-06-01',
      leaseEndDate: '2024-05-31',
      monthlyRent: 1800,
      securityDeposit: 1800,
      status: 'expired',
      signedDate: '2023-05-15',
      leaseTerms: 'Standard 12-month residential lease',
      daysUntilExpiry: -30
    },
    {
      id: 5,
      property: 'Riverside Condo',
      tenant: 'Robert Wilson',
      leaseStartDate: '2024-02-01',
      leaseEndDate: '2025-01-31',
      monthlyRent: 1900,
      securityDeposit: 1900,
      status: 'active',
      signedDate: null,
      leaseTerms: 'Standard 12-month residential lease',
      daysUntilExpiry: 360
    }
  ];

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

  const getExpiryWarningColor = (daysUntilExpiry: number) => {
    if (daysUntilExpiry < 0) return 'text-red-600';
    if (daysUntilExpiry <= 30) return 'text-orange-600';
    if (daysUntilExpiry <= 90) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const filteredLeases = leases.filter(lease => {
    const matchesSearch = lease.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lease.tenant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lease.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalLeases = leases.length;
  const activeLeases = leases.filter(l => l.status === 'active').length;
  const expiringLeases = leases.filter(l => l.daysUntilExpiry <= 90 && l.daysUntilExpiry > 0).length;
  const totalRentRoll = leases.filter(l => l.status === 'active').reduce((sum, l) => sum + l.monthlyRent, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leases</h1>
          <p className="text-gray-600 mt-2">Manage lease agreements and renewals</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Lease
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Lease</DialogTitle>
              <DialogDescription>
                Create a new lease agreement between tenant and property.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Label htmlFor="property">Property</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunset">Sunset Apartments Unit 4B</SelectItem>
                    <SelectItem value="oak">Oak Street House</SelectItem>
                    <SelectItem value="downtown">Downtown Loft 12A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tenant">Tenant</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john">John Smith</SelectItem>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="michael">Michael Brown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="startDate">Lease Start Date</Label>
                <Input id="startDate" type="date" />
              </div>
              <div>
                <Label htmlFor="endDate">Lease End Date</Label>
                <Input id="endDate" type="date" />
              </div>
              <div>
                <Label htmlFor="monthlyRent">Monthly Rent</Label>
                <Input id="monthlyRent" type="number" placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="securityDeposit">Security Deposit</Label>
                <Input id="securityDeposit" type="number" placeholder="0.00" />
              </div>
              <div className="col-span-2">
                <Label htmlFor="leaseTerms">Lease Terms</Label>
                <Textarea id="leaseTerms" placeholder="Enter lease terms and conditions" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button>Create Lease</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leases</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeases}</div>
            <p className="text-xs text-gray-500">All agreements</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leases</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeLeases}</div>
            <p className="text-xs text-gray-500">Currently active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{expiringLeases}</div>
            <p className="text-xs text-gray-500">Within 90 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Rent Roll</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">${totalRentRoll.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Active leases</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by tenant or property..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leases List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredLeases.map((lease) => (
          <Card key={lease.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Lease #{lease.id}</h3>
                    <Badge className={getStatusColor(lease.status)}>
                      {lease.status}
                    </Badge>
                    {lease.daysUntilExpiry <= 90 && lease.daysUntilExpiry > 0 && (
                      <Badge variant="outline" className="border-orange-200 text-orange-800">
                        Expiring in {lease.daysUntilExpiry} days
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center text-sm">
                      <Home className="w-4 h-4 mr-2 text-gray-400" />
                      <div>
                        <div className="text-gray-500">Property</div>
                        <div className="font-medium">{lease.property}</div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      <div>
                        <div className="text-gray-500">Tenant</div>
                        <div className="font-medium">{lease.tenant}</div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <div>
                        <div className="text-gray-500">Lease Period</div>
                        <div className="font-medium">
                          {new Date(lease.leaseStartDate).toLocaleDateString()} - {new Date(lease.leaseEndDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                      <div>
                        <div className="text-gray-500">Monthly Rent</div>
                        <div className="font-medium text-green-600">${lease.monthlyRent.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-500">Security Deposit:</span>
                      <span className="ml-2 font-medium">${lease.securityDeposit.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Signed Date:</span>
                      <span className="ml-2 font-medium">
                        {lease.signedDate ? new Date(lease.signedDate).toLocaleDateString() : 'Not signed'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    <strong>Terms:</strong> {lease.leaseTerms}
                  </div>
                  
                  {lease.status === 'active' && (
                    <div className={`text-sm ${getExpiryWarningColor(lease.daysUntilExpiry)}`}>
                      {lease.daysUntilExpiry > 0 
                        ? `Expires in ${lease.daysUntilExpiry} days`
                        : `Expired ${Math.abs(lease.daysUntilExpiry)} days ago`
                      }
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
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Lease
                    </DropdownMenuItem>
                    {lease.status === 'active' && lease.daysUntilExpiry <= 90 && (
                      <DropdownMenuItem>
                        <Calendar className="w-4 h-4 mr-2" />
                        Renew Lease
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLeases.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leases found</h3>
            <p className="text-gray-600">Try adjusting your search or filters to find what you're looking for.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}