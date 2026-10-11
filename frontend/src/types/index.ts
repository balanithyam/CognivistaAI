export type ExperienceMode = 'progress' | 'create' | 'challenge' | 'review' | 'session' | 'live';

export interface AttemptHistoryItem {
  attempt_id: string;
  challenge_id: string;
  challenge_title: string;
  challenge_type: string;
  domain: string;
  difficulty: number;
  prompt?: string;
  payload?: Record<string, any>;
  user_response?: any;
  correct_answer?: any;
  is_correct: boolean;
  response_time_ms: number;
  hints_used: number;
  score_earned: number;
  pre_attempt_elo?: number;
  post_attempt_elo: number;
  feedback: string;
  mistake_analysis?: {
    mechanism?: string;
    specific_deviation?: string;
    remediation?: string;
  };
  explanation?: string;
  attempted_at: string;
}

export interface QuizLibraryItem {
  id: string;
  title: string;
  subject: string;
  badge: string;
  description: string;
  questions_count: number;
  difficulty: string;
  difficulty_level: 'easy' | 'medium' | 'hard' | 'all';
  plays_count: string;
  tags: string[];
  prompt_trigger: string;
  grade_level?: string;
  rating?: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  settings?: Record<string, any>;
}

export interface DomainStats {
  solved: number;
  attempts: number;
  avg_time_ms: number;
  hints_used: number;
}

export interface CognitiveProfile {
  user_id: string;
  username: string;
  composite_elo: number;
  total_solved: number;
  total_attempts: number;
  accuracy_percent: number;
  current_streak: number;
  best_streak: number;
  domain_ratings: Record<string, number>;
  skill_strengths: string[];
  skill_weaknesses: string[];
  accuracy_history: Array<{
    challenge_id: string;
    domain: string;
    is_correct: boolean;
    response_time_ms: number;
    elo_after: number;
    difficulty: number;
  }>;
  last_trained_at?: string;
}

export interface Challenge {
  id: string;
  challenge_type: string; // 'spatial_rotation' | 'memory_span' | 'logic_deduction' | 'numerical_sequence' | 'verbal_analogy' | 'matrix_pattern' | 'challenge_fusion' | 'live_intelligence';
  primary_domain: string;
  secondary_domains: string[];
  title: string;
  prompt: string;
  description?: string;
  payload: Record<string, any>;
  correct_answer: any;
  acceptable_answers?: string[];
  hint: string;
  explanation: string;
  difficulty_rating: number;
  estimated_time_seconds?: number;
  tags?: string[];
  source_info?: {
    is_live: boolean;
    source_name?: string;
    source_url?: string;
    timestamp?: string;
  };
  created_at?: string;
}

export interface AttemptResult {
  attempt_id: string;
  is_correct: boolean;
  score_delta: number;
  new_elo: number;
  domain_elo: number;
  feedback: string;
  explanation: string;
  correct_answer: any;
  mistake_analysis: {
    mechanism: string;
    specific_deviation: string;
    remediation: string;
  };
  recommendation: {
    strategy: string;
    target_domain: string;
    secondary_domain?: string | null;
    target_difficulty: number;
    is_fusion?: boolean;
    reason: string;
  };
  profile_summary: {
    composite_elo: number;
    total_solved: number;
    current_streak: number;
    domain_ratings: Record<string, number>;
  };
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  intent?: string;
  created_at: string;
}

export interface ConstellationNode {
  id: string;
  name: string;
  elo: number;
  x: number;
  y: number;
  color: string;
}

export interface ConstellationEdge {
  source: string;
  target: string;
  synergy: number;
}

export interface SkillConstellationData {
  nodes: ConstellationNode[];
  edges: ConstellationEdge[];
  composite_elo: number;
  recent_active_domains: string[];
}
