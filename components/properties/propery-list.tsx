'use client';

import { Property } from '@/lib/properties';
import { PropertyCard } from './property-card';

interface PropertiesListProps {
  properties: Property[];
  onEdit: (property: Property) => void;
  onDelete: (property: Property) => void;
}

export function PropertiesList({ properties, onEdit, onDelete }: PropertiesListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
