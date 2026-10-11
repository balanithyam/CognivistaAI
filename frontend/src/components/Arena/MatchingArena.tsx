import React, { useState } from 'react';
import { Check, RotateCcw, Link2, Sparkles } from 'lucide-react';

interface MatchingArenaProps {
  payload: {
    left_items: Array<{ id: string; text: string }>;
    right_items: Array<{ id: string; text: string }>;
    pairs: Record<string, string>; // left_id -> right_id
  };
  prompt: string;
  onSubmit: (response: any) => void;
  disabled?: boolean;
}

export const MatchingArena: React.FC<MatchingArenaProps> = ({
  payload,
  prompt,
  onSubmit,
  disabled = false,
}) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({}); // left_id -> right_id

  const leftItems = payload.left_items || [];
  const rightItems = payload.right_items || [];
  const totalPairs = leftItems.length;

  const handleLeftClick = (id: string) => {
    if (disabled) return;
    setSelectedLeft(id === selectedLeft ? null : id);
  };

  const handleRightClick = (rightId: string) => {
    if (disabled || !selectedLeft) return;

    // Check if right item is already matched to another left
    const newMatches = { ...matchedPairs };
    // Remove any existing match with this rightId
    Object.keys(newMatches).forEach((k) => {
      if (newMatches[k] === rightId) delete newMatches[k];
    });

    // Pair selectedLeft with rightId
    newMatches[selectedLeft] = rightId;
    setMatchedPairs(newMatches);
    setSelectedLeft(null);
  };

  const handleReset = () => {
    if (disabled) return;
    setMatchedPairs({});
    setSelectedLeft(null);
  };

  const handleSubmit = () => {
    if (disabled || Object.keys(matchedPairs).length === 0) return;
    onSubmit(matchedPairs);
  };

  const isComplete = Object.keys(matchedPairs).length === totalPairs;

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-graphite-900 border border-graphite-800 space-y-6 shadow-glass animate-fadeIn">
      {/* Question Prompt */}
      <div className="space-y-2">
        <span className="px-2.5 py-0.5 rounded-full bg-violet-neon/20 text-violet-glow text-[11px] font-mono font-bold uppercase tracking-wider inline-flex items-center space-x-1">
          <Link2 className="w-3.5 h-3.5" />
          <span>Interactive Pair Matching</span>
        </span>
        <h3 className="text-lg md:text-xl font-bold text-graphite-100 font-sans">
          {prompt}
        </h3>
        <p className="text-xs text-graphite-400 font-mono">
          Click an item on the left, then click its corresponding match on the right.
        </p>
      </div>

      {/* Two Column Matching Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold text-graphite-400 uppercase tracking-wider block">
            Column A
          </span>
          <div className="space-y-2">
            {leftItems.map((item) => {
              const isSelected = selectedLeft === item.id;
              const isMatched = !!matchedPairs[item.id];
              const matchedRightId = matchedPairs[item.id];
              const matchedRightText = rightItems.find((r) => r.id === matchedRightId)?.text;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleLeftClick(item.id)}
                  disabled={disabled}
                  className={`w-full p-4 rounded-2xl border text-left text-xs md:text-sm font-sans font-medium transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-violet-neon/30 border-violet-neon text-white ring-2 ring-violet-neon/50 shadow-violet-glow'
                      : isMatched
                      ? 'bg-graphite-850 border-mint-glow/50 text-mint-glow'
                      : 'bg-graphite-950/80 border-graphite-800 text-graphite-200 hover:border-graphite-700'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div>{item.text}</div>
                    {isMatched && (
                      <span className="text-[10px] font-mono text-graphite-400 block">
                        ➔ Paired with: <strong className="text-mint-glow">{matchedRightText}</strong>
                      </span>
                    )}
                  </div>
                  {isMatched && <Check className="w-4 h-4 text-mint-glow shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold text-graphite-400 uppercase tracking-wider block">
            Column B
          </span>
          <div className="space-y-2">
            {rightItems.map((item) => {
              const matchedLeftId = Object.keys(matchedPairs).find((k) => matchedPairs[k] === item.id);
              const isMatched = !!matchedLeftId;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleRightClick(item.id)}
                  disabled={disabled || !selectedLeft}
                  className={`w-full p-4 rounded-2xl border text-left text-xs md:text-sm font-sans font-medium transition-all cursor-pointer flex items-center justify-between ${
                    isMatched
                      ? 'bg-graphite-850 border-mint-glow/50 text-mint-glow'
                      : selectedLeft
                      ? 'bg-graphite-950 border-graphite-700 hover:border-violet-neon hover:bg-violet-neon/10 text-graphite-100 ring-1 ring-violet-neon/20'
                      : 'bg-graphite-950/80 border-graphite-800 text-graphite-300 opacity-80'
                  }`}
                >
                  <span>{item.text}</span>
                  {isMatched && <Check className="w-4 h-4 text-mint-glow shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress & Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-graphite-800">
        <div className="text-xs font-mono text-graphite-400 flex items-center space-x-2">
          <span>Pairs matched:</span>
          <strong className="text-mint-glow">
            {Object.keys(matchedPairs).length} / {totalPairs}
          </strong>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={disabled || Object.keys(matchedPairs).length === 0}
            className="px-4 py-2 rounded-xl bg-graphite-800 hover:bg-graphite-750 text-graphite-300 text-xs font-mono flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={disabled || Object.keys(matchedPairs).length === 0}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs font-mono flex items-center space-x-2 transition-all cursor-pointer ${
              isComplete
                ? 'bg-gradient-to-r from-violet-neon to-mint-neon text-graphite-950 shadow-mint-glow/30 hover:opacity-95'
                : 'bg-graphite-800 text-graphite-300 hover:text-white border border-graphite-700'
            }`}
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Submit Pairs</span>
          </button>
        </div>
      </div>
    </div>
  );
};
