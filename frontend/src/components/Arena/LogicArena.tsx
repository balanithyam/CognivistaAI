import React, { useState } from 'react';
import { Layers, CheckCircle2 } from 'lucide-react';

interface LogicArenaProps {
  payload: any;
  onSubmit: (response: any) => void;
  disabled?: boolean;
}

export const LogicArena: React.FC<LogicArenaProps> = ({ payload, onSubmit, disabled }) => {
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);

  const clues: string[] = payload.clues || [];
  const options: any[] = payload.options || [];
  const isMatrixPattern = !!payload.grid;

  const handleSubmit = () => {
    if (selectedOption !== null && !disabled) {
      onSubmit(selectedOption);
    }
  };

  // Render Raven-style Matrix pattern if present
  if (isMatrixPattern) {
    const grid: any[][] = payload.grid;
    return (
      <div className="space-y-6">
        <div className="p-4 rounded-xl bg-graphite-900 border border-graphite-750">
          <span className="text-xs uppercase font-mono text-violet-glow font-bold">
            Abstract Orthogonal Matrix
          </span>
          <p className="text-xs text-graphite-300 mt-1">
            Observe the row-wise and column-wise distribution of shapes, fill patterns, and dot indicators.
          </p>
        </div>

        {/* 3x3 Matrix Grid */}
        <div className="flex justify-center">
          <div className="grid grid-cols-3 gap-3 p-4 bg-graphite-950 rounded-2xl border border-graphite-800 shadow-glass">
            {grid.map((row, rIdx) =>
              row.map((cell, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className="w-24 h-24 rounded-xl bg-graphite-900 border border-graphite-750 flex flex-col items-center justify-center p-2"
                >
                  {cell.missing ? (
                    <span className="text-2xl font-mono font-bold text-violet-glow animate-pulse">?</span>
                  ) : (
                    <div className="text-center space-y-1">
                      <span className="text-xs font-mono font-bold uppercase text-mint-glow">
                        {cell.shape}
                      </span>
                      <div className="text-[10px] font-mono text-graphite-400">
                        {cell.fill} · {cell.dots} pts
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Options */}
        <div>
          <h5 className="text-xs font-mono uppercase text-graphite-400 tracking-wider mb-3">
            Select Missing Matrix Cell:
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedOption(idx)}
                  disabled={disabled}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-between text-center transition-all ${
                    isSelected
                      ? 'bg-violet-neon/15 border-violet-neon shadow-violet-glow'
                      : 'bg-graphite-900/60 border-graphite-800 hover:border-graphite-650'
                  }`}
                >
                  <span className="text-xs font-mono text-graphite-400">Option {chr(65 + idx)}</span>
                  <div className="my-2">
                    <span className="text-sm font-bold text-mint-glow uppercase block">{opt.shape}</span>
                    <span className="text-[11px] text-graphite-300 block">{opt.fill} fill</span>
                    <span className="text-[10px] text-graphite-400 font-mono block">{opt.dots} indicators</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-violet-glow" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedOption === null || disabled}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-neon to-mint-neon text-graphite-950 font-semibold text-sm shadow-mint-glow hover:opacity-95 disabled:opacity-30 transition-all"
          >
            Submit Matrix Solution
          </button>
        </div>
      </div>
    );
  }

  // Standard Relational Deduction Puzzle
  return (
    <div className="space-y-6">
      {/* Relational Clue Canvas */}
      <div className="p-5 rounded-2xl bg-graphite-900/90 border border-graphite-750 space-y-3 shadow-glass">
        <div className="flex items-center space-x-2 text-violet-glow text-xs uppercase font-mono font-bold tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Relational Boundary Clues</span>
        </div>

        <div className="space-y-2">
          {clues.map((clue, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-graphite-950/60 border border-graphite-800/80 text-xs text-graphite-200 font-sans flex items-start space-x-3"
            >
              <span className="font-mono text-mint-glow font-bold mt-0.5">#{idx + 1}</span>
              <span>{clue}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Answer Candidates */}
      <div>
        <h5 className="text-xs font-mono uppercase text-graphite-400 tracking-wider mb-3">
          Select Deductive Resolution:
        </h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {options.map((opt: any, idx: number) => {
            const isSelected = selectedOption === opt;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedOption(opt)}
                disabled={disabled}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-violet-neon/15 border-violet-neon shadow-violet-glow scale-[1.02]'
                    : 'bg-graphite-900/60 border-graphite-800 hover:border-graphite-650 hover:bg-graphite-850'
                } disabled:opacity-50`}
              >
                <span className="text-sm font-medium text-graphite-100">{opt}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-violet-glow shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Action */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={selectedOption === null || disabled}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-neon to-mint-neon text-graphite-950 font-semibold text-sm shadow-mint-glow hover:opacity-95 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
        >
          Confirm Logical Deduction
        </button>
      </div>
    </div>
  );
};

function chr(code: number): string {
  return String.fromCharCode(code);
}
