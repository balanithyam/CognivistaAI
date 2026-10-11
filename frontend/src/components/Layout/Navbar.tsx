import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAgent } from '../../context/AgentContext';
import { ExperienceMode } from '../../types';
import {
  TrendingUp,
  Wand2,
  Play,
  CheckCircle2,
  Zap,
  Globe2,
  Sparkles,
  Flame,
  Award,
  LogOut,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const { activeMode, setActiveMode } = useAgent();

  const handleNavClick = (mode: ExperienceMode) => {
    setActiveMode(mode);
  };

  const navItems: { mode: ExperienceMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'progress', label: 'My Progress', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { mode: 'create', label: 'Create Challenge', icon: <Wand2 className="w-3.5 h-3.5" /> },
    { mode: 'challenge', label: 'Challenge', icon: <Play className="w-3.5 h-3.5 fill-current" /> },
    { mode: 'review', label: 'Challenge Review', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    { mode: 'session', label: 'Training Session', icon: <Zap className="w-3.5 h-3.5" /> },
    { mode: 'live', label: 'Live Challenges', icon: <Globe2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-graphite-800/80 bg-graphite-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Identity */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveMode('challenge')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-neon to-mint-neon p-0.5 shadow-violet-glow flex items-center justify-center">
            <div className="w-full h-full bg-graphite-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-mint-glow" />
            </div>
          </div>
          <div>
            <div className="text-base font-extrabold tracking-tight font-sans">
              <span className="text-gradient-agent">COGNIVISTA</span>
            </div>
            <div className="text-[9px] font-mono tracking-widest text-graphite-400 uppercase -mt-0.5">
              Cognitive Training Agent
            </div>
          </div>
        </div>

        {/* Experience Mode Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-graphite-900/90 p-1.5 rounded-2xl border border-graphite-750">
          {navItems.map((item) => {
            const isActive = activeMode === item.mode;
            return (
              <button
                key={item.mode}
                type="button"
                onClick={() => handleNavClick(item.mode)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-neon/20 to-mint-deep/30 border border-violet-neon/40 text-graphite-100 shadow-glass'
                    : 'text-graphite-400 hover:text-graphite-200 hover:bg-graphite-850'
                }`}
              >
                <span className={isActive ? 'text-mint-glow' : 'text-graphite-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Side Stats & User Menu */}
        <div className="flex items-center space-x-3">
          {/* Real-time Elo Badge */}
          {profile && (
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-graphite-900 border border-graphite-800 text-xs font-mono">
              <Award className="w-3.5 h-3.5 text-violet-glow" />
              <span className="text-graphite-300 font-bold">{Math.round(profile.composite_elo)}</span>
              <span className="text-graphite-500 text-[10px]">Elo</span>
            </div>
          )}

          {/* Streak Counter */}
          {profile && (
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-300">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="font-bold">{profile.current_streak}</span>
            </div>
          )}

          {/* User Sign Out */}
          {user && (
            <div className="flex items-center space-x-2 pl-2 border-l border-graphite-800">
              <span className="text-xs font-mono text-graphite-300 hidden lg:inline truncate max-w-24">
                {user.username}
              </span>
              <button
                type="button"
                onClick={logout}
                className="p-2 rounded-xl bg-graphite-900 hover:bg-graphite-800 border border-graphite-800 text-graphite-400 hover:text-rose-400 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-graphite-850 px-2 py-2 bg-graphite-950">
        {navItems.map((item) => {
          const isActive = activeMode === item.mode;
          return (
            <button
              key={item.mode}
              type="button"
              onClick={() => handleNavClick(item.mode)}
              className={`flex flex-col items-center py-1 px-2 text-[10px] font-mono ${
                isActive ? 'text-mint-glow font-bold' : 'text-graphite-400'
              }`}
            >
              <span>{item.icon}</span>
              <span className="mt-0.5">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
