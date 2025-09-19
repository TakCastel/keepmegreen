import { DayConsumption, CategoryStats, DayStats, CalendarDay, DayColor } from '@/types';
import { Flower2, Leaf, Sun, Sunrise, Heart, Moon } from 'lucide-react';

// Calculer le nombre total de consommations pour un jour
export const getTotalConsumptions = (dayConsumption: DayConsumption): number => {
  const alcoholTotal = dayConsumption.alcohol.reduce((sum, item) => sum + item.quantity, 0);
  const cigarettesTotal = dayConsumption.cigarettes.reduce((sum, item) => sum + item.quantity, 0);
  const junkfoodTotal = dayConsumption.junkfood.reduce((sum, item) => sum + item.quantity, 0);
  
  return alcoholTotal + cigarettesTotal + junkfoodTotal;
};

// Système de pondération par gravité des consommations
const CONSUMPTION_WEIGHTS = {
  // Cigarettes - moins graves que l'alcool (max ~10 clopes = score 10)
  cigarettes: {
    classic: 1,
    rolled: 1,
    cigar: 1.5,
    electronic: 0.8
  },
  // Alcool - gravité modérée à élevée (plus grave que les clopes)
  alcohol: {
    beer: 2,
    wine: 2.5,
    shot: 3,
    cocktail: 2.5,
    spirits: 3.5
  },
  // Nutrition - gravité faible à modérée
  junkfood: {
    burger: 2,
    pizza: 1.5,
    fries: 1,
    soda: 0.8,
    sweets: 0.5
  }
};

// Calculer le score pondéré d'un jour
export const calculateDayWeight = (consumption: DayConsumption): number => {
  let totalWeight = 0;
  
  // Alcool
  consumption.alcohol?.forEach(item => {
    const weight = CONSUMPTION_WEIGHTS.alcohol[item.type as keyof typeof CONSUMPTION_WEIGHTS.alcohol] || 2;
    totalWeight += weight * item.quantity;
  });
  
  // Cigarettes
  consumption.cigarettes?.forEach(item => {
    const weight = CONSUMPTION_WEIGHTS.cigarettes[item.type as keyof typeof CONSUMPTION_WEIGHTS.cigarettes] || 3;
    totalWeight += weight * item.quantity;
  });
  
  // Junkfood
  consumption.junkfood?.forEach(item => {
    const weight = CONSUMPTION_WEIGHTS.junkfood[item.type as keyof typeof CONSUMPTION_WEIGHTS.junkfood] || 1;
    totalWeight += weight * item.quantity;
  });
  
  return totalWeight;
};

// Déterminer la couleur d'un jour basée sur le score pondéré
export const getDayColorByWeight = (weightedScore: number): DayColor => {
  if (weightedScore === 0) return 'green';
  if (weightedScore <= 5) return 'yellow';   // Ex: quelques cigarettes, bière, burger
  if (weightedScore <= 10) return 'orange';  // Ex: plusieurs cigarettes, alcool + nourriture
  return 'red';                              // Ex: beaucoup de cigarettes, alcool fort, combinaisons lourdes
};

// Déterminer l'icône, la couleur et le fond appropriés selon l'état d'équilibre de la journée
export const getDayMoodIcon = (dayConsumption: DayConsumption | null): { 
  icon: React.ComponentType<{ className?: string }>, 
  color: string, 
  bgGradient: string 
} => {
  if (!dayConsumption) return { 
    icon: Flower2, 
    color: 'text-emerald-600', 
    bgGradient: 'from-emerald-100 to-green-100' 
  };
  
  const weightedScore = calculateDayWeight(dayConsumption);
  const totalConsumptions = getTotalConsumptions(dayConsumption);
  
  // Journée parfaite - aucune consommation
  if (weightedScore === 0) {
    return { 
      icon: Flower2, 
      color: 'text-emerald-600', 
      bgGradient: 'from-emerald-100 to-green-100' 
    }; // Fleur verte - sérénité totale
  }
  
  // Journée légère - consommations mineures (score ≤ 5 = jaune)
  if (weightedScore <= 5) {
    return { 
      icon: Leaf, 
      color: 'text-emerald-500', 
      bgGradient: 'from-emerald-100 to-emerald-200' 
    }; // Feuille vert - équilibre naturel
  }
  
  // Journée modérée - quelques consommations (score ≤ 10 = orange)
  if (weightedScore <= 10) {
    return { 
      icon: Sun, 
      color: 'text-amber-500', 
      bgGradient: 'from-amber-100 to-yellow-100' 
    }; // Soleil orange - avec bienveillance
  }
  
  // Journée très difficile - beaucoup de consommations
  return { 
    icon: Heart, 
    color: 'text-rose-500', 
    bgGradient: 'from-rose-100 to-pink-100' 
  }; // Cœur rose - compassion et bienveillance
};

