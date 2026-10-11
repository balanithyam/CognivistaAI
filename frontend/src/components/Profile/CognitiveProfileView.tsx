import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAgent } from '../../context/AgentContext';
import { api } from '../../services/api';
import { SubjectMasteryReport } from './SubjectMasteryReport';
import {
  Award,
  Flame,
  Target,
  Clock,
  Sparkles,
  Trophy,
  CheckCircle2,
  XCircle,
  Play,
  HeartHandshake,
  GraduationCap
} from 'lucide-react';

export const CognitiveProfileView: React.FC = () => {
  const { user, profile } = useAuth();
  const { loadAdaptiveNext, setActiveMode } = useAgent();
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoadingHistory(true);
        const data = await api.getHistory();
        setHistory(data.history || []);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    fetchHistory();
  }, []);

  if (!profile) return null;

  const brainScore = Math.round(profile.composite_elo || 1200);
  const accuracy = Math.round(profile.accuracy_percent || 0);
  const currentStreak = profile.current_streak || 0;
  const bestStreak = profile.best_streak || 0;
  const totalSolved = profile.total_solved || 0;

  // Simple, human-friendly coach level
  const userLevel = Math.max(1, Math.floor((brainScore - 800) / 80) + 1);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Top Brain Health Header Card */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel-elevated border border-graphite-750 flex flex-col md:flex-row items-center justify-between gap-6 shadow-glass">
        <div className="flex items-center space-x-5">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr from-violet-neon to-mint-neon p-0.5 shadow-violet-glow flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-graphite-950 rounded-[14px] flex flex-col items-center justify-center">
              <Sparkles className="w-7 h-7 text-mint-glow" />
              <span className="text-[10px] font-mono text-graphite-400 font-bold uppercase mt-0.5">
                LVL {userLevel}
              </span>
            </div>
          </div>

          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold text-graphite-100 font-sans">
                {user?.full_name || user?.username || 'Brain Athlete'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-violet-neon/20 border border-violet-neon/30 text-violet-glow text-xs font-mono font-bold">
                Level {userLevel} Mental Athlete
              </span>
            </div>
            <p className="text-xs text-graphite-400">
              Personalized training profile calibrated by Cognivista AI Coach.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            loadAdaptiveNext();
            setActiveMode('challenge');
          }}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-neon to-mint-neon text-graphite-950 font-bold text-sm shadow-mint-glow hover:opacity-95 flex items-center space-x-2 cursor-pointer transition-all"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Start Daily Workout</span>
        </button>
      </div>

      {/* 4 Core Vitality Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Brain Score */}
        <div className="p-5 rounded-2xl bg-graphite-900/90 border border-graphite-750 flex flex-col justify-between">
          <div className="flex items-center justify-between text-graphite-400">
            <span className="text-xs font-mono uppercase font-semibold">Brain Score</span>
            <Award className="w-4 h-4 text-violet-glow" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold font-mono text-gradient-violet">
              {brainScore}
            </span>
            <span className="text-[11px] font-mono text-graphite-400 block mt-1">
              Top 20% in Visual Patterns & Logic
            </span>
          </div>
        </div>

        {/* Daily Streak */}
        <div className="p-5 rounded-2xl bg-graphite-900/90 border border-graphite-750 flex flex-col justify-between">
          <div className="flex items-center justify-between text-graphite-400">
            <span className="text-xs font-mono uppercase font-semibold">Current Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold font-mono text-amber-300">
              {currentStreak} <span className="text-base font-normal text-graphite-400">Days</span>
            </span>
            <span className="text-[11px] font-mono text-graphite-400 block mt-1">
              Best Streak: {bestStreak} Days
            </span>
          </div>
        </div>

        {/* Accuracy */}
        <div className="p-5 rounded-2xl bg-graphite-900/90 border border-graphite-750 flex flex-col justify-between">
          <div className="flex items-center justify-between text-graphite-400">
            <span className="text-xs font-mono uppercase font-semibold">Success Rate</span>
            <Target className="w-4 h-4 text-mint-glow" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold font-mono text-gradient-mint">
              {accuracy}%
            </span>
            <span className="text-[11px] font-mono text-graphite-400 block mt-1">
              {totalSolved} Exercises Solved
            </span>
          </div>
        </div>

        {/* Brain Status */}
        <div className="p-5 rounded-2xl bg-graphite-900/90 border border-graphite-750 flex flex-col justify-between">
          <div className="flex items-center justify-between text-graphite-400">
            <span className="text-xs font-mono uppercase font-semibold">Brain Status</span>
            <Trophy className="w-4 h-4 text-pink-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-pink-400">Sharp & Agile</span>
            <span className="text-[11px] font-mono text-graphite-400 block mt-1">
              High Mental Clarity
            </span>
          </div>
        </div>
      </div>

      {/* Teacher / Evaluator Diagnostic Evaluation Card */}
      <div className="p-6 rounded-3xl bg-graphite-900 border border-violet-neon/40 shadow-glass flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5">
        <div className="w-12 h-12 rounded-2xl bg-violet-neon/20 border border-violet-neon/50 text-violet-glow flex items-center justify-center shrink-0">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-2">
            <h3 className="text-base font-bold text-graphite-100 font-sans">
              Teacher & Evaluator Diagnostic Summary
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-mint-deep/30 text-mint-glow text-[10px] font-mono font-bold">
              Cognivista AI Diagnosis
            </span>
          </div>
          <p className="text-xs md:text-sm text-graphite-300 leading-relaxed max-w-3xl">
            "Student demonstrates strong analytical accuracy in everyday mental math, practical logic, and word riddles (top 15% ranking). Rapid reaction time under 2.5 seconds reflects strong cognitive focus without distraction. Recommended learning progression: practice multi-step detective deduction scenarios."
          </p>
        </div>
      </div>

      {/* Subject & Faculty Mastery Section */}
      <SubjectMasteryReport />

      {/* Trophy Wall & Achievements */}
      <div className="p-6 rounded-3xl bg-graphite-900 border border-graphite-800 space-y-4 shadow-glass">
        <div className="flex items-center space-x-2 text-graphite-100">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold font-sans">Your Trophy Wall & Milestones</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-graphite-950 border border-graphite-800 flex flex-col items-center text-center space-y-2">
            <span className="text-2xl">⚡</span>
            <span className="text-xs font-bold text-graphite-200">First Victory</span>
            <span className="text-[10px] font-mono text-mint-glow">Completed</span>
          </div>

          <div className="p-4 rounded-2xl bg-graphite-950 border border-graphite-800 flex flex-col items-center text-center space-y-2">
            <span className="text-2xl">🧩</span>
            <span className="text-xs font-bold text-graphite-200">Pattern Master</span>
            <span className="text-[10px] font-mono text-mint-glow">Active</span>
          </div>

          <div className="p-4 rounded-2xl bg-graphite-950 border border-graphite-800 flex flex-col items-center text-center space-y-2">
            <span className="text-2xl">🧠</span>
            <span className="text-xs font-bold text-graphite-200">Memory Vault</span>
            <span className="text-[10px] font-mono text-violet-glow">In Progress</span>
          </div>

          <div className="p-4 rounded-2xl bg-graphite-950 border border-graphite-800 flex flex-col items-center text-center space-y-2">
            <span className="text-2xl">🔥</span>
            <span className="text-xs font-bold text-graphite-200">Streak Champion</span>
            <span className="text-[10px] font-mono text-amber-400">Day 5</span>
          </div>
        </div>
      </div>

      {/* Workout Activity Log */}
      <div className="p-6 rounded-3xl bg-graphite-900 border border-graphite-800 space-y-4 shadow-glass">
        <div className="flex items-center justify-between border-b border-graphite-800 pb-3">
          <div className="flex items-center space-x-2 text-graphite-100">
            <Clock className="w-5 h-5 text-violet-glow" />
            <h3 className="text-base font-bold font-sans">Recent Brain Training Sessions</h3>
          </div>
          <span className="text-xs font-mono text-graphite-400">
            {history.length} exercises logged
          </span>
        </div>

        {isLoadingHistory ? (
          <div className="py-8 text-center text-xs font-mono text-graphite-500">
            Loading workout history...
          </div>
        ) : history.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-graphite-500 italic">
            No training sessions completed yet. Play your first puzzle to start your log!
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((att, idx) => (
              <div
                key={idx}
                onClick={() => setActiveMode('review')}
                className="p-4 rounded-2xl bg-graphite-950 hover:bg-graphite-900 border border-graphite-800 hover:border-violet-neon/40 flex items-center justify-between gap-4 text-xs font-mono cursor-pointer transition-all"
                title="Click to view detailed attempt review"
              >
                <div className="flex items-center space-x-3 truncate">
                  {att.is_correct ? (
                    <CheckCircle2 className="w-5 h-5 text-mint-glow shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                  <div className="truncate">
                    <span className="text-sm font-semibold text-graphite-200 truncate block">
                      {att.challenge_title}
                    </span>
                    <span className="text-[11px] text-graphite-400 capitalize">
                      {att.domain} Focus · {Math.round(att.difficulty)} Elo
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 shrink-0 text-right">
                  <span className="text-graphite-400">
                    {(att.response_time_ms / 1000).toFixed(1)}s
                  </span>
                  <span
                    className={`font-bold text-sm ${
                      att.is_correct ? 'text-mint-glow' : 'text-rose-400'
                    }`}
                  >
                    {att.is_correct ? `+${Math.round(att.score_earned * 20 || 15)}` : '-10'} Score
                  </span>
                  <span className="text-xs text-mint-glow font-bold hidden sm:inline">
                    Review →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Friendly Human Disclaimer */}
      <div className="p-4 rounded-2xl bg-graphite-950 border border-graphite-800 flex items-center space-x-3 text-xs text-graphite-400">
        <HeartHandshake className="w-5 h-5 text-violet-glow shrink-0" />
        <p>
          Cognivista is your personal brain gym for everyday problem solving, focus, and memory. It is not a clinical medical diagnostic tool.
        </p>
      </div>
    </div>
  );
};
