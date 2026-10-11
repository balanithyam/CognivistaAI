import {
  User,
  CognitiveProfile,
  Challenge,
  AttemptResult,
  SkillConstellationData,
  ConversationMessage,
  QuizLibraryItem
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('cognivista_token');
  }

  private setToken(token: string) {
    localStorage.setItem('cognivista_token', token);
  }

  public clearToken() {
    localStorage.removeItem('cognivista_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      this.clearToken();
      window.dispatchEvent(new Event('cognivista_unauthorized'));
    }

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.detail || data.message || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return data;
  }

  // --- Auth Endpoints ---
  async register(payload: { email: string; username: string; password: string; full_name?: string }) {
    return this.request<{ success: boolean; message: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async login(payload: { username_or_email: string; password: string }) {
    const data = await this.request<{
      access_token: string;
      token_type: string;
      user: User & { composite_elo: number; current_streak: number; total_solved: number };
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (data.access_token) {
      this.setToken(data.access_token);
    }
    return data;
  }

  async getMe() {
    return this.request<{
      id: string;
      username: string;
      email: string;
      full_name?: string;
      settings: Record<string, any>;
      profile: CognitiveProfile;
    }>('/api/auth/me');
  }

  // --- Agent Interaction ---
  async agentInteract(prompt: string, activeChallengeId?: string) {
    return this.request<{
      success: boolean;
      response: string;
      action_type: string;
      challenge?: Challenge;
      profile: Partial<CognitiveProfile>;
    }>('/api/agent/interact', {
      method: 'POST',
      body: JSON.stringify({ prompt, active_challenge_id: activeChallengeId }),
    });
  }

  async getSessionHistory() {
    return this.request<{ messages: ConversationMessage[] }>('/api/agent/session');
  }

  // --- Challenges ---
  async submitAttempt(payload: {
    challenge_id: string;
    user_response: any;
    response_time_ms: number;
    hints_used?: number;
  }) {
    return this.request<AttemptResult & { success: boolean }>('/api/challenges/submit', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getAdaptiveNext() {
    return this.request<{
      success: boolean;
      recommendation: any;
      challenge: Challenge;
    }>('/api/challenges/adaptive/next');
  }

  async studioGenerate(payload: {
    domain: string;
    difficulty_rating?: number;
    is_fusion?: boolean;
    secondary_domain?: string;
    is_live?: boolean;
  }) {
    return this.request<{
      success: boolean;
      challenge: Challenge;
    }>('/api/challenges/studio/generate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getLiveChallenge() {
    return this.request<{
      success: boolean;
      challenge: Challenge;
    }>('/api/challenges/live');
  }

  async getQuizLibrary() {
    return this.request<{
      success: boolean;
      count: number;
      quizzes: QuizLibraryItem[];
    }>('/api/challenges/library');
  }

  async getHint(challengeId: string) {
    return this.request<{
      challenge_id: string;
      hint: string;
    }>(`/api/challenges/${challengeId}/hint`);
  }

  // --- Profile & Constellation ---
  async getProfile() {
    return this.request<CognitiveProfile>('/api/profile');
  }

  async getConstellation() {
    return this.request<SkillConstellationData>('/api/profile/constellation');
  }

  async getHistory() {
    return this.request<{ history: any[] }>('/api/profile/history');
  }

  async getAttemptDetail(attemptId: string) {
    return this.request<any>(`/api/challenges/attempt/${attemptId}`);
  }

  async explainAttemptMistake(attemptId: string, userQuery?: string) {
    return this.request<{
      attempt_id: string;
      is_correct: boolean;
      user_response: any;
      correct_answer: any;
      mistake_mechanism?: string;
      agent_explanation?: string;
      explanation?: string;
    }>(`/api/challenges/attempt/${attemptId}/explain`, {
      method: 'POST',
      body: JSON.stringify({ user_query: userQuery || 'Why was my answer wrong?' }),
    });
  }
}


export const api = new ApiService();
