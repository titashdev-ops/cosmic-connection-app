
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, CompatibilityResult } from '../types';
import { Sparkles, MapPin, Star, Stars, MessageSquarePlus, Loader2, Info, X, CheckCircle2, AlertCircle, Sun, Moon, Zap, Heart, Gem, Flame, Wind, Droplets, Mountain, Sparkle, Target, Droplet, Quote } from 'lucide-react';
import { getIcebreaker } from '../services/geminiService';

interface MatchCardProps {
  currentUser: UserProfile;
  user: UserProfile;
  compatibility: CompatibilityResult;
  onLike: () => void;
  onPass: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ currentUser, user, compatibility, onLike, onPass }) => {
  const [icebreaker, setIcebreaker] = useState<string | null>(null);
  const [loadingIce, setLoadingIce] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null);
  const [isSparking, setIsSparking] = useState(false);
  const [cardRotate, setCardRotate] = useState({ x: 0, y: 0 });
  
  // Touch Swiping State
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchCurrent, setTouchCurrent] = useState<number | null>(null);
  const [hasTriggeredThresholdHaptic, setHasTriggeredThresholdHaptic] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const SWIPE_THRESHOLD = 120;

  const triggerHaptic = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const createBurst = (x: number, y: number) => {
    if (!burstRef.current) return;
    for (let i = 0; i < 15; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const tx = (Math.random() - 0.5) * 200;
      const ty = (Math.random() - 0.5) * 200;
      p.style.setProperty('--tx', `${tx}px`);
      p.style.setProperty('--ty', `${ty}px`);
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      p.style.background = Math.random() > 0.5 ? '#6366f1' : '#f472b6';
      burstRef.current.appendChild(p);
      setTimeout(() => p.remove(), 800);
    }
  };

  const handleAction = (type: 'like' | 'pass', e?: React.MouseEvent) => {
    if (type === 'like') {
      if (e) createBurst(e.clientX, e.clientY);
      triggerHaptic([40, 60, 40]); 
      setIsSparking(true);
      setTimeout(() => {
        setSwipeDir('right');
        setTimeout(() => {
          onLike();
          setSwipeDir(null);
          setIsSparking(false);
        }, 400);
      }, 400);
    } else {
      triggerHaptic(10); 
      setSwipeDir('left');
      setTimeout(() => {
        onPass();
        setSwipeDir(null);
      }, 400);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setHasTriggeredThresholdHaptic(false);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const current = e.touches[0].clientX;
    setTouchCurrent(current);
    
    const diff = current - touchStart;
    
    if (Math.abs(diff) > SWIPE_THRESHOLD && !hasTriggeredThresholdHaptic) {
      triggerHaptic(5);
      setHasTriggeredThresholdHaptic(true);
    } else if (Math.abs(diff) < SWIPE_THRESHOLD && hasTriggeredThresholdHaptic) {
      setHasTriggeredThresholdHaptic(false);
    }
  };

  const onTouchEnd = () => {
    if (touchStart === null || touchCurrent === null) {
      setTouchStart(null);
      setTouchCurrent(null);
      return;
    }

    const diff = touchCurrent - touchStart;
    if (diff > SWIPE_THRESHOLD) {
      handleAction('like');
    } else if (diff < -SWIPE_THRESHOLD) {
      handleAction('pass');
    }

    setTouchStart(null);
    setTouchCurrent(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || touchStart !== null) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 8;
    const rotateX = ((y / rect.height) - 0.5) * -8;
    setCardRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setCardRotate({ x: 0, y: 0 });
  };

  const handleGenerateIcebreaker = async () => {
    triggerHaptic(10);
    setLoadingIce(true);
    try {
      const result = await getIcebreaker(currentUser, user);
      setIcebreaker(result);
    } catch (error) {
      setIcebreaker("The stars are a bit hazy. Try again?");
    } finally {
      setLoadingIce(false);
    }
  };

  const dragX = touchStart !== null && touchCurrent !== null ? touchCurrent - touchStart : 0;
  const dragRotate = dragX / 20;
  const dragOpacity = Math.max(1 - Math.abs(dragX) / 800, 0.7);
  const parallaxX = dragX * -0.05; // Subtle background shift opposite to drag

  return (
    <div 
      className={`relative w-full max-w-md mx-auto h-[620px] perspective-1000 ${touchStart === null ? 'animate-float-subtle' : ''}`}
    >
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={`relative w-full h-full rounded-[3.5rem] overflow-hidden shadow-2xl glass transition-all duration-300 ease-out transform select-none
          ${swipeDir === 'left' ? '-translate-x-[150%] rotate-[-20deg] opacity-0' : ''}
          ${swipeDir === 'right' ? 'translate-x-[150%] rotate-[20deg] opacity-0' : ''}
          ${isSparking ? 'animate-spark' : ''}
        `}
        style={{ 
          transform: swipeDir ? undefined : `translateX(${dragX}px) rotateX(${cardRotate.x}deg) rotateY(${cardRotate.y + dragRotate}deg)`,
          opacity: swipeDir ? undefined : dragOpacity,
          cursor: touchStart !== null ? 'grabbing' : 'grab',
          willChange: 'transform, opacity'
        }}
      >
        <div ref={burstRef} className="particle-burst" />
        
        <div className="absolute top-0 left-0 w-full h-full group pointer-events-none overflow-hidden">
          <img 
            src={user.images[0]} 
            alt={user.name} 
            className="w-[110%] h-[110%] max-w-none object-cover transition-transform duration-1000 group-hover:scale-105"
            style={{ 
                transform: `translateX(${parallaxX}px) scale(1.1)`,
                transition: touchStart === null ? 'transform 1s ease-out' : 'none'
            }}
          />

          {/* Dynamic Cosmic Overlay Layer - Reacts to Tilt */}
          <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-60 transition-transform duration-200 ease-out"
               style={{ transform: `translate(${cardRotate.y * 1.5}px, ${cardRotate.x * 1.5}px)` }}>
              {/* Nebula Clouds */}
              <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/30 blur-[60px] rounded-full animate-pulse" style={{ animationDuration: '8s' }} />
              <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] bg-rose-500/20 blur-[80px] rounded-full animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
          </div>

          {/* Star Particles Layer - Different Parallax for Depth */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-80 transition-transform duration-200 ease-out"
               style={{ transform: `translate(${cardRotate.y * 0.8}px, ${cardRotate.x * 0.8}px)` }}>
              <div className="absolute top-[20%] right-[20%] w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDuration: '3s' }} />
              <div className="absolute top-[60%] left-[15%] w-0.5 h-0.5 bg-amber-200 rounded-full animate-pulse" style={{ animationDuration: '2s' }} />
              <div className="absolute bottom-[30%] right-[30%] w-1 h-1 bg-indigo-200 rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
              
              {/* Scattered Stars */}
              {[...Array(8)].map((_, i) => (
                <div key={i} className="absolute w-[2px] h-[2px] bg-white/70 rounded-full animate-pulse" 
                     style={{ 
                       top: `${(i * 13 + 7) % 100}%`, 
                       left: `${(i * 23 + 3) % 100}%`, 
                       animationDelay: `${i * 0.5}s`,
                       animationDuration: `${2 + (i % 3)}s`
                     }} 
                />
              ))}
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          <div className="absolute inset-0 shimmer opacity-20" />
        </div>

        {Math.abs(dragX) > 20 && !swipeDir && (
          <div className="absolute top-24 inset-x-0 flex justify-center pointer-events-none z-20">
            {dragX > 0 ? (
              <div className="bg-indigo-600/90 text-white px-8 py-3 rounded-full font-black uppercase tracking-[0.4em] shadow-2xl animate-cinematic-pop scale-110 rotate-12 border-4 border-indigo-400/50 backdrop-blur-md">
                Spark
              </div>
            ) : (
              <div className="bg-slate-800/90 text-white px-8 py-3 rounded-full font-black uppercase tracking-[0.4em] shadow-2xl animate-cinematic-pop scale-110 -rotate-12 border-4 border-slate-600/50 backdrop-blur-md">
                Skip
              </div>
            )}
          </div>
        )}

        <div className="absolute top-6 right-6 z-10">
          <div 
            onClick={(e) => { triggerHaptic(5); e.stopPropagation(); setShowBreakdown(true); }}
            className="bg-amber-400/90 text-slate-900 px-6 py-2.5 rounded-full font-black flex items-center gap-2 shadow-2xl glow-pulse-celestial cursor-pointer hover:scale-110 transition-transform active:scale-95 glass-interactive"
          >
            <Sparkles size={18} />
            <span className="text-xs uppercase tracking-widest">{compatibility.score}% Match</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-10 text-white space-y-6 pointer-events-none">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-6xl font-serif font-bold italic tracking-tighter drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
              {user.name}, {user.age}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-4 text-slate-200">
              <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-colors shadow-lg">
                <Sun size={14} className="text-amber-400" /> {user.sunSign}
              </span>
              <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-colors shadow-lg">
                <Moon size={14} className="text-slate-300" /> {user.moonSign}
              </span>
              <span className="flex items-center gap-2 text-xs font-medium tracking-wide">
                <MapPin size={16} className="text-indigo-400" /> {user.birthLocation}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {icebreaker ? (
              <div className="bg-indigo-600/40 border border-indigo-400/40 rounded-[2rem] p-6 backdrop-blur-xl animate-cinematic-pop shadow-2xl ring-1 ring-white/10">
                <p className="text-[10px] uppercase tracking-[0.3em] text-indigo-300 font-black mb-3 flex items-center gap-2">
                  <Sparkle size={12} className="animate-spin-slow" /> Synastry Fragment
                </p>
                <p className="text-xl italic text-white font-serif leading-relaxed">
                  "{icebreaker}"
                </p>
              </div>
            ) : (
               <div 
                onClick={(e) => { e.stopPropagation(); setShowBreakdown(true); }}
                className="glass-interactive bg-slate-900/40 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl hover:bg-slate-900/60 cursor-pointer pointer-events-auto shadow-lg"
               >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-black group-hover:translate-x-1 transition-transform">Orbital resonance</p>
                  <div className="flex gap-1">
                     {[...Array(3)].map((_, i) => <div key={i} className="w-1 h-1 bg-amber-400/40 rounded-full animate-pulse" style={{ animationDelay: `${i*0.2}s` }} />)}
                  </div>
                </div>
                <p className="text-lg italic text-slate-100 line-clamp-2 leading-relaxed font-serif">"{compatibility.summary}"</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 pointer-events-auto">
            <button 
              onClick={() => handleAction('pass')} 
              className="group relative bg-slate-800/60 hover:bg-slate-700/80 text-white py-6 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all border border-white/10 active:scale-95 overflow-hidden hover:shadow-lg backdrop-blur-md"
            >
              <span className="relative z-10">Pass</span>
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button 
              onClick={(e) => handleAction('like', e)} 
              className="group relative bg-indigo-600 hover:bg-indigo-500 text-white py-6 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-[0_20px_40px_rgba(79,70,229,0.3)] border border-indigo-400/40 active:scale-95 overflow-hidden hover:shadow-[0_20px_50px_rgba(79,70,229,0.5)] backdrop-blur-md"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Spark <Heart size={16} className="fill-current animate-pulse" />
              </span>
              <div className="absolute inset-0 shimmer opacity-20" />
            </button>
          </div>
        </div>
      </div>

      {showBreakdown && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-3xl animate-in fade-in duration-500">
          <div className="relative w-full max-w-sm glass rounded-[3.5rem] p-8 shadow-[0_0_100px_rgba(0,0,0,1)] border border-white/10 space-y-8 animate-cinematic-pop max-h-[90vh] overflow-y-auto no-scrollbar">
            <button 
              onClick={() => { triggerHaptic(5); setShowBreakdown(false); }}
              className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors bg-white/5 rounded-full hover:bg-white/10 z-20"
            >
              <X size={20} />
            </button>

            {/* Header / Score */}
            <div className="text-center space-y-4 pt-4">
                <div className="relative inline-flex flex-col items-center justify-center">
                    {/* Animated Rings */}
                    <div className="absolute inset-0 m-auto w-32 h-32 border-2 border-indigo-500/20 rounded-full animate-ping opacity-20" />
                    <div className="absolute inset-0 m-auto w-28 h-28 border border-indigo-400/30 rounded-full animate-[spin_10s_linear_infinite]" />
                    
                    <div className="relative w-24 h-24 bg-slate-900 rounded-full border border-indigo-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                        <span className="text-4xl font-black text-white tracking-tighter stardust-gradient">{compatibility.score}%</span>
                    </div>
                    
                    <div className="absolute -bottom-3 bg-indigo-600 px-5 py-1.5 rounded-full border-2 border-slate-900 shadow-xl">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">{compatibility.connectionType}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {/* Summary */}
                <div className="glass p-8 rounded-[2.5rem] border border-white/10 bg-indigo-500/5 text-center stagger-1 animate-in slide-in-from-bottom-4 fade-in duration-500">
                    <Quote className="mx-auto text-indigo-500/30 mb-3" size={24} />
                    <p className="text-lg italic text-slate-100 leading-8 font-serif">
                    "{compatibility.summary}"
                    </p>
                </div>

                {/* Aspects Visuals */}
                {(compatibility.sunMoonAspect || compatibility.venusMarsAspect) && (
                    <div className="space-y-4 stagger-2 animate-in slide-in-from-bottom-4 fade-in duration-500">
                        <h4 className="text-[11px] uppercase tracking-[0.4em] text-slate-500 font-black ml-4">Planetary Geometry</h4>
                        <div className="grid grid-cols-1 gap-4">
                            {/* Sun-Moon Card */}
                            {compatibility.sunMoonAspect && (
                                <div className="glass p-6 rounded-[2.5rem] flex gap-5 items-center relative overflow-hidden group border border-white/5 hover:bg-white/5 transition-all">
                                    <div className="absolute right-0 top-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity"><Sun size={100} /></div>
                                    <div className="flex flex-col items-center gap-1 shrink-0">
                                        <div className="flex -space-x-4">
                                            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg"><Sun size={20} /></div>
                                            <div className="w-12 h-12 rounded-full bg-slate-700/50 border border-slate-600/40 flex items-center justify-center text-slate-300 shadow-lg"><Moon size={20} /></div>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 relative z-10">
                                        <div className="flex items-center gap-2">
                                            <h5 className="text-sm font-bold text-white uppercase tracking-wider">{compatibility.sunMoonAspect.title}</h5>
                                            <span className="text-[9px] font-black bg-white/10 px-2 py-0.5 rounded text-slate-300 uppercase tracking-wide">{compatibility.sunMoonAspect.vibe}</span>
                                        </div>
                                        <p className="text-xs text-slate-400 leading-relaxed font-medium">{compatibility.sunMoonAspect.description}</p>
                                    </div>
                                </div>
                            )}

                                {/* Venus-Mars Card */}
                            {compatibility.venusMarsAspect && (
                                <div className="glass p-6 rounded-[2.5rem] flex gap-5 items-center relative overflow-hidden group border border-white/5 hover:bg-white/5 transition-all">
                                    <div className="absolute right-0 top-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity"><Heart size={100} /></div>
                                    <div className="flex flex-col items-center gap-1 shrink-0">
                                        <div className="flex -space-x-4">
                                            <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-lg"><Heart size={20} /></div>
                                            <div className="w-12 h-12 rounded-full bg-red-600/20 border border-red-600/40 flex items-center justify-center text-red-500 shadow-lg"><Flame size={20} /></div>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 relative z-10">
                                        <div className="flex items-center gap-2">
                                            <h5 className="text-sm font-bold text-white uppercase tracking-wider">{compatibility.venusMarsAspect.title}</h5>
                                            <span className="text-[9px] font-black bg-white/10 px-2 py-0.5 rounded text-slate-300 uppercase tracking-wide">{compatibility.venusMarsAspect.vibe}</span>
                                        </div>
                                        <p className="text-xs text-slate-400 leading-relaxed font-medium">{compatibility.venusMarsAspect.description}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Pros */}
                <div className="space-y-4 stagger-3 animate-in slide-in-from-bottom-4 fade-in duration-500">
                    <h4 className="text-[11px] uppercase tracking-[0.4em] text-emerald-400 font-black flex items-center gap-2 ml-4">
                        <CheckCircle2 size={16} /> Harmonious Nodes
                    </h4>
                    <div className="space-y-2">
                        {compatibility.pros.map((pro, i) => (
                            <div key={i} className="flex items-start gap-4 p-5 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10">
                                <Gem size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                                <p className="text-sm text-slate-300 font-medium leading-relaxed">{pro}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cons */}
                <div className="space-y-4 stagger-4 animate-in slide-in-from-bottom-4 fade-in duration-500">
                    <h4 className="text-[11px] uppercase tracking-[0.4em] text-amber-500 font-black flex items-center gap-2 ml-4">
                        <AlertCircle size={16} /> Transit Friction
                    </h4>
                    <div className="space-y-2">
                        {compatibility.cons.map((con, i) => (
                            <div key={i} className="flex items-start gap-4 p-5 rounded-[2rem] bg-amber-500/5 border border-amber-500/10">
                                <Flame size={16} className="text-amber-400 mt-0.5 shrink-0" />
                                <p className="text-sm text-slate-300 font-medium leading-relaxed">{con}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <button 
              onClick={() => { triggerHaptic(5); setShowBreakdown(false); }}
              className="w-full bg-white/5 hover:bg-indigo-600/10 text-slate-400 hover:text-white py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.5em] border border-white/10 hover:border-indigo-500/50 transition-all active:scale-95"
            >
              Close Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchCard;
