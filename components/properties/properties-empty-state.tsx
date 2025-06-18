'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Plus } from 'lucide-react';
import { PropertyFilters } from '@/lib/properties';

interface PropertiesEmptyStateProps {
  filters: PropertyFilters;
  onAddProperty: () => void;
}

export function PropertiesEmptyState({ filters, onAddProperty }: PropertiesEmptyStateProps) {
  const hasActiveFilters = filters.search || filters.status !== 'all' || filters.property_type !== 'all';

  return (
    <Card className="text-center py-16 bg-white/80 backdrop-blur-sm border-border/50 shadow-lg">
      <CardContent>
        <div className="w-20 h-20 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Building className="w-10 h-10 text-primary/60" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-3">No properties found</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {hasActiveFilters
            ? "Try adjusting your search or filters to find what you're looking for."
            : "Get started by adding your first property to begin managing your rental portfolio."
          }
        </p>
        {!hasActiveFilters && (
          <Button 
            onClick={onAddProperty}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Your First Property
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
