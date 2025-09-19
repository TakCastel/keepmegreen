import { DayConsumption, CategoryStats, DayStats, CalendarDay, DayColor } from '@/types';

// Calculer le nombre total de consommations pour un jour
export const getTotalConsumptions = (dayConsumption: DayConsumption): number => {
  const alcoholTotal = dayConsumption.alcohol.reduce((sum, item) => sum + item.quantity, 0);
  const cigarettesTotal = dayConsumption.cigarettes.reduce((sum, item) => sum + item.quantity, 0);
  const junkfoodTotal = dayConsumption.junkfood.reduce((sum, item) => sum + item.quantity, 0);
  
  return alcoholTotal + cigarettesTotal + junkfoodTotal;
};

// Système de pondération par gravité des consommations
const CONSUMPTION_WEIGHTS = {
  // Cigarettes - les plus graves
  cigarettes: {
    classic: 3,
    rolled: 3,
    cigar: 4,
    electronic: 2.5
  },
  // Alcool - gravité modérée à élevée
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
  if (weightedScore <= 3) return 'yellow';   // Ex: toute consommation > 0.1 jusqu'à 3 (e-cigarette, bière, burger)
  if (weightedScore <= 7) return 'orange';   // Ex: 1 cigarette = 3, alcool + nourriture
  return 'red';                              // Ex: 2+ cigarettes, alcool fort, combinaisons lourdes
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
