import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Lightbulb,
  Zap,
  Shield,
  Sparkles,
  Brain,
  Calculator,
  Target,
  Search,
  BookOpen,
  Globe2,
  Compass,
  Link2,
  ListOrdered,
  CheckSquare,
  Edit3,
  AlertCircle
} from 'lucide-react';
import { Challenge } from '../../types';
import { useAgent } from '../../context/AgentContext';
import { SpeedArena } from './SpeedArena';
import { MathArena } from './MathArena';
import { DetectiveArena } from './DetectiveArena';
import { RiddleArena } from './RiddleArena';
import { PracticalLifeArena } from './PracticalLifeArena';
import { SpatialArena } from './SpatialArena';
import { MemoryArena } from './MemoryArena';
import { LogicArena } from './LogicArena';
import { NumericalArena } from './NumericalArena';
import { VerbalArena } from './VerbalArena';
import { LiveArena } from './LiveArena';
import { MatchingArena } from './MatchingArena';
import { OrderingArena } from './OrderingArena';
import { MultiSelectArena } from './MultiSelectArena';
import { TrueFalseArena } from './TrueFalseArena';
import { FillBlankArena } from './FillBlankArena';
import { OddOneOutArena } from './OddOneOutArena';
import { VisualChallengeBoard } from './VisualChallengeBoard';

interface ArenaContainerProps {
  challenge: Challenge;
}

