import { useAppState } from '@/contexts/AppStateContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, PieChart as PieChartIcon, BarChart3, Euro } from 'lucide-react';

const Analytics = () => {
  const { bills } = useAppState();

  // Calculate category distribution
  const categoryData = bills.reduce((acc, bill) => {
    const category = bill.category;
    const existing = acc.find(item => item.name === category);
    if (existing) {
      existing.value += bill.amount;
      existing.count += 1;
    } else {
      acc.push({ name: category, value: bill.amount, count: 1 });
    }
    return acc;
  }, [] as { name: string; value: number; count: number }[]);

  // Calculate total and percentages
  const totalAmount = categoryData.reduce((sum, item) => sum + item.value, 0);
  const categoryPercentages = categoryData.map(item => ({
    ...item,
    percentage: ((item.value / totalAmount) * 100).toFixed(1)
  }));

  // Status distribution
  const statusData = bills.reduce((acc, bill) => {
    const status = bill.status;
    const existing = acc.find(item => item.name === status);
    if (existing) {
      existing.value += bill.amount;
      existing.count += 1;
    } else {
      acc.push({ name: status, value: bill.amount, count: 1 });
    }
    return acc;
  }, [] as { name: string; value: number; count: number }[]);

  // Monthly trend (demo data)
  const monthlyData = [
    { month: 'Jun', amount: 285.50, bills: 4 },
    { month: 'Jul', amount: 312.75, bills: 5 },
    { month: 'Aug', amount: 298.20, bills: 4 },
    { month: 'Sep', amount: 286.69, bills: 4 },
    { month: 'Oct', amount: totalAmount, bills: bills.length },
  ];

  // Colors for charts
  const COLORS = [
    'hsl(220, 91%, 48%)',   // Primary blue
    'hsl(142, 76%, 36%)',   // Success green
    'hsl(43, 96%, 56%)',    // Warning yellow
    'hsl(0, 84%, 60%)',     // Danger red
    'hsl(35, 91%, 65%)',    // Pending orange
  ];

  const STATUS_COLORS = {
    paid: 'hsl(142, 76%, 36%)',
    pending: 'hsl(43, 96%, 56%)',
    insufficient: 'hsl(0, 84%, 60%)',
    not_received: 'hsl(35, 91%, 65%)'
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Insights into your bill patterns and spending</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-sm">
                <Euro className="w-4 h-4" />
                <span>Total Bills</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{totalAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-sm">
                <PieChartIcon className="w-4 h-4" />
                <span>Categories</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categoryData.length}</div>
              <p className="text-xs text-muted-foreground">Different types</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-sm">
                <BarChart3 className="w-4 h-4" />
                <span>Average Bill</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{(totalAmount / bills.length).toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Per bill</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>Monthly Change</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">-2.8%</div>
              <p className="text-xs text-muted-foreground">vs last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Bills by Category</CardTitle>
              <CardDescription>Distribution of your bills by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryPercentages}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                    >
                      {categoryPercentages.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`€${value.toFixed(2)}`, 'Amount']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Category Legend */}
              <div className="space-y-2 mt-4">
                {categoryPercentages.map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span>{category.name}</span>
                    </div>
                    <div className="space-x-4">
                      <span className="font-semibold">€{category.value.toFixed(2)}</span>
                      <span className="text-muted-foreground">({category.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Bills by Status</CardTitle>
              <CardDescription>Current status of your bills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => value.replace('_', ' ')}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value: number, name: string) => {
                        if (name === 'value') return [`€${value.toFixed(2)}`, 'Amount'];
                        if (name === 'count') return [value, 'Bills'];
                        return [value, name];
                      }}
                      labelFormatter={(label) => `Status: ${label.replace('_', ' ')}`}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="hsl(220, 91%, 48%)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Status Summary */}
              <div className="space-y-2 mt-4">
                {statusData.map((status) => (
                  <div key={status.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: STATUS_COLORS[status.name as keyof typeof STATUS_COLORS] }}
                      />
                      <span className="capitalize">{status.name.replace('_', ' ')}</span>
                    </div>
                    <div className="space-x-4">
                      <span className="font-semibold">€{status.value.toFixed(2)}</span>
                      <span className="text-muted-foreground">({status.count} bills)</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trend</CardTitle>
            <CardDescription>Your bill amounts over the last 5 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === 'amount') return [`€${value.toFixed(2)}`, 'Total Amount'];
                      if (name === 'bills') return [value, 'Number of Bills'];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="amount" 
                    fill="hsl(220, 91%, 48%)"
                    name="Total Amount"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;