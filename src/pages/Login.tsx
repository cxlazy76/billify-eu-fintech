import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { CreditCard, Shield, Banknote } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      toast({
        title: "Agreement Required",
        description: "Please accept our terms to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    const success = await login(email, password);
    
    if (success) {
      toast({
        title: "Welcome to Billify!",
        description: "Successfully logged in. Enjoy your first month with 5 bills free!"
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Try demo@billify.app / demo123",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Billify</h1>
          </div>
          <p className="text-muted-foreground">European Bill Management Platform</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to manage your bills efficiently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="demo@billify.app"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="demo123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree that{' '}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button type="button" className="underline text-primary hover:text-primary-hover">
                        Billify acts as a middleman
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <Shield className="w-5 h-5 text-primary" />
                          <span>Privacy & Security</span>
                        </DialogTitle>
                        <DialogDescription className="space-y-3 text-left">
                          <p>
                            <strong>Billify acts as a secure middleman</strong> to facilitate bill payments 
                            between you and your service providers.
                          </p>
                          <p>
                            We do <strong>not store personal banking information</strong> on our servers. 
                            All payment processing is handled through certified European payment providers.
                          </p>
                          <p>
                            Your bill data is encrypted and processed according to GDPR compliance 
                            standards for European customers.
                          </p>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                  {' '}and does not store personal information
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Promo Banner */}
        <Card className="bg-gradient-to-r from-success to-accent text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Banknote className="w-8 h-8" />
              <div>
                <h3 className="font-semibold">First Month Special</h3>
                <p className="text-sm opacity-90">5 bills completely free!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Demo credentials: demo@billify.app / demo123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;