export const ArenaContainer: React.FC<ArenaContainerProps> = ({ challenge }) => {
  const {
    submitChallengeResponse,
    requestHint,
    activeHint,
    hintsUsedCount,
    agentStatus,
    loadAdaptiveNext,
    askAgent
  } = useAgent();

  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const startTimeRef = useRef<number>(Date.now());

  // Reset timer on new challenge
  useEffect(() => {
    startTimeRef.current = Date.now();
    setElapsedMs(0);

    const interval = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 100);

    return () => clearInterval(interval);
  }, [challenge.id]);

  const handleSubmit = async (userResponse: any) => {
    const finalTimeMs = Date.now() - startTimeRef.current;
    await submitChallengeResponse(userResponse, finalTimeMs);
  };

  const isSubmitting = agentStatus === 'evaluating';

  const genresList = [
    { id: 'wayground', label: 'Wayground Visuals', icon: <Sparkles className="w-3.5 h-3.5 text-mint-glow" />, prompt: 'Give me a Wayground curriculum visual diagram challenge' },
    { id: 'math', label: 'Everyday Math', icon: <Calculator className="w-3.5 h-3.5 text-violet-glow" />, prompt: 'Give me a shopping discount math challenge' },
    { id: 'speed', label: 'Speed & Reflex', icon: <Target className="w-3.5 h-3.5 text-amber-400" />, prompt: 'Give me a speed color reflex test' },
    { id: 'matching', label: 'Pair Matching', icon: <Link2 className="w-3.5 h-3.5 text-emerald-400" />, prompt: 'Give me an interactive matching pairs challenge' },
    { id: 'ordering', label: 'Step Ordering', icon: <ListOrdered className="w-3.5 h-3.5 text-cyan-400" />, prompt: 'Give me a sequence ordering challenge' },
    { id: 'multi', label: 'Multiple-Answer', icon: <CheckSquare className="w-3.5 h-3.5 text-pink-400" />, prompt: 'Give me a multiple answer challenge' },
    { id: 'true_false', label: 'True / False', icon: <CheckSquare className="w-3.5 h-3.5 text-rose-400" />, prompt: 'Give me a true or false challenge' },
    { id: 'odd_out', label: 'Odd One Out', icon: <AlertCircle className="w-3.5 h-3.5 text-amber-300" />, prompt: 'Give me an odd one out puzzle' },
    { id: 'fill_blank', label: 'Word Anagram', icon: <Edit3 className="w-3.5 h-3.5 text-purple-400" />, prompt: 'Give me an anagram or fill in the blank challenge' },
    { id: 'logic', label: 'Detective Logic', icon: <Search className="w-3.5 h-3.5 text-mint-glow" />, prompt: 'Give me a detective deduction puzzle' },
    { id: 'riddles', label: 'Words & Riddles', icon: <BookOpen className="w-3.5 h-3.5 text-pink-400" />, prompt: 'Give me a clever riddle or word analogy' },
    { id: 'science', label: 'Life Smarts', icon: <Globe2 className="w-3.5 h-3.5 text-emerald-400" />, prompt: 'Give me an everyday science or practical life challenge' },
    { id: 'memory', label: 'Memory Matrix', icon: <Brain className="w-3.5 h-3.5 text-sky-400" />, prompt: 'Give me a memory tile matrix challenge' },
    { id: 'shapes', label: 'Visual Shapes', icon: <Compass className="w-3.5 h-3.5 text-teal-400" />, prompt: 'Give me a visual shape match puzzle' },
  ];

  const renderActiveArena = () => {
    const format = challenge.payload?.interaction_format || challenge.challenge_type;

    if (format === 'matching') {
      return <MatchingArena payload={challenge.payload as any} prompt={challenge.prompt} onSubmit={handleSubmit} disabled={isSubmitting} />;
    }
    if (format === 'ordering' || format === 'sequence_order') {
      return <OrderingArena payload={challenge.payload as any} prompt={challenge.prompt} onSubmit={handleSubmit} disabled={isSubmitting} />;
    }
    if (format === 'multi_select' || format === 'multiple_answer') {
      return <MultiSelectArena payload={challenge.payload as any} prompt={challenge.prompt} onSubmit={handleSubmit} disabled={isSubmitting} />;
    }
    if (format === 'true_false') {
      return <TrueFalseArena payload={challenge.payload as any} prompt={challenge.prompt} onSubmit={handleSubmit} disabled={isSubmitting} />;
    }
    if (format === 'fill_blank' || format === 'anagram') {
      return <FillBlankArena payload={challenge.payload as any} prompt={challenge.prompt} onSubmit={handleSubmit} disabled={isSubmitting} />;
    }
    if (format === 'odd_one_out') {
      return <OddOneOutArena payload={challenge.payload as any} prompt={challenge.prompt} onSubmit={handleSubmit} disabled={isSubmitting} />;
    }

    // Visual diagram challenges with multiple-choice options (Gear Rotation, Circuit, Scale, Geometry, etc.)
    if (challenge.payload?.visual_type && Array.isArray(challenge.payload?.options) && challenge.payload.options.length > 0) {
      return (
        <PracticalLifeArena
          payload={challenge.payload}
          prompt={challenge.prompt}
          onSubmit={handleSubmit}
          disabled={isSubmitting}
        />
      );
    }

    switch (challenge.challenge_type) {
      case 'speed_stroop':
        return <SpeedArena payload={challenge.payload} onSubmit={handleSubmit} disabled={isSubmitting} />;

      case 'math_quiz':
        return <MathArena payload={challenge.payload} prompt={challenge.prompt} onSubmit={handleSubmit} disabled={isSubmitting} />;

      case 'detective_quiz':
        return <DetectiveArena payload={challenge.payload} prompt={challenge.prompt} onSubmit={handleSubmit} disabled={isSubmitting} />;

      case 'verbal_quiz':
        return <RiddleArena payload={challenge.payload} prompt={challenge.prompt} onSubmit={handleSubmit} disabled={isSubmitting} />;

      case 'science_quiz':
        return <PracticalLifeArena payload={challenge.payload} prompt={challenge.prompt} onSubmit={handleSubmit} disabled={isSubmitting} />;

      case 'spatial_rotation':
        if (challenge.payload?.reference_coords) {
          return <SpatialArena payload={challenge.payload} onSubmit={handleSubmit} disabled={isSubmitting} />;
        }
        return <PracticalLifeArena payload={challenge.payload} prompt={challenge.prompt} onSubmit={handleSubmit} disabled={isSubmitting} />;

      case 'memory_span':
        return <MemoryArena payload={challenge.payload} onSubmit={handleSubmit} disabled={isSubmitting} />;

      case 'logic_deduction':
      case 'matrix_pattern':
        return <LogicArena payload={challenge.payload} onSubmit={handleSubmit} disabled={isSubmitting} />;

      case 'numerical_sequence':
        return <NumericalArena payload={challenge.payload} onSubmit={handleSubmit} disabled={isSubmitting} />;

      case 'live_intelligence':
        return (
          <LiveArena
            payload={challenge.payload}
            sourceInfo={challenge.source_info}
            onSubmit={handleSubmit}
            disabled={isSubmitting}
          />
        );

      case 'challenge_fusion':
        if (challenge.payload?.fusion_type === 'memory_spatial') {
          return <SpatialArena payload={challenge.payload} onSubmit={handleSubmit} disabled={isSubmitting} />;
        } else if (challenge.payload?.fusion_type === 'numerical_critical') {
          return <NumericalArena payload={challenge.payload} onSubmit={handleSubmit} disabled={isSubmitting} />;
        }
        return <RiddleArena payload={challenge.payload} prompt={challenge.prompt} onSubmit={handleSubmit} disabled={isSubmitting} />;

      default:
        if (challenge.payload?.options && Array.isArray(challenge.payload.options) && challenge.payload.options.length > 0) {
          return <PracticalLifeArena payload={challenge.payload} prompt={challenge.prompt} onSubmit={handleSubmit} disabled={isSubmitting} />;
        }
        return <RiddleArena payload={challenge.payload} prompt={challenge.prompt} onSubmit={handleSubmit} disabled={isSubmitting} />;
    }
  };

  const formattedSeconds = (elapsedMs / 1000).toFixed(1);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Wayground-style Genre Switcher Strip */}
      <div className="p-2.5 rounded-2xl bg-graphite-900/90 border border-graphite-800 shadow-glass flex items-center space-x-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] font-mono text-graphite-400 font-bold uppercase tracking-wider pl-2 shrink-0">
          Genres:
        </span>
        {genresList.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => askAgent(g.prompt)}
            disabled={agentStatus !== 'idle'}
            className="px-3 py-1.5 rounded-xl bg-graphite-950/80 hover:bg-graphite-800 border border-graphite-800 hover:border-graphite-700 text-graphite-300 hover:text-graphite-100 text-xs font-mono flex items-center space-x-1.5 shrink-0 transition-all cursor-pointer disabled:opacity-50"
          >
            {g.icon}
            <span>{g.label}</span>
          </button>
        ))}
      </div>

      {/* Challenge Arena Header Bar */}
      <div className="p-4 rounded-2xl bg-graphite-900/80 border border-graphite-750 flex flex-wrap items-center justify-between gap-4 shadow-glass">
        {/* Domain Badge & Title */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-violet-neon/20 text-violet-glow border border-violet-neon/30">
              {challenge.primary_domain}
            </span>
            {challenge.secondary_domains?.map((sec, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-mint-deep/30 text-mint-glow border border-mint-glow/30"
              >
                +{sec}
              </span>
            ))}
            <span className="text-xs font-mono text-graphite-400">
              Target Level: <strong className="text-graphite-200">{Math.round(challenge.difficulty_rating)} Elo</strong>
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-graphite-100 flex items-center space-x-2">
            <span>{challenge.title}</span>
          </h2>
        </div>

        {/* Real-time Reaction Stopwatch & Hint Button */}
        <div className="flex items-center space-x-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-graphite-950 border border-graphite-800 flex items-center space-x-2 font-mono text-sm text-graphite-300">
            <Timer className="w-4 h-4 text-mint-glow animate-pulse-subtle" />
            <span className="w-12 text-right">{formattedSeconds}s</span>
          </div>

          <button
            type="button"
            onClick={requestHint}
            disabled={!!activeHint || isSubmitting}
            className="px-3.5 py-1.5 rounded-xl bg-graphite-800 hover:bg-graphite-750 border border-graphite-700 text-xs font-mono flex items-center space-x-1.5 text-amber-300 hover:text-amber-200 disabled:opacity-50 transition-colors cursor-pointer"
            title="Request Progressive Hint"
          >
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Hint {hintsUsedCount > 0 ? `(${hintsUsedCount})` : ''}</span>
          </button>
        </div>
      </div>

      {/* Active Hint Banner if requested */}
      {activeHint && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start space-x-3 shadow-inner">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-mono font-bold uppercase text-amber-300 mr-1.5">Coach Hint:</span>
            <span>{activeHint}</span>
          </div>
        </div>
      )}

      {/* Interactive Arena Specialized Interface */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel-elevated shadow-glass min-h-[400px] space-y-6">
        <VisualChallengeBoard
          payload={challenge.payload}
          title={challenge.title}
          domain={challenge.primary_domain}
          challengeType={challenge.challenge_type}
        />
        {renderActiveArena()}
      </div>

      {/* Bottom Context Footnote */}
      <div className="flex items-center justify-between text-[11px] font-mono text-graphite-500 px-2">
        <span className="flex items-center space-x-1">
          <Brain className="w-3.5 h-3.5 text-violet-glow" />
          <span>Real-time adaptive difficulty scaling active</span>
        </span>
        <button
          type="button"
          onClick={() => loadAdaptiveNext()}
          className="text-graphite-400 hover:text-graphite-200 hover:underline flex items-center space-x-1 cursor-pointer"
        >
          <Zap className="w-3 h-3 text-mint-glow" />
          <span>Next Adaptive Workout</span>
        </button>
      </div>
    </div>
  );
};
