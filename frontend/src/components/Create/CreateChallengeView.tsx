import React, { useState } from 'react';
import { useAgent } from '../../context/AgentContext';
import {
  Wand2,
  Sparkles,
  Bot,
  Play,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Sliders,
  Layers,
  ShoppingBag,
  Zap,
  SearchCode,
  Lightbulb,
  BookOpen,
  Globe2,
  Brain,
  Check,
  RotateCcw,
  SlidersHorizontal,
  Compass
} from 'lucide-react';

export const CreateChallengeView: React.FC = () => {
  const { askAgent, setActiveMode, activeChallenge, agentStatus } = useAgent();

  const [promptText, setPromptText] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<string>('logic');
  const [selectedFormat, setSelectedFormat] = useState<string>('any');
  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(1200);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [createdChallenge, setCreatedChallenge] = useState<any | null>(null);
  const [reasoningStep, setReasoningStep] = useState<number>(0);

  const domainOptions = [
    { id: 'logic', label: 'Logic & Clues', icon: <SearchCode className="w-4 h-4 text-violet-400" /> },
    { id: 'spatial', label: 'Mechanical Gears & Visuals', icon: <Compass className="w-4 h-4 text-cyan-400" /> },
    { id: 'math', label: 'Practical Math', icon: <ShoppingBag className="w-4 h-4 text-emerald-400" /> },
    { id: 'memory', label: 'Working Memory', icon: <Brain className="w-4 h-4 text-cyan-400" /> },
    { id: 'speed', label: 'Speed & Reflexes', icon: <Zap className="w-4 h-4 text-amber-400" /> },
    { id: 'science', label: 'Science & Gadgets', icon: <Lightbulb className="w-4 h-4 text-yellow-400" /> },
    { id: 'language', label: 'Words & Riddles', icon: <BookOpen className="w-4 h-4 text-pink-400" /> },
  ];

  const formatOptions = [
    { id: 'any', label: 'Agent Chooses Best Format' },
    { id: 'matching', label: 'Interactive Pair Matching' },
    { id: 'ordering', label: 'Step-by-Step Sequencing' },
    { id: 'multi_select', label: 'Multiple-Answer Checkboxes' },
    { id: 'true_false', label: 'Binary True / False' },
    { id: 'fill_blank', label: 'Typing / Anagram Solving' },
    { id: 'odd_one_out', label: 'Categorical Outlier' },
    { id: 'mcq', label: 'Multiple Choice Reasoning' },
  ];

  const samplePrompts = [
    "Generate an interlocking gear train challenge with rotating gears and direction vectors",
    "Create an electric circuit schematic challenge with switches and battery",
    "Give me an everyday shopping discount and restaurant tax mental math challenge",
    "Create a balance scale weight deduction puzzle",
    "Create a tricky detective logic deduction puzzle with 4 suspects",
    "Give me a speed and attention test combining color and word conflict",
    "Give me an interactive matching challenge for gadgets and science principles",
    "Give me a working memory tile matrix recall test"
  ];

  const handleGenerate = async () => {
    const finalPrompt = promptText.trim() || `Create an engaging ${selectedDomain} challenge with difficulty ${selectedDifficulty}`;

    setIsGenerating(true);
    setReasoningStep(1);

    // Realistic agent reasoning progression
    setTimeout(() => setReasoningStep(2), 350);
    setTimeout(() => setReasoningStep(3), 700);

    try {
      await askAgent(finalPrompt);
      setReasoningStep(4);
      // Wait a moment then set created challenge from active challenge
      setTimeout(() => {
        setIsGenerating(false);
      }, 500);
    } catch (err) {
      console.error('Error generating challenge:', err);
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel-elevated border border-graphite-750 flex flex-col md:flex-row items-center justify-between gap-6 shadow-glass">
        <div className="flex items-center space-x-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-neon to-mint-neon p-0.5 shadow-violet-glow flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-graphite-950 rounded-[14px] flex items-center justify-center">
              <Wand2 className="w-7 h-7 text-mint-glow" />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-graphite-100 font-sans">
              Create Challenge
            </h2>
            <p className="text-xs text-graphite-400">
              Describe what you want in natural language. The AI agent decides the skills, format, and complexity to generate a fresh challenge.
            </p>
          </div>
        </div>

        {activeChallenge && (
          <button
            type="button"
            onClick={() => setActiveMode('challenge')}
            className="px-5 py-2.5 rounded-2xl bg-graphite-850 hover:bg-graphite-800 border border-graphite-700 text-graphite-200 text-xs font-mono font-bold flex items-center space-x-2 shrink-0 transition-colors"
          >
            <span>Open Arena</span>
            <ArrowRight className="w-4 h-4 text-mint-glow" />
          </button>
        )}
      </div>

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Natural Language Input & Custom Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Natural Language Prompt Card */}
          <div className="p-6 rounded-3xl glass-panel-elevated border border-graphite-750 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase font-bold text-graphite-300 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-violet-glow" />
                <span>Tell Cognivista What Challenge to Build</span>
              </label>
              <span className="text-[11px] font-mono text-graphite-500">Natural Language</span>
            </div>

            <textarea
              rows={3}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="E.g., 'I want a difficult memory and logic challenge, but not multiple choice.' or 'Give me a step-by-step sequencing puzzle...'"
              className="w-full p-4 rounded-2xl bg-graphite-900/90 border border-graphite-750 text-sm text-graphite-100 placeholder:text-graphite-500 focus:outline-none focus:border-violet-neon transition-all resize-none"
            />

            {/* Quick Sample Prompts */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-graphite-400 uppercase">Or try a natural prompt:</div>
              <div className="flex flex-wrap gap-2">
                {samplePrompts.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPromptText(s)}
                    className="text-left px-3 py-1.5 rounded-xl bg-graphite-900 hover:bg-graphite-850 border border-graphite-800 text-[11px] text-graphite-300 hover:text-graphite-100 transition-colors"
                  >
                    "{s}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Optional Skills & Format Parameters */}
          <div className="p-6 rounded-3xl glass-panel-elevated border border-graphite-750 space-y-5">
            <div className="flex items-center justify-between border-b border-graphite-800 pb-3">
              <span className="text-xs font-mono uppercase font-bold text-graphite-300 flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-mint-glow" />
                <span>Target Focus & Format (Optional)</span>
              </span>
              <span className="text-[11px] font-mono text-graphite-500">Fine-tuning parameters</span>
            </div>

            {/* Domain Selection Chips */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono text-graphite-400 uppercase">Cognitive Skill Area</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {domainOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedDomain(opt.id)}
                    className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-mono transition-all text-left ${
                      selectedDomain === opt.id
                        ? 'bg-violet-neon/20 border-violet-neon/50 text-graphite-100 shadow-glass'
                        : 'bg-graphite-900 border-graphite-800 text-graphite-400 hover:text-graphite-200'
                    }`}
                  >
                    {opt.icon}
                    <span className="truncate">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Format Selection Dropdown */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono text-graphite-400 uppercase">Interaction Format</label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full p-3 rounded-xl bg-graphite-900 border border-graphite-800 text-xs font-mono text-graphite-200 focus:outline-none focus:border-violet-neon"
              >
                {formatOptions.map((fmt) => (
                  <option key={fmt.id} value={fmt.id}>
                    {fmt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-graphite-400 uppercase">Target Difficulty</span>
                <span className="text-mint-glow font-bold">
                  {selectedDifficulty} Elo ({selectedDifficulty < 1200 ? 'Beginner' : selectedDifficulty < 1400 ? 'Intermediate' : 'Advanced'})
                </span>
              </div>
              <input
                type="range"
                min={900}
                max={1800}
                step={50}
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(Number(e.target.value))}
                className="w-full accent-mint-neon cursor-pointer"
              />
            </div>

            {/* Generate Action Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-neon to-mint-neon text-graphite-950 font-bold text-sm shadow-mint-glow hover:opacity-95 flex items-center justify-center space-x-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-graphite-950 border-t-transparent rounded-full animate-spin" />
                  <span>Agent Synthesizing Challenge...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 fill-current" />
                  <span>Ask Agent to Generate Challenge</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Agent Reasoning Stepper & Live Preview */}
        <div className="lg:col-span-5 space-y-6">
          {/* Agent Reasoning Stepper */}
          <div className="p-6 rounded-3xl glass-panel-elevated border border-graphite-750 space-y-4">
            <div className="flex items-center space-x-2 text-xs font-mono uppercase font-bold text-graphite-300">
              <Bot className="w-4 h-4 text-mint-glow" />
              <span>Agentic Reasoning Loop</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div
                className={`p-3 rounded-xl border flex items-center space-x-2.5 ${
                  reasoningStep >= 1
                    ? 'bg-violet-neon/15 border-violet-neon/40 text-violet-glow'
                    : 'bg-graphite-900/60 border-graphite-850 text-graphite-500'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-current" />
                <span>1. Parse user natural language & intent</span>
              </div>

              <div
                className={`p-3 rounded-xl border flex items-center space-x-2.5 ${
                  reasoningStep >= 2
                    ? 'bg-violet-neon/15 border-violet-neon/40 text-violet-glow'
                    : 'bg-graphite-900/60 border-graphite-850 text-graphite-500'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-current" />
                <span>2. Select cognitive skills & difficulty rating</span>
              </div>

              <div
                className={`p-3 rounded-xl border flex items-center space-x-2.5 ${
                  reasoningStep >= 3
                    ? 'bg-violet-neon/15 border-violet-neon/40 text-violet-glow'
                    : 'bg-graphite-900/60 border-graphite-850 text-graphite-500'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-current" />
                <span>3. Formulate interaction format & mechanics</span>
              </div>

              <div
                className={`p-3 rounded-xl border flex items-center space-x-2.5 ${
                  reasoningStep >= 4
                    ? 'bg-mint-neon/15 border-mint-neon/40 text-mint-glow'
                    : 'bg-graphite-900/60 border-graphite-850 text-graphite-500'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-current" />
                <span>4. Validate correctness & present challenge</span>
              </div>
            </div>
          </div>

          {/* Active / Created Challenge Preview Card */}
          {activeChallenge ? (
            <div className="p-6 rounded-3xl glass-panel-elevated border border-mint-neon/30 space-y-4 shadow-glass">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-mint-neon/10 border border-mint-neon/30 text-mint-glow font-bold">
                  Generated Challenge
                </span>
                <span className="text-xs font-mono text-graphite-400">
                  {Math.round(activeChallenge.difficulty_rating)} Elo
                </span>
              </div>

              <h4 className="text-base font-bold text-graphite-100 font-sans">
                {activeChallenge.title}
              </h4>

              <p className="text-xs text-graphite-300 font-sans line-clamp-3 leading-relaxed">
                {activeChallenge.prompt}
              </p>

              <div className="pt-2 border-t border-graphite-800 flex items-center justify-between">
                <span className="text-[11px] font-mono text-graphite-400 capitalize">
                  Format: {activeChallenge.challenge_type.replace(/_/g, ' ')}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveMode('challenge')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-neon to-mint-neon text-graphite-950 font-bold text-xs flex items-center space-x-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Solve in Arena</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl glass-panel-elevated border border-graphite-800 text-center space-y-3 text-graphite-500">
              <Compass className="w-8 h-8 mx-auto text-graphite-600 animate-pulse" />
              <div className="text-xs font-mono">No challenge created yet.</div>
              <p className="text-[11px] text-graphite-500">
                Type what kind of challenge you'd like on the left and tap Generate.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
