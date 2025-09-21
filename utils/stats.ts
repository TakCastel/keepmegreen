import { DayActivities, CategoryStats, DayStats, CalendarDay, DayColor, DayConsumption } from '@/types';
import { Flower2, Leaf, Sun, Sunrise, Heart, Moon, Zap, Users, Apple } from 'lucide-react';

// Calculer le nombre total d'activités pour un jour
export const getTotalActivities = (dayActivities: DayActivities): number => {
  const sportTotal = dayActivities.sport.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const socialTotal = dayActivities.social.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const nutritionTotal = dayActivities.nutrition.reduce((sum, item) => sum + (item.quantity || 0), 0);
  
  return sportTotal + socialTotal + nutritionTotal;
};

// Système de pondération par valeur des activités positives
const ACTIVITY_WEIGHTS = {
  // Sport - activités très positives (score élevé)
  sport: {
    running: 3,
    gym: 3,
    yoga: 2.5,
    swimming: 3,
    cycling: 2.5,
    walking: 2,
    dancing: 2,
    hiking: 3,
    tennis: 2.5,
    football: 2.5
  },
  // Social - activités importantes pour le bien-être
  social: {
    friends: 2,
    family: 2.5,
    volunteering: 3,
    cultural: 2,
    meeting: 1.5,
    party: 1.5,
    date: 2,
    community: 2.5
  },
  // Nutrition - activités de base pour la santé
  nutrition: {
    balanced_meal: 2,
    fruits_vegetables: 2.5,
    hydration: 1.5,
    home_cooking: 2,
    healthy_snack: 1.5,
    breakfast: 1.5,
    lunch: 1.5,
    dinner: 1.5
  }
};

// Calculer le score positif d'un jour
export const calculateDayScore = (activities: DayActivities): number => {
  let totalScore = 0;
  
  // Sport
  activities.sport?.forEach(item => {
    const weight = ACTIVITY_WEIGHTS.sport[item.type as keyof typeof ACTIVITY_WEIGHTS.sport] || 2;
    totalScore += weight * (item.quantity || 0);
  });
  
  // Social
  activities.social?.forEach(item => {
    const weight = ACTIVITY_WEIGHTS.social[item.type as keyof typeof ACTIVITY_WEIGHTS.social] || 2;
    totalScore += weight * (item.quantity || 0);
  });
  
  // Nutrition
  activities.nutrition?.forEach(item => {
    const weight = ACTIVITY_WEIGHTS.nutrition[item.type as keyof typeof ACTIVITY_WEIGHTS.nutrition] || 1.5;
    totalScore += weight * (item.quantity || 0);
  });
  
  return totalScore;
};

// Déterminer la couleur d'un jour basée sur le score positif
export const getDayColorByScore = (positiveScore: number): DayColor => {
  if (positiveScore === 0) return 'neutral';        // Aucune activité
  if (positiveScore <= 3) return 'light-blue';     // Quelques activités légères
  if (positiveScore <= 6) return 'blue';           // Activités modérées
  if (positiveScore <= 10) return 'dark-blue';     // Bonne journée d'activités
  return 'blue-purple';                             // Excellente journée !
};

// Déterminer l'icône, la couleur et le fond appropriés selon les activités de la journée
export const getDayMoodIcon = (dayActivities: DayActivities | null): { 
  icon: React.ComponentType<{ className?: string }>, 
  color: string, 
  bgGradient: string 
} => {
  if (!dayActivities) return { 
    icon: Flower2, 
    color: 'text-gray-500', 
    bgGradient: 'from-gray-100 to-gray-200' 
  };
  
  const positiveScore = calculateDayScore(dayActivities);
  const totalActivities = getTotalActivities(dayActivities);
  
  // Journée sans activité - neutre
  if (positiveScore === 0) {
    return { 
      icon: Flower2, 
      color: 'text-gray-500', 
      bgGradient: 'from-gray-100 to-gray-200' 
    }; // Fleur grise - jour neutre
  }
  
  // Journée légère - quelques activités (score ≤ 3 = bleu clair)
  if (positiveScore <= 3) {
    return { 
      icon: Leaf, 
      color: 'text-blue-500', 
      bgGradient: 'from-blue-100 to-blue-200' 
    }; // Feuille bleue - début d'activités
  }
  
  // Journée modérée - activités moyennes (score ≤ 6 = bleu)
  if (positiveScore <= 6) {
    return { 
      icon: Sun, 
      color: 'text-blue-600', 
      bgGradient: 'from-blue-200 to-blue-300' 
    }; // Soleil bleu - bonne dynamique
  }
  
  // Journée excellente - beaucoup d'activités (score ≤ 10 = bleu foncé)
  if (positiveScore <= 10) {
    return { 
      icon: Zap, 
      color: 'text-blue-700', 
      bgGradient: 'from-blue-300 to-blue-400' 
    }; // Éclair bleu foncé - énergie positive
  }
  
  // Journée exceptionnelle - activités intenses
  return { 
    icon: Heart, 
    color: 'text-blue-800', 
    bgGradient: 'from-blue-400 to-purple-400' 
  }; // Cœur vert - journée parfaite
};

