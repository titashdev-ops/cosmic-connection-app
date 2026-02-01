
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile, ASTRO_PROMPTS, PlanetaryPosition, AstroForecast } from '../types';
import { calculateAstrologyProfile, getAstroForecast } from '../services/geminiService';

import { 
  Settings as SettingsIcon, LogOut, Sun, Moon, ArrowUpCircle, MapPin, 
  Sparkle, Camera, Loader2, Zap, Gem, Stars, RefreshCcw, 
  CheckCircle2, CloudMoon, Database, History, Cpu, FileCode, Search, Orbit,
  Activity, Gauge, Layers, Binary, X, Heart, Flame, Wind, Droplets, Mountain, Ghost, Sparkles
} from 'lucide-react';

interface ProfileProps {
  user: UserProfile;
  onUpdate: (user: UserProfile) => void;
  onLogout: () => void;
}

type MainTab = 'essence' | 'forecasts' | 'ephemeris';

const ForecastSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="glass p-10 rounded-[3.5rem] border border-white/5 relative overflow-hidden skeleton-shimmer">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-3xl bg-white/5" />
          <div className="space-y-2">
            <div className="w-32 h-4 bg-white/10 rounded-full" />
            <div className="w-20 h-2 bg-white/5 rounded-full" />
          </div>
        </div>
        <div className="space-y-3 pl-6 border-l-2 border-white/5">
          <div className="w-full h-3 bg-white/5 rounded-full" />
          <div className="w-5/6 h-3 bg-white/5 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

const getPlanetIcon = (planet: string) => {
  switch (planet) {
    case 'Sun': return <Sun size={24} className="text-amber-400" />;
    case 'Moon': return <Moon size={24} className="text-slate-300" />;
    case 'Mercury': return <Wind size={24} className="text-emerald-400" />;
    case 'Venus': return <Heart size={24} className="text-rose-400" />;
    case 'Mars': return <Flame size={24} className="text-red-500" />;
    case 'Jupiter': return <Sparkles size={24} className="text-purple-400" />;
    case 'Saturn': return <Mountain size={24} className="text-stone-400" />;
    case 'Uranus': return <Zap size={24} className="text-cyan-400" />;
    case 'Neptune': return <Droplets size={24} className="text-blue-400" />;
    case 'Pluto': return <Ghost size={24} className="text-slate-500" />;
    case 'Ascendant': return <ArrowUpCircle size={24} className="text-indigo-400" />;
    default: return <Orbit size={24} className="text-slate-400" />;
  }
};

