import { StoryStation, Theme } from '@/types/story';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useNarration } from '@/hooks/useNarration';

interface StoryPreviewProps {
  storyName: string;
  stations: StoryStation[];
  theme: Theme;
  onBack: () => void;
  isReadOnly?: boolean;
}

export function StoryPreview({ storyName, stations, theme, onBack, isReadOnly }: StoryPreviewProps) {
  const { isPlaying, isLoading, currentStationIndex, narrateText, narrateStory, stopNarration } = useNarration();

  const handleReadAll = () => {
    if (isPlaying) {
      stopNarration();
    } else {
      const storyTexts = stations.map(s => ({ title: s.title, text: s.text || '' }));
      narrateStory(storyTexts);
    }
  };

  const handleReadStation = (index: number) => {
    if (currentStationIndex === index && isPlaying) {
      stopNarration();
    } else {
      const station = stations[index];
      if (station.text) {
        narrateText(station.text, index);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="text-base">
          <ArrowLeft className="w-5 h-5 mr-2" />
          {isReadOnly ? 'Tillbaka' : 'Tillbaka till redigering'}
        </Button>

        <Button 
          onClick={handleReadAll}
          disabled={isLoading}
          className="gap-2"
          style={{ backgroundColor: theme.color }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Laddar...
            </>
          ) : isPlaying ? (
            <>
              <VolumeX className="w-5 h-5" />
              Stoppa uppläsning
            </>
          ) : (
            <>
              <Volume2 className="w-5 h-5" />
              Läs upp hela sagan
            </>
          )}
        </Button>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12 animate-pop">
          <span className="text-6xl mb-4 block">{theme.emoji}</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">
            {storyName}
          </h1>
        </div>

        {/* Story Content */}
        <div className="space-y-12">
          {stations.map((station, index) => (
            <div 
              key={station.id} 
              className="animate-pop"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Station Header */}
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl"
                  style={{ backgroundColor: theme.color }}
                >
                  {index + 1}
                </div>
                <h2 className="text-2xl font-bold text-foreground flex-1">{station.title}</h2>
                {station.text && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReadStation(index)}
                    disabled={isLoading}
                    className="gap-1 text-muted-foreground hover:text-foreground"
                  >
                    {currentStationIndex === index && isPlaying ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">
                      {currentStationIndex === index && isPlaying ? 'Stoppa' : 'Läs upp'}
                    </span>
                  </Button>
                )}
              </div>

              {/* Content Card */}
              <div 
                className="bg-card rounded-2xl p-6 shadow-lg border-2"
                style={{ borderColor: theme.color }}
              >
                {station.element && (
                  <div className="text-center mb-4">
                    <span className="text-8xl block mb-2">{station.element.emoji}</span>
                    <span className="text-lg font-medium text-muted-foreground">
                      {station.element.name}
                    </span>
                  </div>
                )}
                
                {station.text ? (
                  <p className="text-lg text-foreground leading-relaxed whitespace-pre-wrap">
                    {station.text}
                  </p>
                ) : (
                  <p className="text-lg text-muted-foreground italic text-center">
                    (Ingen text skriven ännu)
                  </p>
                )}
              </div>

              {/* Connector Line */}
              {index < stations.length - 1 && (
                <div className="flex justify-center my-4">
                  <div 
                    className="w-1 h-12 rounded-full"
                    style={{ backgroundColor: theme.color, opacity: 0.4 }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* The End */}
        <div className="text-center mt-12 animate-pop" style={{ animationDelay: '0.8s' }}>
          <span className="text-6xl block mb-4">🌟</span>
          <h2 className="text-3xl font-bold text-foreground">Slut</h2>
        </div>
      </div>
    </div>
  );
}
