import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAppState } from '@/contexts/AppStateContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { 
  Crown, 
  Zap, 
  Infinity, 
  Check, 
  Bell, 
  Mail, 
  Smartphone, 
  Shield, 
  User,
  CreditCard
} from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const { subscription, setSubscription, addActivity } = useAppState();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false
  });

  const subscriptionPlans = [
    {
      id: 'free',
      name: 'Free',
      price: '€0',
      period: 'for only first month',
      bills: '5 bills/month',
      features: ['Basic bill tracking', 'Email notifications', 'Standard support'],
      icon: User,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted'
    },
    {
      id: 'basic',
      name: 'Basic',
      price: '€5',
      period: 'month',
      bills: '10 bills/month',
      features: ['All free features', 'Priority support', 'Advanced analytics', 'Auto-pay scheduling'],
      icon: Zap,
      color: 'text-primary',
      bgColor: 'bg-primary'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '€11',
      period: 'month',
      bills: 'Unlimited bills',
      features: ['All basic features', '24/7 premium support', 'Custom categories', 'Export reports', 'White-label'],
      icon: Crown,
      color: 'text-accent',
      bgColor: 'bg-accent'
    }
  ];

  const handleSubscriptionChange = (planId: string) => {
    setSubscription(planId as 'free' | 'basic' | 'premium');
    addActivity('Subscription Changed', `Upgraded to ${planId} plan`);
    
    toast({
      title: "Subscription Updated",
      description: `Successfully switched to ${planId} plan!`
    });
  };

  const handleNotificationToggle = (type: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [type]: !prev[type] }));
    addActivity('Settings Changed', `${type} notifications ${notifications[type] ? 'disabled' : 'enabled'}`);
    
    toast({
      title: "Notification Settings Updated",
      description: `${type} notifications ${notifications[type] ? 'disabled' : 'enabled'}`
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account and subscription preferences</p>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Profile Information</span>
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={user?.name || ''} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" value={user?.email || ''} readOnly />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Profile information is read-only in demo mode.
            </p>
          </CardContent>
        </Card>

        {/* Subscription Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Subscription Plans</span>
            </CardTitle>
            <CardDescription>Choose the plan that works best for you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative rounded-lg border-2 p-6 transition-all ${
                    subscription === plan.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {subscription === plan.id && (
                    <Badge className="absolute -top-2 left-4 bg-primary text-primary-foreground">
                      Current Plan
                    </Badge>
                  )}
                  
                  <div className="space-y-4">
                    <div className="text-center">
                      <plan.icon className={`w-8 h-8 mx-auto mb-2 ${plan.color}`} />
                      <h3 className="text-lg font-semibold">{plan.name}</h3>
                      <div className="text-2xl font-bold">
                        {plan.price}
                        <span className="text-sm font-normal text-muted-foreground">
                          /{plan.period}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{plan.bills}</p>
                    </div>

                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-success" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant={subscription === plan.id ? "secondary" : "default"}
                      className="w-full"
                      onClick={() => handleSubscriptionChange(plan.id)}
                      disabled={subscription === plan.id}
                    >
                      {subscription === plan.id ? 'Current Plan' : 'Choose Plan'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Notification Preferences</span>
            </CardTitle>
            <CardDescription>Choose how you want to be notified about your bills</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="email-notif">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive bill reminders via email</p>
                </div>
              </div>
              <Switch
                id="email-notif"
                checked={notifications.email}
                onCheckedChange={() => handleNotificationToggle('email')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="push-notif">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get instant alerts on your device</p>
                </div>
              </div>
              <Switch
                id="push-notif"
                checked={notifications.push}
                onCheckedChange={() => handleNotificationToggle('push')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="sms-notif">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive text messages for urgent bills</p>
                </div>
              </div>
              <Switch
                id="sms-notif"
                checked={notifications.sms}
                onCheckedChange={() => handleNotificationToggle('sms')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Security & Privacy</span>
            </CardTitle>
            <CardDescription>Manage your account security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <Button variant="outline" size="sm">
                Enable 2FA
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Data Export</h4>
                <p className="text-sm text-muted-foreground">Download your bill data in CSV format</p>
              </div>
              <Button variant="outline" size="sm">
                Export Data
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Delete Account</h4>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;