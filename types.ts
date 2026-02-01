
export type ZodiacSign = 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export interface PlanetaryPosition {
  planet: string;
  sign: ZodiacSign;
  degree: number;
  minute: number;
  isRetrograde: boolean;
  house: number;
  dignity?: string; // Domicile, Exaltation, Detriment, Fall, or Neutral
  element?: 'Fire' | 'Earth' | 'Air' | 'Water';
}

export interface ChartAspect {
  planet1: string;
  planet2: string;
  type: 'Conjunction' | 'Sextile' | 'Square' | 'Trine' | 'Opposition';
  orb: number;
  description: string;
}

export interface AstroForecast {
  event: string;
  date: string;
  vibe: string;
  influence: string;
  type: 'Transit' | 'Moon' | 'Retrograde' | 'Eclipse';
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  birthDate: string;
  birthTime: string;
  birthLocation: string;
  sunSign: ZodiacSign;
  moonSign: string;
  risingSign: string;
  bio: string;
  prompts: { question: string; answer: string }[];
  images: string[];
  avatar: string | null;
  natalChart?: PlanetaryPosition[];
  aspects?: ChartAspect[];
  synthesis?: string;
  isVerified?: boolean;
}

export interface CompatibilityResult {
  score: number;
  summary: string;
  pros: string[];
  cons: string[];
  connectionType: 'Soulmate' | 'Twin Flame' | 'Karmic' | 'Steady';
  sunMoonAspect?: {
    title: string;
    description: string;
    vibe: string;
  };
  venusMarsAspect?: {
    title: string;
    description: string;
    vibe: string;
  };
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export interface Match {
  id: string;
  users: [string, string];
  compatibility: CompatibilityResult;
  lastMessage?: Message;
}

export const ASTRO_PROMPTS = [
  "What does your Moon sign reveal about your emotional needs?",
  "How does your Rising sign influence your first impression?",
  "What's the most 'Mercury retrograde' thing that's happened to you?",
  "My Sun sign makes me act like...",
  "If you want to win over my Venus, you should...",
  "The house placement I'm most proud of is...",
  "My Saturn return taught me that...",
  "The planet I most identify with is...",
  "My Jupiter placement brings me luck when...",
  "A typical day for my Mars in [Sign] looks like...",
  "My Midheaven suggests my true calling is...",
  "I'm looking for someone whose chart has a strong...",
  "My North Node journey has been about...",
  "The biggest cosmic lesson I've learned so far...",
  "How I handle a full moon in my sign...",
  "My Chiron placement shows my deepest healing is in...",
  "If our charts were a movie, the genre would be...",
  "My 7th House (Partnerships) says I value...",
  "My Neptune placement makes me dream of...",
  "The most Plutonian transformation I've undergone...",
  "My cosmic relationship goals include...",
  "Beyond the stars, what I seek in a partner is...",
  "The kind of energy I want to manifest in a companion...",
  "My ideal celestial partnership looks like...",
  "How my Venus sign shows love to a partner..."
];
