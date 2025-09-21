// Re-export des types d'abonnement
export * from './subscription';

// Types pour les activités positives
export type SportType = 'running' | 'gym' | 'yoga' | 'swimming' | 'cycling' | 'walking' | 'dancing' | 'hiking' | 'tennis' | 'football';
export type SocialType = 'friends' | 'family' | 'volunteering' | 'cultural' | 'meeting' | 'party' | 'date' | 'community';
export type NutritionType = 'balanced_meal' | 'fruits_vegetables' | 'hydration' | 'home_cooking' | 'healthy_snack' | 'breakfast' | 'lunch' | 'dinner';

export interface Activity {
  type: string;
  quantity: number;
}

export interface SportActivity extends Activity {
  type: SportType;
}

export interface SocialActivity extends Activity {
  type: SocialType;
}

export interface NutritionActivity extends Activity {
  type: NutritionType;
}

export interface DayActivities {
  date: string; // Format YYYY-MM-DD
  sport: SportActivity[];
  social: SocialActivity[];
  nutrition: NutritionActivity[];
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
  sport: CategoryStats;
  social: CategoryStats;
  nutrition: CategoryStats;
  totalActivities: number;
}

// Types pour le calendrier
export type DayColor = 'neutral' | 'light-blue' | 'blue' | 'dark-blue' | 'blue-purple';

export interface CalendarDay {
  date: string;
  color: DayColor;
  totalActivities: number;
  hasData: boolean;
}

// Configuration des activités
export interface ActivityConfig {
  icon: string; // Nom de l'icône Lucide
  label: string;
  description?: string; // Description de l'activité
}

export const SPORT_CONFIG: Record<SportType, ActivityConfig> = {
  running: { icon: 'Zap', label: 'Course à pied', description: '30 min de course' },
  gym: { icon: 'Dumbbell', label: 'Musculation', description: 'Séance de musculation' },
  yoga: { icon: 'Flower', label: 'Yoga', description: 'Séance de yoga' },
  swimming: { icon: 'Waves', label: 'Natation', description: 'Nage en piscine' },
  cycling: { icon: 'Bike', label: 'Vélo', description: 'Balade à vélo' },
  walking: { icon: 'Footprints', label: 'Marche', description: 'Marche rapide' },
  dancing: { icon: 'Music', label: 'Danse', description: 'Séance de danse' },
  hiking: { icon: 'Mountain', label: 'Randonnée', description: 'Randonnée nature' },
  tennis: { icon: 'Circle', label: 'Tennis', description: 'Match de tennis' },
  football: { icon: 'CircleDot', label: 'Football', description: 'Match de football' },
};

export const SOCIAL_CONFIG: Record<SocialType, ActivityConfig> = {
  friends: { icon: 'Users', label: 'Sortie entre amis', description: 'Temps avec les amis' },
  family: { icon: 'Heart', label: 'Temps en famille', description: 'Moment familial' },
  volunteering: { icon: 'HandHeart', label: 'Bénévolat', description: 'Action bénévole' },
  cultural: { icon: 'Palette', label: 'Événement culturel', description: 'Musée, théâtre, concert' },
  meeting: { icon: 'Calendar', label: 'Réunion sociale', description: 'Rencontre organisée' },
  party: { icon: 'PartyPopper', label: 'Fête', description: 'Événement festif' },
  date: { icon: 'Heart', label: 'Rendez-vous', description: 'Sortie romantique' },
  community: { icon: 'Users2', label: 'Communauté', description: 'Activité communautaire' },
};

export const NUTRITION_CONFIG: Record<NutritionType, ActivityConfig> = {
  balanced_meal: { icon: 'Utensils', label: 'Repas équilibré', description: 'Repas complet et sain' },
  fruits_vegetables: { icon: 'Apple', label: 'Fruits & légumes', description: 'Portion de fruits/légumes' },
  hydration: { icon: 'Droplets', label: 'Hydratation', description: 'Eau, tisane, boisson saine' },
  home_cooking: { icon: 'ChefHat', label: 'Cuisine maison', description: 'Préparation maison' },
  healthy_snack: { icon: 'Cookie', label: 'Collation saine', description: 'En-cas équilibré' },
  breakfast: { icon: 'Sunrise', label: 'Petit-déjeuner', description: 'Premier repas de la journée' },
  lunch: { icon: 'Sun', label: 'Déjeuner', description: 'Repas de midi' },
  dinner: { icon: 'Moon', label: 'Dîner', description: 'Repas du soir' },
};

