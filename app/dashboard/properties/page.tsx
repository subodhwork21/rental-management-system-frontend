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
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  DollarSign,
  Edit,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function Properties() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('all');

  const properties = [
    {
      id: 1,
      title: 'Sunset Apartments Unit 4B',
      address: '123 Main St, Downtown',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      propertyType: 'apartment',
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 850,
      rentAmount: 1200,
      depositAmount: 1200,
      status: 'occupied',
      image: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=400',
      amenities: ['Parking', 'Laundry', 'Pet Friendly']
    },
    {
      id: 2,
      title: 'Oak Street House',
      address: '456 Oak Street',
      city: 'Brooklyn',
      state: 'NY',
      zipCode: '11201',
      propertyType: 'house',
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1200,
      rentAmount: 2500,
      depositAmount: 2500,
      status: 'available',
      image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400',
      amenities: ['Garden', 'Garage', 'Central AC']
    },
    {
      id: 3,
      title: 'Downtown Loft 12A',
      address: '789 Broadway',
      city: 'Manhattan',
      state: 'NY',
      zipCode: '10003',
      propertyType: 'apartment',
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 750,
      rentAmount: 2200,
      depositAmount: 2200,
      status: 'maintenance',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
      amenities: ['City View', 'Gym', 'Doorman']
    },
    {
      id: 4,
      title: 'Commercial Space 1st Floor',
      address: '321 Business Ave',
      city: 'Queens',
      state: 'NY',
      zipCode: '11101',
      propertyType: 'commercial',
      bedrooms: 0,
      bathrooms: 2,
      squareFeet: 2000,
      rentAmount: 4000,
      depositAmount: 8000,
      status: 'available',
      image: 'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=400',
      amenities: ['Street Access', 'Loading Dock', 'High Ceilings']
    }
  ];

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

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    const matchesType = propertyTypeFilter === 'all' || property.propertyType === propertyTypeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 mt-2">Manage your rental properties</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>Add New Property</DialogTitle>
              <DialogDescription>
                Create a new property listing with all the essential details.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto px-1">
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Property Title</Label>
                  <Input id="title" placeholder="Enter property title" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe the property" className="min-h-[80px]" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Street address" />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="City" />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" placeholder="State" />
                </div>
                <div>
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input id="zipCode" placeholder="Zip code" />
                </div>
                <div>
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select>
                    <SelectTrigger>
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
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input id="bedrooms" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input id="bathrooms" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="squareFeet">Square Feet</Label>
                  <Input id="squareFeet" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="rent">Monthly Rent</Label>
                  <Input id="rent" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="deposit">Security Deposit</Label>
                  <Input id="deposit" type="number" placeholder="0" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="amenities">Amenities</Label>
                  <Input id="amenities" placeholder="Enter amenities separated by commas" />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4 border-t flex-shrink-0">
              <Button variant="outline">Cancel</Button>
              <Button>Create Property</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search properties..."
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
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={propertyTypeFilter} onValueChange={setPropertyTypeFilter}>
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

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={property.image}
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
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Property
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
                {property.propertyType !== 'commercial' && (
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
                  {property.squareFeet} ft²
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="text-xl font-bold text-green-600">
                    {property.rentAmount.toLocaleString()}
                  </span>
                  <span className="text-gray-500 ml-1">/mo</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {property.amenities.slice(0, 2).map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
                {property.amenities.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{property.amenities.length - 2} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600">Try adjusting your search or filters to find what you're looking for.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