const Profile: React.FC<ProfileProps> = ({ user, onUpdate, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<MainTab>('essence');
  const [isSyncing, setIsSyncing] = useState(false);
  const [forecasts, setForecasts] = useState<AstroForecast[]>([]);
  const [loadingForecasts, setLoadingForecasts] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetaryPosition | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (forecasts.length === 0) fetchForecasts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = document.querySelectorAll('.reveal-on-scroll');
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [activeTab, forecasts]);

  const triggerHaptic = (pattern: number | number[]) => {
    if ('vibrate' in navigator) navigator.vibrate(pattern);
  };

  const fetchForecasts = async () => {
    setLoadingForecasts(true);
    try {
      const data = await getAstroForecast(user);
      setForecasts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingForecasts(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result as string;
        onUpdate({ ...user, avatar: base64Url });
        triggerHaptic(30);
      };
      reader.readAsDataURL(file);
    }
  };

  const syncDetailedChart = async () => {
    setIsSyncing(true);
    triggerHaptic(20);
    try {
      const data = await calculateAstrologyProfile(user.name, user.birthDate, user.birthTime, user.birthLocation);
      onUpdate({ ...user, ...data });
      fetchForecasts();
      triggerHaptic([30, 50, 30]);
    } catch (err) {
      alert("Synchronization failure. Stars obscured.");
    } finally {
      setIsSyncing(false);
    }
  };

  const hasDetailedData = user.natalChart && user.natalChart.length > 0;

  return (
    <div className="px-6 py-10 space-y-12 pb-36 view-enter" ref={scrollRef}>
      <div className="flex justify-between items-center px-4">
        <div>
          <h1 className="text-5xl font-serif font-black italic text-white drop-shadow-2xl celestial-text tracking-tight">The Oracle</h1>
          <p className="text-[10px] uppercase font-black tracking-[0.6em] text-indigo-500/60 mt-2">Cosmic Identity</p>
        </div>
        <button 
          onClick={() => { triggerHaptic(5); navigate('/settings'); }}
          className="p-4 glass rounded-[2rem] text-slate-400 hover:text-white transition-all active:scale-90"
        >
          <SettingsIcon size={24} />
        </button>
      </div>

      <div className="flex flex-col items-center text-center space-y-8 animate-in slide-in-from-top-6 duration-1000">
        <div className="relative group">
          <div className="relative overflow-hidden rounded-[4rem] w-52 h-52 border-[6px] border-white/5 shadow-[0_40px_80px_rgba(0,0,0,0.8)] glow-pulse-celestial">
            <img 
              src={user.avatar || user.images[0]} 
              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
            />
            <div 
              onClick={() => { triggerHaptic(5); fileInputRef.current?.click(); }}
              className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center backdrop-blur-md"
            >
              <Camera className="text-white" size={32} />
            </div>
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-indigo-600 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.4em] border-4 border-slate-950 text-white shadow-2xl z-10 whitespace-nowrap ring-1 ring-white/10">
            {user.sunSign} Orbit
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-center gap-3">
            <h2 className="text-5xl font-serif font-bold italic text-white tracking-tight drop-shadow-lg">{user.name}, {user.age}</h2>
            {user.isVerified && <CheckCircle2 size={24} className="text-indigo-400 drop-shadow-[0_0_10px_rgba(129,140,248,0.5)]" />}
          </div>
          <p className="text-slate-500 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.5em] font-black">
            <MapPin size={16} className="text-indigo-500" /> {user.birthLocation}
          </p>
        </div>
      </div>

      <div className="flex bg-slate-950/60 p-2 rounded-[2.5rem] border border-white/10 relative z-10 overflow-hidden shadow-2xl">
        {['essence', 'forecasts', 'ephemeris'].map((tab) => (
          <button 
            key={tab}
            onClick={() => { triggerHaptic(10); setActiveTab(tab as MainTab); }}
            className={`flex-1 py-5 rounded-[2rem] text-[10px] uppercase tracking-[0.3em] font-black transition-all relative z-20 ${activeTab === tab ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'essence' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="glass p-10 rounded-[3.5rem] border border-white/10 relative overflow-hidden group reveal-on-scroll">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
               <CloudMoon size={150} />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="relative shrink-0">
                <div className="w-28 h-28 rounded-full bg-slate-950 border border-white/5 flex items-center justify-center shadow-inner relative z-10">
                  <Moon size={56} className="text-indigo-300 animate-pulse" />
                </div>
                <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full scale-150" />
              </div>
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-black tracking-[0.5em] text-indigo-400/80">Lunar Phase</p>
                <h3 className="text-4xl font-serif font-bold italic text-white tracking-tight">Waxing Gibbous</h3>
                <p className="text-base text-slate-400 italic font-serif leading-relaxed">Channel your energy into expansion and manifestation.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Sun', sign: user.sunSign, icon: <Sun size={28} className="text-amber-400" /> },
              { label: 'Moon', sign: user.moonSign, icon: <Moon size={28} className="text-slate-300" /> },
              { label: 'Rising', sign: user.risingSign, icon: <ArrowUpCircle size={28} className="text-indigo-400" /> }
            ].map((node, i) => (
              <div key={i} className="glass p-6 rounded-[2.5rem] flex flex-col items-center text-center space-y-4 border-white/5 hover:border-indigo-500/20 transition-all hover:scale-105 reveal-on-scroll" style={{ transitionDelay: `${i * 0.15}s` }}>
                <div className="p-4 bg-slate-950 rounded-3xl shadow-inner border border-white/5">{node.icon}</div>
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{node.label}</span>
                  <span className="text-base font-bold text-white block tracking-tight">{node.sign}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="glass p-10 rounded-[3rem] space-y-6 relative overflow-hidden border border-white/5 reveal-on-scroll">
            <div className="absolute inset-0 shimmer opacity-10 pointer-events-none" />
            <div className="flex items-center justify-between relative z-10 border-b border-white/5 pb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400"><Sparkle size={20} /></div>
                <h3 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.5em]">Ethereal Narrative</h3>
              </div>
            </div>
            <p className="text-2xl italic text-slate-100 leading-9 font-serif relative z-10 px-2 drop-shadow-md">
              "{user.bio || "Searching for cosmic frequency..."}"
            </p>
          </div>
        </div>
      )}

      {activeTab === 'forecasts' && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
           {loadingForecasts ? (
              <ForecastSkeleton />
           ) : (
            <div className="space-y-8">
              {forecasts.map((f, i) => (
                <div key={i} className="glass p-10 rounded-[3.5rem] border border-white/10 relative overflow-hidden group hover:bg-white/5 transition-all reveal-on-scroll" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-5">
                      <div className="p-5 bg-slate-950 rounded-3xl border border-white/10 group-hover:scale-110 transition-transform shadow-2xl">
                        {f.type === 'Moon' ? <Moon className="text-indigo-400" /> : <Zap className="text-amber-400" />}
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-white tracking-tight">{f.event}</h4>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500/60">{f.date}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-4 py-2 rounded-full border border-indigo-500/30">
                      {f.vibe}
                    </span>
                  </div>
                  <p className="text-xl italic text-slate-200 leading-relaxed font-serif pl-6 border-l-2 border-indigo-500/40">
                    "{f.influence}"
                  </p>
                </div>
              ))}
            </div>
           )}
        </div>
      )}

      {activeTab === 'ephemeris' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
          <div className="glass p-10 rounded-[3.5rem] border border-white/10 relative overflow-hidden reveal-on-scroll">
            <div className="absolute inset-0 bg-indigo-500/5 skeleton-shimmer opacity-20" />
            <div className="flex flex-col items-center text-center space-y-8 relative z-10">
              <div className="p-6 bg-indigo-600/10 rounded-full border border-indigo-500/20 glow-pulse-celestial">
                <Database size={56} className="text-indigo-400" />
              </div>
              <div className="space-y-3">
                <h3 className="text-5xl font-serif font-bold italic text-white tracking-tight celestial-text">Swiss Ephemeris</h3>
                <p className="text-[10px] uppercase font-black tracking-[0.8em] text-indigo-500/60">High-Precision Engine</p>
              </div>
              <p className="text-base italic text-slate-400 font-serif leading-relaxed px-4">
                Powered by JPL DE431. Compressed from 2.8 GB to 99 MB with 0.001" milli-arcsecond accuracy.
              </p>
            </div>
          </div>

          {/* Natal Grid */}
          {hasDetailedData && (
             <div className="space-y-6 reveal-on-scroll">
               <h4 className="text-[11px] uppercase font-black tracking-[0.4em] text-indigo-400/80 flex items-center gap-3 px-6">
                  <Orbit size={16} /> Natal Nodes
               </h4>
               <div className="grid grid-cols-2 gap-4">
                {user.natalChart?.map((planet, idx) => (
                  <button
                    key={idx}
                    onClick={() => { triggerHaptic(10); setSelectedPlanet(planet); }}
                    className="glass p-5 rounded-[2.5rem] flex items-center gap-5 hover:bg-white/5 transition-all text-left group border border-white/5 active:scale-95"
                  >
                     <div className="p-4 bg-slate-950 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform shadow-lg">
                        {getPlanetIcon(planet.planet)}
                     </div>
                     <div>
                        <p className="text-lg font-serif font-bold italic text-white tracking-tight group-hover:text-indigo-300 transition-colors">{planet.planet}</p>
                        <p className="text-[10px] text-indigo-400/70 font-black uppercase tracking-[0.2em]">{planet.sign}</p>
                     </div>
                  </button>
                ))}
              </div>
             </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 reveal-on-scroll">
            <div className="glass p-8 rounded-[3rem] border border-white/5 space-y-5 hover:scale-[1.02] transition-transform group relative overflow-hidden">
               <div className="p-3 bg-rose-500/10 rounded-2xl w-fit text-rose-400"><Gauge size={24} /></div>
               <div className="space-y-1">
                 <h4 className="text-2xl font-serif font-bold italic text-white tracking-tight">Quantum Binary</h4>
                 <p className="text-sm italic text-slate-400 font-serif">50 Planetary & 50 Lunar files covering 30,000 years.</p>
               </div>
               <div className="absolute -bottom-4 -right-4 opacity-[0.05] group-hover:scale-125 transition-transform duration-1000">
                  <Binary size={120} />
               </div>
            </div>

            <div className="glass p-8 rounded-[3rem] border border-white/5 space-y-5 hover:scale-[1.02] transition-transform group relative overflow-hidden">
               <div className="p-3 bg-emerald-500/10 rounded-2xl w-fit text-emerald-400"><History size={24} /></div>
               <div className="space-y-1">
                 <h4 className="text-2xl font-serif font-bold italic text-white tracking-tight">Temporal Scope</h4>
                 <p className="text-sm italic text-slate-400 font-serif">Historical to astronomical year sequence support.</p>
               </div>
               <div className="absolute -bottom-4 -right-4 opacity-[0.05] group-hover:scale-125 transition-transform duration-1000">
                  <Activity size={120} />
               </div>
            </div>
          </div>
        </div>
      )}
      
      {selectedPlanet && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-3xl animate-in fade-in duration-300">
           <div className="w-full max-w-sm glass rounded-[3.5rem] p-8 border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] relative animate-in zoom-in-95 duration-500">
              <button 
                onClick={() => { triggerHaptic(5); setSelectedPlanet(null); }}
                className="absolute top-6 right-6 p-2 bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors"
              >
                 <X size={20} />
              </button>

              <div className="flex flex-col items-center gap-6 mb-8 mt-2">
                 <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500/30 blur-2xl rounded-full scale-150 animate-pulse" />
                    <div className="p-8 bg-slate-900 rounded-full border-2 border-indigo-500/20 shadow-2xl relative z-10">
                       {React.cloneElement(getPlanetIcon(selectedPlanet.planet), { size: 48, className: getPlanetIcon(selectedPlanet.planet).props.className + " animate-float-gentle" })}
                    </div>
                 </div>
                 <div className="text-center space-y-1">
                    <h3 className="text-4xl font-serif font-bold italic text-white tracking-tight">{selectedPlanet.planet}</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">{selectedPlanet.sign}</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="glass p-6 rounded-[2.5rem] border border-white/5 bg-white/[0.02]">
                    <div className="grid grid-cols-2 gap-y-6">
                       <div className="space-y-1">
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Position</p>
                          <p className="text-white font-mono text-sm tracking-wider">{selectedPlanet.degree}° {selectedPlanet.minute}'</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">House</p>
                          <p className="text-white font-mono text-sm tracking-wider">{selectedPlanet.house} (Placidus)</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Motion</p>
                          <p className={`${selectedPlanet.isRetrograde ? 'text-rose-400' : 'text-emerald-400'} text-xs font-bold uppercase tracking-wider`}>
                             {selectedPlanet.isRetrograde ? 'Retrograde' : 'Direct'}
                          </p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Element</p>
                          <p className="text-white text-xs font-bold uppercase tracking-wider">{selectedPlanet.element || 'Unknown'}</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
