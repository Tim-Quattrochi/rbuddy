import { CheckIn } from "@shared/schema";
import { format } from "date-fns";

interface CheckInCardProps {
  checkIn: CheckIn;
}

export function CheckInCard({ checkIn }: CheckInCardProps) {
  const checkInDate = new Date(checkIn.date);
  const formattedDate = format(checkInDate, "EEEE, MMM dd");
  const formattedTime = format(new Date(checkIn.createdAt), "h:mm a");

  // Simple mood emoji mapping based on feeling keywords
  const getMoodEmoji = (feeling: string): string => {
    const feelingLower = feeling.toLowerCase();
    if (feelingLower.includes('happy') || feelingLower.includes('great') || feelingLower.includes('excellent')) return '😊';
    if (feelingLower.includes('good') || feelingLower.includes('positive') || feelingLower.includes('hopeful')) return '🙂';
    if (feelingLower.includes('okay') || feelingLower.includes('fine') || feelingLower.includes('neutral')) return '😐';
    if (feelingLower.includes('sad') || feelingLower.includes('down') || feelingLower.includes('low')) return '😔';
    if (feelingLower.includes('anxious') || feelingLower.includes('worried') || feelingLower.includes('stressed')) return '😰';
    if (feelingLower.includes('angry') || feelingLower.includes('frustrated') || feelingLower.includes('mad')) return '😠';
    if (feelingLower.includes('tired') || feelingLower.includes('exhausted') || feelingLower.includes('weary')) return '😴';
    if (feelingLower.includes('peaceful') || feelingLower.includes('calm') || feelingLower.includes('serene')) return '😌';
    if (feelingLower.includes('energized') || feelingLower.includes('motivated') || feelingLower.includes('excited')) return '💪';
    if (feelingLower.includes('grateful') || feelingLower.includes('blessed') || feelingLower.includes('thankful')) return '🙏';
    return '🙂'; // default
  };

  return (
    <div 
      className="bg-card rounded-lg border border-border shadow-sm p-4 card-hover" 
      data-testid={`card-checkin-${checkIn.id}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-foreground" data-testid="text-checkin-date">
            {formattedDate}
          </p>
          <p className="text-xs text-muted-foreground" data-testid="text-checkin-time">
            {formattedTime}
          </p>
        </div>
        <div className="text-2xl" data-testid="text-mood-emoji">
          {getMoodEmoji(checkIn.feeling)}
        </div>
      </div>
      
      <div className="space-y-2">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            Feeling
          </p>
          <p className="text-sm text-foreground" data-testid="text-feeling">
            {checkIn.feeling}
          </p>
        </div>
        
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            Today's Goal
          </p>
          <p className="text-sm text-foreground font-medium" data-testid="text-goal">
            {checkIn.goal}
          </p>
        </div>
        
        {checkIn.journal && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Journal Entry
            </p>
            <p className="text-sm text-foreground line-clamp-2" data-testid="text-journal">
              {checkIn.journal}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
