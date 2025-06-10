'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  Users, 
  DollarSign, 
  AlertTriangle,
  TrendingUp,
  Home,
  Clock,
  CheckCircle
} from 'lucide-react';

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Properties',
      value: '24',
      change: '+2 this month',
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active Tenants',
      value: '87',
      change: '+5 this month',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Monthly Revenue',
      value: '$24,580',
      change: '+12% from last month',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      title: 'Maintenance Requests',
      value: '12',
      change: '3 urgent',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'payment',
      message: 'Payment received from John Smith - Apt 4B',
      time: '2 hours ago',
      amount: '$1,200'
    },
    {
      id: 2,
      type: 'maintenance',
      message: 'New maintenance request - Plumbing issue in Unit 3A',
      time: '4 hours ago',
      priority: 'High'
    },
    {
      id: 3,
      type: 'lease',
      message: 'Lease renewal signed - Sarah Johnson',
      time: '1 day ago',
      status: 'Completed'
    },
    {
      id: 4,
      type: 'property',
      message: 'New property listing created - Sunset Apartments',
      time: '2 days ago',
      status: 'Active'
    }
  ];

  const upcomingTasks = [
    {
      id: 1,
      task: 'Property inspection - Oak Street Complex',
      due: 'Today',
      priority: 'high'
    },
    {
      id: 2,
      task: 'Lease expiration reminder - 3 tenants',
      due: 'Tomorrow',
      priority: 'medium'
    },
    {
      id: 3,
      task: 'Monthly maintenance review',
      due: 'This week',
      priority: 'low'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your properties.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates from your properties</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {activity.type === 'payment' && <DollarSign className="w-5 h-5 text-green-600" />}
                  {activity.type === 'maintenance' && <AlertTriangle className="w-5 h-5 text-orange-600" />}
                  {activity.type === 'lease' && <CheckCircle className="w-5 h-5 text-blue-600" />}
                  {activity.type === 'property' && <Home className="w-5 h-5 text-purple-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">{activity.time}</p>
                    {activity.amount && (
                      <Badge variant="secondary" className="text-green-600">
                        {activity.amount}
                      </Badge>
                    )}
                    {activity.priority && (
                      <Badge variant={activity.priority === 'High' ? 'destructive' : 'secondary'}>
                        {activity.priority}
                      </Badge>
                    )}
                    {activity.status && (
                      <Badge variant="secondary">{activity.status}</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Upcoming Tasks
            </CardTitle>
            <CardDescription>Important tasks and deadlines</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{task.task}</p>
                  <p className="text-xs text-gray-500 mt-1">Due: {task.due}</p>
                </div>
                <Badge 
                  variant={
                    task.priority === 'high' ? 'destructive' : 
                    task.priority === 'medium' ? 'default' : 'secondary'
                  }
                >
                  {task.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Occupancy Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Property Occupancy Overview</CardTitle>
          <CardDescription>Current occupancy rates across your properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Sunset Apartments</span>
                <span>18/20 units (90%)</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Oak Street Complex</span>
                <span>24/30 units (80%)</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Downtown Lofts</span>
                <span>15/16 units (94%)</span>
              </div>
              <Progress value={94} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}