// Fonction pour compatibilité avec l'ancien système
export const getDayColor = (totalActivities: number): DayColor => {
  if (totalActivities === 0) return 'neutral';
  if (totalActivities <= 2) return 'light-blue';
  if (totalActivities <= 4) return 'blue';
  if (totalActivities <= 6) return 'green';
  return 'dark-green';
};

// Calculer les statistiques pour une catégorie
export const getCategoryStats = (
  activities: Array<{ type: string; quantity: number }>
): CategoryStats => {
  const total = activities.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const breakdown: Record<string, number> = {};
  
  activities.forEach(item => {
    breakdown[item.type] = (breakdown[item.type] || 0) + (item.quantity || 0);
  });
  
  return { total, breakdown };
};

// Calculer les statistiques pour un jour
export const getDayStats = (dayActivities: DayActivities): DayStats => {
  return {
    date: dayActivities.date,
    sport: getCategoryStats(dayActivities.sport),
    social: getCategoryStats(dayActivities.social),
    nutrition: getCategoryStats(dayActivities.nutrition),
    totalActivities: getTotalActivities(dayActivities),
  };
};

// Calculer les statistiques agrégées pour une période
export const getAggregatedStats = (activities: DayActivities[]) => {
  const totalStats = {
    sport: { total: 0, breakdown: {} as Record<string, number> },
    social: { total: 0, breakdown: {} as Record<string, number> },
    nutrition: { total: 0, breakdown: {} as Record<string, number> },
    totalDays: activities.length,
    totalActivities: 0,
  };
  
  activities.forEach(dayActivities => {
    const dayStats = getDayStats(dayActivities);
    
    // Sport
    totalStats.sport.total += dayStats.sport.total;
    Object.entries(dayStats.sport.breakdown).forEach(([type, quantity]) => {
      totalStats.sport.breakdown[type] = (totalStats.sport.breakdown[type] || 0) + quantity;
    });
    
    // Social
    totalStats.social.total += dayStats.social.total;
    Object.entries(dayStats.social.breakdown).forEach(([type, quantity]) => {
      totalStats.social.breakdown[type] = (totalStats.social.breakdown[type] || 0) + quantity;
    });
    
    // Nutrition
    totalStats.nutrition.total += dayStats.nutrition.total;
    Object.entries(dayStats.nutrition.breakdown).forEach(([type, quantity]) => {
      totalStats.nutrition.breakdown[type] = (totalStats.nutrition.breakdown[type] || 0) + quantity;
    });
    
    totalStats.totalActivities += dayStats.totalActivities;
  });
  
  return totalStats;
};

