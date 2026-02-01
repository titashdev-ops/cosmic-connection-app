
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../types';
import { ArrowLeft, User, Bell, Globe, Shield, FileText, HelpCircle, LogOut, ChevronRight, Moon, Sun, Smartphone, Download } from 'lucide-react';

interface SettingsProps {
  user: UserProfile;
  onUpdate: (user: UserProfile) => void;
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdate, onLogout }) => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Celestial Account",
      items: [
        { icon: <User size={20} />, label: "Profile Information", sub: "Update your cosmic vessel details", onClick: () => navigate('/profile') },
        { icon: <Bell size={20} />, label: "Notifications", sub: "Configure orbital alerts", toggle: true },
      ]
    },
    {
      title: "App Experience",
      items: [
        { icon: <Download size={20} />, label: "Get Native App", sub: "iOS & Android availability", onClick: () => navigate('/download') },
        { icon: <Smartphone size={20} />, label: "Appearance", sub: "Deep Space Theme", value: "Automatic" },
      ]
    },
    {
      title: "Preferences",
      items: [
        { icon: <Globe size={20} />, label: "Calculation System", sub: "Placidus House System (Default)", value: "Placidus" },
      ]
    },
    {
      title: "Support & Legal",
      items: [
        { icon: <HelpCircle size={20} />, label: "Help & Support", onClick: () => navigate('/support') },
        { icon: <Shield size={20} />, label: "Privacy Policy", onClick: () => navigate('/privacy') },
        { icon: <FileText size={20} />, label: "Terms of Service", onClick: () => navigate('/terms') },
      ]
    }
  ];

  return (
    <div className="px-6 py-8 space-y-8 pb-32 view-enter min-h-screen">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 glass rounded-full text-slate-400 hover:text-white transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="space-y-0.5">
          <h1 className="text-3xl font-serif font-bold italic text-white">Settings</h1>
          <p className="text-[10px] uppercase font-black tracking-[0.4em] text-indigo-400/60">Orbital Controls</p>
        </div>
      </div>

      <div className="space-y-8">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-500 ml-2">{section.title}</h3>
            <div className="glass rounded-[2.5rem] overflow-hidden border border-white/5">
              {section.items.map((item, i) => (
                <div 
                  key={i}
                  onClick={item.onClick}
                  className={`flex items-center justify-between p-6 transition-all border-b border-white/5 last:border-none ${item.onClick ? 'hover:bg-white/5 cursor-pointer' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white tracking-tight">{item.label}</p>
                      {item.sub && <p className="text-[10px] text-slate-500 font-medium italic">{item.sub}</p>}
                    </div>
                  </div>
                  
                  {item.toggle && (
                    <div className="w-12 h-6 bg-indigo-600 rounded-full relative shadow-inner shadow-black/50">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-lg" />
                    </div>
                  )}
                  
                  {item.value && (
                    <span className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                      {item.value}
                    </span>
                  )}

                  {item.onClick && !item.toggle && !item.value && (
                    <ChevronRight size={18} className="text-slate-700" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 py-5 rounded-[2rem] bg-red-500/5 text-red-500/60 border border-red-500/10 hover:bg-red-500/10 hover:text-red-500 transition-all font-black text-[10px] uppercase tracking-[0.3em] cosmic-btn mt-4"
        >
          <LogOut size={18} /> Sever Celestial Connection
        </button>
        
        <div className="text-center space-y-2 opacity-30">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white">CosmicConnection v1.0.4</p>
          <p className="text-[8px] italic text-slate-500 leading-relaxed max-w-[200px] mx-auto">Hand-crafted by high-vibration stardust developers in the 5th dimension.</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
