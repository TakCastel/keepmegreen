// Re-export des types d'abonnement
export * from './subscription';

// Types pour les consommations
export type AlcoholType = 'beer' | 'wine' | 'shot' | 'cocktail' | 'spirits';
export type CigaretteType = 'classic' | 'rolled' | 'cigar' | 'electronic';
export type JunkfoodType = 'burger' | 'pizza' | 'fries' | 'soda' | 'sweets';

export interface Consumption {
  type: string;
  quantity: number;
}

export interface AlcoholConsumption extends Consumption {
  type: AlcoholType;
}

export interface CigaretteConsumption extends Consumption {
  type: CigaretteType;
}

export interface JunkfoodConsumption extends Consumption {
  type: JunkfoodType;
}

export interface DayConsumption {
  date: string; // Format YYYY-MM-DD
  alcohol: AlcoholConsumption[];
  cigarettes: CigaretteConsumption[];
  junkfood: JunkfoodConsumption[];
  createdAt: string;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Types pour les statistiques
export interface CategoryStats {
  total: number;
  breakdown: Record<string, number>;
}

export interface DayStats {
  date: string;
  alcohol: CategoryStats;
  cigarettes: CategoryStats;
  junkfood: CategoryStats;
  totalConsumptions: number;
}

// Types pour le calendrier
export type DayColor = 'green' | 'yellow' | 'orange' | 'red';

export interface CalendarDay {
  date: string;
  color: DayColor;
  totalConsumptions: number;
  hasData: boolean;
}

// Configuration des consommations
export interface ConsumptionConfig {
  icon: string; // Nom de l'icône Lucide
  label: string;
  volume?: string; // Pour l'alcool
}

export const ALCOHOL_CONFIG: Record<AlcoholType, ConsumptionConfig> = {
  beer: { icon: 'Beer', label: 'Bière', volume: '25cl' },
  wine: { icon: 'Wine', label: 'Vin', volume: '12cl' },
  shot: { icon: 'Coffee', label: 'Shot', volume: '3cl' },
  cocktail: { icon: 'CupSoda', label: 'Cocktail', volume: '20cl' },
  spirits: { icon: 'Martini', label: 'Spiritueux', volume: '4cl' },
};

export const CIGARETTE_CONFIG: Record<CigaretteType, ConsumptionConfig> = {
  classic: { icon: 'Cigarette', label: 'Cigarette classique' },
  rolled: { icon: 'Scissors', label: 'Roulée' },
  cigar: { icon: 'Waves', label: 'Cigare' },
  electronic: { icon: 'Zap', label: 'E-cigarette' },
};

export const JUNKFOOD_CONFIG: Record<JunkfoodType, ConsumptionConfig> = {
  burger: { icon: 'Beef', label: 'Fast-food burger' },
  pizza: { icon: 'Pizza', label: 'Pizza industrielle' },
  fries: { icon: 'Utensils', label: 'Plats transformés' },
  soda: { icon: 'CupSoda', label: 'Boissons énergisantes' },
  sweets: { icon: 'Candy', label: 'Confiseries industrielles' },
};
