import React, { useState } from 'react';
import { useAgent } from '../../context/AgentContext';
import { ArenaContainer } from '../Arena/ArenaContainer';
import {
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  Bot,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Brain,
  ShieldCheck,
  Flag
} from 'lucide-react';

export const TrainingSessionView: React.FC = () => {
  const { activeChallenge, loadAdaptiveNext, setActiveMode, lastAttemptResult } = useAgent();

  const [sessionState, setSessionState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [sessionStep, setSessionStep] = useState<number>(1);
  const [totalTargetSteps, setTotalTargetSteps] = useState<number>(5);
  const [sessionCorrectCount, setSessionCorrectCount] = useState<number>(0);
  const [sessionHistory, setSessionHistory] = useState<any[]>([]);
  const [agentDecisionLog, setAgentDecisionLog] = useState<Array<{ step: number; text: string; time: string }>>([]);

  const startSession = async () => {
    setSessionState('running');
    setSessionStep(1);
    setSessionCorrectCount(0);
    setSessionHistory([]);
    setAgentDecisionLog([
      {
        step: 1,
        text: 'Autonomous Agent initialized session. Calibrating baseline cognitive load to current Elo rating. Prescribing initial diagnostic challenge.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }
    ]);
    await loadAdaptiveNext();
  };

  const handleNextChallenge = async () => {
    // Record current result into session history
    if (lastAttemptResult) {
      if (lastAttemptResult.is_correct) {
        setSessionCorrectCount((prev) => prev + 1);
      }
      setSessionHistory((prev) => [...prev, lastAttemptResult]);

      // Add agent decision entry
      const decisionReason = lastAttemptResult.recommendation?.reason || 'Calibrating challenge based on response speed and accuracy.';
      const nextDomain = lastAttemptResult.recommendation?.target_domain || 'logic';
      const nextDiff = Math.round(lastAttemptResult.recommendation?.target_difficulty || 1200);

      setAgentDecisionLog((prev) => [
        {
          step: sessionStep + 1,
          text: `[ADAPTIVE DECISION] Result: ${lastAttemptResult.is_correct ? 'Correct' : 'Incorrect'}. ${decisionReason} Prescribing next challenge in ${nextDomain.toUpperCase()} (${nextDiff} Elo).`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        },
        ...prev
      ]);
    }

    if (sessionStep >= totalTargetSteps) {
      setSessionState('completed');
    } else {
      setSessionStep((prev) => prev + 1);
      await loadAdaptiveNext();
    }
  };

  const finishSessionEarly = () => {
    setSessionState('completed');
  };

  // State 1: Session Idle / Configuration Screen
  if (sessionState === 'idle') {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <div className="p-8 rounded-3xl glass-panel-elevated border border-graphite-750 text-center space-y-6 shadow-glass">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-neon to-mint-neon p-0.5 shadow-violet-glow mx-auto flex items-center justify-center">
            <div className="w-full h-full bg-graphite-950 rounded-[14px] flex items-center justify-center">
              <Zap className="w-8 h-8 text-mint-glow animate-pulse" />
            </div>
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl font-extrabold text-graphite-100 font-sans">
              Autonomous Adaptive Training Session
            </h2>
            <p className="text-xs text-graphite-400 leading-relaxed">
              Let the AI agent take full control of your workout. Every challenge, difficulty adjustment, and cognitive skill transition is decided autonomously in real time based on how you perform.
            </p>
          </div>

          {/* Session Length Options */}
          <div className="max-w-md mx-auto space-y-2 text-left">
            <label className="text-[11px] font-mono text-graphite-400 uppercase">Target Session Length</label>
            <div className="grid grid-cols-3 gap-3">
              {[3, 5, 8].map((steps) => (
                <button
                  key={steps}
                  type="button"
                  onClick={() => setTotalTargetSteps(steps)}
                  className={`p-3 rounded-2xl border text-center font-mono transition-all ${
                    totalTargetSteps === steps
                      ? 'bg-violet-neon/20 border-violet-neon/50 text-graphite-100 shadow-glass'
                      : 'bg-graphite-900 border-graphite-800 text-graphite-400 hover:text-graphite-200'
                  }`}
                >
                  <div className="text-base font-bold">{steps}</div>
                  <div className="text-[10px] uppercase">Challenges</div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={startSession}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-neon to-mint-neon text-graphite-950 font-bold text-sm shadow-mint-glow hover:opacity-95 flex items-center space-x-2 mx-auto cursor-pointer transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Adaptive Session</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // State 2: Session Completed Summary Screen
  if (sessionState === 'completed') {
    const accuracy = Math.round((sessionCorrectCount / Math.max(1, sessionStep)) * 100);

    return (
      <div className="w-full max-w-3xl mx-auto space-y-6">
        <div className="p-8 rounded-3xl glass-panel-elevated border border-mint-neon/40 text-center space-y-6 shadow-glass">
          <div className="w-16 h-16 rounded-2xl bg-mint-deep/30 border border-mint-neon/40 flex items-center justify-center mx-auto text-mint-glow">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-graphite-100">
              Training Session Complete
            </h2>
            <p className="text-xs text-graphite-400">
              Your autonomous training session has concluded. Here is your adaptive session breakdown:
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="p-4 rounded-2xl bg-graphite-900 border border-graphite-800">
              <div className="text-[10px] font-mono text-graphite-400 uppercase">Challenges</div>
              <div className="text-xl font-bold text-graphite-100 mt-1">{sessionStep}</div>
            </div>
            <div className="p-4 rounded-2xl bg-graphite-900 border border-graphite-800">
              <div className="text-[10px] font-mono text-graphite-400 uppercase">Accuracy</div>
              <div className="text-xl font-bold text-mint-glow mt-1">{accuracy}%</div>
            </div>
            <div className="p-4 rounded-2xl bg-graphite-900 border border-graphite-800">
              <div className="text-[10px] font-mono text-graphite-400 uppercase">Solved</div>
              <div className="text-xl font-bold text-violet-glow mt-1">
                {sessionCorrectCount} / {sessionStep}
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-3 pt-2">
            <button
              type="button"
              onClick={startSession}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-neon to-mint-neon text-graphite-950 font-bold text-xs flex items-center space-x-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start Another Session</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('review')}
              className="px-6 py-2.5 rounded-xl bg-graphite-850 hover:bg-graphite-800 border border-graphite-700 text-graphite-200 font-bold text-xs"
            >
              Inspect in Challenge Review
            </button>
          </div>
        </div>
      </div>
    );
  }

  // State 3: Active Training Session
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Session Header / Progress Bar */}
      <div className="p-4 sm:p-6 rounded-3xl glass-panel-elevated border border-graphite-750 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-violet-neon/20 border border-violet-neon/30 text-violet-glow text-xs font-mono font-bold">
              Step {sessionStep} of {totalTargetSteps}
            </span>
            <span className="text-xs font-mono text-graphite-400">
              Session Score: {sessionCorrectCount} Correct
            </span>
          </div>
          <h3 className="text-base font-bold text-graphite-100 mt-1">
            Autonomous Training in Progress
          </h3>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleNextChallenge}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-neon to-mint-neon text-graphite-950 font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-mint-glow"
          >
            <span>Next Adaptive Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={finishSessionEarly}
            className="p-2 rounded-xl bg-graphite-900 hover:bg-graphite-850 border border-graphite-800 text-graphite-400 hover:text-rose-400 transition-colors"
            title="Finish Session Early"
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live Agent Decision Stream (Autonomous Thought Log) */}
      <div className="p-4 rounded-2xl bg-graphite-950/80 border border-graphite-800 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-mint-glow font-bold flex items-center space-x-1.5">
            <Bot className="w-4 h-4" />
            <span>AI AGENT AUTONOMOUS DECISION STREAM</span>
          </span>
          <span className="text-graphite-500 text-[10px]">Real-Time Cognitive Adaptation</span>
        </div>

        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
          {agentDecisionLog.map((log, idx) => (
            <div
              key={idx}
              className="text-xs font-mono p-2 rounded-lg bg-graphite-900 border border-graphite-850 text-graphite-300 flex items-start space-x-2"
            >
              <span className="text-violet-glow text-[10px] shrink-0 mt-0.5">{log.time}</span>
              <span className="leading-snug">{log.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Embedded Active Challenge Arena */}
      {activeChallenge ? (
        <ArenaContainer challenge={activeChallenge} />
      ) : (
        <div className="p-12 text-center rounded-3xl glass-panel-elevated">
          <div className="w-8 h-8 border-2 border-violet-neon border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-mono text-graphite-400">Agent synthesizing next adaptive challenge...</p>
        </div>
      )}
    </div>
  );
};
