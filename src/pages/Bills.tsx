import { useState } from 'react';
import { useAppState, type Bill } from '@/contexts/AppStateContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { 
  Plus, 
  Mail, 
  Trash2, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle,
  ToggleLeft
} from 'lucide-react';
import { format } from 'date-fns';

const Bills = () => {
  const { bills, addBill, removeBill, updateBillStatus, addActivity } = useAppState();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newBill, setNewBill] = useState({
    name: '',
    amount: '',
    dueDate: '',
    category: '',
    provider: ''
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'pending': return <Clock className="w-4 h-4 text-warning" />;
      case 'insufficient': return <XCircle className="w-4 h-4 text-danger" />;
      case 'not_received': return <AlertCircle className="w-4 h-4 text-pending" />;
      default: return null;
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

  const handleAddBill = () => {
    if (!newBill.name || !newBill.amount || !newBill.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    addBill({
      name: newBill.name,
      amount: parseFloat(newBill.amount),
      dueDate: newBill.dueDate,
      status: 'not_received',
      category: newBill.category || 'Other',
      provider: newBill.provider || 'Unknown'
    });

    addActivity('Bill Added', `Added new bill: ${newBill.name}`);

    setNewBill({ name: '', amount: '', dueDate: '', category: '', provider: '' });
    setShowAddDialog(false);

    toast({
      title: "Bill Added",
      description: `${newBill.name} has been added to your bills.`
    });
  };

  const handlePayBill = (bill: Bill) => {
    updateBillStatus(bill.id, 'paid');
    addActivity('Bill Payment', `Paid ${bill.name}`, -bill.amount);
    
    toast({
      title: "Payment Processed",
      description: `€${bill.amount} paid for ${bill.name}`
    });
  };

  const handleRemoveBill = (bill: Bill) => {
    removeBill(bill.id);
    addActivity('Bill Removed', `Removed bill: ${bill.name}`);
    
    toast({
      title: "Bill Removed",
      description: `${bill.name} has been removed from your bills.`
    });
  };

  const handleImportFromGmail = () => {
    addActivity('Gmail Import', 'Simulated Gmail import for demo');
    
    toast({
      title: "Gmail Import (Demo)",
      description: "In a real app, this would import bills from your Gmail."
    });
  };

  const handleToggleAutoPay = (bill: Bill) => {
    addActivity('Auto-pay Toggle', `Toggled auto-pay for ${bill.name}`);
    
    toast({
      title: "Auto-pay Updated",
      description: `Auto-pay toggled for ${bill.name} (demo feature)`
    });
  };

  const sortedBills = [...bills].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bills Management</h1>
            <p className="text-muted-foreground">Manage and track all your bills in one place</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleImportFromGmail}>
              <Mail className="w-4 h-4 mr-2" />
              Import from Gmail
            </Button>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Bill
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Bill</DialogTitle>
                  <DialogDescription>
                    Enter the details for your new bill
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="billName">Bill Name *</Label>
                    <Input
                      id="billName"
                      value={newBill.name}
                      onChange={(e) => setNewBill(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Electricity Bill"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (€) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={newBill.amount}
                      onChange={(e) => setNewBill(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date *</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newBill.dueDate}
                      onChange={(e) => setNewBill(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={newBill.category} onValueChange={(value) => setNewBill(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Telecommunications">Telecommunications</SelectItem>
                        <SelectItem value="Insurance">Insurance</SelectItem>
                        <SelectItem value="Housing">Housing</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="provider">Provider</Label>
                    <Input
                      id="provider"
                      value={newBill.provider}
                      onChange={(e) => setNewBill(prev => ({ ...prev, provider: e.target.value }))}
                      placeholder="e.g., Latvenergo"
                    />
                  </div>
                  <Button onClick={handleAddBill} className="w-full">
                    Add Bill
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Bills List */}
        <div className="space-y-4">
          {sortedBills.map((bill) => (
            <Card key={bill.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(bill.status)}
                    <div>
                      <h3 className="font-semibold text-lg">{bill.name}</h3>
                      <p className="text-sm text-muted-foreground">{bill.provider} • {bill.category}</p>
                      <p className="text-sm text-muted-foreground">Due: {format(new Date(bill.dueDate), 'MMMM d, yyyy')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold">€{bill.amount.toFixed(2)}</div>
                      <Badge className={getStatusColor(bill.status)}>
                        {bill.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      {bill.status === 'pending' && (
                        <Button size="sm" onClick={() => handlePayBill(bill)}>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pay Now
                        </Button>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          onCheckedChange={() => handleToggleAutoPay(bill)}
                        />
                        <span className="text-xs text-muted-foreground">Auto-pay</span>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveBill(bill)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {bills.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <ToggleLeft className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No bills found</h3>
              <p className="text-muted-foreground mb-4">Get started by adding your first bill or importing from Gmail.</p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Bill
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Bills;