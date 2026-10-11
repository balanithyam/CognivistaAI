import React, { useState } from 'react';
import { Globe2, Plane, DollarSign, Lightbulb, CheckCircle2 } from 'lucide-react';

interface PracticalLifeArenaProps {
  payload: any;
  prompt: string;
  onSubmit: (response: any) => void;
  disabled?: boolean;
}

export const PracticalLifeArena: React.FC<PracticalLifeArenaProps> = ({ payload, prompt, onSubmit, disabled }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (opt: string) => {
    if (disabled) return;
    setSelectedOption(opt);
    onSubmit(opt);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Real-World Scenario Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-graphite-900 border border-graphite-750 shadow-glass space-y-4">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{payload.badge || 'Real-World Life Skill'}</span>
          </div>

          {payload.departure && (
            <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-mono font-bold">
              <Plane className="w-3 h-3" />
              <span>International Route</span>
            </div>
          )}

          {payload.principal && (
            <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-mint-deep/30 text-mint-glow border border-mint-glow/30 text-xs font-mono font-bold">
              <DollarSign className="w-3 h-3" />
              <span>Personal Finance</span>
            </div>
          )}
        </div>

        <p className="text-base text-graphite-100 font-sans leading-relaxed">
          {prompt}
        </p>

        {/* Travel Breakdown if present */}
        {payload.departure && (
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-graphite-800 text-xs font-mono">
            <div className="p-3 rounded-xl bg-graphite-950/80 border border-graphite-800">
              <span className="text-graphite-500 block uppercase text-[10px]">Departs</span>
              <span className="text-graphite-200 font-bold">{payload.departure}</span>
            </div>
            <div className="p-3 rounded-xl bg-graphite-950/80 border border-graphite-800">
              <span className="text-graphite-500 block uppercase text-[10px]">Flight Duration</span>
              <span className="text-mint-glow font-bold">{payload.duration}</span>
            </div>
          </div>
        )}

        {/* Finance Breakdown if present */}
        {payload.principal && (
          <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-graphite-800 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-graphite-950/80 border border-graphite-800 text-center">
              <span className="text-graphite-500 block uppercase text-[10px]">Starting</span>
              <span className="text-graphite-200 font-bold">{payload.principal}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-graphite-950/80 border border-graphite-800 text-center">
              <span className="text-graphite-500 block uppercase text-[10px]">Return</span>
              <span className="text-mint-glow font-bold">{payload.return_rate}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-graphite-950/80 border border-graphite-800 text-center">
              <span className="text-graphite-500 block uppercase text-[10px]">Target</span>
              <span className="text-violet-glow font-bold">{payload.target}</span>
            </div>
          </div>
        )}
      </div>

      {/* Multiple Choice Options */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono uppercase text-graphite-400 tracking-wider">
          Choose the correct real-world outcome:
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
    </div>
  );
};
