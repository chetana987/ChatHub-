import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppDropdown } from "@/components/AppDropdown";
import { MoodType } from "@/components/MoodSelector";

interface TopBarProps {
  currentMood: MoodType;
  onMoodChange: (mood: MoodType) => void;
  onNewContact: () => void;
  onNewGroup: () => void;
}

export function TopBar({ currentMood, onMoodChange, onNewContact, onNewGroup }: TopBarProps) {
  return (
    <div className="h-14 bg-card border-b border-border/50 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-foreground">ChatHub</h1>
      </div>
      
      <div className="flex items-center">
        <AppDropdown 
          currentMood={currentMood}
          onMoodChange={onMoodChange}
          onNewContact={onNewContact}
          onNewGroup={onNewGroup}
        />
      </div>
    </div>
  );
}