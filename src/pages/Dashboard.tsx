import { useAuth } from '@/contexts/AuthContext';
import { useAppState } from '@/contexts/AppStateContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Wallet, 
  TrendingUp, 
  Calendar, 
  Activity,
  CreditCard,
  Smartphone,
  Building2,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const { walletBalance, bills, activities } = useAppState();

  const sortedBills = [...bills].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'pending': return <Clock className="w-4 h-4 text-warning" />;
      case 'insufficient': return <XCircle className="w-4 h-4 text-danger" />;
      case 'not_received': return <AlertCircle className="w-4 h-4 text-pending" />;
      default: return null;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'insufficient': return 'destructive';
      case 'not_received': return 'outline';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-success/10 text-success border-success/20';
      case 'pending': return 'bg-warning/10 text-warning border-warning/20';
      case 'insufficient': return 'bg-danger/10 text-danger border-danger/20';
      case 'not_received': return 'bg-pending/10 text-pending border-pending/20';
      default: return '';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
        </div>

        {/* Wallet & Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-2 bg-gradient-to-br from-primary to-primary-hover text-white border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Wallet className="w-5 h-5" />
                <span>Wallet Balance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-3xl font-bold">€{walletBalance.toFixed(2)}</div>
                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm" className="text-primary">
                    Withdraw Money
                  </Button>
                  <Button variant="outline" size="sm">
                    Top Up
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>Total Bills</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bills.length}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Due Soon</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {bills.filter(bill => bill.status === 'pending' || bill.status === 'insufficient').length}
              </div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bills Overview */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bills Overview</CardTitle>
                <CardDescription>Bills sorted by due date</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {sortedBills.map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(bill.status)}
                      <div>
                        <div className="font-medium">{bill.name}</div>
                        <div className="text-sm text-muted-foreground">{bill.provider}</div>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-semibold">€{bill.amount}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(bill.dueDate), 'MMM d')}
                      </div>
                    </div>
                    <Badge className={getStatusColor(bill.status)}>
                      {bill.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Supported European banking partners</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <Smartphone className="w-8 h-8 text-success" />
                    <span className="text-sm font-medium">Google Pay</span>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <Building2 className="w-8 h-8 text-primary" />
                    <span className="text-sm font-medium">Swedbank</span>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <CreditCard className="w-8 h-8 text-accent" />
                    <span className="text-sm font-medium">Citadele</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Activity Log</span>
              </CardTitle>
              <CardDescription>Recent transactions and actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {activities.slice(0, 8).map((activity) => (
                <div key={activity.id} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{activity.action}</div>
                      <div className="text-xs text-muted-foreground">{activity.description}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(activity.timestamp), 'MMM d, HH:mm')}
                      </div>
                    </div>
                    {activity.amount && (
                      <div className={`text-sm font-semibold ${activity.amount > 0 ? 'text-success' : 'text-danger'}`}>
                        {activity.amount > 0 ? '+' : ''}€{Math.abs(activity.amount).toFixed(2)}
                      </div>
                    )}
                  </div>
                  <Separator />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;