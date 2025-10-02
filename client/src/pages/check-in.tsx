import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useCheckIns } from "@/hooks/use-check-ins";
import { useToast } from "@/hooks/use-toast";
import { insertCheckInSchema } from "@shared/schema";

export default function CheckInPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { addCheckIn, isLoading } = useCheckIns(user || undefined);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    feeling: "",
    goal: "",
    journal: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to submit a check-in.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Submit check-in with the required fields
      await addCheckIn({
        feeling: formData.feeling,
        goal: formData.goal,
        journal: formData.journal || undefined
      });

      toast({
        title: "Check-In Complete! 🎉",
        description: "Great job staying consistent with your recovery journey.",
      });

      // Navigate back to dashboard
      setLocation("/dashboard");
    } catch (error) {
      console.error("Check-in submission error:", error);
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

  const handleBack = () => {
    setLocation("/dashboard");
  };

  if (!user) return null;

  return (
    <div className="page-container">
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 bg-muted rounded-full hover:bg-border transition-colors"
              onClick={handleBack}
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold text-foreground" data-testid="page-title">
              Today's Check-In
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-checkin">
            {/* Feeling Input */}
            <div className="space-y-2">
              <Label htmlFor="feeling" className="block text-sm font-semibold text-foreground">
                How are you feeling today? <span className="text-destructive">*</span>
              </Label>
              <p className="text-xs text-muted-foreground mb-2">Share your current emotional state</p>
              <Input
                type="text"
                id="feeling"
                placeholder="e.g., Hopeful, Anxious, Determined, Peaceful..."
                value={formData.feeling}
                onChange={(e) => handleInputChange("feeling", e.target.value)}
                required
                disabled={isLoading}
                className="form-input"
                data-testid="input-feeling"
              />
            </div>

            {/* Goal Input */}
            <div className="space-y-2">
              <Label htmlFor="goal" className="block text-sm font-semibold text-foreground">
                My simple goal today is... <span className="text-destructive">*</span>
              </Label>
              <p className="text-xs text-muted-foreground mb-2">Keep it simple and achievable</p>
              <Input
                type="text"
                id="goal"
                placeholder="e.g., Attend my support group, Call a friend, Go for a walk..."
                value={formData.goal}
                onChange={(e) => handleInputChange("goal", e.target.value)}
                required
                disabled={isLoading}
                className="form-input"
                data-testid="input-goal"
              />
            </div>

            {/* Journal Textarea */}
            <div className="space-y-2">
              <Label htmlFor="journal" className="block text-sm font-semibold text-foreground">
                Journal Entry
              </Label>
              <p className="text-xs text-muted-foreground mb-2">Write about your thoughts, challenges, or wins (optional)</p>
              <Textarea
                id="journal"
                rows={6}
                placeholder="What's on your mind? This is your safe space to express yourself..."
                value={formData.journal}
                onChange={(e) => handleInputChange("journal", e.target.value)}
                disabled={isLoading}
                className="form-input resize-none"
                data-testid="input-journal"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 pb-20">
              <Button
                type="submit"
                className="btn-primary w-full py-4 text-lg font-semibold shadow-md flex items-center justify-center gap-2"
                disabled={isLoading}
                data-testid="button-submit-checkin"
              >
                <CheckCircle className="h-5 w-5" />
                {isLoading ? "Submitting..." : "Complete Check-In"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
