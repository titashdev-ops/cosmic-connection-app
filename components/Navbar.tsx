
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Compass, MessageCircle, User, Sparkle } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();

  const triggerHaptic = () => {
    if ('vibrate' in navigator) navigator.vibrate(15);
  };

  const getIndicatorPos = () => {
    switch (location.pathname) {
      case '/': return '16.6%';
      case '/chats': return '50%';
      case '/profile': return '83.3%';
      default: return '16.6%';
    }
  };

  return (
    <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-md glass rounded-[3rem] p-2.5 z-50 shadow-[0_40px_80px_rgba(0,0,0,0.8)] border border-white/10">
      <div className="relative flex justify-around items-center h-16">
        <div 
          className="absolute h-full w-[28%] bg-indigo-500/15 rounded-[2rem] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] border-t border-indigo-400/20"
          style={{ left: getIndicatorPos(), transform: 'translateX(-50%)' }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-400 rounded-full shadow-[0_0_15px_#818cf8] animate-pulse" />
        </div>

        <NavLink 
          to="/" 
          onClick={triggerHaptic}
          className={({ isActive }) => `relative z-10 flex flex-col items-center gap-1.5 transition-all duration-300 ${isActive ? 'text-indigo-300 scale-110' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <div className="relative">
            <Compass size={24} className={location.pathname === '/' ? 'animate-spin-slow' : ''} />
            {location.pathname === '/' && <Sparkle size={10} className="absolute -top-1 -right-1 text-amber-400 animate-pulse" />}
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.3em]">Stars</span>
        </NavLink>
        
        <NavLink 
          to="/chats" 
          onClick={triggerHaptic}
          className={({ isActive }) => `relative z-10 flex flex-col items-center gap-1.5 transition-all duration-300 ${isActive ? 'text-indigo-300 scale-110' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <div className="relative">
            <MessageCircle size={24} />
            {location.pathname === '/chats' && <Sparkle size={10} className="absolute -top-1 -right-1 text-indigo-400 animate-pulse" />}
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.3em]">Orbit</span>
        </NavLink>
        
        <NavLink 
          to="/profile" 
          onClick={triggerHaptic}
          className={({ isActive }) => `relative z-10 flex flex-col items-center gap-1.5 transition-all duration-300 ${isActive ? 'text-indigo-300 scale-110' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <div className="relative">
            <User size={24} />
            {location.pathname === '/profile' && <Sparkle size={10} className="absolute -top-1 -right-1 text-amber-500 animate-pulse" />}
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.3em]">Oracle</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
