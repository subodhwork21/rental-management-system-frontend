'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface PropertiesErrorProps {
  error: Error;
  onRetry: () => void;
}

export function PropertiesError({ error, onRetry }: PropertiesErrorProps) {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-accent" />
        </div>
        <h3 className="text-lg font-medium text-accent mb-2">Error loading properties</h3>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
}
