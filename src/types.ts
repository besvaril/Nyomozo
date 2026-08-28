export type KingdomId = 'animals' | 'plants' | 'fungi';

export type VennRegionId =
  | 'only_animals'
  | 'only_plants'
  | 'only_fungi'
  | 'animals_plants'
  | 'animals_fungi'
  | 'plants_fungi'
  | 'all_three';

export interface BiologicalClue {
  id: number;
  text: string;
  correctRegion: VennRegionId;
  involvedKingdoms: KingdomId[];
  difficulty: 'alap' | 'halado' | 'mester';
  explanation: string;
  microscopeDetail?: string;
  category: 'Anyagcsere' | 'Sejttan' | 'Szövettan & Szerveződés' | 'Életmód & Funkciók' | 'Különleges Tulajdonság';
}

export interface RegionInfo {
  id: VennRegionId;
  label: string;
  shortName: string;
  kingdoms: KingdomId[];
  color: string;
  bgLight: string;
  borderClass: string;
  description: string;
}

export type GameMode = 'home' | 'speed_scanner' | 'handbook' | 'story_case' | 'worksheet' | 'extended_case';

export interface UserPlacement {
  clueId: number;
  placedRegion: VennRegionId | null;
}

export interface DetectiveRank {
  minScore: number;
  maxScore: number;
  title: string;
  icon: string;
  description: string;
  badgeClass: string;
}

export type UserRole = 'detective' | 'teacher';

export interface UserProfile {
  id?: string;
  username: string;
  display_name?: string;
  role: UserRole;
  class_code?: string;
  total_score?: number;
  tasks_completed?: number;
  rank_achieved?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TaskScoreRecord {
  id?: string;
  user_id?: string;
  username: string;
  clue_id: number;
  clue_text: string;
  chosen_region: VennRegionId;
  correct_region: VennRegionId;
  is_correct: boolean;
  points_awarded: number;
  time_spent_seconds?: number;
  streak_count?: number;
  session_id?: string;
  created_at?: string;
}

export interface GameSessionRecord {
  id?: string;
  user_id?: string;
  username: string;
  role: UserRole;
  class_code?: string;
  total_score: number;
  correct_count: number;
  wrong_count: number;
  accuracy_percentage: number;
  max_streak: number;
  rank_achieved: string;
  completion_time_seconds?: number;
  created_at?: string;
}

export interface LeaderboardEntry {
  username: string;
  role: UserRole;
  class_code?: string;
  total_accumulated_score: number;
  tasks_count: number;
  correct_count: number;
  accuracy_percent: number;
  last_active?: string;
}

export interface GameScore {
  total: number;
  correct: number;
  wrong: number;
  accuracy: number;
  rank: string;
}

