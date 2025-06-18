'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Building, Home, Store, Wrench } from 'lucide-react';
import { Property } from '@/lib/properties';

interface PropertiesStatsProps {
  properties: Property[];
  totalCount: number;
}

export function PropertiesStats({ properties, totalCount }: PropertiesStatsProps) {
  const availableCount = properties?.filter(p => p.status === 'available').length || 0;
  const occupiedCount = properties?.filter(p => p.status === 'occupied').length || 0;
  const maintenanceCount = properties?.filter(p => p.status === 'maintenance').length || 0;

  const stats = [
    {
      title: 'Total Properties',
      value: totalCount,
      icon: Building,
      gradient: 'from-primary/5 to-primary/10',
      border: 'border-primary/20',
      textColor: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Available',
      value: availableCount,
      icon: Home,
      gradient: 'from-secondary/5 to-secondary/10',
      border: 'border-secondary/20',
      textColor: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      title: 'Occupied',
      value: occupiedCount,
      icon: Store,
      gradient: 'from-blue-500/5 to-blue-500/10',
      border: 'border-blue-500/20',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Maintenance',
      value: maintenanceCount,
      icon: Wrench,
      gradient: 'from-accent/5 to-accent/10',
      border: 'border-accent/20',
      textColor: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={index}
            className={`bg-gradient-to-br ${stat.gradient} ${stat.border} shadow-lg hover:shadow-xl transition-all duration-200`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${stat.textColor}/70`}>{stat.title}</p>
                  <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
