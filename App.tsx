
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { UserProfile, CompatibilityResult } from './types';
import CelestialBackground from './components/CelestialBackground';
import Onboarding from './views/Onboarding';
import Discovery from './views/Discovery';
import Chats from './views/Chats';
import Profile from './views/Profile';
import Settings from './views/Settings';
import Support from './views/Support';
import Legal from './views/Legal';
import StoreListing from './views/StoreListing';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('cosmic_user');
    if (saved) {
      setCurrentUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const handleOnboardComplete = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('cosmic_user', JSON.stringify(user));
  };

  const handleUpdateProfile = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('cosmic_user', JSON.stringify(updatedUser));
  };

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500" />
    </div>
  );

  return (
    <HashRouter>
      <div className="relative min-h-screen">
        <CelestialBackground />
        
        <div className="relative z-10 max-w-lg mx-auto pb-24 lg:pb-0 lg:pt-8">
          <Routes>
            {!currentUser ? (
              <Route path="*" element={<Onboarding onComplete={handleOnboardComplete} />} />
            ) : (
              <>
                <Route path="/" element={<Discovery user={currentUser} />} />
                <Route path="/chats" element={<Chats user={currentUser} />} />
                <Route path="/profile" element={<Profile 
                  user={currentUser} 
                  onUpdate={handleUpdateProfile}
                  onLogout={() => {
                    setCurrentUser(null);
                    localStorage.removeItem('cosmic_user');
                  }} 
                />} />
                <Route path="/settings" element={<Settings 
                  user={currentUser} 
                  onUpdate={handleUpdateProfile}
                  onLogout={() => {
                    setCurrentUser(null);
                    localStorage.removeItem('cosmic_user');
                  }}
                />} />
                <Route path="/support" element={<Support />} />
                <Route path="/privacy" element={<Legal type="privacy" />} />
                <Route path="/terms" element={<Legal type="terms" />} />
                <Route path="/download" element={<StoreListing />} />
                <Route path="*" element={<Discovery user={currentUser} />} />
              </>
            )}
          </Routes>
        </div>

        {currentUser && <Navbar />}
      </div>
    </HashRouter>
  );
};

export default App;
