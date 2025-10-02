import { Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onUserMenuClick?: () => void;
}

export function Header({ onUserMenuClick }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            <Heart className="h-5 w-5" data-testid="logo-icon" />
          </div>
          <h1 className="text-xl font-bold text-foreground" data-testid="app-title">
            Reentry Buddy
          </h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
          onClick={onUserMenuClick}
          data-testid="button-user-menu"
        >
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
