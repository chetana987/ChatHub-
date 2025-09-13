import { useState } from "react";
import { Smile, Waves, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type MoodType = 'happy' | 'calm' | 'focused';

interface MoodSelectorProps {
  selectedMood: MoodType;
  onMoodChange: (mood: MoodType) => void;
}

export function MoodSelector({ selectedMood, onMoodChange }: MoodSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const moods = [
    { type: 'happy' as const, icon: Smile, label: 'Happy', color: 'text-purple-400' },
    { type: 'calm' as const, icon: Waves, label: 'Calm', color: 'text-teal-400' },
    { type: 'focused' as const, icon: Target, label: 'Focused', color: 'text-white' },
  ];

  const currentMood = moods.find(m => m.type === selectedMood);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        {currentMood && <currentMood.icon className={`h-4 w-4 ${currentMood.color}`} />}
        <span className="text-sm">{currentMood?.label}</span>
      </Button>

      {isOpen && (
        <Card className="absolute top-full right-0 mt-2 w-48 z-50">
          <CardContent className="p-2">
            <div className="space-y-1">
              {moods.map((mood) => (
                <Button
                  key={mood.type}
                  variant={selectedMood === mood.type ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    onMoodChange(mood.type);
                    setIsOpen(false);
                  }}
                >
                  <mood.icon className={`h-4 w-4 mr-2 ${mood.color}`} />
                  {mood.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}