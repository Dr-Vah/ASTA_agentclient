export enum Role {
  WEREWOLF = 'WEREWOLF',
  VILLAGER = 'VILLAGER',
  SEER = 'SEER',
  WITCH = 'WITCH',
  HUNTER = 'HUNTER',
  UNKNOWN = 'UNKNOWN'
}

export enum Phase {
  NIGHT_WOLF = 'NIGHT_WOLF',
  NIGHT_WITCH = 'NIGHT_WITCH',
  NIGHT_SEER = 'NIGHT_SEER',
  NIGHT_HUNTER = 'NIGHT_HUNTER',
  DAY_ANNOUNCE = 'DAY_ANNOUNCE',
  DAY_DISCUSS = 'DAY_DISCUSS',
  DAY_VOTE = 'DAY_VOTE',
  GAME_OVER = 'GAME_OVER'
}

export interface Player {
  id: number;
  name: string; // e.g., "Agent-001" or "Human"
  isAlive: boolean;
  role: Role;
  isHuman?: boolean;
  avatarUrl?: string;
  suspicionScore?: number; // 0-100
}

export interface LogEntry {
  id: string;
  day: number;
  phase: Phase;
  speakerId?: number;
  content: string;
  type: 'system' | 'speech' | 'action' | 'alert';
  timestamp: number;
}

export interface GameState {
  day: number;
  phase: Phase;
  players: Player[];
  logs: LogEntry[];
  timeLeft: number; // Seconds remaining for current action
  winner: 'WEREWOLVES' | 'VILLAGERS' | null;
  selfId: number | null; // If playing as human
  sheriffId: number | null;
}

export interface AgentDecision {
  natural_speech: string;
  vote_target?: number;
  skill_target?: number;
  reasoning_steps: string[];
  suspicion_scores: Record<string, number>;
}