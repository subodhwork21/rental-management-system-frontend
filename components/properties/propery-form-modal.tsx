'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { PropertyFormData } from '@/lib/properties';

interface PropertyFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  formData: PropertyFormData;
  onInputChange: (field: keyof PropertyFormData, value: any) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
  isEdit?: boolean;
  title: string;
  description: string;
}

export function PropertyFormModal({
  isOpen,
  onOpenChange,
  onSubmit,
  formData,
  onInputChange,
  onFileChange,
  isSubmitting,
  isEdit = false,
  title,
  description
}: PropertyFormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <DialogHeader className="border-b border-border/50 pb-4">
          <DialogTitle className="text-2xl font-bold text-primary">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[60vh] pr-2">
          <div className="grid grid-cols-2 gap-6 py-6">
            <div className="col-span-2">
              <Label htmlFor="title" className="text-sm font-semibold text-foreground">Property Title *</Label>
              <Input 
                id="title"
                name="title"
                placeholder="Enter property title"
                value={formData.title}
                onChange={(e) => onInputChange('title', e.target.value)}
                className="mt-2 border-border/50 focus:border-primary focus:ring-primary/20"
                autoComplete="off"
              />
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="description" className="text-sm font-semibold text-foreground">Description</Label>
              <Textarea 
                id="description"
                name="description"
                placeholder="Describe the property" 
                className="min-h-[100px] mt-2 border-border/50 focus:border-primary focus:ring-primary/20"
                value={formData.description}
                onChange={(e) => onInputChange('description', e.target.value)}
              />
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="address" className="text-sm font-semibold text-foreground">Address *</Label>
              <Input 
                id="address"
                name="address"
                placeholder="Street address"
                value={formData.address}
                onChange={(e) => onInputChange('address', e.target.value)}
                className="mt-2 border-border/50 focus:border-primary focus:ring-primary/20"
                autoComplete="off"
              />
            </div>
            
            <div>
              <Label htmlFor="city" className="text-sm font-semibold text-foreground">City *</Label>
              <Input 
                id="city"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={(e) => onInputChange('city', e.target.value)}
                className="mt-2 border-border/50 focus:border-primary focus:ring-primary/20"
                autoComplete="off"
              />
            </div>
            
            <div>
              <Label htmlFor="state" className="text-sm font-semibold text-foreground">State *</Label>
              <Input 
                id="state"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={(e) => onInputChange('state', e.target.value)}
                className="mt-2 border-border/50 focus:border-primary focus:ring-primary/20"
                autoComplete="off"
              />
            </div>
            
            <div>
              <Label htmlFor="zipCode" className="text-sm font-semibold text-foreground">Zip Code *</Label>
              <Input 
                id="zipCode"
                name="zipCode"
                placeholder="Zip code"
                value={formData.zip_code}
                onChange={(e) => onInputChange('zip_code', e.target.value)}
                className="mt-2 border-border/50 focus:border-primary focus:ring-primary/20"
                autoComplete="off"
              />
            </div>
            
            <div>
              <Label htmlFor="propertyType" className="text-sm font-semibold text-foreground">Property Type *</Label>
              <Select 
                value={formData.property_type} 
                onValueChange={(value) => onInputChange('property_type', value)}
              >
                <SelectTrigger id="propertyType" className="mt-2 border-border/50 focus:border-primary focus:ring-primary/20">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm border-border/50">
                  <SelectItem value="apartment">🏢 Apartment</SelectItem>
                  <SelectItem value="house">🏠 House</SelectItem>
                  <SelectItem value="commercial">🏪 Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="bedrooms" className="text-sm font-semibold text-foreground">Bedrooms</Label>
              <Input 
                id="bedrooms"
                name="bedrooms"
                type="number" 
                min="0"
                placeholder="0"
                value={formData.bedrooms || ''}
                onChange={(e) => onInputChange('bedrooms', parseInt(e.target.value) || 0)}
                className="mt-2 border-border/50 focus:border-primary focus:ring-primary/20"
              />
            </div>
            
            <div>
              <Label htmlFor="bathrooms" className="text-sm font-semibold text-foreground">Bathrooms</Label>
              <Input 
                id="bathrooms"
                name="bathrooms"
                type="number" 
                min="0"
                placeholder="0"
                value={formData.bathrooms || ''}
                onChange={(e) => onInputChange('bathrooms', parseInt(e.target.value) || 0)}
                className="mt-2 border-border/50 focus:border-primary focus:ring-primary/20"
              />
            </div>
            
            <div>
              <Label htmlFor="squareFeet" className="text-sm font-semibold text-foreground">Square Feet *</Label>
              <Input 
                id="squareFeet"
                name="squareFeet"
                type="number" 
                min="1"
                placeholder="1"
                value={formData.square_feet || ''}
                onChange={(e) => onInputChange('square_feet', parseInt(e.target.value) || 1)}
                className="mt-2 border-border/50 focus:border-primary focus:ring-primary/20"
              />
            </div>
            
            <div>
              <Label htmlFor="rent" className="text-sm font-semibold text-foreground">Monthly Rent *</Label>
              <Input 
                id="rent"
                name="rent"
                type="number" 
                min="0"
                step="0.01"
                placeholder="0"
                value={formData.rent_amount || ''}
                onChange={(e) => onInputChange('rent_amount', parseFloat(e.target.value) || 0)}
                className="mt-2 border-border/50 focus:border-primary focus:ring-primary/20"
              />
            </div>
            
            <div>
              <Label htmlFor="deposit" className="text-sm font-semibold text-foreground">Security Deposit *</Label>
              <Input 
                id="deposit"
                name="deposit"
                type="number" 
                min="0"
                step="0.01"
                placeholder="0"
                value={formData.deposit_amount || ''}
                onChange={(e) => onInputChange('deposit_amount', parseFloat(e.target.value) || 0)}
                className="mt-2 border-border/50 focus:border-primary focus:ring-primary/20"
              />
            </div>
            
            <div>
              <Label htmlFor="status" className="text-sm font-semibold text-foreground">Status *</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => onInputChange('status', value)}
              >
                <SelectTrigger id="status" className="mt-2 border-border/50 focus:border-primary focus:ring-primary/20">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm border-border/50">
                  <SelectItem value="available">✅ Available</SelectItem>
                  <SelectItem value="occupied">👥 Occupied</SelectItem>
                  <SelectItem value="maintenance">🔧 Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="image" className="text-sm font-semibold text-foreground">Property Image</Label>
              <Input 
                id="image"
                name="image"
                type="file" 
                accept="image/*"
                onChange={onFileChange}
                className="mt-2 border-border/50 focus:border-primary focus:ring-primary/20"
              />
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="amenities" className="text-sm font-semibold text-foreground">Amenities</Label>
              <Input 
                id="amenities"
                name="amenities"
                placeholder="Enter amenities separated by commas"
                value={formData.amenities}
                onChange={(e) => onInputChange('amenities', e.target.value)}
                className="mt-2 border-border/50 focus:border-primary focus:ring-primary/20"
                autoComplete="off"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-6 border-t border-border/50">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-border/50 hover:bg-muted/50"
          >
            Cancel
          </Button>
          <Button 
            onClick={onSubmit} 
            disabled={isSubmitting}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEdit ? 'Update Property' : 'Create Property'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
