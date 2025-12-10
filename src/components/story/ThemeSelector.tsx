import { ThemeType } from '@/types/story';
import { themes } from '@/data/themes';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ThemeSelectorProps {
  onSelectTheme: (theme: ThemeType) => void;
  onBack: () => void;
}

export function ThemeSelector({ onSelectTheme, onBack }: ThemeSelectorProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background via-muted/30 to-background">
      <Button
        variant="ghost"
        onClick={onBack}
        className="absolute top-6 left-6 text-lg"
      >
        <ArrowLeft className="w-6 h-6 mr-2" />
        Tillbaka
      </Button>

      <div className="text-center mb-12 animate-pop">
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
          Välj ett tema 🎨
        </h1>
        <p className="text-xl text-muted-foreground">
          Vilken värld vill du utforska?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        {themes.map((theme, index) => (
          <Card
            key={theme.id}
            onClick={() => onSelectTheme(theme.id)}
            className="p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-4 animate-pop flex flex-col items-center text-center"
            style={{ 
              animationDelay: `${index * 0.15}s`,
              borderColor: theme.color,
            }}
          >
            <span className="text-7xl mb-4 animate-bounce-soft" style={{ animationDelay: `${index * 0.2}s` }}>
              {theme.emoji}
            </span>
            <h2 className="text-2xl font-bold text-foreground mb-2">{theme.name}</h2>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {theme.elements.slice(0, 6).map(el => (
                <span key={el.id} className="text-2xl" title={el.name}>
                  {el.emoji}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
