import React, { useState, useEffect, useRef } from 'react';
import { Zap, Timer, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface SpeedArenaProps {
  payload: any;
  onSubmit: (response: any) => void;
  disabled?: boolean;
}

export const SpeedArena: React.FC<SpeedArenaProps> = ({ payload, onSubmit, disabled }) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [timeLeftMs, setTimeLeftMs] = useState<number>((payload.time_limit_seconds || 6) * 1000);
  const startTimeRef = useRef<number>(Date.now());
  const maxTimeMs = (payload.time_limit_seconds || 6) * 1000;

  useEffect(() => {
    startTimeRef.current = Date.now();
    setTimeLeftMs(maxTimeMs);

    const timer = setInterval(() => {
      const remaining = maxTimeMs - (Date.now() - startTimeRef.current);
      if (remaining <= 0) {
        clearInterval(timer);
        setTimeLeftMs(0);
      } else {
        setTimeLeftMs(remaining);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [payload.display_word, payload.ink_color]);

  const handleSelect = (colorName: string) => {
    if (disabled || selectedColor) return;
    setSelectedColor(colorName);
    onSubmit(colorName);
  };

  const progressPercent = Math.max(0, Math.min(100, (timeLeftMs / maxTimeMs) * 100));
  const isUrgent = progressPercent < 30;

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Header Badge & Rapid Instruction */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>{payload.badge || 'Speed & Reflex Test'}</span>
        </div>
        <h3 className="text-lg md:text-xl font-bold text-graphite-100">
          What is the <span className="underline decoration-mint-glow decoration-2">INK COLOR</span> of the word?
        </h3>
        <p className="text-xs text-graphite-400 font-sans">
          Ignore the written letters! Click the visual color of the font as fast as you can.
        </p>
      </div>

      {/* Countdown Timer Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-graphite-400 flex items-center space-x-1">
            <Timer className={`w-3.5 h-3.5 ${isUrgent ? 'text-red-400 animate-pulse' : 'text-mint-glow'}`} />
            <span>Reflex Timer:</span>
          </span>
          <span className={`font-bold ${isUrgent ? 'text-red-400' : 'text-graphite-200'}`}>
            {(timeLeftMs / 1000).toFixed(1)}s
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-graphite-950 overflow-hidden border border-graphite-800">
          <div
            className={`h-full transition-all duration-75 rounded-full ${
              isUrgent ? 'bg-red-500 shadow-red-500/50' : 'bg-gradient-to-r from-mint-neon to-violet-neon'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Center Word Display with Conflicting Color */}
      <div className="p-8 md:p-12 rounded-3xl bg-graphite-950 border border-graphite-800 flex items-center justify-center shadow-inner relative overflow-hidden group">
        <div className="absolute inset-0 bg-radial from-violet-950/20 to-transparent pointer-events-none" />
        <span
          className="text-4xl md:text-6xl font-black tracking-widest select-none transition-transform duration-200 group-hover:scale-105"
          style={{
            color: payload.ink_hex,
            textShadow: `0 0 25px ${payload.ink_hex}55, 0 0 40px ${payload.ink_hex}22`
          }}
        >
          {payload.display_word}
        </span>
      </div>

      {/* Big Colorful Response Buttons */}
      <div className="grid grid-cols-2 gap-3.5">
        {(payload.options || []).map((colorName: string, idx: number) => {
          const swatchHex = payload.swatches?.[colorName] || '#38bdf8';
          const isSelected = selectedColor === colorName;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(colorName)}
              disabled={disabled || !!selectedColor}
              className={`p-4 rounded-2xl border flex items-center space-x-3.5 transition-all duration-150 cursor-pointer text-left ${
                isSelected
                  ? 'bg-violet-neon/20 border-violet-glow scale-102 ring-2 ring-violet-glow shadow-violet-glow'
                  : 'bg-graphite-900/90 border-graphite-750 hover:border-graphite-600 hover:bg-graphite-850 active:scale-98'
              }`}
            >
              {/* Color Swatch Circle */}
              <div
                className="w-7 h-7 rounded-xl shadow-md shrink-0 border border-white/20 flex items-center justify-center"
                style={{ backgroundColor: swatchHex }}
              >
                {isSelected && <CheckCircle className="w-4 h-4 text-white drop-shadow" />}
              </div>

              {/* Color Label */}
              <div className="flex-1">
                <span className="text-sm font-bold text-graphite-100 font-mono tracking-wide">
                  {colorName}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Speed Tip */}
      <div className="text-center text-[11px] font-mono text-graphite-500">
        ⚡ Measures cognitive response inhibition and rapid color-word decoding
      </div>
    </div>
  );
};
