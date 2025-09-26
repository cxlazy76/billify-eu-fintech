import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, X, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SupportWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleWidget = () => setIsOpen(!isOpen);

  const navigateToSupport = () => {
    navigate('/support');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Support Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleWidget}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          size="icon"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </Button>
      </div>

      {/* Support Widget Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80">
          <Card className="shadow-xl border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Need Help?</CardTitle>
              <CardDescription>
                Get quick support or contact our team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={navigateToSupport}
                className="w-full justify-start"
                variant="outline"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Full Support Center
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Mail className="w-3 h-3 mr-1" />
                  Email
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <Phone className="w-3 h-3 mr-1" />
                  Call
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground pt-2 border-t">
                Mon-Fri: 9AM-6PM CET
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};