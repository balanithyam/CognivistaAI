import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Lock, User, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

interface SignInViewProps {
  onSwitchToRegister: () => void;
  successMessage?: string | null;
}

export const SignInView: React.FC<SignInViewProps> = ({ onSwitchToRegister, successMessage }) => {
  const { login, isLoading, error } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) return;
    await login(identifier, password);
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-3xl glass-panel-elevated border border-graphite-750 space-y-6 shadow-2xl">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-neon to-mint-neon p-0.5 shadow-violet-glow mx-auto flex items-center justify-center">
          <div className="w-full h-full bg-graphite-950 rounded-[14px] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-mint-glow" />
          </div>
        </div>
        <h2 className="text-2xl font-extrabold text-graphite-100 tracking-tight font-sans">
          Welcome to <span className="text-gradient-agent">COGNIVISTA</span>
        </h2>
        <p className="text-xs text-graphite-400 font-mono">
          Adaptive Brain Challenge & Cognitive Training Agent
        </p>
      </div>

      {/* Success Notification from Registration */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-mint-deep/20 border border-mint-glow/40 text-xs text-mint-glow text-center font-mono">
          {successMessage}
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Sign In Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-mono uppercase text-graphite-400">Username or Email</label>
          <div className="relative flex items-center">
            <User className="w-4 h-4 text-graphite-500 absolute left-3.5" />
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. neuro_researcher"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-graphite-950/80 border border-graphite-750 text-graphite-100 placeholder-graphite-600 text-sm focus:outline-none focus:border-violet-glow"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono uppercase text-graphite-400">Password</label>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-graphite-500 absolute left-3.5" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-graphite-950/80 border border-graphite-750 text-graphite-100 placeholder-graphite-600 text-sm focus:outline-none focus:border-violet-glow"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !identifier.trim() || !password.trim()}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-neon to-mint-neon text-graphite-950 font-bold text-sm shadow-mint-glow hover:opacity-95 disabled:opacity-40 flex items-center justify-center space-x-2 transition-all duration-200 mt-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-graphite-950" />
          ) : (
            <>
              <span>Sign In to Training Environment</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="text-center pt-2 border-t border-graphite-800 text-xs font-mono text-graphite-400">
        New to Cognivista?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-mint-glow hover:underline font-bold ml-1"
        >
          Register an Account
        </button>
      </div>
    </div>
  );
};
