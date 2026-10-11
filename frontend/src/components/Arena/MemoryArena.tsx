import React, { useState, useEffect } from 'react';
import { Eye, Sparkles, RotateCcw, Brain, Check } from 'lucide-react';

interface MemoryArenaProps {
  payload: any;
  onSubmit: (response: any) => void;
  disabled?: boolean;
}

export const MemoryArena: React.FC<MemoryArenaProps> = ({ payload, onSubmit, disabled }) => {
  const [phase, setPhase] = useState<'watch' | 'pause' | 'recall'>('watch');
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [userSequence, setUserSequence] = useState<[number, number][]>([]);

  const sequence: [number, number][] = payload.sequence || [[0, 1], [1, 2], [2, 0], [3, 3]];
  const isReverse: boolean = payload.is_reverse || false;
  const gridSize: number = payload.grid_size || 4;
  const flashIntervalMs: number = payload.flash_interval_ms || 650;

  // Flash animation loop
  useEffect(() => {
    setPhase('watch');
    setActiveStep(-1);
    setUserSequence([]);

    let step = 0;
    const timer = setInterval(() => {
      if (step < sequence.length) {
        setActiveStep(step);
        step++;
      } else {
        clearInterval(timer);
        setActiveStep(-1);
        setPhase('pause');

        setTimeout(() => {
          setPhase('recall');
        }, 800);
      }
    }, flashIntervalMs);

    return () => clearInterval(timer);
  }, [payload]);

  const handleTileClick = (r: number, c: number) => {
    if (phase !== 'recall' || disabled) return;
    if (userSequence.length >= sequence.length) return;

    // Check if tile already selected
    if (userSequence.some(([ur, uc]) => ur === r && uc === c)) return;

    setUserSequence((prev) => [...prev, [r, c]]);
  };

  const handleClear = () => {
    setUserSequence([]);
  };

  const handleSubmit = () => {
    if (userSequence.length === sequence.length && !disabled) {
      onSubmit(userSequence);
    }
  };

  const isFlashing = (r: number, c: number) => {
    if (phase !== 'watch' || activeStep < 0 || activeStep >= sequence.length) return false;
    const [targetR, targetC] = sequence[activeStep];
    return targetR === r && targetC === c;
  };

  const getTapNumber = (r: number, c: number) => {
    const idx = userSequence.findIndex(([ur, uc]) => ur === r && uc === c);
    return idx >= 0 ? idx + 1 : null;
  };

  return (
    <div className="space-y-6">
      {/* Friendly Game Status Banner */}
      <div className="p-5 rounded-2xl bg-graphite-900 border border-graphite-750 flex flex-wrap items-center justify-between gap-4 shadow-glass">
        <div className="flex items-center space-x-3">
          {phase === 'watch' && (
            <>
              <div className="w-10 h-10 rounded-xl bg-violet-neon/20 border border-violet-neon/40 text-violet-glow flex items-center justify-center animate-pulse">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase font-mono font-bold text-violet-glow">
                  Step 1: Watch Carefully
                </span>
                <p className="text-sm font-semibold text-graphite-100">
                  Memorize the order of glowing tiles ({activeStep + 1} of {sequence.length})
                </p>
              </div>
            </>
          )}

          {phase === 'pause' && (
            <>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center animate-spin">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase font-mono font-bold text-amber-300">
                  Get Ready...
                </span>
                <p className="text-sm font-semibold text-graphite-100">Hold the pattern in your head!</p>
              </div>
            </>
          )}

          {phase === 'recall' && (
            <>
              <div className="w-10 h-10 rounded-xl bg-mint-deep/30 border border-mint-glow text-mint-glow flex items-center justify-center shadow-mint-glow">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase font-mono font-bold text-mint-glow">
                  Step 2: Your Turn!
                </span>
                <p className="text-sm font-semibold text-graphite-100">
                  Tap the tiles in {isReverse ? 'REVERSE order (last to first)' : 'EXACT order'}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Live Counter */}
        <div className="px-4 py-2 rounded-xl bg-graphite-950 border border-graphite-800 text-xs font-mono text-graphite-300">
          Target: <span className="text-mint-glow font-bold">{sequence.length} Tiles</span> · Selected:{' '}
          <span className="text-violet-glow font-bold">{userSequence.length}</span>
        </div>
      </div>

      {/* Interactive Tile Matrix */}
      <div className="flex justify-center py-2">
        <div
          className="grid gap-3 p-5 rounded-3xl bg-graphite-950 border border-graphite-800 shadow-glass"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            width: `${Math.min(420, gridSize * 80)}px`,
          }}
        >
          {Array.from({ length: gridSize }).map((_, r) =>
            Array.from({ length: gridSize }).map((_, c) => {
              const flashing = isFlashing(r, c);
              const tapNum = getTapNumber(r, c);

              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  onClick={() => handleTileClick(r, c)}
                  disabled={phase !== 'recall' || disabled}
                  className={`aspect-square rounded-2xl border flex items-center justify-center font-mono font-bold text-base md:text-lg transition-all duration-200 select-none cursor-pointer ${
                    flashing
                      ? 'bg-violet-neon border-white text-white shadow-violet-glow scale-105 ring-4 ring-violet-glow/60'
                      : tapNum !== null
                      ? 'bg-mint-deep/40 border-mint-glow text-mint-glow shadow-mint-glow scale-100 ring-2 ring-mint-glow/40'
                      : 'bg-graphite-900 border-graphite-750 hover:border-violet-glow/50 hover:bg-graphite-850 text-graphite-400'
                  }`}
                >
                  {flashing && '★'}
                  {tapNum !== null && `#${tapNum}`}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={handleClear}
          disabled={phase !== 'recall' || userSequence.length === 0 || disabled}
          className="px-4 py-2.5 rounded-xl bg-graphite-800 hover:bg-graphite-750 text-graphite-200 text-xs font-mono flex items-center space-x-2 border border-graphite-700 disabled:opacity-30 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Selection</span>
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={userSequence.length !== sequence.length || phase !== 'recall' || disabled}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-neon to-mint-neon text-graphite-950 font-bold text-sm shadow-mint-glow hover:opacity-95 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 cursor-pointer flex items-center space-x-1.5"
        >
          <Check className="w-4 h-4" />
          <span>Submit My Pattern</span>
        </button>
      </div>
    </div>
  );
};
