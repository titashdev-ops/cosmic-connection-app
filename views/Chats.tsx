
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ZodiacSign, PlanetaryPosition, Message } from '../types';
import { getIcebreaker } from '../services/geminiService';
import { Sparkles, Send, Mic, ArrowLeft, MoreHorizontal, Ghost, Zap, Loader2, Sparkle } from 'lucide-react';

const generateMockChart = (sunSign: string): PlanetaryPosition[] => [
  { planet: 'Sun', sign: sunSign as ZodiacSign, degree: 15, minute: 0, isRetrograde: false, house: 1 },
  { planet: 'Moon', sign: 'Scorpio', degree: 10, minute: 30, isRetrograde: false, house: 4 },
  { planet: 'Mercury', sign: sunSign as ZodiacSign, degree: 12, minute: 0, isRetrograde: true, house: 1 },
  { planet: 'Venus', sign: 'Libra', degree: 22, minute: 15, isRetrograde: false, house: 2 },
  { planet: 'Mars', sign: 'Aries', degree: 12, minute: 45, isRetrograde: false, house: 5 },
  { planet: 'Ascendant', sign: 'Leo', degree: 5, minute: 0, isRetrograde: false, house: 1 },
];

const MOCK_MATCHES: Partial<UserProfile>[] = [
  { 
    id: '1', 
    name: 'Aria', 
    sunSign: 'Libra' as ZodiacSign, 
    moonSign: 'Scorpio', 
    risingSign: 'Taurus',
    images: ['https://picsum.photos/400?random=20'], 
    bio: 'Art enthusiast and candle collector.',
    prompts: [],
    natalChart: generateMockChart('Libra')
  },
  { 
    id: '2', 
    name: 'Leo', 
    sunSign: 'Leo' as ZodiacSign, 
    moonSign: 'Aries', 
    risingSign: 'Leo',
    images: ['https://picsum.photos/400?random=21'], 
    bio: 'Living life at maximum volume.',
    prompts: [],
    natalChart: generateMockChart('Leo')
  },
];

