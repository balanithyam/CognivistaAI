import React, { useState } from 'react';
import { Edit3, Sparkles, RotateCcw, ArrowRight } from 'lucide-react';

interface FillBlankArenaProps {
  payload: {
    scrambled_letters?: string[];
    hint_letters?: string;
    blank_length?: number;
    placeholder?: string;
  };
  prompt: string;
  onSubmit: (response: any) => void;
  disabled?: boolean;
}

export const FillBlankArena: React.FC<FillBlankArenaProps> = ({
  payload,
  prompt,
  onSubmit,
  disabled = false,
}) => {
  const [typedValue, setTypedValue] = useState<string>('');
  const scrambled = payload.scrambled_letters || [];

  const handleLetterClick = (letter: string) => {
    if (disabled) return;
    setTypedValue((prev) => prev + letter);
  };

  const handleClear = () => {
    if (disabled) return;
    setTypedValue('');
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (disabled || !typedValue.trim()) return;
    onSubmit(typedValue.trim());
  };

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-graphite-900 border border-graphite-800 space-y-6 shadow-glass animate-fadeIn max-w-2xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[11px] font-mono font-bold uppercase tracking-wider inline-flex items-center space-x-1">
          <Edit3 className="w-3.5 h-3.5" />
          <span>Fill In The Blank & Word Solving</span>
        </span>
        <h3 className="text-lg md:text-xl font-bold text-graphite-100 font-sans">
          {prompt}
        </h3>
        <p className="text-xs text-graphite-400 font-mono">
          Type your answer below or click the letter tiles in order.
        </p>
      </div>

      {/* Scrambled letter tiles if available */}
      {scrambled.length > 0 && (
        <div className="space-y-2">
          <span className="text-[11px] font-mono text-graphite-400 uppercase font-bold block">
            Letter Bank:
          </span>
          <div className="flex flex-wrap gap-2">
            {scrambled.map((ltr, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLetterClick(ltr)}
                disabled={disabled}
                className="w-10 h-10 rounded-xl bg-graphite-950 border border-graphite-750 hover:border-pink-400 hover:text-pink-300 font-mono font-bold text-base text-graphite-100 flex items-center justify-center transition-all cursor-pointer shadow-glass active:scale-95"
              >
                {ltr}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={typedValue}
            onChange={(e) => setTypedValue(e.target.value)}
            disabled={disabled}
            placeholder={payload.placeholder || 'Type your solution here...'}
            className="w-full p-4 rounded-2xl bg-graphite-950 border-2 border-graphite-750 focus:border-pink-400 focus:outline-none text-graphite-100 text-lg font-mono tracking-wider transition-all placeholder:text-graphite-600"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled || !typedValue}
            className="px-4 py-2 rounded-xl bg-graphite-800 hover:bg-graphite-750 text-graphite-300 text-xs font-mono flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>

          <button
            type="submit"
            disabled={disabled || !typedValue.trim()}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-neon to-mint-neon text-graphite-950 font-bold text-xs font-mono shadow-mint-glow/30 hover:opacity-95 flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-40"
          >
            <span>Submit Solution</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
