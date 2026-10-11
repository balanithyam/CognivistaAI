import React, { useState } from 'react';
import { CheckSquare, Square, Sparkles, Check } from 'lucide-react';

interface MultiSelectArenaProps {
  payload: {
    options: Array<{ id: string; text: string; label?: string }>;
    required_count?: number;
  };
  prompt: string;
  onSubmit: (response: any) => void;
  disabled?: boolean;
}

export const MultiSelectArena: React.FC<MultiSelectArenaProps> = ({
  payload,
  prompt,
  onSubmit,
  disabled = false,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const options = payload.options || [];

  const handleToggle = (id: string) => {
    if (disabled) return;
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSubmit = () => {
    if (disabled || selectedIds.length === 0) return;
    onSubmit(selectedIds);
  };

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-graphite-900 border border-graphite-800 space-y-6 shadow-glass animate-fadeIn">
      {/* Question Prompt */}
      <div className="space-y-2">
        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-mono font-bold uppercase tracking-wider inline-flex items-center space-x-1">
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Multiple-Answer Challenge (Select All That Apply)</span>
        </span>
        <h3 className="text-lg md:text-xl font-bold text-graphite-100 font-sans">
          {prompt}
        </h3>
        <p className="text-xs text-graphite-400 font-mono">
          Select all correct options below, then click submit.
        </p>
      </div>

      {/* Options List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {options.map((opt) => {
          const isSelected = selectedIds.includes(opt.id);

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleToggle(opt.id)}
              disabled={disabled}
              className={`p-4 rounded-2xl border text-left flex items-start space-x-3.5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500/10 border-cyan-400 text-white ring-2 ring-cyan-400/30 shadow-glass'
                  : 'bg-graphite-950/80 border-graphite-800 text-graphite-300 hover:border-graphite-700 hover:bg-graphite-850'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isSelected ? (
                  <CheckSquare className="w-5 h-5 text-cyan-400" />
                ) : (
                  <Square className="w-5 h-5 text-graphite-600" />
                )}
              </div>
              <div className="space-y-0.5">
                {opt.label && (
                  <span className="text-[10px] font-mono uppercase font-bold text-graphite-400 block">
                    {opt.label}
                  </span>
                )}
                <span className="text-xs md:text-sm font-sans font-medium text-graphite-100">
                  {opt.text}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer & Submit */}
      <div className="flex items-center justify-between pt-4 border-t border-graphite-800">
        <span className="text-xs font-mono text-graphite-400">
          Selected: <strong className="text-cyan-400">{selectedIds.length}</strong> option{selectedIds.length === 1 ? '' : 's'}
        </span>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || selectedIds.length === 0}
          className={`px-6 py-2.5 rounded-xl font-bold text-xs font-mono flex items-center space-x-2 transition-all cursor-pointer ${
            selectedIds.length > 0
              ? 'bg-gradient-to-r from-violet-neon to-mint-neon text-graphite-950 shadow-mint-glow/30 hover:opacity-95'
              : 'bg-graphite-800 text-graphite-400 border border-graphite-750 opacity-40'
          }`}
        >
          <Sparkles className="w-4 h-4 fill-current" />
          <span>Submit Answers</span>
        </button>
      </div>
    </div>
  );
};
