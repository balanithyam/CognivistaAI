import React, { useState, useEffect } from 'react';
import { useAgent } from '../../context/AgentContext';
import { api } from '../../services/api';
import { AttemptHistoryItem } from '../../types';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  Lightbulb,
  Search,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Send,
  AlertTriangle,
  RotateCcw,
  Bot
} from 'lucide-react';

export const ChallengeReviewView: React.FC = () => {
  const { setActiveMode, askAgent } = useAgent();
  const [history, setHistory] = useState<AttemptHistoryItem[]>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<AttemptHistoryItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userQuery, setUserQuery] = useState<string>('');
  const [agentAnswer, setAgentAnswer] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState<boolean>(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const res = await api.getHistory();
      const list: AttemptHistoryItem[] = res.history || [];
      setHistory(list);
      if (list.length > 0) {
        setSelectedAttempt(list[0]);
      }
    } catch (e) {
      console.error('Failed to load attempt history:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAttempt = (att: AttemptHistoryItem) => {
    setSelectedAttempt(att);
    setAgentAnswer(null);
    setUserQuery('');
  };

  const handleAskWhyWrong = async (customQuery?: string) => {
    if (!selectedAttempt) return;
    const query = customQuery || userQuery.trim() || 'Why was my answer wrong?';
    try {
      setIsExplaining(true);
      setAgentAnswer(null);
      const res = await api.explainAttemptMistake(selectedAttempt.attempt_id, query);
      setAgentAnswer(res.agent_explanation || res.explanation || 'Review completed.');
    } catch (err: any) {
      setAgentAnswer(`Could not analyze mistake: ${err.message}`);
    } finally {
      setIsExplaining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto p-12 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-violet-neon border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono text-graphite-400">Loading completed attempts for review...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto p-12 text-center rounded-3xl glass-panel-elevated space-y-4">
        <Search className="w-12 h-12 text-graphite-500 mx-auto" />
        <h3 className="text-lg font-bold text-graphite-200">No Attempts Recorded Yet</h3>
        <p className="text-xs text-graphite-400 max-w-md mx-auto">
          Complete your first brain workout in the Challenge Arena to inspect your actual responses, correct solutions, and AI mistake diagnosis here.
        </p>
        <button
          type="button"
          onClick={() => setActiveMode('challenge')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-neon to-mint-neon text-graphite-950 font-bold text-xs"
        >
          Go to Challenge Arena
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel-elevated border border-graphite-750">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-graphite-100">Challenge Review</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-mint-neon/10 border border-mint-neon/30 text-mint-glow text-[11px] font-mono font-bold">
              {history.length} Attempts Analyzed
            </span>
          </div>
          <p className="text-xs text-graphite-400 mt-1">
            Examine your actual answers, analyze mistakes, and ask the AI agent why your answer was wrong.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveMode('challenge')}
          className="px-4 py-2 rounded-xl bg-graphite-850 hover:bg-graphite-800 border border-graphite-700 text-graphite-200 text-xs font-mono font-bold flex items-center space-x-2 shrink-0 transition-colors"
        >
          <span>Continue Solving</span>
          <ArrowRight className="w-3.5 h-3.5 text-mint-glow" />
        </button>
      </div>

      {/* Main Grid: Left Attempt Selector & Right Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Attempt History List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono uppercase text-graphite-400 font-semibold px-1">
            Recent Attempts ({history.length})
          </div>

          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {history.map((att) => {
              const isSelected = selectedAttempt?.attempt_id === att.attempt_id;
              return (
                <div
                  key={att.attempt_id}
                  onClick={() => handleSelectAttempt(att)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-graphite-900 border-violet-neon/50 shadow-glass'
                      : 'bg-graphite-950/60 hover:bg-graphite-900/80 border-graphite-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-graphite-800 text-graphite-300">
                      {att.domain || 'general'}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      {att.is_correct ? (
                        <span className="flex items-center space-x-1 text-mint-glow text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Correct</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 text-rose-400 text-[11px] font-bold">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs font-bold text-graphite-200 line-clamp-1">
                    {att.challenge_title || 'Cognitive Challenge'}
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-graphite-500 mt-2">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{Math.round(att.response_time_ms / 1000)}s</span>
                    </span>
                    <span>{att.attempted_at ? new Date(att.attempted_at).toLocaleDateString() : ''}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: In-Depth Attempt Breakdown */}
        {selectedAttempt && (
          <div className="lg:col-span-8 space-y-6">
            {/* Attempt Summary Card */}
            <div className="p-6 rounded-3xl glass-panel-elevated border border-graphite-750 space-y-5">
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-graphite-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-violet-neon/20 border border-violet-neon/30 text-violet-glow font-bold">
                      {selectedAttempt.domain}
                    </span>
                    <span className="text-xs font-mono text-graphite-400">
                      Rating: {Math.round(selectedAttempt.difficulty || 1200)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-graphite-100 mt-1">
                    {selectedAttempt.challenge_title}
                  </h3>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-graphite-400 uppercase">Response Time</div>
                    <div className="text-xs font-mono font-bold text-graphite-200">
                      {(selectedAttempt.response_time_ms / 1000).toFixed(1)}s
                    </div>
                  </div>
                  <div className="text-right pl-3 border-l border-graphite-800">
                    <div className="text-[10px] font-mono text-graphite-400 uppercase">Score Change</div>
                    <div
                      className={`text-xs font-mono font-bold ${
                        selectedAttempt.is_correct ? 'text-mint-glow' : 'text-rose-400'
                      }`}
                    >
                      {selectedAttempt.is_correct ? '+15' : '-10'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Challenge Question / Prompt */}
              {selectedAttempt.prompt && (
                <div className="p-4 rounded-2xl bg-graphite-900/90 border border-graphite-800 space-y-2">
                  <div className="text-[11px] font-mono text-graphite-400 uppercase">Original Challenge Question:</div>
                  <div className="text-xs font-sans text-graphite-200 whitespace-pre-wrap leading-relaxed">
                    {selectedAttempt.prompt}
                  </div>
                </div>
              )}

              {/* User Answer vs Correct Answer Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* User Response */}
                <div
                  className={`p-4 rounded-2xl border ${
                    selectedAttempt.is_correct
                      ? 'bg-mint-deep/10 border-mint-neon/30 text-mint-glow'
                      : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                  }`}
                >
                  <div className="text-[11px] font-mono uppercase font-bold mb-1 flex items-center space-x-1.5">
                    {selectedAttempt.is_correct ? (
                      <CheckCircle2 className="w-4 h-4 text-mint-neon" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                    <span>Your Submitted Answer</span>
                  </div>
                  <div className="text-sm font-mono font-bold break-words mt-2">
                    {typeof selectedAttempt.user_response === 'object'
                      ? JSON.stringify(selectedAttempt.user_response)
                      : String(selectedAttempt.user_response || 'No response recorded')}
                  </div>
                </div>

                {/* Correct Answer */}
                <div className="p-4 rounded-2xl bg-graphite-900 border border-graphite-750 text-graphite-200">
                  <div className="text-[11px] font-mono uppercase font-bold text-mint-glow mb-1 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-mint-glow" />
                    <span>Target Correct Answer</span>
                  </div>
                  <div className="text-sm font-mono font-bold break-words text-graphite-100 mt-2">
                    {typeof selectedAttempt.correct_answer === 'object'
                      ? JSON.stringify(selectedAttempt.correct_answer)
                      : String(selectedAttempt.correct_answer || 'Validated Target')}
                  </div>
                </div>
              </div>

              {/* Agent Mistake Analysis & Reasoning Diagnosis */}
              {selectedAttempt.mistake_analysis && (
                <div className="p-4 rounded-2xl bg-graphite-900/80 border border-graphite-800 space-y-3">
                  <div className="flex items-center space-x-2 text-violet-glow text-xs font-mono font-bold uppercase">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Reasoning Mechanism Diagnosis</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-graphite-500 font-mono text-[10px] block uppercase">Identified Pattern:</span>
                      <span className="text-graphite-200 font-medium capitalize">
                        {(selectedAttempt.mistake_analysis.mechanism || 'logical_deviation').replace(/_/g, ' ')}
                      </span>
                    </div>
                    {selectedAttempt.mistake_analysis.remediation && (
                      <div>
                        <span className="text-graphite-500 font-mono text-[10px] block uppercase">Recommended Strategy:</span>
                        <span className="text-graphite-300">
                          {selectedAttempt.mistake_analysis.remediation}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step-by-Step Pedagogical Explanation */}
              {selectedAttempt.explanation && (
                <div className="p-4 rounded-2xl bg-violet-neon/5 border border-violet-neon/20 space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-violet-glow uppercase">
                    <Lightbulb className="w-4 h-4" />
                    <span>Solution Explanation & Insights</span>
                  </div>
                  <p className="text-xs text-graphite-300 leading-relaxed font-sans">
                    {selectedAttempt.explanation}
                  </p>
                </div>
              )}

              {/* Ask Agent: Why Was My Answer Wrong? */}
              <div className="p-5 rounded-2xl bg-graphite-950 border border-graphite-800 space-y-3">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-mint-glow" />
                  <span className="text-xs font-mono font-bold text-graphite-200 uppercase">
                    Ask Agent About This Attempt
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleAskWhyWrong('Why was my answer wrong?')}
                    className="px-3 py-1 rounded-lg bg-graphite-900 hover:bg-graphite-850 border border-graphite-750 text-[11px] font-mono text-graphite-300 transition-colors"
                  >
                    "Why was my answer wrong?"
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAskWhyWrong('How do I solve this step by step?')}
                    className="px-3 py-1 rounded-lg bg-graphite-900 hover:bg-graphite-850 border border-graphite-750 text-[11px] font-mono text-graphite-300 transition-colors"
                  >
                    "How do I solve this step by step?"
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAskWhyWrong('Give me a tip to avoid this mistake in the future')}
                    className="px-3 py-1 rounded-lg bg-graphite-900 hover:bg-graphite-850 border border-graphite-750 text-[11px] font-mono text-graphite-300 transition-colors"
                  >
                    "How can I avoid this mistake?"
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAskWhyWrong()}
                    placeholder="Ask anything about this attempt..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-graphite-900 border border-graphite-800 text-xs text-graphite-200 placeholder:text-graphite-500 focus:outline-none focus:border-violet-neon"
                  />
                  <button
                    type="button"
                    onClick={() => handleAskWhyWrong()}
                    disabled={isExplaining}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-neon to-mint-neon text-graphite-950 font-bold text-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isExplaining ? 'Analyzing...' : 'Ask'}</span>
                  </button>
                </div>

                {/* AI Agent Response Box */}
                {agentAnswer && (
                  <div className="mt-3 p-4 rounded-xl bg-graphite-900/90 border border-mint-neon/30 space-y-1.5 animate-fadeIn">
                    <div className="flex items-center space-x-1.5 text-mint-glow text-[11px] font-mono font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>COGNIVISTA AGENT RESPONSE</span>
                    </div>
                    <p className="text-xs text-graphite-200 leading-relaxed font-sans">
                      {agentAnswer}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
