
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Scale } from 'lucide-react';

interface LegalProps {
  type: 'privacy' | 'terms';
}

const Legal: React.FC<LegalProps> = ({ type }) => {
  const navigate = useNavigate();

  const content = {
    privacy: {
      title: "Privacy Policy",
      subtitle: "Data Governance in the Ethereal Realm",
      icon: <Shield className="text-emerald-400" size={28} />,
      sections: [
        { t: "1. Data Collection", c: "We collect your birth date, time, and location to calculate your natal chart. This data is handled with the utmost sanctity and is never shared with third-party lunar or solar entities without your explicit consent." },
        { t: "2. Visual Form", c: "Your profile images are stored on secure celestial servers. We use AI to moderate content and ensure all visual projections remain high-vibration and safe for the cosmic community." },
        { t: "3. Synastry Processing", c: "Compatibility algorithms process your data locally where possible. Large-scale ephemeris calculations are performed on encrypted cloud nodes that strictly adhere to galactic privacy standards." },
        { t: "4. Your Rights", c: "At any time, you may initiate a 'Black Hole' event which permanently deletes your data from our servers, effectively ending your current incarnation in this app." }
      ]
    },
    terms: {
      title: "Terms & Conditions",
      subtitle: "The Compact of Celestial Interaction",
      icon: <FileText className="text-indigo-400" size={28} />,
      sections: [
        { t: "1. Sacred Conduct", c: "By entering this space, you agree to treat all souls with empathy. Harassment, shadow-work projections onto others, or disruptive vibrations will result in immediate suspension from the orbit." },
        { t: "2. Authenticity", c: "You must use your accurate birth data. False charts create misaligned frequencies and undermine the integrity of our synastry engine." },
        { t: "3. No Guarantees", c: "While the stars incline, they do not compel. CosmicConnection is for entertainment and guidance purposes. We are not responsible for decisions made based on Oracle interpretations." },
        { t: "4. Manifestation Fees", c: "Certain features require the exchange of earthly currency. These are clearly marked and non-refundable once the celestial service has been rendered." }
      ]
    }
  };

  const active = content[type];

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
          <h1 className="text-3xl font-serif font-bold italic text-white">{active.title}</h1>
          <p className="text-[10px] uppercase font-black tracking-[0.4em] text-indigo-400/60">Legal Frequency</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="glass rounded-[3rem] p-8 border border-white/5 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
            <Scale size={100} />
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-2xl">
              {active.icon}
            </div>
            <div>
              <h2 className="text-xl font-serif italic font-bold text-white tracking-wide">{active.subtitle}</h2>
              <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Effective Cycle: March 2025</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {active.sections.map((section, i) => (
            <div key={i} className="glass rounded-[2rem] p-8 border border-white/5 space-y-3 hover:bg-white/5 transition-all">
              <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400">{section.t}</h3>
              <p className="text-sm italic text-slate-300 leading-relaxed font-serif pl-4 border-l-2 border-indigo-500/20">
                {section.c}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center opacity-30 px-8">
           <p className="text-[9px] italic text-slate-500 leading-relaxed">
             By continuing your transit in this app, you acknowledge receipt of these energetic guidelines.
           </p>
        </div>
      </div>
    </div>
  );
};

export default Legal;
