'use client';

import { Loader2 } from 'lucide-react';

export function PropertiesLoading() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
        <p className="text-muted-foreground">Loading properties...</p>
      </div>
    </div>
  );
}
