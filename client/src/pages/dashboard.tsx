import { format } from "date-fns";
import { Clock, CheckCircle, Calendar } from "lucide-react";
import { Link } from "wouter";
import { Header } from "@/components/header";
import { CheckInCard } from "@/components/check-in-card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useCheckIns } from "@/hooks/use-check-ins";

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const { checkIns, streak, isNewUser, hasCheckedInToday, isLoading } = useCheckIns(user || undefined);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const currentDate = format(new Date(), "EEEE, MMMM dd, yyyy");

  if (!user) return null;

  if (isNewUser) {
    return (
      <div className="page-container">
        <Header onUserMenuClick={signOut} />
        
        <main className="max-w-2xl mx-auto px-4 py-6">
          <div className="space-y-6 py-8">
            <div className="text-center space-y-4 mb-8">
              <div className="emoji-large" data-testid="welcome-emoji">🌟</div>
              <h2 className="text-2xl font-bold text-foreground" data-testid="welcome-title">
                Welcome to Reentry Buddy!
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto" data-testid="welcome-description">
                You're taking an important step in your recovery journey. Let's start with your first check-in.
              </p>
            </div>

            <div className="bg-card rounded-lg border border-border shadow-sm p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Daily Check-Ins</h4>
                  <p className="text-sm text-muted-foreground">
                    Record your feelings, set goals, and journal your thoughts each day
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                  <div className="text-sm">🔥</div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Build Your Streak</h4>
                  <p className="text-sm text-muted-foreground">
                    Stay consistent and watch your daily streak grow
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Track Your Progress</h4>
                  <p className="text-sm text-muted-foreground">
                    Review your history and see how far you've come
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <div className="fixed-bottom-cta">
          <Link href="/check-in">
            <Button 
              className="btn-primary w-full max-w-2xl mx-auto py-4 text-lg font-semibold shadow-xl flex items-center justify-center gap-2"
              data-testid="button-first-checkin"
            >
              <Calendar className="h-5 w-5" />
              Start Your First Check-In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header onUserMenuClick={signOut} />
      
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* User Greeting */}
          <section className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground" data-testid="greeting">
              <span data-testid="greeting-time">{getGreeting()}</span>, <span data-testid="user-name">{user.firstName}</span>! 👋
            </h2>
            <p className="text-muted-foreground" data-testid="current-date">
              {currentDate}
            </p>
          </section>

          {/* Today's Status Card */}
          <div className="bg-card rounded-lg border border-border shadow-sm p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Today's Check-In</h3>
                <p className="text-sm text-muted-foreground">Keep your momentum going</p>
              </div>
              
              {hasCheckedInToday ? (
                <span 
                  className="status-badge-complete text-success-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                  data-testid="status-complete"
                >
                  <CheckCircle className="h-3 w-3" />
                  Completed
                </span>
              ) : (
                <span 
                  className="status-badge-pending text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                  data-testid="status-pending"
                >
                  <Clock className="h-3 w-3" />
                  Pending
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 pt-3 border-t border-border">
              <div className="streak-badge text-success-foreground w-16 h-16 rounded-lg flex flex-col items-center justify-center">
                <div className="text-2xl font-bold" data-testid="streak-count">{streak}</div>
                <div className="text-xs uppercase tracking-wide">Days</div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">Current Streak</p>
                <p className="text-xs text-muted-foreground" data-testid="streak-message">
                  {streak > 0 ? "You're doing great! Keep it up 🎉" : "Start your streak today! 💪"}
                </p>
              </div>
            </div>
          </div>

          {/* Check-In History */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Recent Check-Ins</h3>
              {checkIns.length > 5 && (
                <Button
                  variant="ghost"
                  className="text-sm text-primary font-medium hover:underline p-0 h-auto"
                  data-testid="button-view-all"
                >
                  View All
                </Button>
              )}
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading check-ins...</p>
              </div>
            ) : checkIns.length === 0 ? (
              <div className="text-center py-8 bg-card rounded-lg border border-border">
                <p className="text-muted-foreground" data-testid="no-checkins-message">
                  No check-ins yet. Start your first one today!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {checkIns
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map((checkIn) => (
                    <CheckInCard key={checkIn.id} checkIn={checkIn} />
                  ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Fixed Bottom CTA */}
      {!hasCheckedInToday && (
        <div className="fixed-bottom-cta">
          <Link href="/check-in">
            <Button 
              className="btn-primary w-full max-w-2xl mx-auto py-4 text-lg font-semibold shadow-xl flex items-center justify-center gap-2"
              data-testid="button-checkin-today"
            >
              <Calendar className="h-5 w-5" />
              Check-In for Today
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
