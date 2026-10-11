import React, { useState } from 'react';
import { ArrowRight, Binary } from 'lucide-react';

interface NumericalArenaProps {
  payload: any;
  onSubmit: (response: any) => void;
  disabled?: boolean;
}

export const NumericalArena: React.FC<NumericalArenaProps> = ({ payload, onSubmit, disabled }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<number | string | null>(null);

  const sequence: string[] = payload.sequence || [];
  const options: (number | string)[] = payload.options || [];

  const handleSelectOption = (opt: number | string) => {
    setSelectedOption(opt);
    setInputValue(String(opt));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = inputValue.trim() || selectedOption;
    if (val !== null && val !== '' && !disabled) {
      onSubmit(val);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sequence Visualizer */}
      <div className="p-6 rounded-2xl bg-graphite-900 border border-graphite-750 shadow-glass">
        <div className="flex items-center space-x-2 text-violet-glow text-xs uppercase font-mono font-bold tracking-wider mb-4">
          <Binary className="w-4 h-4" />
          <span>Pattern Hunter: Number Series</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {sequence.map((term, idx) => {
            const isMissing = term === '?';
            return (
              <React.Fragment key={idx}>
                <div
                  className={`min-w-16 h-16 px-4 rounded-xl flex items-center justify-center font-mono font-bold text-lg md:text-xl transition-all ${
                    isMissing
                      ? 'bg-violet-neon/20 border-2 border-dashed border-violet-glow text-mint-glow animate-pulse ring-4 ring-violet-neon/20 shadow-violet-glow'
                      : 'bg-graphite-950 border border-graphite-800 text-graphite-100 shadow-inner'
                  }`}
                >
                  {isMissing ? (inputValue || '?') : term}
                </div>
                {idx < sequence.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-graphite-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Quick Option Candidates */}
      {options.length > 0 && (
        <div>
          <h5 className="text-xs font-mono uppercase text-graphite-400 tracking-wider mb-3">
            Fast Select Derived Value:
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {options.map((opt, idx) => {
              const isSelected = selectedOption === opt || inputValue === String(opt);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  disabled={disabled}
                  className={`p-3.5 rounded-xl border font-mono font-bold text-base transition-all ${
                    isSelected
                      ? 'bg-violet-neon/20 border-violet-neon text-mint-glow shadow-violet-glow scale-[1.02]'
                      : 'bg-graphite-900/60 border-graphite-800 hover:border-graphite-650 hover:bg-graphite-850 text-graphite-200'
                  } disabled:opacity-50`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Manual Input Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="w-full sm:w-auto flex-1 max-w-sm">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setSelectedOption(null);
            }}
            placeholder="Type calculated number..."
            disabled={disabled}
            className="w-full py-2.5 px-4 rounded-xl bg-graphite-900 border border-graphite-750 text-graphite-100 placeholder-graphite-500 font-mono text-sm focus:outline-none focus:border-violet-glow"
          />
        </div>

        <button
          type="submit"
          disabled={(!inputValue.trim() && selectedOption === null) || disabled}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-neon to-mint-neon text-graphite-950 font-semibold text-sm shadow-mint-glow hover:opacity-95 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
        >
          Confirm Computed Value
        </button>
      </form>
    </div>
  );
};
