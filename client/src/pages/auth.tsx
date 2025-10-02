import { useState } from "react";
import { useLocation } from "wouter";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { insertUserSchema } from "@shared/schema";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { signIn, isLoading } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      const validatedData = insertUserSchema.parse(formData);
      
      // Sign in user
      await signIn(validatedData);
      
      toast({
        title: "Welcome!",
        description: "You've successfully signed in to Reentry Buddy.",
      });
      
      // Redirect to dashboard
      setLocation("/dashboard");
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Error",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground mx-auto shadow-lg">
            <Heart className="h-10 w-10" data-testid="logo-icon-large" />
          </div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="app-title-large">
            Reentry Buddy
          </h1>
          <p className="text-muted-foreground" data-testid="app-description">
            Your daily companion for recovery and accountability
          </p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="form-signin">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-semibold text-foreground">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="text"
                  id="firstName"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  required
                  disabled={isLoading}
                  data-testid="input-firstname"
                  className="form-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-semibold text-foreground">
                  Last Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="text"
                  id="lastName"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  required
                  disabled={isLoading}
                  data-testid="input-lastname"
                  className="form-input"
                />
              </div>

              <Button
                type="submit"
                className="btn-primary w-full py-3 font-semibold shadow-md"
                disabled={isLoading}
                data-testid="button-get-started"
              >
                {isLoading ? "Getting Started..." : "Get Started"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-xs text-center text-muted-foreground" data-testid="text-privacy-notice">
          By continuing, you agree to our terms and privacy policy
        </p>
      </div>
    </div>
  );
}
