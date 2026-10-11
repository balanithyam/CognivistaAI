import React, { useState } from 'react';
import { HelpCircle, Sparkles, Check, AlertCircle } from 'lucide-react';

interface OddOneOutArenaProps {
  payload: {
    items: Array<{ id: string; text: string; subtext?: string }>;
  };
  prompt: string;
  onSubmit: (response: any) => void;
  disabled?: boolean;
}

export const OddOneOutArena: React.FC<OddOneOutArenaProps> = ({
  payload,
  prompt,
  onSubmit,
  disabled = false,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const items = payload.items || [];

  const handleSelect = (id: string) => {
    if (disabled) return;
    setSelectedId(id);
    onSubmit(id);
  };

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-graphite-900 border border-graphite-800 space-y-6 shadow-glass animate-fadeIn max-w-3xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-mono font-bold uppercase tracking-wider inline-flex items-center space-x-1">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Odd One Out Reasoning</span>
        </span>
        <h3 className="text-lg md:text-xl font-bold text-graphite-100 font-sans">
          {prompt}
        </h3>
        <p className="text-xs text-graphite-400 font-mono">
          Click the single item that does NOT belong with the others based on their common property.
        </p>
      </div>

      {/* Grid of Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {items.map((item, idx) => {
          const isSelected = selectedId === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              disabled={disabled}
              className={`p-5 rounded-2xl border text-left flex items-start space-x-3.5 transition-all cursor-pointer group hover:scale-[1.01] ${
                isSelected
                  ? 'bg-amber-500/20 border-amber-400 text-white shadow-glass ring-2 ring-amber-400/40'
                  : 'bg-graphite-950/80 border-graphite-800 text-graphite-200 hover:border-amber-400/50 hover:bg-graphite-850'
              }`}
            >
              <span className="w-7 h-7 rounded-xl bg-graphite-900 border border-graphite-750 flex items-center justify-center font-mono font-bold text-xs text-amber-400 shrink-0">
                {chr(65 + idx)}
              </span>

              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-graphite-100 block">
                  {item.text}
                </span>
                {item.subtext && (
                  <span className="text-xs text-graphite-400 block font-mono">
                    {item.subtext}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-center text-[11px] font-mono text-graphite-500 pt-2">
        Select the outlier to submit your reasoning
      </div>
    </div>
  );
};

function chr(code: number) {
  return String.fromCharCode(code);
}
