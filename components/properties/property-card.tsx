'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MapPin, Bed, Bath, Square, DollarSign, Edit, Trash2, MoreHorizontal, Building, Home, Store } from 'lucide-react';
import Image from 'next/image';
import { Property } from '@/lib/properties';

interface PropertyCardProps {
  property: Property;
  onEdit: (property: Property) => void;
  onDelete: (property: Property) => void;
}

export function PropertyCard({ property, onEdit, onDelete }: PropertyCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'occupied':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'maintenance':
        return 'bg-accent/10 text-accent border-accent/20';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPropertyIcon = (type: string) => {
    switch (type) {
      case 'apartment':
        return <Building className="w-5 h-5 text-primary" />;
      case 'house':
        return <Home className="w-5 h-5 text-primary" />;
      case 'commercial':
        return <Store className="w-5 h-5 text-primary" />;
      default:
        return <Building className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <Image
          width={400}
          height={240}  
          src={property.image_path || 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=400'}
          alt={property.title}
          className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Badge
          className={`absolute top-4 right-4 ${getStatusColor(property.status)} shadow-lg backdrop-blur-sm border`}
        >
          {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
        </Badge>
        <div className="absolute top-4 left-4">
          <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
            {getPropertyIcon(property.property_type)}
          </div>
        </div>
      </div>
      
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl leading-tight text-foreground group-hover:text-primary transition-colors duration-200">
            {property.title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-primary/10">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm border-border/50 shadow-xl">
              <DropdownMenuItem onClick={() => onEdit(property)} className="hover:bg-primary/10 hover:text-primary">
                <Edit className="w-4 h-4 mr-2" />
                Edit Property
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(property)}
                className="hover:bg-accent/10 hover:text-accent"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Property
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center text-muted-foreground text-sm mt-2">
          <MapPin className="w-4 h-4 mr-2 text-primary/60" />
          <span className="truncate">{property.address}, {property.city}, {property.state}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          {property.property_type !== 'commercial' && (
            <div className="flex items-center justify-center p-3 bg-muted/30 rounded-lg">
              <Bed className="w-4 h-4 mr-2 text-primary/60" />
              <span className="font-medium">{property.bedrooms}</span>
            </div>
          )}
          <div className="flex items-center justify-center p-3 bg-muted/30 rounded-lg">
            <Bath className="w-4 h-4 mr-2 text-secondary/60" />
            <span className="font-medium">{property.bathrooms}</span>
          </div>
          <div className="flex items-center justify-center p-3 bg-muted/30 rounded-lg">
            <Square className="w-4 h-4 mr-2 text-neutral/60" />
            <span className="font-medium text-xs">{property?.square_feet?.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/10">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mr-3">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ${property.rent_amount.toLocaleString()}
              </span>
              <span className="text-muted-foreground ml-1">/mo</span>
            </div>
          </div>
          <Badge variant="outline" className="text-xs border-primary/20 text-primary/70 bg-primary/5">
            {property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1)}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Amenities</p>
          <div className="flex flex-wrap gap-2">
            {property.amenities && property.amenities.length > 0 ? (
              <>
                {property.amenities.slice(0, 3).map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-secondary/10 text-secondary border-secondary/20">
                    {amenity}
                  </Badge>
                ))}
                {property.amenities.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-neutral/10 text-neutral border-neutral/20">
                    +{property.amenities.length - 3} more
                  </Badge>
                )}
              </>
            ) : (
              <Badge variant="secondary" className="text-xs bg-muted/50 text-muted-foreground border-muted">
                No amenities listed
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
