'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { PropertyFilters } from '@/lib/properties';

interface PropertiesFiltersProps {
  filters: PropertyFilters;
  onFilterChange: (key: keyof PropertyFilters, value: any) => void;
}

export function PropertiesFilters({ filters, onFilterChange }: PropertiesFiltersProps) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-border/50 shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search properties by title, address, or city..."
                value={filters.search || ''}
                onChange={(e) => onFilterChange('search', e.target.value)}
                className="pl-12 border-border/50 focus:border-primary focus:ring-primary/20 bg-white/50"
              />
            </div>
          </div>
          <Select 
            value={filters.status || 'all'} 
            onValueChange={(value) => onFilterChange('status', value)}
          >
            <SelectTrigger className="w-full md:w-48 border-border/50 focus:border-primary focus:ring-primary/20 bg-white/50">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-sm border-border/50">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">✅ Available</SelectItem>
              <SelectItem value="occupied">👥 Occupied</SelectItem>
              <SelectItem value="maintenance">🔧 Maintenance</SelectItem>
            </SelectContent>
          </Select>
          <Select 
            value={filters.property_type || 'all'} 
            onValueChange={(value) => onFilterChange('property_type', value)}
          >
            <SelectTrigger className="w-full md:w-48 border-border/50 focus:border-primary focus:ring-primary/20 bg-white/50">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-sm border-border/50">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="apartment">🏢 Apartment</SelectItem>
              <SelectItem value="house">🏠 House</SelectItem>
              <SelectItem value="commercial">🏪 Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
