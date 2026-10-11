import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AgentProvider, useAgent } from './context/AgentContext';
import { Navbar } from './components/Layout/Navbar';
import { AgentNaturalInput } from './components/Input/AgentNaturalInput';
import { ArenaContainer } from './components/Arena/ArenaContainer';
import { CognitiveProfileView } from './components/Profile/CognitiveProfileView';
import { CreateChallengeView } from './components/Create/CreateChallengeView';
import { ChallengeReviewView } from './components/Review/ChallengeReviewView';
import { TrainingSessionView } from './components/Session/TrainingSessionView';
import { LiveChallengesView } from './components/Live/LiveChallengesView';
import { ReasoningReviewModal } from './components/Review/ReasoningReviewModal';
import { SignInView } from './components/Auth/SignInView';
import { RegisterView } from './components/Auth/RegisterView';
import { Sparkles, Brain, Loader2 } from 'lucide-react';

const MainApplication: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { activeChallenge, activeMode, agentStatus } = useAgent();

  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [registerSuccessMsg, setRegisterSuccessMsg] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-graphite-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-neon to-mint-neon p-0.5 shadow-violet-glow animate-pulse">
          <div className="w-full h-full bg-graphite-950 rounded-[14px] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-mint-glow" />
          </div>
        </div>
        <div className="text-xs font-mono text-graphite-400 tracking-wider">
          INITIALIZING COGNIVISTA NEURAL CORE...
        </div>
      </div>
    );
  }

  // Unauthenticated: Render Sign In or Register screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen neural-grid flex items-center justify-center p-4">
        {authMode === 'signin' ? (
          <SignInView
            onSwitchToRegister={() => {
              setRegisterSuccessMsg(null);
              setAuthMode('register');
            }}
            successMessage={registerSuccessMsg}
          />
        ) : (
          <RegisterView
            onSwitchToSignIn={() => setAuthMode('signin')}
            onRegisterSuccess={(msg) => setRegisterSuccessMsg(msg)}
          />
        )}
      </div>
    );
  }

  // Authenticated Agent Workspace
  return (
    <div className="min-h-screen flex flex-col bg-graphite-950 neural-grid">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-8">
        {/* Dynamic Distinct Page Canvas - 6 Functionally Distinct Pages */}
        <div className="transition-all duration-300">
          {/* PAGE 1 — MY PROGRESS: Performance, historical accuracy, response times, mistake diagnosis */}
          {activeMode === 'progress' && <CognitiveProfileView />}

          {/* PAGE 2 — CREATE CHALLENGE: Natural-language request -> Agent creates fresh challenge */}
          {activeMode === 'create' && <CreateChallengeView />}

          {/* PAGE 3 — CHALLENGE: Interactive challenge solving environment */}
          {activeMode === 'challenge' && (
            <div className="space-y-6">
              <AgentNaturalInput />
              {activeChallenge ? (
                <ArenaContainer challenge={activeChallenge} />
              ) : (
                <div className="p-12 text-center rounded-3xl glass-panel-elevated max-w-md mx-auto space-y-4">
                  <Brain className="w-10 h-10 text-violet-glow mx-auto animate-pulse" />
                  <h3 className="text-base font-bold text-graphite-200">Challenge Arena Ready</h3>
                  <p className="text-xs text-graphite-400 font-mono">
                    Select any workout above or type what you'd like to practice today.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* PAGE 4 — CHALLENGE REVIEW: Completed attempt analysis & "Why was my answer wrong?" */}
          {activeMode === 'review' && <ChallengeReviewView />}

          {/* PAGE 5 — TRAINING SESSION: Autonomous adaptive session loop */}
          {activeMode === 'session' && <TrainingSessionView />}

          {/* PAGE 6 — LIVE CHALLENGES: Real-world current information challenges */}
          {activeMode === 'live' && <LiveChallengesView />}
        </div>
      </main>

      {/* Reasoning Review Diagnostics Modal */}
      <ReasoningReviewModal />

      {/* Global Safety & Neuroplasticity Disclaimer */}
      <footer className="w-full border-t border-graphite-900 py-4 px-6 text-center text-[11px] font-mono text-graphite-500 bg-graphite-950/90">
        <span>COGNIVISTA Autonomous Brain Training Agent · Personal Cognitive Conditioning · Not a clinical or diagnostic medical tool.</span>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AgentProvider>
        <MainApplication />
      </AgentProvider>
    </AuthProvider>
  );
}

export default App;
