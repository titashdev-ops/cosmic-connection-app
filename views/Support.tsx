
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Mail, HelpCircle, ChevronDown, ChevronUp, Sparkles, Send, Bug, Lightbulb, Info, Loader2, CheckCircle2, Cpu, Globe } from 'lucide-react';

const Support: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [feedbackCategory, setFeedbackCategory] = useState<'bug' | 'suggestion' | 'other'>('bug');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    { q: "How are compatibility scores calculated?", a: "Scores are derived from a complex synastry algorithm that analyzes planetary aspects, houses, and element balances between two natal charts using Gemini Pro's high-reasoning engine." },
    { q: "What is 'The Oracle'?", a: "The Oracle is our custom AI tuned to translate complex ephemeris data into intuitive, actionable guidance for your dating life and personal growth." },
    { q: "Is my birth data secure?", a: "Absolutely. We encrypt natal data and only use it for calculation. Your exact birth time is never displayed to other users; only your signs and summary aspects are revealed." },
    { q: "Mercury is retrograde. Should I date?", a: "While retrograde can cause miscommunication, it's also a time for cosmic fated encounters. We suggest using extra clear communication during these transits." }
  ];

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;

    setIsSubmitting(true);
    
    // Simulate broadcasting to the celestial backend
    try {
      const payload = {
        category: feedbackCategory,
        message: feedbackMessage,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      };
      
      console.log("Broadcasting feedback to designated endpoint:", payload);
      
      // Artificial delay for cosmic transit
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitted(true);
      setFeedbackMessage('');
    } catch (error) {
      console.error("The feedback was lost in a nebula:", error);
      alert("A cosmic disturbance prevented your report from reaching us. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-6 py-8 space-y-10 pb-32 view-enter min-h-screen">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 glass rounded-full text-slate-400 hover:text-white transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="space-y-0.5">
          <h1 className="text-3xl font-serif font-bold italic text-white">Help & Support</h1>
          <p className="text-[10px] uppercase font-black tracking-[0.4em] text-indigo-400/60">Guidance Center</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="glass rounded-[3rem] p-8 space-y-6 border border-indigo-500/20 shadow-[0_0_40px_rgba(79,70,229,0.1)]">
          <div className="space-y-2">
            <h2 className="text-xl font-serif italic font-bold text-white flex items-center gap-3">
              <Sparkles size={20} className="text-amber-400 animate-pulse" /> Ethereal Inquiry
            </h2>
            <p className="text-xs text-slate-500 italic leading-relaxed font-medium">Reach out to our celestial architects if you've encountered a glitch in the matrix.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center gap-3 p-6 glass rounded-[2rem] hover:bg-white/5 transition-all border border-white/5 group">
              <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform">
                <MessageSquare size={24} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Live Chat</span>
            </button>
            <button className="flex flex-col items-center gap-3 p-6 glass rounded-[2rem] hover:bg-white/5 transition-all border border-white/5 group">
              <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-400 group-hover:scale-110 transition-transform">
                <Mail size={24} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Email Oracle</span>
            </button>
          </div>
        </div>

        {/* FEEDBACK FORM SECTION */}
        <div className="glass rounded-[2.5rem] p-8 border border-white/5 space-y-6 relative overflow-hidden">
           {!submitted ? (
             <>
               <div className="space-y-1">
                 <h3 className="text-sm font-black uppercase tracking-widest text-indigo-300">Submit a Report</h3>
                 <p className="text-[10px] text-slate-500 italic">Your vibration helps us perfect the orbit.</p>
               </div>

               <div className="flex gap-2">
                 {[
                   { id: 'bug', icon: <Bug size={14} />, label: 'Bug' },
                   { id: 'suggestion', icon: <Lightbulb size={14} />, label: 'Idea' },
                   { id: 'other', icon: <Info size={14} />, label: 'Other' }
                 ].map(cat => (
                   <button
                    key={cat.id}
                    onClick={() => setFeedbackCategory(cat.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border ${
                      feedbackCategory === cat.id 
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                        : 'bg-slate-900/50 border-white/5 text-slate-500 hover:text-slate-300'
                    }`}
                   >
                     {cat.icon} {cat.label}
                   </button>
                 ))}
               </div>

               <textarea 
                placeholder={
                  feedbackCategory === 'bug' ? "Describe the celestial anomaly..." :
                  feedbackCategory === 'suggestion' ? "What new features do you envision?" :
                  "Channel your message here..."
                }
                className="w-full bg-slate-900/60 border border-white/5 p-5 rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500/50 outline-none h-32 text-xs text-white italic resize-none transition-all placeholder:text-slate-600"
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                disabled={isSubmitting}
               />
               
               <button 
                onClick={handleSubmitFeedback}
                disabled={isSubmitting || !feedbackMessage.trim()}
                className="w-full bg-indigo-600 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center justify-center gap-2 cosmic-btn shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed group"
               >
                 {isSubmitting ? (
                   <Loader2 size={16} className="animate-spin" />
                 ) : (
                   <>
                    <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                    Broadcast to Void
                   </>
                 )}
               </button>
             </>
           ) : (
             <div className="py-10 flex flex-col items-center text-center space-y-6 animate-in zoom-in-95 duration-500">
               <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                 <CheckCircle2 size={40} className="text-emerald-400" />
               </div>
               <div className="space-y-2">
                 <h3 className="text-xl font-serif italic font-bold text-white">Broadcast Received</h3>
                 <p className="text-xs text-slate-400 italic px-6 leading-relaxed">
                   "Your insights have successfully transited the cosmic void. The Architects will integrate this frequency into the next update."
                 </p>
               </div>
               <button 
                onClick={() => setSubmitted(false)}
                className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors"
               >
                 Submit another report
               </button>
             </div>
           )}
        </div>

        {/* ABOUT SECTION */}
        <div className="space-y-5">
           <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-400/80 ml-2">Mission & Tech</h3>
           <div className="glass rounded-[2.5rem] p-8 border border-white/5 space-y-4">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 border border-indigo-500/20">
                    <Cpu size={24} />
                 </div>
                 <div>
                    <h4 className="text-lg font-serif font-bold italic text-white">The Neural Lattice</h4>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Gemini 3 Pro x Swiss Ephemeris</p>
                 </div>
              </div>
              <p className="text-sm italic text-slate-300 leading-relaxed font-serif pl-4 border-l-2 border-indigo-500/20">
                 "Our mission is to bridge the gap between celestial mechanics and human connection. By fusing JPL's DE431 astronomical data with advanced AI reasoning, we provide the most accurate compatibility modeling in the known universe."
              </p>
           </div>
        </div>

        <div className="space-y-5">
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-400/80 ml-2">Cosmic Knowledge Base</h3>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass rounded-[2rem] border border-white/5 overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-all"
                >
                  <span className="text-sm font-bold text-white tracking-tight">{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={18} className="text-indigo-400" /> : <ChevronDown size={18} className="text-slate-700" />}
                </button>
                {openFaq === i && (
                  <div className="p-6 pt-0 animate-in slide-in-from-top-2 duration-300">
                    <p className="text-xs text-slate-400 italic font-serif leading-relaxed border-t border-white/5 pt-4">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
