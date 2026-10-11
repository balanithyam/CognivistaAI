import React, { useState, useRef } from 'react';
import { Send, Sparkles, Loader2, Brain, Compass, Zap, Lightbulb, Globe2, Target } from 'lucide-react';
import { useAgent } from '../../context/AgentContext';

export const AgentNaturalInput: React.FC = () => {
  const { askAgent, agentStatus, agentMessage } = useAgent();
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || agentStatus !== 'idle') return;

    const query = inputText;
    setInputText('');
    await askAgent(query);
  };

  const handleChipClick = async (prompt: string) => {
    if (agentStatus !== 'idle') return;
    await askAgent(prompt);
  };

  const isBusy = agentStatus !== 'idle';

  const quickPills = [
    { label: 'Everyday Math & Discounts', icon: <Zap className="w-3.5 h-3.5 text-violet-glow" />, prompt: 'Give me a shopping discount math challenge' },
    { label: 'Speed & Reflex Test', icon: <Target className="w-3.5 h-3.5 text-amber-400" />, prompt: 'Give me a rapid color reflex test' },
    { label: 'Detective Logic', icon: <Compass className="w-3.5 h-3.5 text-mint-glow" />, prompt: 'Give me a detective deduction puzzle' },
    { label: 'Memory Tile Matrix', icon: <Brain className="w-3.5 h-3.5 text-sky-400" />, prompt: 'Let us train memory tile span' },
    { label: 'Clever Riddles', icon: <Lightbulb className="w-3.5 h-3.5 text-pink-400" />, prompt: 'Give me a fun lateral thinking riddle' },
    { label: 'Real-World Life Skills', icon: <Globe2 className="w-3.5 h-3.5 text-emerald-400" />, prompt: 'Give me an everyday science or life skills challenge' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-2.5">
      {/* Coach Voice Notification */}
      <div className="flex items-center justify-between text-xs text-graphite-400 font-mono px-1">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isBusy ? 'bg-amber-400' : 'bg-mint-glow'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isBusy ? 'bg-amber-500' : 'bg-mint-neon'
              }`}
            />
          </span>
          <span className="uppercase tracking-wider font-bold text-graphite-300">
            {isBusy ? 'COACH AT WORK' : 'COGNIVISTA COACH'}
          </span>
        </div>
        <div className="truncate max-w-lg text-right text-graphite-300 font-sans italic text-xs">
          {agentMessage}
        </div>
      </div>

      {/* Main Natural Input Bar */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center rounded-2xl bg-graphite-900 border border-graphite-750 shadow-glass focus-within:border-violet-neon/70 focus-within:ring-2 focus-within:ring-violet-neon/30 transition-all duration-300">
          <div className="pl-4 pr-2 text-violet-glow">
            <Sparkles className="w-5 h-5 animate-pulse-subtle" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isBusy}
            placeholder="Ask Cognivista to train any topic (e.g. 'Give me shopping math', 'Speed color test', 'Detective puzzle')..."
            className="w-full py-4 px-2 bg-transparent text-graphite-100 placeholder-graphite-500 text-sm md:text-base focus:outline-none font-sans disabled:opacity-50"
            id="cognivista-natural-input"
          />

          <div className="pr-3 flex items-center space-x-2">
            <button
              type="submit"
              disabled={isBusy || !inputText.trim()}
              className="p-3 rounded-xl bg-gradient-to-r from-violet-neon to-mint-neon hover:opacity-95 text-graphite-950 font-bold disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 cursor-pointer shadow-mint-glow"
              title="Send to Coach"
            >
              {isBusy ? (
                <Loader2 className="w-4 h-4 animate-spin text-graphite-950" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Quick Brain Workout Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
        <span className="text-graphite-500 text-[11px] shrink-0 pl-1">Quick Workouts:</span>
        {quickPills.map((pill, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleChipClick(pill.prompt)}
            disabled={isBusy}
            className="px-3 py-1 rounded-xl bg-graphite-900 hover:bg-graphite-850 border border-graphite-800 hover:border-graphite-700 text-graphite-300 hover:text-graphite-100 flex items-center space-x-1.5 shrink-0 transition-all cursor-pointer text-xs"
          >
            {pill.icon}
            <span>{pill.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
