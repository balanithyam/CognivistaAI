import React, { useState } from 'react';
import { useAgent } from '../../context/AgentContext';
import {
  ShoppingBag,
  Zap,
  SearchCode,
  Lightbulb,
  BookOpen,
  Brain,
  Sparkles,
  Play,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

export const SubjectMasteryReport: React.FC = () => {
  const { askAgent, setActiveMode } = useAgent();
  const [activeSubject, setActiveSubject] = useState<string>('math');

  const subjects = [
    {
      id: 'math',
      name: 'Everyday Math',
      subtitle: 'Discounts, Tips & Budgets',
      score: 86,
      color: '#10b981',
      icon: <ShoppingBag className="w-5 h-5 text-emerald-400" />,
      desc: 'Calculating grocery flash sales, restaurant bill splitting, and fast mental percentage math.',
      tip: 'Practicing everyday estimation helps make rapid, confident financial decisions in daily life.',
      status: 'Proficient (Top 15%)'
    },
    {
      id: 'speed',
      name: 'Speed & Reflexes',
      subtitle: 'Stroop Color & Fast Reaction',
      score: 89,
      color: '#fbbf24',
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      desc: 'Rapid color-word conflict reaction and quick decision-making under 5-second countdown timers.',
      tip: 'Reflex speed training sharpens focus and helps filter out daily cognitive distractions.',
      status: 'Advanced (Top 10%)'
    },
    {
      id: 'logic',
      name: 'Detective Logic',
      subtitle: 'Clue Deduction & Elimination',
      score: 82,
      color: '#8b5cf6',
      icon: <SearchCode className="w-5 h-5 text-violet-400" />,
      desc: 'Analyzing clues, eliminating contradictory suspects, and reaching verifiable conclusions.',
      tip: 'Logical deduction builds structured reasoning useful for exams, code, and investigation.',
      status: 'Proficient (Top 20%)'
    },
    {
      id: 'science',
      name: 'Practical Science',
      subtitle: 'Gadgets, Energy & Everyday Life',
      score: 78,
      color: '#06b6d4',
      icon: <Lightbulb className="w-5 h-5 text-cyan-400" />,
      desc: 'Understanding how home microwaves work, battery charging physics, and natural phenomena.',
      tip: 'Applying scientific curiosity to daily appliances builds lasting intuitive problem-solving skills.',
      status: 'Developing (Top 25%)'
    },
    {
      id: 'language',
      name: 'Words & Riddles',
      subtitle: 'Lateral Thinking & Wordplay',
      score: 92,
      color: '#ec4899',
      icon: <BookOpen className="w-5 h-5 text-pink-400" />,
      desc: 'Thinking outside the box, solving clever riddles, and spotting lateral word analogies.',
      tip: 'Riddles train neural plasticity by breaking automatic mental assumptions.',
      status: 'Master (Top 5%)'
    },
    {
      id: 'visual',
      name: 'Visual Shapes',
      subtitle: 'Shape Matching & Rotation',
      score: 85,
      color: '#00f5a0',
      icon: <Brain className="w-5 h-5 text-mint-glow" />,
      desc: 'Spotting symmetry, turning 2D/3D shapes mentally, and recognizing visual geometric patterns.',
      tip: 'Essential for architecture, navigation, art, and visual interface comprehension.',
      status: 'Proficient (Top 15%)'
    },
  ];

  const selectedSubject = subjects.find((s) => s.id === activeSubject) || subjects[0];

  const handleTrainSubject = (subjectId: string) => {
    askAgent(`Let's train my ${subjectId} skills`);
    setActiveMode('challenge');
  };

  return (
    <div className="w-full rounded-3xl bg-graphite-900 border border-graphite-800 p-6 md:p-8 shadow-glass space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-graphite-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-mint-glow text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Subject Mastery Assessment</span>
          </div>
          <h3 className="text-xl font-bold text-graphite-100 mt-1 font-sans">
            Student Subject & Faculty Mastery
          </h3>
          <p className="text-xs text-graphite-400">
            Real-time competency across core academic and life skill faculties evaluated by Cognivista AI.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleTrainSubject(selectedSubject.id)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-neon to-mint-neon text-graphite-950 font-bold text-xs font-mono shadow-mint-glow hover:opacity-95 flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Practice {selectedSubject.name}</span>
        </button>
      </div>

      {/* Grid of 6 Subject Mastery Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {subjects.map((sub) => {
          const isSelected = activeSubject === sub.id;
          return (
            <div
              key={sub.id}
              onClick={() => setActiveSubject(sub.id)}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-graphite-850 border-mint-glow shadow-mint-glow/20 scale-[1.03] ring-2 ring-mint-glow/30'
                  : 'bg-graphite-950/80 border-graphite-800 hover:border-graphite-700 hover:bg-graphite-850/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-graphite-900 border border-graphite-800">
                  {sub.icon}
                </div>
                <span className="text-base font-bold font-mono text-graphite-100">
                  {sub.score}%
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-graphite-200 line-clamp-1">{sub.name}</h4>
                <span className="text-[10px] text-graphite-400 font-mono block truncate">
                  {sub.subtitle}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-graphite-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${sub.score}%`,
                    backgroundColor: sub.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Subject In-Depth Card */}
      <div className="p-5 rounded-2xl bg-graphite-950 border border-graphite-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: selectedSubject.color }}
            />
            <h4 className="text-base font-bold text-graphite-100 font-sans">
              {selectedSubject.name}: {selectedSubject.subtitle}
            </h4>
            <span className="px-2 py-0.5 rounded-full bg-graphite-850 border border-graphite-750 text-[10px] font-mono text-mint-glow font-bold">
              {selectedSubject.status}
            </span>
          </div>

          <p className="text-xs text-graphite-300 leading-relaxed">
            {selectedSubject.desc}
          </p>

          <p className="text-xs text-graphite-400 italic">
            💡 <strong>AI Coach Note:</strong> {selectedSubject.tip}
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleTrainSubject(selectedSubject.id)}
          className="px-6 py-3 rounded-xl bg-graphite-850 hover:bg-graphite-800 text-graphite-100 border border-graphite-700 text-xs font-mono font-bold flex items-center space-x-2 shrink-0 cursor-pointer transition-all"
        >
          <Play className="w-3.5 h-3.5 text-mint-glow fill-current" />
          <span>Launch {selectedSubject.name} Workout</span>
        </button>
      </div>
    </div>
  );
};
