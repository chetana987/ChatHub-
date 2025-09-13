import { useState } from "react";
import { MoreVertical, Palette, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { MoodType } from "@/components/MoodSelector";

interface AppDropdownProps {
  currentMood: MoodType;
  onMoodChange: (mood: MoodType) => void;
  onNewContact: () => void;
  onNewGroup: () => void;
}

export function AppDropdown({ currentMood, onMoodChange, onNewContact, onNewGroup }: AppDropdownProps) {
  const [open, setOpen] = useState(false);

  const moods = [
    { type: 'happy' as const, label: '😊 Happy', description: 'Purple gradient theme' },
    { type: 'calm' as const, label: '🌊 Calm', description: 'Teal gradient theme' },
    { type: 'focused' as const, label: '🎯 Focused', description: 'Dark mode theme' },
  ];

  const handleMoodSelect = (mood: MoodType) => {
    onMoodChange(mood);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-card border border-border/50">
        <DropdownMenuLabel>App Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Palette className="mr-2 h-4 w-4" />
            <span>Mood-based Themes 🎨</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-card border border-border/50">
            {moods.map((mood) => (
              <DropdownMenuItem
                key={mood.type}
                onClick={() => handleMoodSelect(mood.type)}
                className={`cursor-pointer ${
                  currentMood === mood.type ? 'bg-accent text-accent-foreground' : ''
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm">{mood.label}</span>
                  <span className="text-xs text-muted-foreground">{mood.description}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onNewContact}>
          <UserPlus className="mr-2 h-4 w-4" />
          <span>New Contact</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onNewGroup}>
          <Users className="mr-2 h-4 w-4" />
          <span>New Group</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => {/* Add logout logic */}}>
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}