// Générer les données du calendrier pour une période
export const generateCalendarData = (
  activities: DayActivities[],
  startDate: Date,
  endDate: Date
): CalendarDay[] => {
  const calendarDays: CalendarDay[] = [];
  const activityMap = new Map<string, DayActivities>();
  
  // Créer une map des activités par date
  activities.forEach(activity => {
    activityMap.set(activity.date, activity);
  });
  
  // Générer les jours du calendrier
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString().split('T')[0];
    const dayActivities = activityMap.get(dateString);
    
    if (dayActivities) {
      const totalActivities = getTotalActivities(dayActivities);
      const positiveScore = calculateDayScore(dayActivities);
      calendarDays.push({
        date: dateString,
        color: getDayColorByScore(positiveScore),
        totalActivities,
        hasData: true,
      });
    } else {
      calendarDays.push({
        date: dateString,
        color: 'neutral',
        totalActivities: 0,
        hasData: false,
      });
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return calendarDays;
};

// Calculer le pourcentage de jours "actifs" (avec activités positives)
export const getActiveDaysPercentage = (calendarDays: CalendarDay[]): number => {
  if (calendarDays.length === 0) return 0;
  
  const activeDays = calendarDays.filter(day => day.color !== 'neutral').length;
  return Math.round((activeDays / calendarDays.length) * 100);
};

// Calculer la moyenne d'activités par jour
export const getAverageActivitiesPerDay = (activities: DayActivities[]): number => {
  if (activities.length === 0) return 0;
  
  const totalActivities = activities.reduce((sum, day) => {
    return sum + getTotalActivities(day);
  }, 0);
  
  return Math.round((totalActivities / activities.length) * 10) / 10;
};

// ===== FONCTIONS POUR LES STATISTIQUES ANNUELLES =====

// Calculer les statistiques mensuelles pour une année
export const getMonthlyStatsForYear = (activities: DayActivities[]) => {
  const monthlyStats: Record<string, {
    month: string;
    totalActivities: number;
    sport: number;
    social: number;
    nutrition: number;
    averageScore: number;
    activeDays: number;
    totalDays: number;
  }> = {};

  // Initialiser les mois
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  months.forEach((month, index) => {
    monthlyStats[month] = {
      month,
      totalActivities: 0,
      sport: 0,
      social: 0,
      nutrition: 0,
      averageScore: 0,
      activeDays: 0,
      totalDays: 0
    };
  });

  // Grouper les activités par mois
  const activitiesByMonth: Record<string, DayActivities[]> = {};
  
  activities.forEach(activity => {
    const date = new Date(activity.date);
    const monthKey = months[date.getMonth()];
    
    if (!activitiesByMonth[monthKey]) {
      activitiesByMonth[monthKey] = [];
    }
    activitiesByMonth[monthKey].push(activity);
  });

  // Calculer les statistiques pour chaque mois
  Object.entries(activitiesByMonth).forEach(([month, monthActivities]) => {
    const monthStats = getAggregatedStats(monthActivities);
    const activeDays = monthActivities.filter(day => getTotalActivities(day) > 0).length;
    const averageScore = monthActivities.length > 0 
      ? monthActivities.reduce((sum, day) => sum + calculateDayScore(day), 0) / monthActivities.length
      : 0;

    monthlyStats[month] = {
      month,
      totalActivities: monthStats.totalActivities,
      sport: monthStats.sport.total,
      social: monthStats.social.total,
      nutrition: monthStats.nutrition.total,
      averageScore: Math.round(averageScore * 10) / 10,
      activeDays,
      totalDays: monthActivities.length
    };
  });

  return Object.values(monthlyStats);
};

// Calculer les statistiques trimestrielles pour une année
export const getQuarterlyStatsForYear = (activities: DayActivities[]) => {
  const quarterlyStats: Record<string, {
    quarter: string;
    totalActivities: number;
    sport: number;
    social: number;
    nutrition: number;
    averageScore: number;
    activeDays: number;
    totalDays: number;
  }> = {};

  const quarters = [
    { name: 'Q1', months: [0, 1, 2] }, // Jan-Mar
    { name: 'Q2', months: [3, 4, 5] }, // Apr-Jun
    { name: 'Q3', months: [6, 7, 8] }, // Jul-Sep
    { name: 'Q4', months: [9, 10, 11] } // Oct-Dec
  ];

  quarters.forEach(quarter => {
    quarterlyStats[quarter.name] = {
      quarter: quarter.name,
      totalActivities: 0,
      sport: 0,
      social: 0,
      nutrition: 0,
      averageScore: 0,
      activeDays: 0,
      totalDays: 0
    };
  });

  // Grouper les activités par trimestre
  const activitiesByQuarter: Record<string, DayActivities[]> = {};
  
  activities.forEach(activity => {
    const date = new Date(activity.date);
    const month = date.getMonth();
    
    let quarterKey = 'Q1';
    if (month >= 3 && month <= 5) quarterKey = 'Q2';
    else if (month >= 6 && month <= 8) quarterKey = 'Q3';
    else if (month >= 9 && month <= 11) quarterKey = 'Q4';
    
    if (!activitiesByQuarter[quarterKey]) {
      activitiesByQuarter[quarterKey] = [];
    }
    activitiesByQuarter[quarterKey].push(activity);
  });

  // Calculer les statistiques pour chaque trimestre
  Object.entries(activitiesByQuarter).forEach(([quarter, quarterActivities]) => {
    const quarterStats = getAggregatedStats(quarterActivities);
    const activeDays = quarterActivities.filter(day => getTotalActivities(day) > 0).length;
    const averageScore = quarterActivities.length > 0 
      ? quarterActivities.reduce((sum, day) => sum + calculateDayScore(day), 0) / quarterActivities.length
      : 0;

    quarterlyStats[quarter] = {
      quarter,
      totalActivities: quarterStats.totalActivities,
      sport: quarterStats.sport.total,
      social: quarterStats.social.total,
      nutrition: quarterStats.nutrition.total,
      averageScore: Math.round(averageScore * 10) / 10,
      activeDays,
      totalDays: quarterActivities.length
    };
  });

  return Object.values(quarterlyStats);
};

// Calculer les tendances annuelles
export const getYearlyTrends = (activities: DayActivities[]) => {
  const monthlyStats = getMonthlyStatsForYear(activities);
  
  // Calculer les tendances
  const trends = {
    bestMonth: '',
    worstMonth: '',
    mostActiveCategory: '',
    improvement: 0,
    consistency: 0
  };

  if (monthlyStats.length === 0) return trends;

  // Trouver le meilleur et le pire mois
  const sortedByActivities = [...monthlyStats].sort((a, b) => b.totalActivities - a.totalActivities);
  trends.bestMonth = sortedByActivities[0]?.month || '';
  trends.worstMonth = sortedByActivities[sortedByActivities.length - 1]?.month || '';

  // Calculer la catégorie la plus active
  const totalSport = monthlyStats.reduce((sum, month) => sum + month.sport, 0);
  const totalSocial = monthlyStats.reduce((sum, month) => sum + month.social, 0);
  const totalNutrition = monthlyStats.reduce((sum, month) => sum + month.nutrition, 0);
  
  if (totalSport >= totalSocial && totalSport >= totalNutrition) {
    trends.mostActiveCategory = 'Sport';
  } else if (totalSocial >= totalNutrition) {
    trends.mostActiveCategory = 'Social';
  } else {
    trends.mostActiveCategory = 'Nutrition';
  }

  // Calculer l'amélioration (différence entre le premier et le dernier mois)
  if (monthlyStats.length >= 2) {
    const firstMonth = monthlyStats.find(m => m.month === 'Janvier');
    const lastMonth = monthlyStats.find(m => m.month === 'Décembre');
    if (firstMonth && lastMonth) {
      trends.improvement = Math.round(((lastMonth.totalActivities - firstMonth.totalActivities) / firstMonth.totalActivities) * 100);
    }
  }

  // Calculer la régularité (écart-type des activités mensuelles)
  const averageActivities = monthlyStats.reduce((sum, month) => sum + month.totalActivities, 0) / monthlyStats.length;
  const variance = monthlyStats.reduce((sum, month) => {
    return sum + Math.pow(month.totalActivities - averageActivities, 2);
  }, 0) / monthlyStats.length;
  const standardDeviation = Math.sqrt(variance);
  trends.consistency = Math.round((1 - (standardDeviation / averageActivities)) * 100);

  return trends;
};

// ===== FONCTIONS POUR LES CONSOMMATIONS =====

// Calculer le nombre total de consommations pour un jour
export const getTotalConsumptions = (dayConsumption: DayConsumption): number => {
  const alcoholTotal = dayConsumption.alcohol.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const cigarettesTotal = dayConsumption.cigarettes.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const junkfoodTotal = dayConsumption.junkfood.reduce((sum, item) => sum + (item.quantity || 0), 0);
  
  return alcoholTotal + cigarettesTotal + junkfoodTotal;
};

// Calculer les statistiques agrégées pour les consommations
export const getAggregatedConsumptionStats = (consumptions: DayConsumption[] | undefined) => {
  // Si consumptions est undefined ou null, retourner des statistiques vides
  if (!consumptions) {
    return {
      alcohol: { total: 0, breakdown: {} as Record<string, number> },
      cigarettes: { total: 0, breakdown: {} as Record<string, number> },
      junkfood: { total: 0, breakdown: {} as Record<string, number> },
      totalDays: 0,
      totalConsumptions: 0,
    };
  }

  const totalStats = {
    alcohol: { total: 0, breakdown: {} as Record<string, number> },
    cigarettes: { total: 0, breakdown: {} as Record<string, number> },
    junkfood: { total: 0, breakdown: {} as Record<string, number> },
    totalDays: consumptions.length,
    totalConsumptions: 0,
  };
  
  consumptions.forEach(dayConsumption => {
    // Alcool
    dayConsumption.alcohol.forEach(item => {
      totalStats.alcohol.total += item.quantity || 0;
      totalStats.alcohol.breakdown[item.type] = (totalStats.alcohol.breakdown[item.type] || 0) + (item.quantity || 0);
    });
    
    // Cigarettes
    dayConsumption.cigarettes.forEach(item => {
      totalStats.cigarettes.total += item.quantity || 0;
      totalStats.cigarettes.breakdown[item.type] = (totalStats.cigarettes.breakdown[item.type] || 0) + (item.quantity || 0);
    });
    
    // Malbouffe
    dayConsumption.junkfood.forEach(item => {
      totalStats.junkfood.total += item.quantity || 0;
      totalStats.junkfood.breakdown[item.type] = (totalStats.junkfood.breakdown[item.type] || 0) + (item.quantity || 0);
    });
    
    totalStats.totalConsumptions += getTotalConsumptions(dayConsumption);
  });
  
  return totalStats;
};

// Calculer la moyenne de consommations par jour
export const getAverageConsumptionsPerDay = (consumptions: DayConsumption[] | undefined): number => {
  if (!consumptions || consumptions.length === 0) return 0;
  
  const totalConsumptions = consumptions.reduce((sum, day) => {
    return sum + getTotalConsumptions(day);
  }, 0);
  
  return Math.round((totalConsumptions / consumptions.length) * 10) / 10;
};

// Générer les données du calendrier pour les consommations
export const generateConsumptionCalendarData = (
  consumptions: DayConsumption[] | undefined,
  startDate: Date,
  endDate: Date
): CalendarDay[] => {
  // Si consumptions est undefined, retourner un calendrier vide
  if (!consumptions) {
    const calendarDays: CalendarDay[] = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      calendarDays.push({
        date: dateString,
        color: 'dark-green', // Pas de consommation = excellent
        totalActivities: 0,
        hasData: false,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return calendarDays;
  }
  const calendarDays: CalendarDay[] = [];
  const consumptionMap = new Map<string, DayConsumption>();
  
  // Créer une map des consommations par date
  consumptions.forEach(consumption => {
    consumptionMap.set(consumption.date, consumption);
  });
  
  // Générer les jours du calendrier
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString().split('T')[0];
    const dayConsumption = consumptionMap.get(dateString);
    
    if (dayConsumption) {
      const totalConsumptions = getTotalConsumptions(dayConsumption);
      // Pour les consommations, on utilise une logique inverse : moins c'est mieux
      let color: DayColor;
      if (totalConsumptions === 0) {
        color = 'dark-green'; // Jour sans consommation = excellent
      } else if (totalConsumptions <= 2) {
        color = 'green'; // Peu de consommations = bon
      } else if (totalConsumptions <= 4) {
        color = 'blue'; // Consommations modérées = acceptable
      } else if (totalConsumptions <= 6) {
        color = 'light-blue'; // Beaucoup de consommations = attention
      } else {
        color = 'neutral'; // Trop de consommations = préoccupant
      }
      
      calendarDays.push({
        date: dateString,
        color,
        totalActivities: totalConsumptions,
        hasData: true,
      });
    } else {
      calendarDays.push({
        date: dateString,
        color: 'dark-green', // Pas de consommation = excellent
        totalActivities: 0,
        hasData: false,
      });
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return calendarDays;
};

// Calculer le pourcentage de jours "verts" (sans consommation ou avec très peu de consommations)
export const getGreenDaysPercentage = (calendarDays: CalendarDay[]): number => {
  if (calendarDays.length === 0) return 0;
  
  const greenDays = calendarDays.filter(day => 
    day.color === 'green' || day.color === 'dark-green'
  ).length;
  
  return Math.round((greenDays / calendarDays.length) * 100);
};

// ===== FONCTIONS POUR LES CONSOMMATIONS - CALCULS DE POIDS =====

// Système de pondération pour les consommations (plus c'est élevé, plus c'est préoccupant)
const CONSUMPTION_WEIGHTS = {
  // Alcool - impact élevé sur la santé
  alcohol: {
    beer: 2,
    wine: 2.5,
    whiskey: 4,
    vodka: 4,
    rum: 4,
    gin: 4,
    tequila: 4,
    champagne: 3,
    cocktail: 3.5,
    spirits: 4
  },
  // Cigarettes - impact très élevé
  cigarettes: {
    cigarette: 5,
    cigar: 6,
    pipe: 5,
    vape: 3,
    shisha: 4,
    rolled: 5,
    classic: 5
  },
  // Malbouffe - impact modéré
  junkfood: {
    burger: 2,
    pizza: 2,
    fries: 1.5,
    soda: 2,
    candy: 1.5,
    chips: 1.5,
    ice_cream: 1,
    donut: 2,
    cake: 2
  }
};

// Calculer le poids total d'un jour basé sur les consommations
export const calculateDayWeight = (dayConsumption: DayConsumption): number => {
  let totalWeight = 0;
  
  // Alcool
  dayConsumption.alcohol?.forEach(item => {
    const weight = CONSUMPTION_WEIGHTS.alcohol[item.type as keyof typeof CONSUMPTION_WEIGHTS.alcohol] || 2;
    totalWeight += weight * (item.quantity || 0);
  });
  
  // Cigarettes
  dayConsumption.cigarettes?.forEach(item => {
    const weight = CONSUMPTION_WEIGHTS.cigarettes[item.type as keyof typeof CONSUMPTION_WEIGHTS.cigarettes] || 5;
    totalWeight += weight * (item.quantity || 0);
  });
  
  // Malbouffe
  dayConsumption.junkfood?.forEach(item => {
    const weight = CONSUMPTION_WEIGHTS.junkfood[item.type as keyof typeof CONSUMPTION_WEIGHTS.junkfood] || 1.5;
    totalWeight += weight * (item.quantity || 0);
  });
  
  return totalWeight;
};

// Déterminer la couleur d'un jour basée sur le poids des consommations
export const getDayColorByWeight = (weight: number): 'green' | 'yellow' | 'orange' | 'red' => {
  if (weight === 0) return 'green';        // Aucune consommation - excellent
  if (weight <= 3) return 'yellow';        // Consommations légères - acceptable
  if (weight <= 8) return 'orange';        // Consommations modérées - attention
  return 'red';                            // Consommations élevées - préoccupant
};

// Fonction pour obtenir l'icône de mood basée sur les consommations (logique inverse)
export const getConsumptionMoodIcon = (dayConsumption: DayConsumption | null): { 
  icon: React.ComponentType<{ className?: string }>, 
  color: string, 
  bgGradient: string 
} => {
  if (!dayConsumption) return { 
    icon: Flower2, 
    color: 'text-emerald-600', 
    bgGradient: 'from-emerald-100 to-green-200' 
  };
  
  const totalConsumptions = getTotalConsumptions(dayConsumption);
  const weight = calculateDayWeight(dayConsumption);
  
  // Journée sans consommation - excellent
  if (totalConsumptions === 0) {
    return { 
      icon: Flower2, 
      color: 'text-emerald-600', 
      bgGradient: 'from-emerald-100 to-green-200' 
    }; // Fleur verte - journée parfaite
  }
  
  // Consommations légères (poids ≤ 3 = jaune)
  if (weight <= 3) {
    return { 
      icon: Sun, 
      color: 'text-amber-600', 
      bgGradient: 'from-amber-100 to-yellow-200' 
    }; // Soleil jaune - acceptable
  }
  
  // Consommations modérées (poids ≤ 8 = orange)
  if (weight <= 8) {
    return { 
      icon: Sunrise, 
      color: 'text-orange-600', 
      bgGradient: 'from-orange-100 to-red-200' 
    }; // Lever de soleil orange - attention
  }
  
  // Consommations élevées (poids > 8 = rouge)
  return { 
    icon: Heart, 
    color: 'text-red-600', 
    bgGradient: 'from-red-100 to-red-200' 
  }; // Cœur rouge - préoccupant mais avec bienveillance
};