const Chats: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [selectedChat, setSelectedChat] = useState<UserProfile | null>(null);
  const [icebreaker, setIcebreaker] = useState('');
  const [loadingIce, setLoadingIce] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedChat) {
      setMessages([]); // Reset messages on chat open
      if (!icebreaker) {
        // Simulate "Real-time" celestial typing after a short delay
        const timer = setTimeout(() => setIsTyping(true), 1500);
        const stopTimer = setTimeout(() => {
           setIsTyping(false);
           // Add an initial message from the match
           setMessages([{
             id: 'init-1',
             senderId: selectedChat.id,
             text: `The stars were right about you. I can feel the ${selectedChat.sunSign} energy from here.`,
             timestamp: Date.now()
           }]);
        }, 3500);
        return () => { clearTimeout(timer); clearTimeout(stopTimer); };
      }
    }
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, icebreaker]);

  const generateIce = async (match: UserProfile) => {
    setLoadingIce(true);
    try {
      const res = await getIcebreaker(user, match);
      setIcebreaker(res);
    } catch (e) {
      console.error(e);
      setIcebreaker("The cosmos is silent. Try again in a moment.");
    } finally {
      setLoadingIce(false);
    }
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      text: inputText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Simulate response
    setTimeout(() => setIsTyping(true), 1000);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        senderId: selectedChat!.id,
        text: "That resonates deeply. Tell me more about your chart?",
        timestamp: Date.now()
      }]);
    }, 4000);
  };

  if (selectedChat) {
    return (
      <div className="flex flex-col h-[92vh] glass-thick animate-in slide-in-from-right-10 duration-500 rounded-t-[3rem] mt-4 overflow-hidden shadow-2xl border-t border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
          <button onClick={() => { setSelectedChat(null); setIcebreaker(''); setMessages([]); }} className="p-3 bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col items-center">
            <h2 className="font-serif font-bold italic text-2xl text-white tracking-wide">{selectedChat.name}</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
               <p className="text-[9px] text-indigo-300 uppercase tracking-[0.25em] font-black">{selectedChat.sunSign} Orbiting</p>
            </div>
          </div>
          <img src={selectedChat.images[0]} className="w-12 h-12 rounded-[1.2rem] object-cover border-2 border-indigo-500/20 shadow-lg" alt={selectedChat.name} />
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar">
          <div className="flex flex-col items-center py-6 space-y-3 opacity-40">
             <Ghost size={28} className="text-indigo-400" />
             <p className="text-[10px] uppercase font-black tracking-[0.3em]">Encounter Fragmented in {selectedChat.sunSign}</p>
          </div>

          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-3 ${msg.senderId === user.id ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
               {msg.senderId !== user.id && (
                 <div className="w-8 h-8 rounded-xl bg-slate-900 overflow-hidden shrink-0 border border-white/10 shadow-lg">
                    <img src={selectedChat.images[0]} className="w-full h-full object-cover" />
                 </div>
               )}
               <div className={`
                 max-w-[80%] p-5 text-base leading-relaxed font-serif italic shadow-sm
                 ${msg.senderId === user.id 
                   ? 'bg-indigo-600 text-white rounded-[2rem] rounded-tr-none' 
                   : 'bg-slate-900/60 border border-white/10 text-slate-200 rounded-[2rem] rounded-tl-none'}
               `}>
                 {msg.text}
               </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3 text-indigo-400/50 animate-pulse ml-14">
               <span className="text-[9px] font-black uppercase tracking-[0.3em]">Oracle is typing</span>
               <div className="flex gap-1">
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce" />
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0.4s]" />
               </div>
            </div>
          )}

          {icebreaker && (
            <div className="flex flex-col items-end gap-2 animate-in fade-in zoom-in-95 duration-500">
              <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-[2.5rem] rounded-tr-none max-w-[90%] text-base italic text-indigo-100 shadow-[0_0_40px_rgba(79,70,229,0.05)] relative group leading-7 font-serif">
                <div className="flex items-center gap-2 text-[9px] font-black text-indigo-400 mb-3 uppercase tracking-[0.25em]">
                  <Zap size={10} className="text-amber-400 animate-pulse" /> Celestial Synastry Icebreaker
                </div>
                "{icebreaker}"
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 space-y-4 bg-slate-950/60 backdrop-blur-2xl border-t border-white/5 pb-10">
          {!icebreaker && messages.length === 0 && (
            <button 
              onClick={() => generateIce(selectedChat)}
              disabled={loadingIce}
              className="w-full bg-indigo-600/10 text-indigo-400 py-4 rounded-3xl border border-indigo-500/20 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-indigo-600/20 transition-all disabled:opacity-50 cosmic-btn"
            >
              {loadingIce ? (
                <Loader2 size={16} className="animate-spin text-indigo-400" />
              ) : (
                <><Sparkles size={16} className="text-amber-400 animate-pulse" /> Consult the Oracle for Icebreaker</>
              )}
            </button>
          )}
          
          <div className="flex gap-3">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-[2rem] px-6 py-4 flex items-center gap-4 focus-within:ring-2 focus-within:ring-indigo-500/40 transition-all">
              <input 
                placeholder="Compose cosmic vibration..." 
                className="bg-transparent border-none outline-none flex-1 text-sm text-slate-200 placeholder:text-slate-600 font-medium" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Mic size={20} className="text-slate-500 hover:text-indigo-400 cursor-pointer transition-colors" />
            </div>
            <button 
              onClick={sendMessage}
              className="bg-indigo-600 w-14 h-14 rounded-[1.5rem] text-white shadow-xl shadow-indigo-500/30 hover:bg-indigo-500 transition-all active:scale-90 flex items-center justify-center group shrink-0"
            >
              <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-10 space-y-12 view-enter">
      <div className="space-y-1 px-2">
        <h1 className="text-5xl font-serif font-black italic text-white tracking-tight drop-shadow-2xl">Matches</h1>
        <p className="text-[10px] uppercase font-black tracking-[0.6em] text-indigo-500/60 mt-2">Orbital Connections</p>
      </div>

      <div className="space-y-4">
        {MOCK_MATCHES.map((match, idx) => (
          <div 
            key={match.id}
            onClick={() => setSelectedChat(match as UserProfile)}
            className="flex items-center gap-6 p-6 glass rounded-[3rem] hover:bg-white/5 transition-all cursor-pointer group animate-in slide-in-from-bottom-4 duration-500 border border-white/5"
            style={{ animationDelay: `${idx * 0.15}s` }}
          >
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden border-2 border-white/10 group-hover:border-indigo-500/50 transition-all duration-500 group-hover:scale-105 shadow-2xl">
                <img src={match.images?.[0]} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-amber-400 w-7 h-7 rounded-xl flex items-center justify-center text-slate-950 border-4 border-slate-950 shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
                <Sparkle size={12} fill="black" />
              </div>
            </div>
            <div className="flex-1 space-y-1.5 min-w-0">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-serif font-bold italic text-white group-hover:text-indigo-300 transition-colors tracking-wide">{match.name}</h3>
                <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest bg-slate-950/50 px-2 py-1 rounded-md">2h Galactic Time</span>
              </div>
              <p className="text-sm text-slate-500 truncate italic font-serif group-hover:text-slate-300 transition-colors">"Tap to reveal connection..."</p>
              <div className="flex gap-2 pt-1">
                 <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20 font-black uppercase tracking-wide">{match.sunSign}</span>
                 <span className="text-[9px] bg-white/5 text-slate-500 px-3 py-1 rounded-full border border-white/10 font-black uppercase tracking-wide">{match.moonSign} Moon</span>
              </div>
            </div>
            <div className="p-3 text-slate-700 group-hover:text-indigo-400 transition-colors bg-white/5 rounded-full">
               <ArrowLeft className="rotate-180" size={18} />
            </div>
          </div>
        ))}
      </div>

      {MOCK_MATCHES.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 space-y-8 opacity-40">
           <div className="p-10 bg-indigo-500/5 rounded-full border border-indigo-500/10 animate-float-gentle">
              <Ghost size={64} className="text-indigo-400" />
           </div>
           <p className="text-xs uppercase font-black tracking-[0.4em] text-center max-w-xs leading-relaxed">No earthly souls caught in your gravity yet.</p>
        </div>
      )}
    </div>
  );
};

export default Chats;
