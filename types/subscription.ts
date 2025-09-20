// Types pour le système d'abonnement
export type SubscriptionPlan = 'free' | 'premium' | 'premium-plus';

export interface SubscriptionLimits {
  // Calendrier
  calendarMonthsAccess: number; // Nombre de mois accessibles dans le calendrier
  calendarYearsAccess: number; // Nombre d'années accessibles
  
  // Historique
  historyDaysAccess: number; // Nombre de jours d'historique accessible
  
  // Statistiques
  advancedStats: boolean; // Accès aux statistiques avancées
  detailedBreakdown: boolean; // Répartition détaillée par type
  timeComparison: boolean; // Comparaison dans le temps
  
  // Export
  exportEnabled: boolean; // Export des données
  exportFormats: string[]; // Formats d'export disponibles
  
  // Personnalisation
  customThemes: boolean; // Thèmes personnalisés
  customCategories: boolean; // Catégories personnalisées
  
  // Fonctionnalités avancées
  smartNotifications: boolean; // Notifications intelligentes
  challenges: boolean; // Défis personnalisés
  badges: boolean; // Système de badges
  widgets: boolean; // Widgets mobile
  
  // Support
  premiumResources: boolean; // Ressources exclusives
  offlineMode: boolean; // Mode hors-ligne
}

export interface UserSubscription {
  plan: SubscriptionPlan;
  startDate: string;
  endDate?: string; // undefined pour les abonnements actifs
  isActive: boolean;
  autoRenew: boolean;
  paymentMethod?: string;
}

// Configuration des limites par plan
export const SUBSCRIPTION_LIMITS: Record<SubscriptionPlan, SubscriptionLimits> = {
  free: {
    calendarMonthsAccess: 1, // Seulement le mois en cours
    calendarYearsAccess: 1, // Seulement l'année en cours
    historyDaysAccess: 7, // 7 derniers jours
    advancedStats: false,
    detailedBreakdown: false,
    timeComparison: false,
    exportEnabled: false,
    exportFormats: [],
    customThemes: false,
    customCategories: false,
    smartNotifications: false,
    challenges: false,
    badges: false,
    widgets: false,
    premiumResources: false,
    offlineMode: false,
  },
  premium: {
    calendarMonthsAccess: 12, // 12 mois
    calendarYearsAccess: 3, // 3 ans
    historyDaysAccess: 365, // 1 an complet
    advancedStats: true,
    detailedBreakdown: true,
    timeComparison: true,
    exportEnabled: true,
    exportFormats: ['csv', 'pdf'],
    customThemes: true,
    customCategories: true,
    smartNotifications: true,
    challenges: false,
    badges: false,
    widgets: false,
    premiumResources: false,
    offlineMode: false,
  },
  'premium-plus': {
    calendarMonthsAccess: -1, // Illimité
    calendarYearsAccess: -1, // Illimité
    historyDaysAccess: -1, // Illimité
    advancedStats: true,
    detailedBreakdown: true,
    timeComparison: true,
    exportEnabled: true,
    exportFormats: ['csv', 'pdf', 'image'],
    customThemes: true,
    customCategories: true,
    smartNotifications: true,
    challenges: true,
    badges: true,
    widgets: true,
    premiumResources: true,
    offlineMode: true,
  },
};

// Prix des abonnements (en euros)
export const SUBSCRIPTION_PRICES = {
  premium: 1.99,
  'premium-plus': 19.99,
};

// Fonction pour vérifier si une fonctionnalité est accessible
export const hasFeatureAccess = (
  userPlan: SubscriptionPlan,
  feature: keyof SubscriptionLimits
): boolean => {
  return SUBSCRIPTION_LIMITS[userPlan][feature];
};

// Fonction pour vérifier les limites de données
export const getDataLimits = (userPlan: SubscriptionPlan) => {
  const limits = SUBSCRIPTION_LIMITS[userPlan];
  return {
    maxHistoryDays: limits.historyDaysAccess,
    maxCalendarMonths: limits.calendarMonthsAccess,
    maxCalendarYears: limits.calendarYearsAccess,
  };
};
