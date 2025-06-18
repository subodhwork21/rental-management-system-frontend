'use client';

import { Button } from '@/components/ui/button';

interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface PropertiesPaginationProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

export function PropertiesPagination({ pagination, onPageChange }: PropertiesPaginationProps) {
  if (pagination.last_page <= 1) return null;

  return (
    <div className="space-y-4">
      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-2">
        <Button
          variant="outline"
          onClick={() => onPageChange(pagination.current_page - 1)}
          disabled={pagination.current_page === 1}
          className="border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
        >
          Previous
        </Button>
        
        {/* Page numbers */}
        <div className="flex space-x-1">
          {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
            const pageNumber = Math.max(1, pagination.current_page - 2) + i;
            if (pageNumber > pagination.last_page) return null;
            
            return (
              <Button
                key={pageNumber}
                variant={pageNumber === pagination.current_page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNumber)}
                className={pageNumber === pagination.current_page 
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg" 
                  : "border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                }
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>
        
        <Button
          variant="outline"
          onClick={() => onPageChange(pagination.current_page + 1)}
          disabled={pagination.current_page === pagination.last_page}
          className="border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
        >
          Next
        </Button>
      </div>

      {/* Results summary */}
      <div className="text-center text-sm text-muted-foreground bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-border/30">
        Showing <span className="font-semibold text-primary">{((pagination.current_page - 1) * pagination.per_page) + 1}</span> to{' '}
        <span className="font-semibold text-primary">{Math.min(pagination.current_page * pagination.per_page, pagination.total)}</span> of{' '}
        <span className="font-semibold text-primary">{pagination.total}</span> properties
      </div>
    </div>
  );
}
