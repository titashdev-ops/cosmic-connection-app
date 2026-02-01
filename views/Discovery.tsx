
import React, { useState, useEffect } from 'react';
import { UserProfile, CompatibilityResult, PlanetaryPosition, ZodiacSign } from '../types';
import MatchCard from '../components/MatchCard';
import { getMatchCompatibility } from '../services/geminiService';
import { Sparkles, RefreshCcw, Loader2, Stars, Heart, Sparkle, X, Zap } from 'lucide-react';

const MOCK_PROFILES: Partial<UserProfile>[] = [
  { name: 'Aria', age: 24, sunSign: 'Libra', bio: 'Art enthusiast and candle collector.', images: ['https://picsum.photos/600/800?random=11'], birthDate: '1999-10-05', birthTime: '08:45', birthLocation: 'New York, NY' },
  { name: 'Leo', age: 28, sunSign: 'Leo', bio: 'Living life at maximum volume.', images: ['https://picsum.photos/600/800?random=12'], birthDate: '1995-08-12', birthTime: '14:20', birthLocation: 'Los Angeles, CA' },
  { name: 'Luna', age: 26, sunSign: 'Pisces', bio: 'Dreaming of empathy.', images: ['https://picsum.photos/600/800?random=13'], birthDate: '1997-03-01', birthTime: '23:10', birthLocation: 'London, UK' },
  { name: 'Ethan', age: 30, sunSign: 'Capricorn', bio: 'Building legacies.', images: ['https://picsum.photos/600/800?random=14'], birthDate: '1993-01-15', birthTime: '04:00', birthLocation: 'Chicago, IL' },
];

const generateMockChart = (sunSign: string): PlanetaryPosition[] => [
  { planet: 'Sun', sign: sunSign as ZodiacSign, degree: 15, minute: 0, isRetrograde: false, house: 1 },
  { planet: 'Moon', sign: 'Scorpio', degree: 10, minute: 30, isRetrograde: false, house: 4 },
  { planet: 'Mercury', sign: sunSign as ZodiacSign, degree: 12, minute: 0, isRetrograde: true, house: 1 },
  { planet: 'Venus', sign: 'Libra', degree: 22, minute: 15, isRetrograde: false, house: 2 },
  { planet: 'Mars', sign: 'Aries', degree: 12, minute: 45, isRetrograde: false, house: 5 },
  { planet: 'Ascendant', sign: 'Leo', degree: 5, minute: 0, isRetrograde: false, house: 1 },
];

const DiscoverySkeleton = () => (
  <div className="w-full h-full rounded-[4rem] glass-thick flex flex-col items-center justify-center gap-14 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] border border-white/5 relative skeleton-shimmer">
    <div className="relative flex items-center justify-center">
      <div className="absolute w-48 h-48 border-2 border-dashed border-indigo-500/10 rounded-full animate-[spin_20s_linear_infinite]" />
      <div className="relative z-10 p-10 bg-indigo-600/10 rounded-full border border-indigo-500/20 glow-pulse-celestial shadow-[0_0_80px_rgba(99,102,241,0.2)]">
        <Stars className="text-indigo-400" size={64} />
      </div>
    </div>
    <div className="text-center space-y-6">
      <div className="space-y-2">
        <p className="text-[12px] uppercase font-black tracking-[0.8em] stardust-gradient">Mapping Soul Nodes</p>
        <div className="w-24 h-1 bg-white/10 rounded-full mx-auto" />
      </div>
      <p className="text-xs text-slate-500 font-serif italic max-w-xs px-10 leading-relaxed">The Oracle is synthesizing your synastry aspects through high-precision ephemeris data.</p>
    </div>
  </div>
);

