import React from 'react';
import { CheckCircle2, XCircle, Brain, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';
import { useAgent } from '../../context/AgentContext';

export const ReasoningReviewModal: React.FC = () => {
  const {
    lastAttemptResult,
    isReviewOpen,
    closeReviewModal,
    loadAdaptiveNext,
    askAgent
  } = useAgent();

  if (!isReviewOpen || !lastAttemptResult) return null;

  const isCorrect = lastAttemptResult.is_correct;
  const analysis = lastAttemptResult.mistake_analysis;
  const recommendation = lastAttemptResult.recommendation;

  const handleNextChallenge = () => {
    closeReviewModal();
    loadAdaptiveNext();
  };

  const handleTargetedFollowup = () => {
    closeReviewModal();
    askAgent(`Give me another puzzle in ${recommendation?.target_domain || 'this topic'}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-graphite-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl glass-panel-elevated p-6 md:p-8 space-y-6 shadow-2xl border border-graphite-700 animate-scaleUp">
        {/* Outcome Header */}
        <div className="flex items-center justify-between border-b border-graphite-800 pb-4">
          <div className="flex items-center space-x-3.5">
            {isCorrect ? (
              <div className="w-12 h-12 rounded-2xl bg-mint-deep/30 border border-mint-glow text-mint-glow flex items-center justify-center shadow-mint-glow">
                <CheckCircle2 className="w-7 h-7" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center">
                <XCircle className="w-7 h-7" />
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-graphite-100">
                {isCorrect ? 'Awesome! You Nailed It!' : 'Not Quite! Here is the Trick:'}
              </h3>
              <span className="text-xs font-mono text-graphite-400">
                {isCorrect ? `Score Earned: +${lastAttemptResult.score_delta}` : `Score Shift: ${lastAttemptResult.score_delta}`} · Current Elo: {Math.round(lastAttemptResult.new_elo)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={closeReviewModal}
            className="text-graphite-400 hover:text-graphite-200 text-xs font-mono px-2.5 py-1.5 rounded-xl bg-graphite-800 border border-graphite-700 cursor-pointer"
          >
            ✕ Close
          </button>
        </div>

        {/* Coach Breakdown */}
        <div className="space-y-3.5">
          <div className="p-4 rounded-2xl bg-graphite-950/90 border border-graphite-800 space-y-1.5">
            <span className="text-[11px] font-mono uppercase text-violet-glow font-bold flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Coach Takeaway</span>
            </span>
            <div className="text-sm font-semibold text-graphite-100">
              {analysis?.mechanism || (isCorrect ? 'Sharp Precision' : 'Common Mental Trap')}
            </div>
            <p className="text-xs text-graphite-300 leading-relaxed">
              {analysis?.specific_deviation}
            </p>
          </div>

          {/* Explanation */}
          <div className="p-4 rounded-2xl bg-graphite-900 border border-graphite-750 space-y-1.5">
            <span className="text-[11px] font-mono uppercase text-mint-glow font-bold">
              Why This Solution Works
            </span>
            <p className="text-xs text-graphite-200 leading-relaxed font-sans">
              {lastAttemptResult.explanation}
            </p>
          </div>

          {/* Remediation Tip */}
          {analysis?.remediation && (
            <div className="flex items-start space-x-2 text-xs text-amber-300 bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/30">
              <Brain className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-mono uppercase text-amber-400 mr-1.5">Pro Tip:</strong>
                <span>{analysis.remediation}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleTargetedFollowup}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-graphite-800 hover:bg-graphite-750 text-graphite-200 border border-graphite-700 text-xs font-mono font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-violet-glow" />
            <span>Try Another Like This</span>
          </button>

          <button
            type="button"
            onClick={handleNextChallenge}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-violet-neon to-mint-neon text-graphite-950 font-bold text-xs md:text-sm shadow-mint-glow hover:opacity-95 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
          >
            <span>Next Workout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
