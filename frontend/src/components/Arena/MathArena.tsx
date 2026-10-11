import React, { useState } from 'react';
import { Calculator, Tag, Percent, ArrowRight, CheckCircle2 } from 'lucide-react';

interface MathArenaProps {
  payload: any;
  prompt: string;
  onSubmit: (response: any) => void;
  disabled?: boolean;
}

export const MathArena: React.FC<MathArenaProps> = ({ payload, prompt, onSubmit, disabled }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState<string>('');

  const handleSelect = (opt: string) => {
    if (disabled) return;
    setSelectedOption(opt);
    onSubmit(opt);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim() || disabled) return;
    onSubmit(customInput.trim());
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Problem Scenario Card */}
      <div className="p-6 rounded-3xl bg-graphite-900 border border-graphite-750 shadow-glass space-y-4">
        {/* Badge & Title */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-violet-neon/15 border border-violet-neon/30 text-violet-glow text-xs font-mono font-bold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            <span>{payload.badge || 'Everyday Math'}</span>
          </div>

          {payload.discount && (
            <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-mint-deep/30 border border-mint-glow/30 text-mint-glow text-xs font-mono font-bold">
              <Tag className="w-3 h-3" />
              <span>{payload.discount} DISCOUNT</span>
            </div>
          )}
        </div>

        {/* Prompt Text */}
        <p className="text-base text-graphite-100 font-sans leading-relaxed">
          {prompt}
        </p>

        {/* Visual Parameter Chips (if shopping or utility) */}
        {(payload.orig_price || payload.appliance || payload.expression) && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-graphite-800">
            {payload.orig_price && (
              <div className="p-2.5 rounded-xl bg-graphite-950/80 border border-graphite-800 text-center">
                <span className="text-[10px] font-mono text-graphite-400 block uppercase">Original Price</span>
                <span className="text-sm font-bold text-graphite-200 font-mono">{payload.orig_price}</span>
              </div>
            )}
            {payload.discount && (
              <div className="p-2.5 rounded-xl bg-graphite-950/80 border border-graphite-800 text-center">
                <span className="text-[10px] font-mono text-graphite-400 block uppercase">Discount Rate</span>
                <span className="text-sm font-bold text-mint-glow font-mono">{payload.discount}</span>
              </div>
            )}
            {payload.saved_amount && (
              <div className="p-2.5 rounded-xl bg-graphite-950/80 border border-graphite-800 text-center">
                <span className="text-[10px] font-mono text-graphite-400 block uppercase">You Save</span>
                <span className="text-sm font-bold text-violet-glow font-mono">{payload.saved_amount}</span>
              </div>
            )}
            {payload.watts && (
              <div className="p-2.5 rounded-xl bg-graphite-950/80 border border-graphite-800 text-center">
                <span className="text-[10px] font-mono text-graphite-400 block uppercase">Power Rating</span>
                <span className="text-sm font-bold text-amber-400 font-mono">{payload.watts}</span>
              </div>
            )}
            {payload.hours && (
              <div className="p-2.5 rounded-xl bg-graphite-950/80 border border-graphite-800 text-center">
                <span className="text-[10px] font-mono text-graphite-400 block uppercase">Run Time</span>
                <span className="text-sm font-bold text-graphite-200 font-mono">{payload.hours}</span>
              </div>
            )}
            {payload.rate && (
              <div className="p-2.5 rounded-xl bg-graphite-950/80 border border-graphite-800 text-center">
                <span className="text-[10px] font-mono text-graphite-400 block uppercase">Utility Rate</span>
                <span className="text-sm font-bold text-graphite-200 font-mono">{payload.rate}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Multiple Choice Cards */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono uppercase text-graphite-400 tracking-wider">
          Choose the correct calculated amount:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(payload.options || []).map((opt: string, idx: number) => {
            const isSelected = selectedOption === opt;
            const letter = String.fromCharCode(65 + idx);

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(opt)}
                disabled={disabled}
                className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-violet-neon/20 border-violet-glow scale-102 ring-2 ring-violet-glow shadow-violet-glow'
                    : 'bg-graphite-900/80 border-graphite-750 hover:border-graphite-600 hover:bg-graphite-850 active:scale-98'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 rounded-xl bg-graphite-950 border border-graphite-800 flex items-center justify-center font-mono font-bold text-xs text-graphite-400">
                    {letter}
                  </span>
                  <span className="text-base font-bold text-graphite-100 font-mono">
                    {opt}
                  </span>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-mint-glow shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Direct Custom Answer Input */}
      {payload.allow_text_input && (
        <form onSubmit={handleCustomSubmit} className="pt-2 flex items-center space-x-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            disabled={disabled}
            placeholder="Or type numerical answer..."
            className="flex-1 py-3 px-4 rounded-xl bg-graphite-900 border border-graphite-750 text-graphite-100 placeholder-graphite-500 text-sm focus:outline-none focus:border-violet-glow font-mono"
          />
          <button
            type="submit"
            disabled={!customInput.trim() || disabled}
            className="px-5 py-3 rounded-xl bg-graphite-800 hover:bg-graphite-750 border border-graphite-700 text-graphite-200 text-xs font-mono font-bold disabled:opacity-40 transition-colors"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};
