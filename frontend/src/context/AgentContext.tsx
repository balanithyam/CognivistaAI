import React, { createContext, useContext, useState, useEffect } from 'react';
import { Challenge, AttemptResult, ExperienceMode, ConversationMessage } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

interface AgentContextType {
  activeChallenge: Challenge | null;
  activeMode: ExperienceMode;
  agentStatus: 'idle' | 'reasoning' | 'synthesizing' | 'evaluating';
  agentMessage: string;
  conversationHistory: ConversationMessage[];
  lastAttemptResult: AttemptResult | null;
  isReviewOpen: boolean;
  activeHint: string | null;
  hintsUsedCount: number;
  setActiveMode: (mode: ExperienceMode) => void;
  askAgent: (prompt: string, targetMode?: ExperienceMode) => Promise<void>;
  loadAdaptiveNext: (targetMode?: ExperienceMode) => Promise<void>;
  loadLiveChallenge: (targetMode?: ExperienceMode) => Promise<void>;
  generateStudioChallenge: (params: {
    domain: string;
    difficulty_rating?: number;
    is_fusion?: boolean;
    secondary_domain?: string;
    is_live?: boolean;
  }, targetMode?: ExperienceMode) => Promise<void>;
  submitChallengeResponse: (userResponse: any, responseTimeMs: number) => Promise<AttemptResult | null>;
  requestHint: () => Promise<void>;
  closeReviewModal: () => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, updateProfileState, refreshProfile } = useAuth();
  
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [activeMode, setActiveMode] = useState<ExperienceMode>('challenge');
  const [agentStatus, setAgentStatus] = useState<'idle' | 'reasoning' | 'synthesizing' | 'evaluating'>('idle');
  const [agentMessage, setAgentMessage] = useState<string>(
    'Cognivista is ready. Tell me what cognitive skill you want to target, or continue your adaptive training.'
  );
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [lastAttemptResult, setLastAttemptResult] = useState<AttemptResult | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [hintsUsedCount, setHintsUsedCount] = useState<number>(0);

  // Load initial challenge when user authenticates
  useEffect(() => {
    if (isAuthenticated) {
      loadAdaptiveNext();
      loadHistory();
    } else {
      setActiveChallenge(null);
      setConversationHistory([]);
      setLastAttemptResult(null);
    }
  }, [isAuthenticated]);

  const loadHistory = async () => {
    try {
      const res = await api.getSessionHistory();
      setConversationHistory(res.messages || []);
    } catch (e) {
      console.warn('Could not load session history:', e);
    }
  };

  const askAgent = async (prompt: string, targetMode?: ExperienceMode) => {
    if (!prompt.trim()) return;

    try {
      setAgentStatus('reasoning');
      setAgentMessage('Analyzing natural language request and context...');

      // Optimistically add user message
      const tempUserMsg: ConversationMessage = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content: prompt,
        created_at: new Date().toISOString(),
      };
      setConversationHistory((prev) => [...prev, tempUserMsg]);

      const res = await api.agentInteract(prompt, activeChallenge?.id);

      setAgentMessage(res.response);

      // Add agent reply to history
      const tempAgentMsg: ConversationMessage = {
        id: `agent-${Date.now()}`,
        role: 'agent',
        content: res.response,
        intent: res.action_type,
        created_at: new Date().toISOString(),
      };
      setConversationHistory((prev) => [...prev, tempAgentMsg]);

      if (res.challenge) {
        setActiveChallenge(res.challenge);
        if (targetMode) {
          setActiveMode(targetMode);
        }
        setActiveHint(null);
        setHintsUsedCount(0);
      }

      if (res.profile) {
        updateProfileState(res.profile);
      }
    } catch (err: any) {
      setAgentMessage(`Agent processing error: ${err.message}`);
    } finally {
      setAgentStatus('idle');
    }
  };

  const loadAdaptiveNext = async (targetMode?: ExperienceMode) => {
    try {
      setAgentStatus('synthesizing');
      setAgentMessage('Consulting cognitive model and synthesizing next adaptive challenge...');
      
      const res = await api.getAdaptiveNext();
      setActiveChallenge(res.challenge);
      setActiveHint(null);
      setHintsUsedCount(0);
      if (targetMode) {
        setActiveMode(targetMode);
      }
      
      const strat = res.recommendation?.strategy || 'Adaptive Step';
      const reason = res.recommendation?.reason || 'Calibrated to your real performance.';
      setAgentMessage(`[${strat.toUpperCase()}] ${reason}`);
    } catch (err: any) {
      setAgentMessage(`Could not synthesize adaptive challenge: ${err.message}`);
    } finally {
      setAgentStatus('idle');
    }
  };

  const loadLiveChallenge = async (targetMode?: ExperienceMode) => {
    try {
      setAgentStatus('synthesizing');
      setAgentMessage('Fetching real-world weather and travel reports...');
      const res = await api.getLiveChallenge();
      setActiveChallenge(res.challenge);
      setActiveHint(null);
      setHintsUsedCount(0);
      if (targetMode) {
        setActiveMode(targetMode);
      }
      setAgentMessage('Real-world problem loaded into your challenge arena.');
    } catch (err: any) {
      setAgentMessage(`Stream error: ${err.message}`);
    } finally {
      setAgentStatus('idle');
    }
  };

  const generateStudioChallenge = async (params: {
    domain: string;
    difficulty_rating?: number;
    is_fusion?: boolean;
    secondary_domain?: string;
    is_live?: boolean;
  }, targetMode?: ExperienceMode) => {
    try {
      setAgentStatus('synthesizing');
      setAgentMessage('Synthesizing custom challenge in Laboratory Studio...');
      const res = await api.studioGenerate(params);
      setActiveChallenge(res.challenge);
      setActiveHint(null);
      setHintsUsedCount(0);
      if (targetMode) {
        setActiveMode(targetMode);
      }
      setAgentMessage(`Synthesized fresh challenge in ${res.challenge.primary_domain.toUpperCase()} (${Math.round(res.challenge.difficulty_rating)} Elo).`);
    } catch (err: any) {
      setAgentMessage(`Studio synthesis failed: ${err.message}`);
    } finally {
      setAgentStatus('idle');
    }
  };

  const submitChallengeResponse = async (userResponse: any, responseTimeMs: number): Promise<AttemptResult | null> => {
    if (!activeChallenge) return null;

    try {
      setAgentStatus('evaluating');
      setAgentMessage('Evaluating cognitive response and diagnosing error mechanisms...');

      const result = await api.submitAttempt({
        challenge_id: activeChallenge.id,
        user_response: userResponse,
        response_time_ms: responseTimeMs,
        hints_used: hintsUsedCount,
      });

      setLastAttemptResult(result);
      setIsReviewOpen(true);

      // Update profile in context
      if (result.profile_summary) {
        updateProfileState(result.profile_summary);
      }

      if (result.is_correct) {
        setAgentMessage(`Correct! +${result.score_delta} Elo. ${result.feedback}`);
        // Trigger subtle celebration confetti
        try {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#8b5cf6', '#00f5a0', '#38bdf8']
          });
        } catch {}
      } else {
        setAgentMessage(`Mistake identified: ${result.mistake_analysis.mechanism}. Click Reasoning Review for diagnostic breakdown.`);
      }

      await refreshProfile();
      return result;
    } catch (err: any) {
      setAgentMessage(`Submission error: ${err.message}`);
      return null;
    } finally {
      setAgentStatus('idle');
    }
  };

  const requestHint = async () => {
    if (!activeChallenge) return;
    try {
      const res = await api.getHint(activeChallenge.id);
      setActiveHint(res.hint);
      setHintsUsedCount((prev) => prev + 1);
      setAgentMessage(`Hint unlocked: ${res.hint}`);
    } catch (err: any) {
      setAgentMessage(`Failed to retrieve hint: ${err.message}`);
    }
  };

  const closeReviewModal = () => {
    setIsReviewOpen(false);
  };

  return (
    <AgentContext.Provider
      value={{
        activeChallenge,
        activeMode,
        agentStatus,
        agentMessage,
        conversationHistory,
        lastAttemptResult,
        isReviewOpen,
        activeHint,
        hintsUsedCount,
        setActiveMode,
        askAgent,
        loadAdaptiveNext,
        loadLiveChallenge,
        generateStudioChallenge,
        submitChallengeResponse,
        requestHint,
        closeReviewModal,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
};

export const useAgent = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
};
