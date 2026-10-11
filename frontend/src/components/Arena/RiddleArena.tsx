import React, { useState } from 'react';
import { Lightbulb, Sparkles, CheckCircle2 } from 'lucide-react';

interface RiddleArenaProps {
  payload: any;
  prompt: string;
  onSubmit: (response: any) => void;
  disabled?: boolean;
}

export const RiddleArena: React.FC<RiddleArenaProps> = ({ payload, prompt, onSubmit, disabled }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [freeformAnswer, setFreeformAnswer] = useState<string>('');

  const handleSelect = (opt: string) => {
    if (disabled) return;
    setSelectedOption(opt);
    onSubmit(opt);
  };

  const handleFreeformSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!freeformAnswer.trim() || disabled) return;
    onSubmit(freeformAnswer.trim());
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Riddle Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-graphite-900 border border-graphite-750 shadow-glass space-y-4">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-mono font-bold uppercase tracking-wider">
          <Lightbulb className="w-3.5 h-3.5 text-pink-400" />
          <span>{payload.badge || 'Clever Riddle & Word Play'}</span>
        </div>

        <p className="text-base md:text-lg text-graphite-100 font-sans leading-relaxed">
          {prompt}
        </p>
      </div>

      {/* Multiple Choice Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono uppercase text-graphite-400 tracking-wider">
          Select Your Answer:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                  <span className="text-sm md:text-base font-bold text-graphite-100 font-sans">
                    {opt}
                  </span>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-mint-glow shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional Freeform Type-in */}
      {payload.allow_text_input && (
        <form onSubmit={handleFreeformSubmit} className="pt-2 flex items-center space-x-2">
          <input
            type="text"
            value={freeformAnswer}
            onChange={(e) => setFreeformAnswer(e.target.value)}
            disabled={disabled}
            placeholder="Or type your riddle answer in your own words..."
            className="flex-1 py-3 px-4 rounded-xl bg-graphite-900 border border-graphite-750 text-graphite-100 placeholder-graphite-500 text-sm focus:outline-none focus:border-violet-glow font-sans"
          />
          <button
            type="submit"
            disabled={!freeformAnswer.trim() || disabled}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-neon to-mint-neon text-graphite-950 font-bold text-xs font-mono disabled:opacity-40 transition-opacity"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};
