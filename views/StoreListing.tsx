
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Stars, Smartphone, Apple, PlayCircle, ShieldCheck, Zap, Heart, Sparkles } from 'lucide-react';

const StoreListing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="px-6 py-8 space-y-12 pb-32 view-enter min-h-screen bg-slate-950/40">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 glass rounded-full text-slate-400 hover:text-white transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="space-y-0.5">
          <h1 className="text-3xl font-serif font-bold italic text-white">Experience Native</h1>
          <p className="text-[10px] uppercase font-black tracking-[0.4em] text-indigo-400/60">Orbital Downloads</p>
        </div>
      </div>

      <div className="flex flex-col items-center text-center space-y-8">
        <div className="relative">
          <div className="w-32 h-32 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_60px_rgba(79,70,229,0.4)] border-4 border-white/10 glow-pulse">
            <Stars size={64} className="text-white animate-pulse" />
          </div>
          <Sparkles className="absolute -top-4 -right-4 text-amber-400 animate-bounce" size={32} />
        </div>
        
        <div className="space-y-3">
          <h2 className="text-4xl font-serif font-black italic text-white tracking-tight">CosmicConnection</h2>
          <p className="text-indigo-400 text-xs font-black uppercase tracking-[0.4em]">Where Stars Align</p>
        </div>

        <div className="flex flex-col w-full gap-4 max-w-xs">
          <button className="bg-white text-slate-950 flex items-center justify-center gap-4 py-5 rounded-3xl font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-xl">
            <Apple size={24} className="fill-current" />
            <div className="flex flex-col items-start">
              <span className="text-[8px] uppercase tracking-widest leading-none opacity-60">Download on the</span>
              <span className="text-base leading-none">App Store</span>
            </div>
          </button>
          
          <button className="bg-slate-900 border border-white/10 text-white flex items-center justify-center gap-4 py-5 rounded-3xl font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-xl">
            <PlayCircle size={24} className="text-indigo-400" />
            <div className="flex flex-col items-start">
              <span className="text-[8px] uppercase tracking-widest leading-none opacity-60">Get it on</span>
              <span className="text-base leading-none">Google Play</span>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="glass p-8 rounded-[3rem] border border-white/5 space-y-4">
          <div className="p-3 bg-indigo-500/10 rounded-2xl w-fit text-indigo-400">
            <Smartphone size={24} />
          </div>
          <h3 className="text-xl font-serif font-bold italic text-white">Full Celestial Immersion</h3>
          <p className="text-sm text-slate-400 italic font-serif leading-relaxed">
            Native push notifications for real-time transit alerts, widget support for your daily horoscope, and optimized performance for high-precision natal chart rendering.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass p-6 rounded-[2.5rem] border border-white/5 text-center space-y-3">
            <Heart size={20} className="text-red-400 mx-auto" />
            <p className="text-[10px] font-black uppercase text-white">Soul Matching</p>
          </div>
          <div className="glass p-6 rounded-[2.5rem] border border-white/5 text-center space-y-3">
            <ShieldCheck size={20} className="text-emerald-400 mx-auto" />
            <p className="text-[10px] font-black uppercase text-white">Data Sanctity</p>
          </div>
        </div>
      </div>

      <div className="text-center opacity-30 pb-10">
        <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Universal Compatibility Guaranteed</p>
      </div>
    </div>
  );
};

export default StoreListing;
