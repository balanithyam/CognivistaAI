import React, { useState } from 'react';
import { CheckCircle2, XCircle, Sparkles, HelpCircle } from 'lucide-react';

interface TrueFalseArenaProps {
  payload: {
    statement: string;
    context?: string;
  };
  prompt: string;
  onSubmit: (response: any) => void;
  disabled?: boolean;
}

export const TrueFalseArena: React.FC<TrueFalseArenaProps> = ({
  payload,
  prompt,
  onSubmit,
  disabled = false,
}) => {
  const statement = payload.statement || prompt;

  const handleChoice = (choice: boolean) => {
    if (disabled) return;
    onSubmit(choice);
  };

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-graphite-900 border border-graphite-800 space-y-6 shadow-glass animate-fadeIn max-w-2xl mx-auto">
      {/* Header */}
      <div className="space-y-2 text-center">
        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold uppercase tracking-wider inline-flex items-center space-x-1.5">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>True or False Challenge</span>
        </span>
        <h3 className="text-xl md:text-2xl font-bold text-graphite-100 font-sans pt-2">
          {statement}
        </h3>
        {payload.context && (
          <p className="text-xs text-graphite-400 italic font-mono max-w-lg mx-auto">
            {payload.context}
          </p>
        )}
      </div>

      {/* Two Big Action Tiles */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        {/* TRUE Button */}
        <button
          type="button"
          onClick={() => handleChoice(true)}
          disabled={disabled}
          className="p-6 md:p-8 rounded-3xl bg-emerald-500/10 hover:bg-emerald-500/20 border-2 border-emerald-500/40 hover:border-emerald-400 text-emerald-300 flex flex-col items-center justify-center space-y-3 transition-all cursor-pointer group hover:scale-[1.02] shadow-glass"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <span className="text-xl font-extrabold font-mono tracking-wider">TRUE</span>
          <span className="text-[11px] text-emerald-400/80 font-mono">Statement is correct</span>
        </button>

        {/* FALSE Button */}
        <button
          type="button"
          onClick={() => handleChoice(false)}
          disabled={disabled}
          className="p-6 md:p-8 rounded-3xl bg-rose-500/10 hover:bg-rose-500/20 border-2 border-rose-500/40 hover:border-rose-400 text-rose-300 flex flex-col items-center justify-center space-y-3 transition-all cursor-pointer group hover:scale-[1.02] shadow-glass"
        >
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <XCircle className="w-8 h-8 text-rose-400" />
          </div>
          <span className="text-xl font-extrabold font-mono tracking-wider">FALSE</span>
          <span className="text-[11px] text-rose-400/80 font-mono">Statement is incorrect</span>
        </button>
      </div>

      <div className="text-center text-[11px] font-mono text-graphite-500">
        Click either button to submit your decision instantly
      </div>
    </div>
  );
};
