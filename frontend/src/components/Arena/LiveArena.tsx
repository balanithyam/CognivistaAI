import React, { useState } from 'react';
import { Globe2, Clock, CheckCircle2, RefreshCw, ShoppingCart, Plane, Zap, AlertTriangle } from 'lucide-react';
import { useAgent } from '../../context/AgentContext';

interface LiveArenaProps {
  payload: any;
  sourceInfo?: any;
  onSubmit: (response: any) => void;
  disabled?: boolean;
}

export const LiveArena: React.FC<LiveArenaProps> = ({ payload, sourceInfo, onSubmit, disabled }) => {
  const { loadLiveChallenge } = useAgent();
  const [selectedVal, setSelectedVal] = useState<string>('');

  const isLiveAvailable = payload.live_source_available !== false;
  const options: string[] = payload.options || [];

  if (!isLiveAvailable) {
    return (
      <div className="p-8 rounded-2xl bg-graphite-900 border border-amber-500/30 text-center space-y-4 shadow-glass">
        <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-lg font-bold text-graphite-100">Live source unavailable</h4>
          <p className="text-sm text-graphite-400 max-w-md mx-auto">
            Live stream endpoints could not be reached right now. Cognivista never fabricates synthetic data.
          </p>
        </div>
        <button
          type="button"
          onClick={() => loadLiveChallenge()}
          className="px-5 py-2.5 rounded-xl bg-graphite-800 hover:bg-graphite-750 text-graphite-200 border border-graphite-700 text-xs font-mono inline-flex items-center space-x-2 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Live Connection</span>
        </button>
      </div>
    );
  }

  const handleConfirm = () => {
    if (selectedVal && !disabled) {
      onSubmit(selectedVal);
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-World Live Data Banner */}
      <div className="p-5 rounded-2xl bg-graphite-900 border border-mint-glow/30 space-y-3 shadow-glass">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-graphite-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-mint-500" />
            </span>
            <span className="text-xs font-mono uppercase font-bold text-mint-glow tracking-wider">
              {sourceInfo?.source_name || 'Live Real-World Data Feed'}
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono text-graphite-400">
            {sourceInfo?.timestamp && (
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-graphite-500" />
                <span>{sourceInfo.timestamp.slice(0, 16).replace('T', ' ')} UTC</span>
              </span>
            )}
          </div>
        </div>

        {/* Informational Cards */}
        {payload.flight && (
          <div className="p-4 rounded-xl bg-graphite-950/70 border border-graphite-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2 text-graphite-200">
              <Plane className="w-4 h-4 text-violet-glow" />
              <span>{payload.flight.origin} → {payload.flight.destination}</span>
            </div>
            <div className="text-mint-glow font-bold">
              Departs: {payload.flight.departure_local} (Duration: {payload.flight.flight_duration})
            </div>
          </div>
        )}

        {payload.weather && (
          <div className="p-4 rounded-xl bg-graphite-950/70 border border-graphite-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2 text-graphite-200">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Current Temp: {payload.weather.temperature_c}°C ({payload.weather.temperature_f}°F)</span>
            </div>
            <div className="text-amber-300 font-bold">
              AC Runtime: {payload.weather.ac_hours} hours @ {payload.weather.kwh_rate}/kWh
            </div>
          </div>
        )}
      </div>

      {/* Answer Candidates */}
      {options.length > 0 && (
        <div>
          <h4 className="text-xs font-mono uppercase text-graphite-300 font-bold tracking-wider mb-3">
            Select the Correct Real-World Solution:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((opt, idx) => {
              const isSelected = selectedVal === opt;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedVal(opt)}
                  disabled={disabled}
                  className={`p-4 rounded-xl border text-left flex items-center justify-between font-mono text-sm transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-mint-deep/30 border-mint-glow text-mint-glow shadow-mint-glow scale-[1.01]'
                      : 'bg-graphite-900/70 border-graphite-750 hover:border-graphite-600 text-graphite-200'
                  }`}
                >
                  <span className="font-semibold">{opt}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-mint-glow ml-2 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Manual Input */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <input
          type="text"
          value={selectedVal}
          onChange={(e) => setSelectedVal(e.target.value)}
          placeholder="Or type your calculated answer..."
          disabled={disabled}
          className="w-full sm:w-80 py-2.5 px-4 rounded-xl bg-graphite-900 border border-graphite-750 text-graphite-100 font-mono text-sm focus:outline-none focus:border-mint-glow"
        />

        <button
          type="button"
          onClick={handleConfirm}
          disabled={!selectedVal || disabled}
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-violet-neon to-mint-neon text-graphite-950 font-bold text-sm shadow-mint-glow hover:opacity-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};
