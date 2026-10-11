import React, { useState } from 'react';
import { ArrowUp, ArrowDown, ListOrdered, Sparkles, RotateCcw } from 'lucide-react';

interface OrderingArenaProps {
  payload: {
    items: Array<{ id: string; text: string }>;
  };
  prompt: string;
  onSubmit: (response: any) => void;
  disabled?: boolean;
}

export const OrderingArena: React.FC<OrderingArenaProps> = ({
  payload,
  prompt,
  onSubmit,
  disabled = false,
}) => {
  const initialItems = payload.items || [];
  const [items, setItems] = useState<Array<{ id: string; text: string }>>(initialItems);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (disabled) return;
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setItems(newItems);
  };

  const handleReset = () => {
    if (disabled) return;
    setItems(initialItems);
  };

  const handleSubmit = () => {
    if (disabled) return;
    onSubmit(items.map((it) => it.id));
  };

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-graphite-900 border border-graphite-800 space-y-6 shadow-glass animate-fadeIn">
      {/* Question Prompt */}
      <div className="space-y-2">
        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-mono font-bold uppercase tracking-wider inline-flex items-center space-x-1">
          <ListOrdered className="w-3.5 h-3.5" />
          <span>Logical Sequence & Ordering</span>
        </span>
        <h3 className="text-lg md:text-xl font-bold text-graphite-100 font-sans">
          {prompt}
        </h3>
        <p className="text-xs text-graphite-400 font-mono">
          Use the ▲ and ▼ buttons to arrange the items in the correct order from top to bottom.
        </p>
      </div>

      {/* Ordered List Items */}
      <div className="space-y-2.5">
        {items.map((item, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === items.length - 1;

          return (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-graphite-950/80 border border-graphite-800 hover:border-graphite-700 flex items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-center space-x-3.5">
                <span className="w-7 h-7 rounded-xl bg-graphite-900 border border-graphite-750 flex items-center justify-center font-mono font-bold text-xs text-mint-glow shrink-0">
                  {idx + 1}
                </span>
                <span className="text-xs md:text-sm font-sans font-medium text-graphite-200">
                  {item.text}
                </span>
              </div>

              {/* Move Controls */}
              <div className="flex items-center space-x-1 shrink-0">
                <button
                  type="button"
                  onClick={() => moveItem(idx, 'up')}
                  disabled={disabled || isFirst}
                  className="p-2 rounded-xl bg-graphite-900 hover:bg-graphite-850 text-graphite-300 hover:text-white border border-graphite-800 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => moveItem(idx, 'down')}
                  disabled={disabled || isLast}
                  className="p-2 rounded-xl bg-graphite-900 hover:bg-graphite-850 text-graphite-300 hover:text-white border border-graphite-800 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress & Submit */}
      <div className="flex items-center justify-between pt-4 border-t border-graphite-800">
        <span className="text-xs font-mono text-graphite-400">
          Arranged: <strong className="text-graphite-200">{items.length} steps</strong>
        </span>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={disabled}
            className="px-4 py-2 rounded-xl bg-graphite-800 hover:bg-graphite-750 text-graphite-300 text-xs font-mono flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={disabled}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-neon to-mint-neon text-graphite-950 font-bold text-xs font-mono shadow-mint-glow/30 hover:opacity-95 flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Submit Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};
