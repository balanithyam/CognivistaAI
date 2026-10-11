import React from 'react';
import {
  Compass,
  Zap,
  Globe2,
  Clock,
  Sparkles,
  Plane,
  Sun,
  Flame,
  Scale,
  Award,
  CircleDot,
  Radio,
  Tag
} from 'lucide-react';

interface VisualChallengeBoardProps {
  payload: any;
  title?: string;
  domain?: string;
  challengeType?: string;
}

export const VisualChallengeBoard: React.FC<VisualChallengeBoardProps> = ({
  payload,
  title,
  domain,
  challengeType
}) => {
  const visualType = payload?.visual_type || payload?.diagram_data?.visual_type;
  const diagram = payload?.diagram_data || {};

  // 1. GEOMETRY TRIANGLE ANGLE SVG
  if (visualType === 'geometry_angle' || (diagram.shape === 'triangle')) {
    const angleA = diagram.angle_a || 60;
    const angleB = diagram.angle_b || 50;
    const target = diagram.target_angle || 'x°';

    return (
      <div className="p-5 rounded-2xl bg-graphite-950 border border-violet-neon/40 shadow-glass space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-violet-glow font-bold flex items-center space-x-1.5">
            <Compass className="w-4 h-4" />
            <span>GEOMETRIC ANGLE DIAGRAM</span>
          </span>
          <span className="text-graphite-400 text-[10px]">Sum of Angles = 180°</span>
        </div>

        <div className="relative w-full h-52 bg-graphite-900/60 rounded-xl flex items-center justify-center p-2 overflow-hidden border border-graphite-800">
          <svg viewBox="0 0 340 180" className="w-full h-full max-w-sm drop-shadow-lg">
            {/* Triangle Lines */}
            <polygon
              points="170,25 40,155 300,155"
              fill="rgba(139, 92, 246, 0.08)"
              stroke="#8b5cf6"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Vertex Nodes */}
            <circle cx="170" cy="25" r="5" fill="#00f5a0" />
            <circle cx="40" cy="155" r="5" fill="#8b5cf6" />
            <circle cx="300" cy="155" r="5" fill="#38bdf8" />

            {/* Angle Arcs */}
            <path d="M 65 155 A 25 25 0 0 0 55 135" fill="none" stroke="#00f5a0" strokeWidth="2.5" />
            <path d="M 275 155 A 25 25 0 0 1 285 135" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
            <path d="M 155 45 A 25 25 0 0 0 185 45" fill="none" stroke="#f43f5e" strokeWidth="2.5" />

            {/* Labels */}
            <text x="68" y="145" fill="#00f5a0" fontSize="13" fontWeight="bold" fontFamily="monospace">
              {angleA}°
            </text>
            <text x="250" y="145" fill="#fbbf24" fontSize="13" fontWeight="bold" fontFamily="monospace">
              {angleB}°
            </text>
            <text x="160" y="65" fill="#f43f5e" fontSize="15" fontWeight="extrabold" fontFamily="monospace">
              {target}
            </text>

            <text x="170" y="15" fill="#94a3b8" fontSize="11" textAnchor="middle" fontFamily="sans-serif">
              Vertex A
            </text>
            <text x="25" y="170" fill="#94a3b8" fontSize="11" textAnchor="middle" fontFamily="sans-serif">
              Vertex B
            </text>
            <text x="315" y="170" fill="#94a3b8" fontSize="11" textAnchor="middle" fontFamily="sans-serif">
              Vertex C
            </text>
          </svg>
        </div>
      </div>
    );
  }

  // 2. ELECTRICAL CIRCUIT DIAGRAM SVG
  if (visualType === 'circuit_switch') {
    const isParallel = diagram.circuit_type === 'parallel';
    const switchA = diagram.switch_a;
    const switchB = diagram.switch_b;
    const bulbLit = diagram.bulb_lit;

    return (
      <div className="p-5 rounded-2xl bg-graphite-950 border border-amber-500/40 shadow-glass space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-amber-400 font-bold flex items-center space-x-1.5">
            <Zap className="w-4 h-4" />
            <span>CIRCUIT SCHEMATIC ({isParallel ? 'PARALLEL' : 'SERIES'})</span>
          </span>
          <span className="text-graphite-400 text-[10px]">9V DC Power Supply</span>
        </div>

        <div className="relative w-full h-52 bg-graphite-900/60 rounded-xl flex items-center justify-center p-2 border border-graphite-800">
          <svg viewBox="0 0 360 180" className="w-full h-full max-w-md drop-shadow-lg">
            {/* Battery on Left */}
            <line x1="40" y1="40" x2="40" y2="140" stroke="#94a3b8" strokeWidth="3" />
            <line x1="30" y1="80" x2="50" y2="80" stroke="#38bdf8" strokeWidth="4" />
            <line x1="35" y1="100" x2="45" y2="100" stroke="#f43f5e" strokeWidth="4" />
            <text x="20" y="85" fill="#38bdf8" fontSize="12" fontWeight="bold">+</text>
            <text x="20" y="105" fill="#f43f5e" fontSize="12" fontWeight="bold">-</text>
            <text x="40" y="160" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">9V Battery</text>

            {/* Main loop conductors */}
            <path d="M 40 40 L 120 40" stroke="#64748b" strokeWidth="3" fill="none" />
            <path d="M 40 140 L 320 140 L 320 90" stroke="#64748b" strokeWidth="3" fill="none" />

            {/* Switches */}
            {isParallel ? (
              <>
                {/* Branch 1: Switch A */}
                <path d="M 120 40 L 120 25 L 140 25" stroke="#64748b" strokeWidth="3" fill="none" />
                <line x1="140" y1="25" x2="190" y2={switchA ? "25" : "10"} stroke={switchA ? "#00f5a0" : "#f43f5e"} strokeWidth="3.5" />
                <path d="M 190 25 L 220 25 L 220 40" stroke="#64748b" strokeWidth="3" fill="none" />
                <text x="165" y="42" fill="#e2e8f0" fontSize="10" fontFamily="monospace" textAnchor="middle">
                  Switch A: {switchA ? "CLOSED" : "OPEN"}
                </text>

                {/* Branch 2: Switch B */}
                <path d="M 120 40 L 120 75 L 140 75" stroke="#64748b" strokeWidth="3" fill="none" />
                <line x1="140" y1="75" x2="190" y2={switchB ? "75" : "60"} stroke={switchB ? "#00f5a0" : "#f43f5e"} strokeWidth="3.5" />
                <path d="M 190 75 L 220 75 L 220 40" stroke="#64748b" strokeWidth="3" fill="none" />
                <text x="165" y="92" fill="#e2e8f0" fontSize="10" fontFamily="monospace" textAnchor="middle">
                  Switch B: {switchB ? "CLOSED" : "OPEN"}
                </text>
                <path d="M 220 40 L 320 40 L 320 70" stroke="#64748b" strokeWidth="3" fill="none" />
              </>
            ) : (
              <>
                {/* Series: Switch A then Switch B */}
                <line x1="100" y1="40" x2="140" y2={switchA ? "40" : "25"} stroke={switchA ? "#00f5a0" : "#f43f5e"} strokeWidth="3.5" />
                <text x="120" y="20" fill="#e2e8f0" fontSize="10" fontFamily="monospace" textAnchor="middle">
                  Sw A ({switchA ? "CLOSED" : "OPEN"})
                </text>
                <line x1="140" y1="40" x2="180" y2="40" stroke="#64748b" strokeWidth="3" />
                <line x1="180" y1="40" x2="220" y2={switchB ? "40" : "25"} stroke={switchB ? "#00f5a0" : "#f43f5e"} strokeWidth="3.5" />
                <text x="200" y="20" fill="#e2e8f0" fontSize="10" fontFamily="monospace" textAnchor="middle">
                  Sw B ({switchB ? "CLOSED" : "OPEN"})
                </text>
                <path d="M 220 40 L 320 40 L 320 70" stroke="#64748b" strokeWidth="3" fill="none" />
              </>
            )}

            {/* Light Bulb on Right */}
            <circle
              cx="320"
              cy="80"
              r="16"
              fill={bulbLit ? "rgba(251, 191, 36, 0.35)" : "#1e293b"}
              stroke={bulbLit ? "#fbbf24" : "#475569"}
              strokeWidth="2.5"
            />
            {/* Filament */}
            <path d="M 314 84 L 320 74 L 326 84" stroke={bulbLit ? "#fef08a" : "#64748b"} strokeWidth="2" fill="none" />
            <text x="320" y="112" fill={bulbLit ? "#fbbf24" : "#94a3b8"} fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              {bulbLit ? "⚡ LIGHT ON" : "⚪ LIGHT OFF"}
            </text>
          </svg>
        </div>
      </div>
    );
  }

  // 3. GEAR ROTATION TRAIN SVG
  if (visualType === 'gear_rotation') {
    const numGears = diagram.num_gears || 4;
    const gears = diagram.gears || [
      { id: 1, dir: 'Clockwise' },
      { id: 2, dir: 'Counter-Clockwise' },
      { id: 3, dir: 'Clockwise' },
      { id: 4, dir: 'Counter-Clockwise' }
    ];

    return (
      <div className="p-5 rounded-2xl bg-graphite-950 border border-cyan-500/40 shadow-glass space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-cyan-400 font-bold flex items-center space-x-1.5">
            <Radio className="w-4 h-4" />
            <span>INTERLOCKING GEAR TRAIN</span>
          </span>
          <span className="text-graphite-400 text-[10px]">Opposite Meshed Rotations</span>
        </div>

        <div className="relative w-full h-44 bg-graphite-900/60 rounded-xl flex items-center justify-center p-2 border border-graphite-800">
          <div className="flex items-center justify-center space-x-2 sm:space-x-4">
            {gears.map((g: any, idx: number) => {
              const isTarget = idx === gears.length - 1;
              const isCW = g.dir === 'Clockwise';
              return (
                <div key={idx} className="flex flex-col items-center space-y-1">
                  <div
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 flex items-center justify-center transition-all ${
                      isTarget
                        ? 'border-dashed border-rose-400 bg-rose-950/30'
                        : isCW
                        ? 'border-cyan-400 bg-cyan-950/20'
                        : 'border-violet-neon bg-violet-neon/15'
                    }`}
                  >
                    {/* Simulated gear teeth */}
                    <div className="absolute inset-0 rounded-full border-2 border-dotted border-graphite-600 animate-spin-slow" />
                    <div className="w-6 h-6 rounded-full bg-graphite-900 border border-graphite-700 flex items-center justify-center">
                      <span className="text-xs font-bold font-mono text-graphite-200">{g.id}</span>
                    </div>

                    {/* Rotation indicator arrow */}
                    {idx === 0 ? (
                      <span className="absolute -top-3 px-1.5 py-0.5 rounded bg-cyan-500 text-graphite-950 text-[9px] font-bold font-mono">
                        {isCW ? '↻ CW' : '↺ CCW'}
                      </span>
                    ) : isTarget ? (
                      <span className="absolute -top-3 px-1.5 py-0.5 rounded bg-rose-500 text-white text-[9px] font-bold font-mono animate-pulse">
                        ? TARGET
                      </span>
                    ) : (
                      <span className="text-[10px] text-graphite-400 font-mono">
                        {isCW ? '↻' : '↺'}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-graphite-400">Gear {g.id}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 4. BALANCE SCALE SVG
  if (visualType === 'balance_scale') {
    return (
      <div className="p-5 rounded-2xl bg-graphite-950 border border-emerald-500/40 shadow-glass space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-emerald-400 font-bold flex items-center space-x-1.5">
            <Scale className="w-4 h-4" />
            <span>ALGEBRAIC BALANCE SCALES</span>
          </span>
          <span className="text-graphite-400 text-[10px]">Equilibrium = Equal Weights</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Scale 1 */}
          <div className="p-3.5 rounded-xl bg-graphite-900 border border-graphite-800 text-center space-y-2">
            <div className="text-[11px] font-mono font-bold text-mint-glow">⚖️ Scale 1 (Balanced)</div>
            <div className="flex items-center justify-around text-xs font-mono py-2 bg-graphite-950 rounded-lg">
              <span className="px-2 py-1 rounded bg-violet-neon/20 text-violet-glow border border-violet-neon/30">
                1 Circle + 1 Square
              </span>
              <span className="text-graphite-500 font-bold">=</span>
              <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {diagram.scale1?.right || '12 kg'}
              </span>
            </div>
          </div>

          {/* Scale 2 */}
          <div className="p-3.5 rounded-xl bg-graphite-900 border border-graphite-800 text-center space-y-2">
            <div className="text-[11px] font-mono font-bold text-sky-400">⚖️ Scale 2 (Balanced)</div>
            <div className="flex items-center justify-around text-xs font-mono py-2 bg-graphite-950 rounded-lg">
              <span className="px-2 py-1 rounded bg-violet-neon/20 text-violet-glow border border-violet-neon/30">
                2 Circles
              </span>
              <span className="text-graphite-500 font-bold">=</span>
              <span className="px-2 py-1 rounded bg-mint-deep/30 text-mint-glow border border-mint-glow/30">
                1 Square
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. FRACTION PIE MODEL SVG
  if (visualType === 'fraction_pie') {
    const total = diagram.total_slices || 8;
    const shaded = diagram.shaded_slices || 3;
    const radius = 60;
    const cx = 90;
    const cy = 90;

    // Generate pie slice SVG paths
    const slices = [];
    const angleStep = (2 * Math.PI) / total;

    for (let i = 0; i < total; i++) {
      const startAngle = i * angleStep - Math.PI / 2;
      const endAngle = (i + 1) * angleStep - Math.PI / 2;

      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);
      const x2 = cx + radius * Math.cos(endAngle);
      const y2 = cy + radius * Math.sin(endAngle);

      const isShaded = i < shaded;
      const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;

      slices.push(
        <path
          key={i}
          d={pathData}
          fill={isShaded ? "#00f5a0" : "#1e293b"}
          stroke="#090d16"
          strokeWidth="2.5"
          opacity={isShaded ? "0.9" : "0.5"}
        />
      );
    }

    return (
      <div className="p-5 rounded-2xl bg-graphite-950 border border-mint-neon/40 shadow-glass space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-mint-glow font-bold flex items-center space-x-1.5">
            <CircleDot className="w-4 h-4" />
            <span>VISUAL FRACTION MODEL</span>
          </span>
          <span className="text-graphite-400 text-[10px]">
            {shaded} of {total} Slices Shaded ({diagram.percent || ''})
          </span>
        </div>

        <div className="flex items-center justify-center p-2 bg-graphite-900/60 rounded-xl border border-graphite-800">
          <svg width="180" height="180" viewBox="0 0 180 180" className="drop-shadow-lg">
            {slices}
            <circle cx={cx} cy={cy} r="6" fill="#090d16" />
          </svg>
        </div>
      </div>
    );
  }

  // 6. WORLD FLIGHT MAP & TIME ZONES
  if (visualType === 'flight_map' || payload?.flight || payload?.departure) {
    const flight = payload?.flight || diagram || {};
    const origin = flight.origin || 'London (UTC)';
    const destination = flight.destination || 'New York (UTC-4)';
    const depTime = flight.departure_local || flight.departure_time || '10:00';
    const duration = flight.flight_duration || '8h 30m';

    return (
      <div className="p-5 rounded-2xl bg-graphite-950 border border-sky-500/40 shadow-glass space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-sky-400 font-bold flex items-center space-x-1.5">
            <Plane className="w-4 h-4" />
            <span>GLOBAL FLIGHT ROUTE & TIME ZONE DIALS</span>
          </span>
          <span className="text-graphite-400 text-[10px]">International UTC Coordinates</span>
        </div>

        {/* Visual Map Arc */}
        <div className="relative p-4 rounded-xl bg-graphite-900/80 border border-graphite-800 overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            {/* Origin Terminal */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-graphite-400 uppercase block">Origin Terminal</span>
              <div className="text-sm font-bold text-graphite-100">{origin}</div>
              <div className="inline-flex items-center space-x-1 text-xs font-mono text-sky-400 font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>Departs {depTime}</span>
              </div>
            </div>

            {/* Trajectory */}
            <div className="flex-1 px-4 flex flex-col items-center">
              <span className="text-[10px] font-mono text-mint-glow mb-1">✈️ {duration} flight</span>
              <div className="w-full h-0.5 bg-gradient-to-r from-sky-400 via-mint-neon to-violet-neon relative">
                <div className="w-2.5 h-2.5 rounded-full bg-mint-neon absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping" />
              </div>
            </div>

            {/* Destination Terminal */}
            <div className="space-y-1 text-right">
              <span className="text-[10px] font-mono text-graphite-400 uppercase block">Arrival Destination</span>
              <div className="text-sm font-bold text-graphite-100">{destination}</div>
              <div className="inline-flex items-center space-x-1 text-xs font-mono text-mint-glow font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>Local Arrival ?</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 7. THERMOSTAT & UTILITY POWER GAUGE
  if (visualType === 'thermometer_energy' || payload?.weather || payload?.watts) {
    const outdoor = diagram.outdoor_temp || payload?.weather?.temperature_c || '35°C';
    const indoor = diagram.indoor_temp || '22°C';
    const power = diagram.power_draw || payload?.watts || '1800W';
    const hours = diagram.run_hours || payload?.hours || '6 hours';

    return (
      <div className="p-5 rounded-2xl bg-graphite-950 border border-amber-500/40 shadow-glass space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-amber-400 font-bold flex items-center space-x-1.5">
            <Flame className="w-4 h-4" />
            <span>THERMAL & POWER DRAW METER</span>
          </span>
          <span className="text-graphite-400 text-[10px]">Real-World Household Energy</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="p-3 rounded-xl bg-graphite-900 border border-graphite-800 text-center">
            <span className="text-[10px] font-mono text-graphite-500 uppercase block">Outdoor Weather</span>
            <span className="text-sm font-bold text-rose-400 font-mono mt-0.5 block">{outdoor}</span>
          </div>
          <div className="p-3 rounded-xl bg-graphite-900 border border-graphite-800 text-center">
            <span className="text-[10px] font-mono text-graphite-500 uppercase block">Target Temp</span>
            <span className="text-sm font-bold text-sky-400 font-mono mt-0.5 block">{indoor}</span>
          </div>
          <div className="p-3 rounded-xl bg-graphite-900 border border-graphite-800 text-center">
            <span className="text-[10px] font-mono text-graphite-500 uppercase block">Appliance Power</span>
            <span className="text-sm font-bold text-amber-400 font-mono mt-0.5 block">{power}</span>
          </div>
          <div className="p-3 rounded-xl bg-graphite-900 border border-graphite-800 text-center">
            <span className="text-[10px] font-mono text-graphite-500 uppercase block">Daily Run Time</span>
            <span className="text-sm font-bold text-mint-glow font-mono mt-0.5 block">{hours}</span>
          </div>
        </div>
      </div>
    );
  }

  // 8. OLYMPIC PODIUM FOR DETECTIVE RACE PUZZLES
  if (payload?.clues && payload?.target_position) {
    return (
      <div className="p-5 rounded-2xl bg-graphite-950 border border-violet-neon/40 shadow-glass space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-violet-glow font-bold flex items-center space-x-1.5">
            <Award className="w-4 h-4" />
            <span>MEDAL PODIUM STANDINGS</span>
          </span>
          <span className="text-graphite-400 text-[10px]">Detective Deduction</span>
        </div>

        {/* 3D Olympic Podium Diagram */}
        <div className="flex items-end justify-center space-x-3 pt-4 pb-2">
          {/* 2nd Place Silver */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-mono font-bold text-slate-300 mb-1">🥈 Silver</span>
            <div className="w-20 h-16 rounded-t-xl bg-gradient-to-t from-slate-800 to-slate-600 border border-slate-500 flex items-center justify-center font-bold text-lg text-slate-100 shadow-md">
              2nd
            </div>
          </div>

          {/* 1st Place Gold */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-mono font-bold text-amber-300 mb-1">🥇 Gold</span>
            <div className="w-24 h-24 rounded-t-xl bg-gradient-to-t from-amber-800 to-amber-500 border border-amber-400 flex items-center justify-center font-extrabold text-2xl text-amber-950 shadow-lg">
              1st
            </div>
          </div>

          {/* 3rd Place Bronze */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-mono font-bold text-amber-700 mb-1">🥉 Bronze</span>
            <div className="w-20 h-12 rounded-t-xl bg-gradient-to-t from-amber-950 to-amber-800 border border-amber-700 flex items-center justify-center font-bold text-base text-amber-200 shadow-md">
              3rd
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 9. RETAIL DISCOUNT & CHECKOUT CARD
  if (payload?.orig_price && payload?.discount) {
    return (
      <div className="p-5 rounded-2xl bg-graphite-950 border border-mint-neon/40 shadow-glass space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-mint-glow font-bold flex items-center space-x-1.5">
            <Tag className="w-4 h-4" />
            <span>RETAIL DISCOUNT RECEIPT</span>
          </span>
          <span className="text-graphite-400 text-[10px]">Everyday Math</span>
        </div>

        <div className="flex items-center justify-between p-3.5 bg-graphite-900 rounded-xl border border-graphite-800">
          <div>
            <span className="text-[10px] font-mono text-graphite-500 block uppercase">Product Item</span>
            <span className="text-sm font-bold text-graphite-100">{payload.item_name || 'Retail Item'}</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <span className="text-[10px] font-mono text-graphite-500 block uppercase">Original</span>
              <span className="text-xs font-mono line-through text-rose-400 font-bold">{payload.orig_price}</span>
            </div>
            <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-violet-neon to-mint-neon text-graphite-950 font-extrabold text-xs font-mono shadow-mint-glow">
              {payload.discount} OFF
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default clean visual banner
  return null;
};
