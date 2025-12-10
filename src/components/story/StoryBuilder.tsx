import { useState } from 'react';
import { Story, StoryElement, ThemeType } from '@/types/story';
import { themes, createEmptyStations } from '@/data/themes';
import { ImageLibrary } from './ImageLibrary';
import { StoryStationCard } from './StoryStationCard';
import { StoryPreview } from './StoryPreview';
import { StoryAssistant } from './StoryAssistant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Eye, Save, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

interface StoryBuilderProps {
  initialStory?: Story;
  themeType: ThemeType;
  onBack: () => void;
  onSave: (story: Story) => void;
}

export function StoryBuilder({ initialStory, themeType, onBack, onSave }: StoryBuilderProps) {
  const theme = themes.find(t => t.id === themeType)!;
  
  const [storyName, setStoryName] = useState(initialStory?.name || 'Min saga');
  const [stations, setStations] = useState(initialStory?.stations || createEmptyStations());
  const [isPreview, setIsPreview] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [activeStationId, setActiveStationId] = useState<string>('character');

  const handleDropOnStation = (stationId: string, element: StoryElement) => {
    setStations(prev => prev.map(s => 
      s.id === stationId ? { ...s, element } : s
    ));
    toast.success(`${element.name} tillagd!`);
  };

  const handleTextChange = (stationId: string, text: string) => {
    setStations(prev => prev.map(s => 
      s.id === stationId ? { ...s, text } : s
    ));
  };

  const handleRemoveElement = (stationId: string) => {
    setStations(prev => prev.map(s => 
      s.id === stationId ? { ...s, element: null } : s
    ));
  };

  const handleSave = () => {
    const story: Story = {
      id: initialStory?.id || crypto.randomUUID(),
      name: storyName,
      theme: themeType,
      stations,
      createdAt: initialStory?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSave(story);
    toast.success('Sagan sparad! 🎉');
  };

  const activeStation = stations.find(s => s.id === activeStationId);

  const handleSuggestion = (suggestion: string) => {
    // Apply suggestion to active station's text
    if (activeStationId) {
      setStations(prev => prev.map(s => 
        s.id === activeStationId 
          ? { ...s, text: s.text ? `${s.text}\n\n${suggestion}` : suggestion }
          : s
      ));
      toast.success('Förslag tillagt! ✨');
    }
  };

  if (isPreview) {
    return (
      <StoryPreview
        storyName={storyName}
        stations={stations}
        theme={theme}
        onBack={() => setIsPreview(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="text-base">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Tillbaka
        </Button>
        
        <div className="flex items-center gap-2">
          {isEditingName ? (
            <Input
              value={storyName}
              onChange={(e) => setStoryName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
              className="w-48 text-center font-bold"
              autoFocus
            />
          ) : (
            <button 
              onClick={() => setIsEditingName(true)}
              className="flex items-center gap-2 text-xl font-bold text-foreground hover:text-primary transition-colors"
            >
              <span className="text-2xl">{theme.emoji}</span>
              {storyName}
              <Edit2 className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsPreview(true)} className="text-base">
            <Eye className="w-5 h-5 mr-2" />
            Förhandsgranska
          </Button>
          <Button onClick={handleSave} className="text-base">
            <Save className="w-5 h-5 mr-2" />
            Spara
          </Button>
        </div>
      </div>

      {/* Image Library */}
      <div className="mb-6">
        <ImageLibrary theme={theme} />
      </div>

      {/* Story Thread (Sagotråden) */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="text-3xl">🧵</span>
          Sagotråden
        </h2>
        
        {/* Visual thread line */}
        <div className="relative">
          <div 
            className="absolute top-1/2 left-0 right-0 h-2 rounded-full -translate-y-1/2 hidden md:block"
            style={{ backgroundColor: theme.color, opacity: 0.3 }}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
            {stations.map((station) => (
              <StoryStationCard
                key={station.id}
                station={station}
                themeColor={theme.color}
                onDrop={(element) => handleDropOnStation(station.id, element)}
                onTextChange={(text) => handleTextChange(station.id, text)}
                onRemoveElement={() => handleRemoveElement(station.id)}
                onFocus={() => setActiveStationId(station.id)}
                isActive={station.id === activeStationId}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Trollis Assistant */}
      <div className="fixed bottom-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)]">
        <StoryAssistant
          activeStation={activeStationId}
          theme={themeType}
          themeName={theme.name}
          element={activeStation?.element || null}
          currentText={activeStation?.text || ''}
          onSuggestion={handleSuggestion}
        />
      </div>
    </div>
  );
}
