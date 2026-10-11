import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Mail, User, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

interface RegisterViewProps {
  onSwitchToSignIn: () => void;
  onRegisterSuccess: (msg: string) => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ onSwitchToSignIn, onRegisterSuccess }) => {
  const { register, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !username.trim() || !password.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    try {
      const res = await register({
        email: email.trim(),
        username: username.trim(),
        password: password.trim(),
        full_name: fullName.trim() || undefined,
      });

      // Strict requirement: Register -> successful registration -> Sign In page.
      // Do NOT automatically enter the application after registration.
      onRegisterSuccess(res.message || 'Registration successful. Please sign in with your credentials.');
      onSwitchToSignIn();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete registration.');
    }
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
          Initialize Cognitive Profile
        </h2>
        <p className="text-xs text-graphite-400 font-mono">
          Register to establish your persistent neuroplastic model
        </p>
      </div>

      {/* Error Notification */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="space-y-1">
          <label className="text-xs font-mono uppercase text-graphite-400">Email Address</label>
          <div className="relative flex items-center">
            <Mail className="w-4 h-4 text-graphite-500 absolute left-3.5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="researcher@neural.lab"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-graphite-950/80 border border-graphite-750 text-graphite-100 placeholder-graphite-600 text-sm focus:outline-none focus:border-mint-glow"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono uppercase text-graphite-400">Username</label>
          <div className="relative flex items-center">
            <User className="w-4 h-4 text-graphite-500 absolute left-3.5" />
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. synaptiq"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-graphite-950/80 border border-graphite-750 text-graphite-100 placeholder-graphite-600 text-sm focus:outline-none focus:border-mint-glow"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono uppercase text-graphite-400">Full Name (Optional)</label>
          <div className="relative flex items-center">
            <User className="w-4 h-4 text-graphite-500 absolute left-3.5" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Dr. Alex Mercer"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-graphite-950/80 border border-graphite-750 text-graphite-100 placeholder-graphite-600 text-sm focus:outline-none focus:border-mint-glow"
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
              placeholder="Minimum 6 characters"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-graphite-950/80 border border-graphite-750 text-graphite-100 placeholder-graphite-600 text-sm focus:outline-none focus:border-mint-glow"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !email.trim() || !username.trim() || !password.trim()}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-mint-neon to-violet-neon text-graphite-950 font-bold text-sm shadow-mint-glow hover:opacity-95 disabled:opacity-40 flex items-center justify-center space-x-2 transition-all duration-200 mt-3"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-graphite-950" />
          ) : (
            <>
              <span>Complete Registration</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Sign In */}
      <div className="text-center pt-2 border-t border-graphite-800 text-xs font-mono text-graphite-400">
        Already registered?{' '}
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="text-violet-glow hover:underline font-bold ml-1"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};
