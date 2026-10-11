import React, { useState } from 'react';
import { Search, CheckSquare, Square, Award, CheckCircle2 } from 'lucide-react';

interface DetectiveArenaProps {
  payload: any;
  prompt: string;
  onSubmit: (response: any) => void;
  disabled?: boolean;
}

export const DetectiveArena: React.FC<DetectiveArenaProps> = ({ payload, prompt, onSubmit, disabled }) => {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [checkedClues, setCheckedClues] = useState<Record<number, boolean>>({});

  const toggleClue = (idx: number) => {
    setCheckedClues((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleSelect = (candidate: string) => {
    if (disabled) return;
    setSelectedCandidate(candidate);
    onSubmit(candidate);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Detective Header & Goal */}
      <div className="p-6 rounded-3xl bg-graphite-900 border border-graphite-750 shadow-glass space-y-4">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-mint-deep/30 border border-mint-glow/30 text-mint-glow text-xs font-mono font-bold uppercase tracking-wider">
            <Search className="w-3.5 h-3.5" />
            <span>{payload.badge || 'Detective Clues'}</span>
          </div>

          {payload.target_position && (
            <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-violet-neon/20 border border-violet-neon/40 text-violet-glow text-xs font-mono font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>Target: {payload.target_position}</span>
            </div>
          )}
        </div>

        <p className="text-sm md:text-base text-graphite-100 font-sans leading-relaxed">
          {prompt}
        </p>
      </div>

      {/* Interactive Clue Checklist */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-mono text-graphite-400">
          <span>Clue Notebook (Click to check off analyzed clues):</span>
          <span>{Object.values(checkedClues).filter(Boolean).length}/{payload.clues.length} checked</span>
        </div>

        <div className="space-y-2">
          {(payload.clues || []).map((clue: string, idx: number) => {
            const isChecked = !!checkedClues[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleClue(idx)}
                className={`p-3.5 rounded-xl border flex items-start space-x-3 cursor-pointer transition-all select-none ${
                  isChecked
                    ? 'bg-graphite-950 border-graphite-800 text-graphite-500 line-through opacity-75'
                    : 'bg-graphite-900/90 border-graphite-750 text-graphite-200 hover:border-graphite-650'
                }`}
              >
                <div className="pt-0.5 shrink-0 text-mint-glow">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-graphite-500" />
                  ) : (
                    <Square className="w-4 h-4 text-mint-glow" />
                  )}
                </div>
                <span className="text-xs md:text-sm font-sans">{clue}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Candidate Decision Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono uppercase text-graphite-400 tracking-wider">
          Select Your Deductive Conclusion:
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {(payload.options || []).map((cand: string, idx: number) => {
            const isSelected = selectedCandidate === cand;
            const letter = String.fromCharCode(65 + idx);

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(cand)}
                disabled={disabled}
                className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-violet-neon/20 border-violet-glow scale-102 ring-2 ring-violet-glow shadow-violet-glow'
                    : 'bg-graphite-900/80 border-graphite-750 hover:border-graphite-600 hover:bg-graphite-850 active:scale-98'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="w-7 h-7 rounded-xl bg-graphite-950 border border-graphite-800 flex items-center justify-center font-mono font-bold text-xs text-graphite-400">
                    {letter}
                  </span>
                  <span className="text-sm md:text-base font-bold text-graphite-100 font-sans">
                    {cand}
                  </span>
                </div>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-mint-glow shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
