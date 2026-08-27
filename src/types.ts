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

export type GameMode = 'story_case' | 'worksheet' | 'extended_case' | 'speed_scanner' | 'handbook';

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

export interface GameScore {
  total: number;
  correct: number;
  wrong: number;
  accuracy: number;
  rank: string;
}

