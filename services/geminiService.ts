
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, CompatibilityResult, ZodiacSign, PlanetaryPosition, ChartAspect, AstroForecast } from "../types";

// Always use new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const cleanAndParseJSON = (text: string | undefined): any => {
  if (!text) return {};
  try {
    // Remove markdown code blocks if present
    let clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(clean);
  } catch (e) {
    console.error("JSON Parse Error on text:", text);
    // Fallback: try to find the first '{' and last '}'
    try {
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
            return JSON.parse(text.substring(start, end + 1));
        }
    } catch (e2) {}
    throw new Error("Failed to parse AI response");
  }
};

/**
 * High-precision Astrology calculation using Gemini 3 Pro.
 */
export const calculateAstrologyProfile = async (
  name: string, 
  date: string, 
  time: string, 
  location: string
): Promise<{ 
  sunSign: ZodiacSign; 
  moonSign: string; 
  risingSign: string; 
  summary: string; 
  natalChart: PlanetaryPosition[];
  aspects: ChartAspect[];
  synthesis: string;
}> => {
  const prompt = `
    TASK: High-Precision Natal Chart Calculation (Swiss Ephemeris Standard)
    
    SUBJECT:
    Name: ${name}
    Birth Date: ${date}
    Birth Time: ${time} (local time)
    Birth Location: ${location}
    
    REQUIREMENTS:
    1. Calculate exact longitudinal positions for the Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, and the Ascendant.
    2. Use the Placidus House System.
    3. Determine degrees (0-29) and minutes (0-59) within each Zodiac Sign.
    4. Detect Retrograde status for all planets.
    5. Determine the House placement for each celestial body.
    6. Identify Planetary Dignity: Domicile, Exaltation, Detriment, Fall, or Neutral.
    7. Identify Sign Element: Fire, Earth, Air, Water.
    8. Calculate MAJOR ASPECTS (Conjunction, Sextile, Square, Trine, Opposition) between all planets with a max orb of 6 degrees.
    9. Provide a "synthesis" - a 150-word high-vibration narrative summarizing the user's soul architecture.
    
    OUTPUT:
    Return valid JSON. Be extremely precise.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 6000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sunSign: { type: Type.STRING },
          moonSign: { type: Type.STRING },
          risingSign: { type: Type.STRING },
          summary: { type: Type.STRING },
          synthesis: { type: Type.STRING },
          natalChart: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                planet: { type: Type.STRING },
                sign: { type: Type.STRING },
                degree: { type: Type.INTEGER },
                minute: { type: Type.INTEGER },
                isRetrograde: { type: Type.BOOLEAN },
                house: { type: Type.INTEGER },
                dignity: { type: Type.STRING },
                element: { type: Type.STRING }
              }
            }
          },
          aspects: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                planet1: { type: Type.STRING },
                planet2: { type: Type.STRING },
                type: { type: Type.STRING },
                orb: { type: Type.NUMBER },
                description: { type: Type.STRING }
              }
            }
          }
        },
        required: ['sunSign', 'moonSign', 'risingSign', 'summary', 'natalChart', 'aspects', 'synthesis']
      }
    }
  });

  return cleanAndParseJSON(response.text);
};

/**
 * Calculates Synastry (Compatibility) using deep planetary aspects.
 */
export const getMatchCompatibility = async (
  user1: UserProfile, 
  user2: UserProfile
): Promise<CompatibilityResult> => {
  const prompt = `
    Analyze Synastry compatibility between two natal charts. 
    User 1: ${user1.name} (${JSON.stringify(user1.natalChart)})
    User 2: ${user2.name} (${JSON.stringify(user2.natalChart)})
    
    Look for specific aspects: Conjunctions, Trines, Squares, Oppositions, and Sextiles.
    
    SPECIAL FOCUS: 
    1. Calculate the key Sun-Moon aspects between these two individuals.
    2. Calculate the key Venus-Mars aspects between these two individuals (attraction and drive).
    
    Identify the single most influential Sun-Moon aspect and Venus-Mars aspect.
    
    Calculate a compatibility score (0-100).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 4000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          pros: { type: Type.ARRAY, items: { type: Type.STRING } },
          cons: { type: Type.ARRAY, items: { type: Type.STRING } },
          connectionType: { 
            type: Type.STRING, 
            enum: ['Soulmate', 'Twin Flame', 'Karmic', 'Steady'] 
          },
          sunMoonAspect: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              vibe: { type: Type.STRING }
            },
            required: ['title', 'description', 'vibe']
          },
          venusMarsAspect: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              vibe: { type: Type.STRING }
            },
            required: ['title', 'description', 'vibe']
          }
        },
        required: ['score', 'summary', 'pros', 'cons', 'connectionType', 'sunMoonAspect', 'venusMarsAspect']
      }
    }
  });

  return cleanAndParseJSON(response.text);
};

export const getIcebreaker = async (user1: UserProfile, user2: UserProfile): Promise<string> => {
  const prompt = `
    Based on their Synastry Aspects:
    User 1 Chart: ${JSON.stringify(user1.natalChart)}
    User 2 Chart: ${JSON.stringify(user2.natalChart)}
    
    Create a deep, specific icebreaker that references a particular astrological connection (e.g., "The way your Moon interacts with their Neptune suggests...").
    Keep it mysterious, high-vibration, and romantic. Under 25 words.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  
  return response.text?.trim() || "The stars are aligning for a conversation.";
};

/**
 * Fetches personalized astrological event forecasts.
 */
export const getAstroForecast = async (user: UserProfile): Promise<AstroForecast[]> => {
  const today = new Date().toISOString().split('T')[0];
  const prompt = `
    TASK: Personal Astrological Event Forecast
    CURRENT DATE: ${today}
    USER CHART: ${JSON.stringify(user.natalChart)}
    
    REQUIREMENTS:
    1. Identify 4 major upcoming astrological events (Full/New Moons, Planetary Retrogrades, Major Transits) starting from today.
    2. Provide a personalized "influence" description (30-50 words) explaining how this specific event interacts with the user's natal chart.
    3. Categorize each event (Moon, Retrograde, Transit, Eclipse).
    4. Define a one-word "vibe" (e.g., Transformative, Reflective, Energizing).
    
    OUTPUT: Valid JSON.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            event: { type: Type.STRING },
            date: { type: Type.STRING },
            vibe: { type: Type.STRING },
            influence: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['Transit', 'Moon', 'Retrograde', 'Eclipse'] }
          },
          required: ['event', 'date', 'vibe', 'influence', 'type']
        }
      }
    }
  });

  try {
    return cleanAndParseJSON(response.text);
  } catch (e) {
    console.error("Failed to fetch astro forecast", e);
    return [];
  }
};
