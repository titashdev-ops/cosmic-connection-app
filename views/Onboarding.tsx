
import React, { useState, useEffect } from 'react';
import { calculateAstrologyProfile } from '../services/geminiService';
import { UserProfile, ZodiacSign, ASTRO_PROMPTS } from '../types';
import { Sparkles, Stars, Send, PlusCircle, XCircle, RefreshCw, User, Calendar, MapPin, Info, Compass, Loader2, Zap, Eye, Ghost, BookOpen, Target } from 'lucide-react';

interface OnboardingProps {
  onComplete: (user: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Consulting Oracle");
  const [placeholderSeed, setPlaceholderSeed] = useState(Math.floor(Math.random() * 1000));
  const [isRevealingImage, setIsRevealingImage] = useState(false);
  
  const manifestationMessages = [
    "Consulting Swiss Ephemeris files...",
    "Mapping DE431 Planetary Nodes...",
    "Calculating Synastry Orbs...",
    "Reaching across the 12th house...",
    "Synthesizing soul architecture...",
    "Materializing earthly fragment..."
  ];

  const [formData, setFormData] = useState({
    name: '',
    age: 25,
    gender: 'Woman',
    birthDate: '',
    birthTime: '',
    birthLocation: '',
    bio: ''
  });

  const triggerHaptic = (pattern: number | number[]) => {
    if ('vibrate' in navigator) navigator.vibrate(pattern);
  };
  
  const [userPrompts, setUserPrompts] = useState<{ question: string; answer: string }[]>([
    { question: ASTRO_PROMPTS[0], answer: '' }
  ]);

  const placeholderUrl = `https://picsum.photos/seed/${placeholderSeed}/600/800`;

  // Cycle loading messages
  useEffect(() => {
    let interval: number;
    if (loading) {
      let i = 0;
      interval = window.setInterval(() => {
        i = (i + 1) % manifestationMessages.length;
        setLoadingText(manifestationMessages[i]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleNext = () => {
    triggerHaptic(10);
    if (step === 3) {
      setIsRevealingImage(true);
      setTimeout(() => {
        setIsRevealingImage(false);
        setStep(step + 1);
      }, 1500);
    } else {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.birthDate || !formData.birthTime || !formData.birthLocation) {
      alert("The stars require precision. Please complete all birth coordinates (Date, Time, Location).");
      return;
    }
    
    setLoading(true);
    triggerHaptic([50, 30, 50]);
    try {
      const astro = await calculateAstrologyProfile(
        formData.name,
        formData.birthDate,
        formData.birthTime,
        formData.birthLocation
      );

      const newUser: UserProfile = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        sunSign: astro.sunSign as ZodiacSign,
        moonSign: astro.moonSign,
        risingSign: astro.risingSign,
        natalChart: astro.natalChart,
        images: [placeholderUrl],
        avatar: null,
        prompts: userPrompts.filter(p => p.answer.trim().length > 0)
      };

      onComplete(newUser);
    } catch (err) {
      console.error(err);
      alert("Celestial disturbance detected (API Error). Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Identity Fragment",
      subtitle: "Materialize your physical name.",
      icon: <User className="text-indigo-400" size={28} />,
      content: (
        <div className="space-y-8 animate-cinematic-pop">
          <div className="space-y-4 stagger-1">
            <label className="text-[10px] uppercase tracking-[0.5em] font-black text-indigo-400/70 ml-2">Vessel Name</label>
            <div className="glass-interactive rounded-[2.5rem]">
              <input 
                autoFocus
                className="w-full bg-slate-900/40 border border-white/10 p-6 rounded-[2.5rem] focus:ring-2 focus:ring-indigo-500/50 outline-none text-white text-2xl font-serif italic transition-all shadow-inner placeholder:text-slate-600" 
                placeholder="Your Earthly Designation"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 stagger-2">
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.5em] font-black text-indigo-400/70 ml-2">Solar Age</label>
              <div className="glass-interactive rounded-[2.5rem]">
                <input 
                  type="number"
                  className="w-full bg-slate-900/40 border border-white/10 p-6 rounded-[2.5rem] focus:ring-2 focus:ring-indigo-500/50 outline-none text-white text-xl font-serif transition-all shadow-inner" 
                  value={formData.age}
                  onChange={e => setFormData({...formData, age: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            <div className="space-y-4 relative">
              <label className="text-[10px] uppercase tracking-[0.5em] font-black text-indigo-400/70 ml-2">Core Vibration</label>
              <div className="glass-interactive rounded-[2.5rem]">
                <select 
                  className="w-full bg-slate-900/40 border border-white/10 p-6 rounded-[2.5rem] focus:ring-2 focus:ring-indigo-500/50 outline-none text-white text-lg font-serif italic appearance-none shadow-inner"
                  value={formData.gender}
                  onChange={e => setFormData({...formData, gender: e.target.value})}
                >
                  <option value="Woman">Woman</option>
                  <option value="Man">Man</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Ethereal">Ethereal</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Temporal Anchor",
      subtitle: "The moment the stars caught you.",
      icon: <Calendar className="text-amber-400" size={28} />,
      content: (
        <div className="space-y-8 animate-cinematic-pop">
          <div className="space-y-4 stagger-1">
            <label className="text-[10px] uppercase tracking-[0.5em] font-black text-amber-500/70 ml-2">Birth Rotation</label>
            <div className="glass-interactive rounded-[2.5rem]">
              <input 
                type="date"
                className="w-full bg-slate-900/40 border border-white/10 p-6 rounded-[2.5rem] focus:ring-2 focus:ring-amber-500/50 outline-none text-white text-2xl font-serif shadow-inner invert-calendar-icon" 
                value={formData.birthDate}
                onChange={e => setFormData({...formData, birthDate: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-4 stagger-2">
            <label className="text-[10px] uppercase tracking-[0.5em] font-black text-amber-500/70 ml-2">Planetary Second</label>
            <div className="glass-interactive rounded-[2.5rem]">
              <input 
                type="time"
                className="w-full bg-slate-900/40 border border-white/10 p-6 rounded-[2.5rem] focus:ring-2 focus:ring-amber-500/50 outline-none text-white text-2xl font-serif shadow-inner" 
                value={formData.birthTime}
                onChange={e => setFormData({...formData, birthTime: e.target.value})}
              />
            </div>
            <p className="text-[9px] text-slate-500 italic ml-4">*Required for Ascendant calculation</p>
          </div>
        </div>
      )
    },
    {
      title: "Nodal Genesis",
      subtitle: "Where your energy crystallized.",
      icon: <MapPin className="text-emerald-400" size={28} />,
      content: (
        <div className="space-y-8 animate-cinematic-pop">
          <div className="space-y-4 stagger-1">
            <label className="text-[10px] uppercase tracking-[0.5em] font-black text-emerald-500/70 ml-2">Birth Coordinates</label>
            <div className="glass-interactive rounded-[2.5rem]">
              <input 
                className="w-full bg-slate-900/40 border border-white/10 p-6 rounded-[2.5rem] focus:ring-2 focus:ring-emerald-500/50 outline-none text-white text-2xl font-serif italic shadow-inner placeholder:text-slate-600" 
                placeholder="City, Country"
                value={formData.birthLocation}
                onChange={e => setFormData({...formData, birthLocation: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-4 stagger-2">
            <label className="text-[10px] uppercase tracking-[0.5em] font-black text-emerald-500/70 ml-2">Soul Signature</label>
            <div className="glass-interactive rounded-[2.5rem]">
              <textarea 
                className="w-full bg-slate-900/40 border border-white/10 p-6 rounded-[2.5rem] focus:ring-2 focus:ring-emerald-500/50 outline-none h-44 text-white font-serif italic resize-none shadow-inner leading-relaxed placeholder:text-slate-600" 
                placeholder="Describe your current energetic transit..."
                value={formData.bio}
                onChange={e => setFormData({...formData, bio: e.target.value})}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Manifest Form",
      subtitle: "Materializing your visual projection.",
      icon: <Eye className="text-indigo-400" size={28} />,
      content: (
        <div className="flex flex-col items-center gap-10 animate-cinematic-pop">
          <div className="relative group stagger-1">
            <div className="w-64 h-80 rounded-[3.5rem] overflow-hidden border-8 border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative bg-slate-900">
              {isRevealingImage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-950/80 backdrop-blur-3xl z-30 transition-all">
                  <div className="relative">
                    <Loader2 className="animate-spin text-indigo-400" size={48} />
                    <Stars className="absolute inset-0 m-auto text-white/20 animate-pulse" size={20} />
                  </div>
                </div>
              )}
              <img 
                src={placeholderUrl} 
                className={`w-full h-full object-cover transition-all duration-[2s] ${isRevealingImage ? 'blur-2xl scale-125' : 'blur-0 scale-100'}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
            </div>
            <button 
              onClick={() => {
                triggerHaptic(20);
                setIsRevealingImage(true);
                setTimeout(() => {
                  setPlaceholderSeed(Math.floor(Math.random() * 1000));
                  setIsRevealingImage(false);
                }, 1000);
              }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-indigo-600 p-6 rounded-[2rem] text-white shadow-[0_20px_40px_rgba(79,70,229,0.5)] hover:bg-indigo-500 transition-all hover:scale-110 active:scale-90 group"
            >
              <RefreshCw size={24} className={`${isRevealingImage ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
            </button>
          </div>
          <div className="max-w-xs text-center stagger-2">
             <p className="text-[10px] uppercase font-black tracking-[0.4em] text-indigo-400 mb-2">Oracle Suggestion</p>
             <p className="text-sm text-slate-400 italic font-serif leading-relaxed px-4">
               "This visual echo resonates with Fragment {placeholderSeed}. Choose your form wisely."
             </p>
          </div>
        </div>
      )
    },
    {
      title: "Soul Insights",
      subtitle: "Charting your emotional nodes.",
      icon: <Target className="text-amber-400" size={28} />,
      content: (
        <div className="space-y-6 max-h-[440px] overflow-y-auto pr-4 no-scrollbar animate-cinematic-pop pb-16">
          {userPrompts.map((p, idx) => (
            <div key={idx} className={`bg-slate-900/40 rounded-[2.5rem] border border-white/10 p-2 transition-all hover:border-indigo-500/40 ring-1 ring-white/5 animate-in fade-in slide-in-from-bottom-4 duration-500`} style={{ animationDelay: `${idx * 150}ms` }}>
              <select 
                className="w-full bg-transparent p-6 rounded-t-[2.5rem] outline-none text-base font-serif italic text-indigo-300 appearance-none border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors"
                value={p.question}
                onChange={e => updatePrompt(idx, 'question', e.target.value)}
              >
                {ASTRO_PROMPTS.map(q => <option key={q} value={q} className="bg-slate-950 text-slate-400">{q}</option>)}
              </select>
              <textarea 
                className="w-full bg-transparent p-6 rounded-b-[2.5rem] outline-none h-32 text-base text-white resize-none italic leading-relaxed placeholder:text-slate-600" 
                placeholder="Compose your cosmic truth..."
                value={p.answer}
                onChange={e => updatePrompt(idx, 'answer', e.target.value)}
              />
            </div>
          ))}
          <button 
            onClick={() => { triggerHaptic(10); handleAddPrompt(); }}
            className="w-full py-6 border-2 border-dashed border-white/10 rounded-[2.5rem] text-slate-500 hover:text-white transition-all flex items-center justify-center gap-3 hover:border-indigo-500/50 hover:bg-indigo-500/5 group"
          >
            <PlusCircle size={24} className="group-hover:rotate-90 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Add Insight Node</span>
          </button>
        </div>
      )
    }
  ];

  const handleAddPrompt = () => {
    if (userPrompts.length < 5) {
      setUserPrompts([...userPrompts, { question: ASTRO_PROMPTS[userPrompts.length], answer: '' }]);
    }
  };

  const updatePrompt = (index: number, key: 'question' | 'answer', value: string) => {
    const next = [...userPrompts];
    next[index][key] = value;
    setUserPrompts(next);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[90vh] text-center space-y-12 animate-in fade-in duration-1000">
        <style>{`
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
        `}</style>
        <div className="relative scale-150">
          <div className="absolute inset-0 w-32 h-32 border-2 border-dashed border-indigo-500/20 rounded-full animate-[spin_20s_linear_infinite]" />
          <div className="relative z-10 p-10 bg-indigo-600/10 rounded-full border border-indigo-500/20 glow-pulse-celestial shadow-[0_0_80px_rgba(99,102,241,0.2)]">
            <Stars size={64} className="text-indigo-400 animate-pulse" />
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-5xl font-serif font-bold italic text-white stardust-gradient">{loadingText}</h2>
          <div className="w-64 h-2 bg-slate-900 rounded-full mx-auto relative overflow-hidden">
             <div className="absolute inset-0 bg-indigo-600/30 w-1/2 rounded-full animate-[shimmer_2s_infinite]" />
          </div>
          <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.5em] animate-pulse">Synchronizing Natal Chart</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10">
      <div className="mb-14 text-center space-y-4 animate-in slide-in-from-top-10 fade-in duration-1000">
        <div className="relative inline-flex p-8 bg-indigo-500/5 rounded-full border border-white/10 glow-pulse-celestial animate-float-gentle">
          <Stars size={56} className="text-indigo-400" />
        </div>
        <div>
          <h1 className="text-5xl font-serif font-black italic tracking-tighter text-white drop-shadow-2xl">Cosmic Connection</h1>
          <p className="text-indigo-400/60 text-[11px] uppercase tracking-[0.6em] font-black mt-2">The Stars Are Listening</p>
        </div>
      </div>

      <div className="w-full max-w-lg glass rounded-[4rem] p-10 space-y-12 relative overflow-hidden shadow-2xl animate-cinematic-pop transition-all duration-500">
        {/* Modern Orbital Progress */}
        <div className="flex justify-between items-center px-6">
          {steps.map((_, i) => (
            <React.Fragment key={i}>
              <div 
                className={`w-3 h-3 rounded-full transition-all duration-1000 relative ${
                  i <= step ? 'bg-indigo-400 shadow-[0_0_20px_#818cf8]' : 'bg-slate-800'
                }`} 
              />
              {i < steps.length - 1 && (
                <div className={`flex-1 h-[1.5px] mx-2 rounded-full transition-all duration-1000 ${
                  i < step ? 'bg-indigo-400/50' : 'bg-slate-800'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-white/5 rounded-3xl text-indigo-400 border border-white/10 animate-in zoom-in duration-300" key={`icon-${step}`}>
              {steps[step].icon}
            </div>
            <div className="animate-in slide-in-from-right-4 duration-300" key={`text-${step}`}>
              <h2 className="text-4xl font-serif font-bold italic text-white tracking-tight">{steps[step].title}</h2>
              <p className="text-sm text-indigo-400/80 font-medium italic">{steps[step].subtitle}</p>
            </div>
          </div>
        </div>

        <div className="min-h-[380px] flex flex-col justify-center">
          {steps[step].content}
        </div>

        <div className="flex gap-4 pt-4">
          {step > 0 && (
            <button 
              onClick={() => { triggerHaptic(5); setStep(step - 1); }}
              className="px-8 py-6 text-slate-500 hover:text-white transition-all text-[11px] font-black uppercase tracking-[0.3em] border border-white/10 rounded-[2rem] hover:bg-white/5 active:scale-95 glass-interactive"
            >
              Recall
            </button>
          )}
          <button 
            disabled={isRevealingImage}
            onClick={() => step < steps.length - 1 ? handleNext() : handleSubmit()}
            className="flex-1 bg-indigo-600 py-6 rounded-[2.5rem] font-black flex items-center justify-center gap-3 text-white shadow-[0_20px_50px_rgba(79,70,229,0.4)] hover:bg-indigo-500 transition-all active:scale-95 group overflow-hidden relative"
          >
            <span className="uppercase tracking-[0.4em] text-[11px] relative z-10">
              {step === steps.length - 1 ? "Forge Bond" : "Next Phase"}
            </span>
            <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform relative z-10" />
            <div className="absolute inset-0 shimmer opacity-20" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
