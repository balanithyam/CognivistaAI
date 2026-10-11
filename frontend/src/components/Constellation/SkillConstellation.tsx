import React, { useState } from 'react';
import { useAgent } from '../../context/AgentContext';
import { Brain, Zap, Target, Sparkles, Compass, Lightbulb, Play } from 'lucide-react';

export const SkillConstellation: React.FC = () => {
  const { askAgent, setActiveMode } = useAgent();
  const [activeSkill, setActiveSkill] = useState<string>('visual');

  const skills = [
    {
      id: 'memory',
      name: 'Memory',
      subtitle: 'Pattern & Sequence Recall',
      score: 84,
      color: '#38bdf8',
      icon: <Brain className="w-5 h-5 text-sky-400" />,
      desc: 'How quickly and accurately your brain holds and recalls visual patterns and sequences.',
      tip: 'Daily memory exercises prevent cognitive fatigue and sharpen focus.',
    },
    {
      id: 'visual',
      name: 'Visual & Shapes',
      subtitle: 'Pattern & Shape Matching',
      score: 91,
      color: '#00f5a0',
      icon: <Compass className="w-5 h-5 text-mint-glow" />,
      desc: 'Your ability to mentally rotate shapes, spot geometric symmetry, and visualize physical objects.',
      tip: 'Top performers in design, architecture, and navigation excel in visual pattern recognition.',
    },
    {
      id: 'logic',
      name: 'Logic & Math',
      subtitle: 'Deduction & Number Chains',
      score: 79,
      color: '#8b5cf6',
      icon: <Zap className="w-5 h-5 text-violet-glow" />,
      desc: 'Recognizing patterns, solving numerical series, and connecting clues to reach conclusions.',
      tip: 'Logical flexibility helps with daily financial decisions and structured planning.',
    },
    {
      id: 'attention',
      name: 'Speed & Focus',
      subtitle: 'Reaction Time & Reflexes',
      score: 88,
      color: '#fbbf24',
      icon: <Target className="w-5 h-5 text-amber-400" />,
      desc: 'Processing speed under time pressure and selective attention ignoring distractions.',
      tip: 'Faster reflexes free up mental energy for deeper creative problem solving.',
    },
    {
      id: 'lateral',
      name: 'Problem Solving',
      subtitle: 'Lateral Thinking & Riddles',
      score: 82,
      color: '#ec4899',
      icon: <Lightbulb className="w-5 h-5 text-pink-400" />,
      desc: 'Looking at situations from unexpected angles and escaping common mental traps.',
      tip: 'Great for creative innovation, entrepreneurship, and out-of-the-box ideas.',
    },
  ];

  const selectedSkill = skills.find((s) => s.id === activeSkill) || skills[0];

  const handleTrainSkill = (skillId: string) => {
    askAgent(`Let's train my ${skillId} brain power`);
    setActiveMode('challenge');
  };

  return (
    <div className="w-full rounded-3xl bg-graphite-900 border border-graphite-850 p-6 md:p-8 shadow-glass space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-graphite-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-violet-glow text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Brain Power Map</span>
          </div>
          <h3 className="text-xl font-bold text-graphite-100 mt-1">
            Your 5 Core Cognitive Powers
          </h3>
          <p className="text-xs text-graphite-400">
            Click on any brain power to inspect your mastery score and launch targeted training.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleTrainSkill(selectedSkill.id)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-neon to-mint-neon text-graphite-950 font-bold text-xs font-mono shadow-mint-glow hover:opacity-95 flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Train {selectedSkill.name} Now</span>
        </button>
      </div>

      {/* Grid of 5 Brain Powers */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {skills.map((skill) => {
          const isSelected = activeSkill === skill.id;
          return (
            <div
              key={skill.id}
              onClick={() => setActiveSkill(skill.id)}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-graphite-850 border-violet-glow/80 shadow-violet-glow scale-105 ring-2 ring-violet-glow/40'
                  : 'bg-graphite-950/80 border-graphite-800 hover:border-graphite-700 hover:bg-graphite-850/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-graphite-900 border border-graphite-800">
                  {skill.icon}
                </div>
                <span className="text-lg font-bold font-mono text-graphite-100">
                  {skill.score}%
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-graphite-200">{skill.name}</h4>
                <span className="text-[10px] text-graphite-400 font-mono block truncate">
                  {skill.subtitle}
                </span>
              </div>

              {/* Mini Progress Bar */}
              <div className="w-full bg-graphite-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${skill.score}%`,
                    backgroundColor: skill.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Power In-Depth Card */}
      <div className="p-5 rounded-2xl bg-graphite-950/80 border border-graphite-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: selectedSkill.color }}
            />
            <h4 className="text-base font-bold text-graphite-100">
              {selectedSkill.name}: {selectedSkill.subtitle}
            </h4>
            <span className="px-2 py-0.5 rounded-full bg-graphite-800 text-[10px] font-mono text-mint-glow font-bold">
              Level {Math.floor(selectedSkill.score / 10)}
            </span>
          </div>

          <p className="text-xs text-graphite-300 leading-relaxed">
            {selectedSkill.desc}
          </p>

          <p className="text-xs text-graphite-400 italic">
            💡 <strong>Coach Tip:</strong> {selectedSkill.tip}
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleTrainSkill(selectedSkill.id)}
          className="px-6 py-3 rounded-xl bg-graphite-800 hover:bg-graphite-750 text-graphite-100 border border-graphite-700 text-xs font-mono font-bold flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 text-mint-glow fill-current" />
          <span>Launch {selectedSkill.name} Challenge</span>
        </button>
      </div>
    </div>
  );
};
