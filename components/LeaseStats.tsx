'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLeaseStatistics } from '@/hooks/useLeaseStatistics';
import { FileText, DollarSign, Calendar, AlertTriangle } from 'lucide-react';

export function LeaseStats() {
  const { statistics, loading, error } = useLeaseStatistics();

  if (loading) return <div>Loading statistics...</div>;
  if (error) return <div>Error loading statistics</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Leases</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics?.total_leases || 0}</div>
          <p className="text-xs text-muted-foreground">
            {statistics?.active_leases || 0} active
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${statistics?.total_monthly_revenue?.toLocaleString() || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            From active leases
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expired Leases</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics?.expired_leases || 0}</div>
          <p className="text-xs text-muted-foreground">
            Need renewal
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics?.expiring_soon || 0}</div>
          <p className="text-xs text-muted-foreground">
            Within 30 days
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