// Ancienne fonction pour compatibilité
export const getDayColor = (totalConsumptions: number): DayColor => {
  if (totalConsumptions === 0) return 'green';
  if (totalConsumptions <= 2) return 'yellow';
  if (totalConsumptions <= 5) return 'orange';
  return 'red';
};

// Calculer les statistiques pour une catégorie
export const getCategoryStats = (
  consumptions: Array<{ type: string; quantity: number }>
): CategoryStats => {
  const total = consumptions.reduce((sum, item) => sum + item.quantity, 0);
  const breakdown: Record<string, number> = {};
  
  consumptions.forEach(item => {
    breakdown[item.type] = (breakdown[item.type] || 0) + item.quantity;
  });
  
  return { total, breakdown };
};

// Calculer les statistiques pour un jour
export const getDayStats = (dayConsumption: DayConsumption): DayStats => {
  return {
    date: dayConsumption.date,
    alcohol: getCategoryStats(dayConsumption.alcohol),
    cigarettes: getCategoryStats(dayConsumption.cigarettes),
    junkfood: getCategoryStats(dayConsumption.junkfood),
    totalConsumptions: getTotalConsumptions(dayConsumption),
  };
};

// Calculer les statistiques agrégées pour une période
export const getAggregatedStats = (consumptions: DayConsumption[]) => {
  const totalStats = {
    alcohol: { total: 0, breakdown: {} as Record<string, number> },
    cigarettes: { total: 0, breakdown: {} as Record<string, number> },
    junkfood: { total: 0, breakdown: {} as Record<string, number> },
    totalDays: consumptions.length,
    totalConsumptions: 0,
  };
  
  consumptions.forEach(dayConsumption => {
    const dayStats = getDayStats(dayConsumption);
    
    // Alcool
    totalStats.alcohol.total += dayStats.alcohol.total;
    Object.entries(dayStats.alcohol.breakdown).forEach(([type, quantity]) => {
      totalStats.alcohol.breakdown[type] = (totalStats.alcohol.breakdown[type] || 0) + quantity;
    });
    
    // Cigarettes
    totalStats.cigarettes.total += dayStats.cigarettes.total;
    Object.entries(dayStats.cigarettes.breakdown).forEach(([type, quantity]) => {
      totalStats.cigarettes.breakdown[type] = (totalStats.cigarettes.breakdown[type] || 0) + quantity;
    });
    
    // Malbouffe
    totalStats.junkfood.total += dayStats.junkfood.total;
    Object.entries(dayStats.junkfood.breakdown).forEach(([type, quantity]) => {
      totalStats.junkfood.breakdown[type] = (totalStats.junkfood.breakdown[type] || 0) + quantity;
    });
    
    totalStats.totalConsumptions += dayStats.totalConsumptions;
  });
  
  return totalStats;
};

// Générer les données du calendrier pour une période
export const generateCalendarData = (
  consumptions: DayConsumption[],
  startDate: Date,
  endDate: Date
): CalendarDay[] => {
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
      const weightedScore = calculateDayWeight(dayConsumption);
      calendarDays.push({
        date: dateString,
        color: getDayColorByWeight(weightedScore),
        totalConsumptions,
        hasData: true,
      });
    } else {
      calendarDays.push({
        date: dateString,
        color: 'green',
        totalConsumptions: 0,
        hasData: false,
      });
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return calendarDays;
};

// Calculer le pourcentage de jours "verts" (sans consommation)
export const getGreenDaysPercentage = (calendarDays: CalendarDay[]): number => {
  if (calendarDays.length === 0) return 100;
  
  const greenDays = calendarDays.filter(day => day.color === 'green').length;
  return Math.round((greenDays / calendarDays.length) * 100);
};

// Calculer la moyenne de consommations par jour
export const getAverageConsumptionsPerDay = (consumptions: DayConsumption[]): number => {
  if (consumptions.length === 0) return 0;
  
  const totalConsumptions = consumptions.reduce((sum, day) => {
    return sum + getTotalConsumptions(day);
  }, 0);
  
  return Math.round((totalConsumptions / consumptions.length) * 10) / 10;
};
