import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const STATION_PROMPTS: Record<string, string> = {
  character: `Hjälp barnet med INLEDNINGEN av sagan. 
    - Uppmuntra dem att berätta VEM huvudpersonen är
    - Fråga om VAR sagan utspelar sig
    - Ställ frågor som: "Vad heter din karaktär?" "Hur ser hen ut?" "Var bor hen?"`,
  problem: `Hjälp barnet med PROBLEMET i sagan.
    - Uppmuntra dem att skapa lite spänning
    - Fråga vad som händer som gör att hjälten måste agera
    - Ställ frågor som: "Vad går fel?" "Vem behöver hjälp?" "Varför är det farligt?"`,
  solution: `Hjälp barnet med LÖSNINGEN i sagan.
    - Uppmuntra dem att tänka på hur hjälten löser problemet
    - Fråga om hjälten använder list, mod eller hjälp
    - Ställ frågor som: "Hur löser hjälten detta?" "Vem hjälper till?" "Vad gör hjälten?"`,
  ending: `Hjälp barnet med SLUTET av sagan.
    - Uppmuntra dem att avsluta sagan på ett fint sätt
    - Fråga hur alla känner sig efteråt
    - Ställ frågor som: "Hur slutar det?" "Lärde sig hjälten något?" "Blev alla glada?"`
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, station, theme, element, currentText, themeName } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const stationContext = STATION_PROMPTS[station] || STATION_PROMPTS.character;
    const elementContext = element ? `Barnet har valt bilden "${element.emoji} ${element.name}".` : 'Barnet har inte valt någon bild ännu.';
    const textContext = currentText ? `Barnet har skrivit: "${currentText}"` : 'Barnet har inte skrivit något ännu.';
    const themeContext = themeName ? `Temat är "${themeName}".` : '';

    let systemPrompt = `Du är Trollis, en vänlig och busig trollkarl som hjälper barn 6-8 år att skriva sagor på svenska.
Du pratar på enkel och rolig svenska. Du är uppmuntrande och positiv.
Du ställer alltid en inspirerande fråga tillbaka för att hjälpa barnet fortsätta berätta.
Håll svaren korta (max 2-3 meningar).
Använd ibland emojis för att göra det roligare.
${themeContext}
${stationContext}`;

    let userPrompt = '';

    switch (action) {
      case 'tips':
        userPrompt = `${elementContext} ${textContext}
Ge ett uppmuntrande tips om hur barnet kan fortsätta, och ställ en inspirerande fråga.`;
        break;
      
      case 'question':
        userPrompt = `${elementContext} ${textContext}
Ställ en kreativ och inspirerande fråga som hjälper barnet att tänka på vad som ska hända i sagan.`;
        break;
      
      case 'generate':
        userPrompt = `${elementContext} ${textContext} ${themeContext}
Barnet behöver hjälp! Ge ett kort förslag på text (2-3 meningar) som passar till bilden och sagodelen.
Skriv förslaget så att barnet kan använda det direkt eller ändra det.`;
        break;
      
      case 'improve':
        if (!currentText) {
          return new Response(
            JSON.stringify({ message: 'Skriv lite text först, så hjälper jag dig göra den ännu bättre! ✨' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        userPrompt = `${elementContext}
Barnet har skrivit: "${currentText}"
Förbättra texten lite - gör den mer beskrivande och spännande, men behåll barnets idéer.
Ge både den förbättrade texten och berätta kort vad du ändrade.`;
        break;

      default:
        userPrompt = `${elementContext} ${textContext}
Säg hej och ge ett uppmuntrande tips!`;
    }

    console.log('Story assistant request:', { action, station, theme });

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 300,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Trollis behöver vila lite! Försök igen om en stund. 🧙‍♂️💤' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error('AI gateway error');
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content || 'Trollis tänker... 🤔';

    return new Response(
      JSON.stringify({ message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Story assistant error:', error);
    return new Response(
      JSON.stringify({ error: 'Trollis snubblade på sin trollstav! Försök igen. 🪄' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