// Types pour les consommations
export type AlcoholType = 'beer' | 'wine' | 'whiskey' | 'vodka' | 'rum' | 'gin' | 'tequila' | 'champagne' | 'cocktail' | 'spirits';
export type CigaretteType = 'cigarette' | 'cigar' | 'pipe' | 'vape' | 'shisha' | 'rolled' | 'classic';
export type JunkfoodType = 'burger' | 'pizza' | 'fries' | 'soda' | 'candy' | 'chips' | 'ice_cream' | 'donut' | 'cake';

// Interface pour la configuration des consommations
export interface ConsumptionConfig {
  icon: string; // Nom de l'icône Lucide
  label: string;
  volume?: string; // Volume ou quantité (ex: "33cl", "1 cigarette")
}

// Configuration des consommations d'alcool
export const ALCOHOL_CONFIG: Record<AlcoholType, ConsumptionConfig> = {
  beer: { icon: 'Beer', label: 'Bière', volume: '33cl' },
  wine: { icon: 'Wine', label: 'Vin', volume: '12.5cl' },
  whiskey: { icon: 'Glass', label: 'Whiskey', volume: '4cl' },
  vodka: { icon: 'Glass', label: 'Vodka', volume: '4cl' },
  rum: { icon: 'Glass', label: 'Rhum', volume: '4cl' },
  gin: { icon: 'Glass', label: 'Gin', volume: '4cl' },
  tequila: { icon: 'Glass', label: 'Tequila', volume: '4cl' },
  champagne: { icon: 'Glass', label: 'Champagne', volume: '12.5cl' },
  cocktail: { icon: 'Glass', label: 'Cocktail', volume: '15cl' },
  spirits: { icon: 'Glass', label: 'Spiritueux', volume: '4cl' },
};

// Configuration des cigarettes
export const CIGARETTE_CONFIG: Record<CigaretteType, ConsumptionConfig> = {
  cigarette: { icon: 'Cigarette', label: 'Cigarette', volume: '1 cigarette' },
  cigar: { icon: 'Cigar', label: 'Cigare', volume: '1 cigare' },
  pipe: { icon: 'Pipe', label: 'Pipe', volume: '1 pipe' },
  vape: { icon: 'Vape', label: 'Cigarette électronique', volume: '1 bouffée' },
  shisha: { icon: 'Shisha', label: 'Chicha', volume: '1 bouffée' },
  rolled: { icon: 'Cigarette', label: 'Cigarette roulée', volume: '1 cigarette' },
  classic: { icon: 'Cigarette', label: 'Cigarette classique', volume: '1 cigarette' },
};

// Configuration de la malbouffe
export const JUNKFOOD_CONFIG: Record<JunkfoodType, ConsumptionConfig> = {
  burger: { icon: 'Hamburger', label: 'Burger', volume: '1 burger' },
  pizza: { icon: 'Pizza', label: 'Pizza', volume: '1 part' },
  fries: { icon: 'Fries', label: 'Frites', volume: '1 portion' },
  soda: { icon: 'Soda', label: 'Soda', volume: '33cl' },
  candy: { icon: 'Candy', label: 'Bonbons', volume: '1 paquet' },
  chips: { icon: 'Chips', label: 'Chips', volume: '1 paquet' },
  ice_cream: { icon: 'IceCream', label: 'Glace', volume: '1 boule' },
  donut: { icon: 'Donut', label: 'Donut', volume: '1 donut' },
  cake: { icon: 'Cake', label: 'Gâteau', volume: '1 part' },
};

// Interface pour une consommation individuelle
export interface Consumption {
  type: AlcoholType | CigaretteType | JunkfoodType;
  quantity: number;
  timestamp: string;
}

// Interface pour les consommations d'une journée
export interface DayConsumption {
  date: string; // Format YYYY-MM-DD
  alcohol: Consumption[];
  cigarettes: Consumption[];
  junkfood: Consumption[];
}