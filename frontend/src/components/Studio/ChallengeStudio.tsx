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
  RotateCcw
} from 'lucide-react';

export const ChallengeStudio: React.FC = () => {
  const { askAgent, setActiveMode, activeChallenge, agentStatus } = useAgent();

  const [promptText, setPromptText] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<string>('math');
  const [selectedAudience, setSelectedAudience] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('mcq');
  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(1200);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedSuccess, setGeneratedSuccess] = useState<boolean>(false);
  const [reasoningStep, setReasoningStep] = useState<number>(0);

  const domainOptions = [
    { id: 'math', label: 'Everyday Math & Shopping', icon: <ShoppingBag className="w-4 h-4 text-emerald-400" /> },
    { id: 'speed', label: 'Speed & Reflexes', icon: <Zap className="w-4 h-4 text-amber-400" /> },
    { id: 'logic', label: 'Detective Logic & Clues', icon: <SearchCode className="w-4 h-4 text-violet-400" /> },
    { id: 'science', label: 'Practical Science & Gadgets', icon: <Lightbulb className="w-4 h-4 text-cyan-400" /> },
    { id: 'language', label: 'English & Lateral Riddles', icon: <BookOpen className="w-4 h-4 text-pink-400" /> },
    { id: 'life_skills', label: 'Life Skills & Travel', icon: <Globe2 className="w-4 h-4 text-blue-400" /> },
  ];

  const audienceOptions = [
    { id: 'middle', label: '🎒 Middle School (Grades 5-8)' },
    { id: 'high', label: '🎓 High School' },
    { id: 'all', label: '🌟 All Levels & Family' },
    { id: 'adult', label: '💼 Adults & Professional' },
  ];

  const quickTemplates = [
    {
      title: '🛒 Supermarket Discounts & Tips',
      domain: 'math',
      prompt: 'Create a practical math challenge calculating 20% discounts and restaurant tax',
    },
    {
      title: '⚡ Lightning Stroop Color Reflexes',
      domain: 'speed',
      prompt: 'Generate a high-speed color conflict reaction test under 5 seconds',
    },
    {
      title: '🔍 Stolen Trophy Detective Mystery',
      domain: 'logic',
      prompt: 'Create a detective clue deduction mystery with 4 suspects and verifiable facts',
    },
    {
      title: '💡 Everyday Physics: How Microwave Heats',
      domain: 'science',
      prompt: 'Create an engaging everyday practical science question about microwave and kitchen gadgets',
    },
    {
      title: '📖 Tricky Lateral Thinking Riddle',
      domain: 'language',
      prompt: 'Generate a clever word riddle that challenges assumptions without being confusing',
    },
    {
      title: '🌍 International Flight Time Zones',
      domain: 'life_skills',
      prompt: 'Create a real-world travel math scenario calculating flight durations across time zones',
    },
  ];

  const handleSelectTemplate = (tpl: typeof quickTemplates[0]) => {
    setPromptText(tpl.prompt);
    setSelectedDomain(tpl.domain);
  };

  const handleGenerate = async () => {
    const finalPrompt =
      promptText.trim() ||
      `Create an engaging ${selectedDomain} challenge for ${selectedAudience} level with difficulty ${selectedDifficulty}`;

    setIsGenerating(true);
    setGeneratedSuccess(false);
    setReasoningStep(1);

    // Realistic pedagogical agent reasoning simulation
    setTimeout(() => setReasoningStep(2), 500);
    setTimeout(() => setReasoningStep(3), 1100);
    setTimeout(() => setReasoningStep(4), 1700);

    try {
      await askAgent(finalPrompt);
      setTimeout(() => {
        setIsGenerating(false);
        setGeneratedSuccess(true);
      }, 2000);
    } catch (err) {
      console.error('Agent generation failed:', err);
      setIsGenerating(false);
    }
  };

  const handlePlayGenerated = () => {
    setActiveMode('challenge');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Studio Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel-elevated border border-graphite-750 shadow-glass space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-neon/20 border border-violet-neon/40 text-violet-glow text-xs font-mono font-bold">
          <Bot className="w-4 h-4" />
          <span>AI Quiz Creator Studio</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-graphite-100 font-sans tracking-tight">
          Generate Custom Quizzes With Autonomous AI
        </h1>
        <p className="text-xs md:text-sm text-graphite-300 leading-relaxed max-w-2xl">
          On Wayground, educators must manually create or copy question sets. Cognivista empowers you with a genuine AI Agent that invents original, verified questions with interactive options, step-by-step hints, and explanations in seconds.
        </p>
      </div>

      {/* Main Creation Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-graphite-900 border border-graphite-800 space-y-6 shadow-glass">
        {/* Step 1: Prompt Input */}
        <div className="space-y-3">
          <label className="text-xs font-mono uppercase tracking-wider text-graphite-300 font-bold block">
            1. What quiz would you like the AI Agent to build?
          </label>
          <div className="relative">
            <textarea
              rows={3}
              placeholder="e.g. Create a 4-question everyday math quiz on supermarket discounts and receipts for 8th graders..."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="w-full p-4 rounded-2xl bg-graphite-950 border border-graphite-750 text-graphite-100 text-sm placeholder:text-graphite-500 focus:outline-none focus:border-violet-neon focus:ring-1 focus:ring-violet-neon/40 transition-all font-sans"
            />
          </div>

          {/* Quick Idea Templates */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-mono text-graphite-400 font-medium block">
              Or pick an instant idea template:
            </span>
            <div className="flex flex-wrap gap-2">
              {quickTemplates.map((tpl) => (
                <button
                  key={tpl.title}
                  type="button"
                  onClick={() => handleSelectTemplate(tpl)}
                  className="px-3 py-1.5 rounded-xl bg-graphite-950 border border-graphite-800 hover:border-violet-neon/40 hover:text-white text-[11px] font-mono text-graphite-300 transition-all cursor-pointer"
                >
                  {tpl.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2: Subject Domain Selection */}
        <div className="space-y-3 pt-2 border-t border-graphite-800">
          <label className="text-xs font-mono uppercase tracking-wider text-graphite-300 font-bold block">
            2. Primary Subject Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {domainOptions.map((opt) => {
              const isSelected = selectedDomain === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedDomain(opt.id)}
                  className={`p-3 rounded-2xl border text-left flex items-center space-x-2.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-violet-neon/20 border-violet-neon text-white shadow-violet-glow/20'
                      : 'bg-graphite-950/70 border-graphite-800 text-graphite-300 hover:border-graphite-700 hover:bg-graphite-850'
                  }`}
                >
                  {opt.icon}
                  <span className="text-xs font-mono font-medium">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Audience Level */}
        <div className="space-y-3 pt-2 border-t border-graphite-800">
          <label className="text-xs font-mono uppercase tracking-wider text-graphite-300 font-bold block">
            3. Target Audience / Grade Level
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {audienceOptions.map((aud) => {
              const isSelected = selectedAudience === aud.id;
              return (
                <button
                  key={aud.id}
                  type="button"
                  onClick={() => setSelectedAudience(aud.id)}
                  className={`p-2.5 rounded-xl border text-center text-xs font-mono transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-mint-glow text-graphite-950 font-bold border-mint-glow'
                      : 'bg-graphite-950 border-graphite-800 text-graphite-400 hover:text-graphite-200'
                  }`}
                >
                  {aud.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: Difficulty Slider */}
        <div className="space-y-3 pt-2 border-t border-graphite-800">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="uppercase tracking-wider text-graphite-300 font-bold">
              4. Target Difficulty Rating
            </span>
            <span className="text-mint-glow font-bold text-sm">{selectedDifficulty} Elo</span>
          </div>
          <input
            type="range"
            min="900"
            max="1800"
            step="50"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(Number(e.target.value))}
            className="w-full accent-mint-neon cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-graphite-500">
            <span>Beginner (900)</span>
            <span>Intermediate (1200)</span>
            <span>Challenging (1500)</span>
            <span>Master (1800+)</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-graphite-800">
          <button
            type="button"
            disabled={isGenerating}
            onClick={handleGenerate}
            className={`w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-violet-neon to-mint-neon text-graphite-950 font-extrabold text-sm font-sans shadow-mint-glow/30 flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              isGenerating ? 'opacity-80 animate-pulse' : 'hover:opacity-95 hover:scale-[1.01]'
            }`}
          >
            <Sparkles className="w-5 h-5 text-graphite-950" />
            <span>
              {isGenerating ? 'AI Agent Is Generating Quiz...' : '✨ Generate Complete Quiz with AI Agent'}
            </span>
          </button>
        </div>
      </div>

      {/* Live AI Reasoning Visualizer */}
      {isGenerating && (
        <div className="p-6 rounded-3xl bg-graphite-900 border border-violet-neon/50 shadow-violet-glow/20 space-y-4 animate-fadeIn">
          <div className="flex items-center space-x-2 text-violet-glow text-xs font-mono font-bold">
            <Bot className="w-4 h-4 animate-bounce" />
            <span>Autonomous Cognitive Orchestrator Working</span>
          </div>

          <div className="space-y-2.5">
            <div
              className={`p-3 rounded-xl border text-xs font-mono flex items-center space-x-3 transition-all ${
                reasoningStep >= 1
                  ? 'bg-graphite-950 border-mint-glow/40 text-mint-glow'
                  : 'bg-graphite-950/40 border-graphite-800 text-graphite-500'
              }`}
            >
              <CheckCircle className={`w-4 h-4 ${reasoningStep >= 1 ? 'text-mint-glow' : 'text-graphite-600'}`} />
              <span>Step 1: NLP Intent Parser parsing requirements & target grade level...</span>
            </div>

            <div
              className={`p-3 rounded-xl border text-xs font-mono flex items-center space-x-3 transition-all ${
                reasoningStep >= 2
                  ? 'bg-graphite-950 border-mint-glow/40 text-mint-glow'
                  : 'bg-graphite-950/40 border-graphite-800 text-graphite-500'
              }`}
            >
              <CheckCircle className={`w-4 h-4 ${reasoningStep >= 2 ? 'text-mint-glow' : 'text-graphite-600'}`} />
              <span>Step 2: Synthesizing real-world practical problem scenario...</span>
            </div>

            <div
              className={`p-3 rounded-xl border text-xs font-mono flex items-center space-x-3 transition-all ${
                reasoningStep >= 3
                  ? 'bg-graphite-950 border-mint-glow/40 text-mint-glow'
                  : 'bg-graphite-950/40 border-graphite-800 text-graphite-500'
              }`}
            >
              <CheckCircle className={`w-4 h-4 ${reasoningStep >= 3 ? 'text-mint-glow' : 'text-graphite-600'}`} />
              <span>Step 3: Calculating valid answer keys & distractor plausibility...</span>
            </div>

            <div
              className={`p-3 rounded-xl border text-xs font-mono flex items-center space-x-3 transition-all ${
                reasoningStep >= 4
                  ? 'bg-graphite-950 border-mint-glow/40 text-mint-glow'
                  : 'bg-graphite-950/40 border-graphite-800 text-graphite-500'
              }`}
            >
              <CheckCircle className={`w-4 h-4 ${reasoningStep >= 4 ? 'text-mint-glow' : 'text-graphite-600'}`} />
              <span>Step 4: Compiling interactive gameboard payload & pedagogical hints...</span>
            </div>
          </div>
        </div>
      )}

      {/* Generated Quiz Live Preview Deck */}
      {generatedSuccess && activeChallenge && !isGenerating && (
        <div className="p-6 md:p-8 rounded-3xl bg-graphite-900 border border-mint-glow/40 shadow-mint-glow/10 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-graphite-800 pb-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-mint-glow font-bold uppercase flex items-center space-x-1.5">
                <Check className="w-4 h-4" />
                <span>Quiz Successfully Generated by AI Agent</span>
              </span>
              <h3 className="text-xl font-bold text-graphite-100 font-sans">
                {activeChallenge.title}
              </h3>
            </div>

            <button
              type="button"
              onClick={handlePlayGenerated}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-neon to-mint-neon text-graphite-950 font-bold text-xs font-mono shadow-mint-glow/20 flex items-center space-x-2 shrink-0 cursor-pointer hover:opacity-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Play in Arena Now</span>
            </button>
          </div>

          {/* Question Preview Box */}
          <div className="p-5 rounded-2xl bg-graphite-950 border border-graphite-800 space-y-3">
            <span className="text-[10px] font-mono text-graphite-400 font-bold uppercase tracking-wider block">
              Question Prompt Preview:
            </span>
            <p className="text-sm text-graphite-200 font-medium leading-relaxed">
              {activeChallenge.prompt}
            </p>

            {activeChallenge.description && (
              <p className="text-xs text-graphite-400 italic">
                {activeChallenge.description}
              </p>
            )}

            {activeChallenge.hint && (
              <div className="pt-2 text-xs font-mono text-amber-300 flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Hint: {activeChallenge.hint}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-graphite-400">
            <span>Subject: {activeChallenge.primary_domain}</span>
            <span>Difficulty: {Math.round(activeChallenge.difficulty_rating)} Elo</span>
            <span className="text-mint-glow font-bold">Ready to Play</span>
          </div>
        </div>
      )}
    </div>
  );
};
