import React, { useState } from 'react';
import { RotateCw, RotateCcw, Check, Sparkles } from 'lucide-react';

interface SpatialArenaProps {
  payload: any;
  onSubmit: (response: any) => void;
  disabled?: boolean;
}

export const SpatialArena: React.FC<SpatialArenaProps> = ({ payload, onSubmit, disabled }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userRotation, setUserRotation] = useState<number>(0);

  const referenceCoords: [number, number][] = payload.reference_coords || [[0,0], [1,0], [2,0], [2,1], [1,1]];
  const targetAngle: number = payload.target_angle || 90;
  const options = payload.options || [];

  const handleRotateLeft = () => {
    setUserRotation((prev) => (prev - 90 + 360) % 360);
  };

  const handleRotateRight = () => {
    setUserRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setUserRotation(0);
  };

  const renderShape = (coords: [number, number][], rotationDeg: number = 0, isTarget: boolean = false) => {
    const cellSize = 30;
    const padding = 20;
    const size = 180;

    return (
      <div className="relative flex items-center justify-center p-3">
        <svg
          width={size}
          height={size}
          className="rounded-2xl transition-transform duration-300"
          style={{ transform: `rotate(${rotationDeg}deg)` }}
        >
          {/* Subtle grid background */}
          {Array.from({ length: 5 }).map((_, r) =>
            Array.from({ length: 5 }).map((_, c) => (
              <circle
                key={`${r}-${c}`}
                cx={c * cellSize + padding + cellSize / 2}
                cy={r * cellSize + padding + cellSize / 2}
                r="1.5"
                fill="#243048"
              />
            ))
          )}

          {/* Glowing Tiles */}
          {coords.map(([x, y], idx) => (
            <g key={idx}>
              <rect
                x={x * cellSize + padding}
                y={y * cellSize + padding}
                width={cellSize - 4}
                height={cellSize - 4}
                rx="6"
                className={
                  isTarget
                    ? 'fill-violet-neon stroke-violet-glow'
                    : 'fill-mint-neon stroke-mint-glow'
                }
                strokeWidth="2"
                style={{
                  filter: isTarget
                    ? 'drop-shadow(0 0 6px rgba(139, 92, 246, 0.6))'
                    : 'drop-shadow(0 0 6px rgba(0, 245, 160, 0.5))',
                }}
              />
              {/* Inner gradient highlight */}
              <circle
                cx={x * cellSize + padding + (cellSize - 4) / 2}
                cy={y * cellSize + padding + (cellSize - 4) / 2}
                r="3"
                fill="#ffffff"
                opacity="0.6"
              />
            </g>
          ))}
        </svg>
      </div>
    );
  };

  const handleConfirm = () => {
    if (selectedOption !== null && !disabled) {
      onSubmit(selectedOption);
    }
  };

  return (
    <div className="space-y-6">
      {/* Target Preview Box */}
      <div className="p-6 rounded-2xl bg-graphite-900 border border-graphite-750 flex flex-col md:flex-row items-center justify-between gap-6 shadow-glass">
        <div className="space-y-2 text-center md:text-left max-w-sm">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-violet-neon/15 border border-violet-neon/30 text-violet-glow text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Visual Pattern & Shape Rotation</span>
          </div>
          <h3 className="text-lg font-bold text-graphite-100">
            Rotate Shape by {targetAngle}° Clockwise
          </h3>
          <p className="text-xs text-graphite-400 leading-relaxed">
            Look at the base shape on the right. Mentally turn it <strong>{targetAngle}° clockwise</strong>. Watch out for mirrored impostor shapes!
          </p>

          {/* Interactive Rotation Tool */}
          <div className="pt-3 flex items-center justify-center md:justify-start space-x-2">
            <button
              type="button"
              onClick={handleRotateLeft}
              className="p-2 rounded-xl bg-graphite-800 hover:bg-graphite-750 text-graphite-200 border border-graphite-700 text-xs flex items-center space-x-1 font-mono transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>-90°</span>
            </button>
            <button
              type="button"
              onClick={handleRotateRight}
              className="p-2 rounded-xl bg-graphite-800 hover:bg-graphite-750 text-graphite-200 border border-graphite-700 text-xs flex items-center space-x-1 font-mono transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>+90°</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 rounded-xl bg-graphite-850 hover:bg-graphite-800 text-graphite-400 text-xs font-mono transition-colors"
            >
              Reset
            </button>
            <span className="text-xs font-mono text-mint-glow font-bold pl-2">
              Viewing: {userRotation}°
            </span>
          </div>
        </div>

        {/* Live Reference Shape */}
        <div className="flex flex-col items-center p-3 rounded-2xl bg-graphite-950/90 border border-graphite-800">
          <span className="text-[10px] font-mono text-graphite-400 uppercase tracking-widest mb-1">
            Interactive Shape Sandbox
          </span>
          {renderShape(referenceCoords, userRotation, true)}
        </div>
      </div>

      {/* Candidate Shapes Grid */}
      <div>
        <h4 className="text-xs font-mono uppercase text-graphite-300 font-bold tracking-wider mb-3">
          Which figure matches the shape rotated by {targetAngle}°?
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {options.map((opt: any, idx: number) => {
            const isSelected = selectedOption === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedOption(idx)}
                disabled={disabled}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-between transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-violet-neon/20 border-violet-glow shadow-violet-glow scale-105 ring-2 ring-violet-glow'
                    : 'bg-graphite-900/80 border-graphite-750 hover:border-graphite-600 hover:bg-graphite-850'
                }`}
              >
                <div className="w-full flex items-center justify-between text-xs font-mono">
                  <span className={`font-bold ${isSelected ? 'text-violet-glow' : 'text-graphite-300'}`}>
                    Figure {String.fromCharCode(65 + idx)}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-mint-glow" />}
                </div>

                <div className="my-2">
                  {renderShape(opt.coords || [], 0, false)}
                </div>

                <span className="text-[11px] font-mono text-graphite-400">
                  {opt.label || `Choice ${String.fromCharCode(65 + idx)}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirm Button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={selectedOption === null || disabled}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-neon to-mint-neon text-graphite-950 font-bold text-sm shadow-mint-glow hover:opacity-95 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 cursor-pointer"
        >
          Confirm My Answer
        </button>
      </div>
    </div>
  );
};