const Discovery: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [compResults, setCompResults] = useState<Record<string, CompatibilityResult>>({});
  const [loading, setLoading] = useState(true);
  const [showMatchModal, setShowMatchModal] = useState<UserProfile | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fullProfiles = MOCK_PROFILES.map((p, i) => ({
      ...p,
      id: `mock-${i}`,
      gender: i % 2 === 0 ? 'Woman' : 'Man',
      moonSign: 'Scorpio',
      risingSign: 'Leo',
      prompts: [],
      images: p.images || [],
      avatar: null,
      natalChart: generateMockChart(p.sunSign || 'Aries')
    } as UserProfile));
    
    setProfiles(fullProfiles);
    if (fullProfiles.length > 0) {
      analyzeCompatibility(fullProfiles[0]);
    }
  }, []);

  const triggerHaptic = (pattern: number | number[]) => {
    if ('vibrate' in navigator) navigator.vibrate(pattern);
  };

  const analyzeCompatibility = async (target: UserProfile) => {
    setLoading(true);
    setError(false);
    try {
      const res = await getMatchCompatibility(user, target);
      setCompResults(prev => ({ ...prev, [target.id]: res }));
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setTimeout(() => setLoading(false), 1500);
    }
  };

  const handleLike = () => {
    const current = profiles[currentIndex];
    if (Math.random() > 0.4) {
      triggerHaptic([40, 60, 40, 60, 40]); 
      setShowMatchModal(current);
    } else {
      next();
    }
  };

  const next = () => {
    const nextIdx = currentIndex + 1;
    if (nextIdx < profiles.length) {
      setCurrentIndex(nextIdx);
      analyzeCompatibility(profiles[nextIdx]);
    } else {
      setCurrentIndex(profiles.length);
    }
  };

  if (currentIndex >= profiles.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center p-10 space-y-12 view-enter">
        <div className="relative p-12 glass rounded-full border border-indigo-500/20">
          <RefreshCcw size={100} className="text-indigo-500/10 animate-[spin_30s_linear_infinite]" />
          <div className="absolute inset-0 flex items-center justify-center">
             <Stars size={56} className="text-indigo-400 animate-pulse" />
          </div>
        </div>
        <div className="space-y-4 max-w-sm">
          <h2 className="text-5xl font-serif italic text-white leading-tight stardust-gradient">Nebulae Drifting</h2>
          <p className="text-slate-500 text-base leading-relaxed italic font-serif px-6 text-center">The galactic currents are shifting. Return shortly to explore new orbital crossings.</p>
        </div>
        <button 
          onClick={() => { triggerHaptic(15); setCurrentIndex(0); analyzeCompatibility(profiles[0]); }} 
          className="bg-indigo-600 text-white px-14 py-6 rounded-full font-black uppercase tracking-[0.5em] text-[11px] shadow-[0_20px_50px_rgba(79,70,229,0.3)] transition-all hover:scale-105 active:scale-95"
        >
          Reset Cosmic Cycle
        </button>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];
  const compatibility = compResults[currentProfile?.id];

  return (
    <div className="px-6 py-10 space-y-10 view-enter min-h-screen">
      <div className="flex justify-between items-center px-4">
        <div>
          <h1 className="text-4xl font-serif font-black italic flex items-center gap-4 text-white drop-shadow-2xl celestial-text">
            Discovery <Sparkles size={28} className="text-rose-400 animate-pulse" />
          </h1>
          <p className="text-[11px] uppercase font-black tracking-[0.6em] text-indigo-500/60 mt-1">Stellar Alignments</p>
        </div>
        <div className="p-3.5 glass rounded-2xl border border-indigo-500/30 text-indigo-400 glow-pulse-celestial">
           <Zap size={24} className="animate-pulse" />
        </div>
      </div>

      <div className="relative h-[620px]">
        {loading ? (
          <DiscoverySkeleton />
        ) : error ? (
           <div className="w-full h-full rounded-[4rem] glass-thick flex flex-col items-center justify-center gap-6 p-10 border border-white/5">
             <div className="p-8 bg-amber-500/10 rounded-full border border-amber-500/20">
               <Zap size={48} className="text-amber-400" />
             </div>
             <p className="text-center text-slate-400 font-serif italic">Celestial interference detected. Unable to calculate synastry.</p>
             <button onClick={() => analyzeCompatibility(currentProfile)} className="px-8 py-4 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/20">Retry Signal</button>
             <button onClick={next} className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Skip to Next</button>
           </div>
        ) : (
          compatibility && (
            <MatchCard 
              currentUser={user}
              user={currentProfile} 
              compatibility={compatibility} 
              onLike={handleLike}
              onPass={next}
            />
          )
        )}
      </div>

      {showMatchModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-[60px] animate-in fade-in duration-700">
          <div className="absolute inset-0 overflow-hidden">
             {[...Array(20)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-1 h-1 bg-indigo-400 rounded-full animate-float-gentle opacity-20"
                  style={{ top: `${Math.random()*100}%`, left: `${Math.random()*100}%`, animationDelay: `${Math.random()*5}s` }}
                />
             ))}
             <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                <line x1="20%" y1="20%" x2="80%" y2="80%" stroke="white" strokeWidth="1" strokeDasharray="5,5" className="animate-pulse" />
                <line x1="10%" y1="70%" x2="90%" y2="30%" stroke="white" strokeWidth="1" strokeDasharray="5,5" className="animate-pulse" style={{animationDelay: '1s'}} />
             </svg>
          </div>

          <div className="relative w-full max-w-sm flex flex-col items-center space-y-14 text-center">
            <div className="space-y-6 animate-in zoom-in-50 duration-1000">
              <div className="relative inline-flex p-10 bg-indigo-600/10 rounded-full border border-indigo-500/30 shadow-[0_0_120px_rgba(79,70,229,0.5)]">
                <Heart size={80} className="text-indigo-400 fill-indigo-400 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h2 className="text-6xl font-serif font-black italic text-white stardust-gradient tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,1)]">Destiny Aligned</h2>
                <p className="text-[12px] uppercase font-black tracking-[0.8em] text-indigo-300 opacity-60">Quantum Resonance Achieved</p>
              </div>
            </div>

            <div className="flex items-center gap-10">
               <div className="relative group perspective-1000">
                 <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-indigo-500/40 shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-y-12">
                    <img src={user.avatar || user.images[0]} className="w-full h-full object-cover" />
                 </div>
               </div>

               <div className="relative">
                  <Sparkles size={32} className="text-amber-400 animate-spin-slow opacity-80" />
                  <div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full" />
               </div>

               <div className="relative group perspective-1000">
                 <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-rose-500/40 shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:-rotate-y-12">
                    <img src={showMatchModal.images[0]} className="w-full h-full object-cover" />
                 </div>
               </div>
            </div>

            <div className="space-y-10 w-full px-4 animate-in fade-in slide-in-from-bottom-12 duration-1000">
               <p className="text-xl italic text-slate-100 font-serif leading-relaxed px-8">
                  "Your planetary nodes have intersected. This connection represents a rare harmonic crossing."
               </p>
               <button 
                onClick={() => { triggerHaptic(15); setShowMatchModal(null); next(); }}
                className="w-full bg-indigo-600 text-white py-7 rounded-[2.5rem] font-black uppercase tracking-[0.5em] text-[12px] shadow-[0_20px_60px_rgba(79,70,229,0.5)] transition-all active:scale-95 liquid-border"
               >
                 Channel Connection
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discovery;
