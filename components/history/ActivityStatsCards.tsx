'use client';

import { DayActivities } from '@/types';
import { getAggregatedStats, getAverageActivitiesPerDay, getActiveDaysPercentage } from '@/utils/stats';
import { generateCalendarData } from '@/utils/stats';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { Activity, Calendar, Flower, Scale, Info } from 'lucide-react';
import { useState } from 'react';

interface ActivityStatsCardsProps {
  activities: DayActivities[];
  type: 'weekly' | 'monthly';
}

export default function ActivityStatsCards({ activities, type }: ActivityStatsCardsProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const stats = getAggregatedStats(activities);
  
  // Générer les données du calendrier pour calculer les jours actifs
  const today = new Date();
  const startDate = type === 'weekly' 
    ? startOfWeek(today, { weekStartsOn: 1 }) 
    : startOfMonth(today);
  const endDate = type === 'weekly' 
    ? endOfWeek(today, { weekStartsOn: 1 }) 
    : endOfMonth(today);
  
  const calendarDays = generateCalendarData(activities, startDate, endDate);
  const activeDaysPercentage = getActiveDaysPercentage(calendarDays);
  const averagePerDay = getAverageActivitiesPerDay(activities);

  const cards = [
    {
      title: 'Activités totales',
      value: stats.totalActivities,
      icon: Activity,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      gradient: 'from-emerald-400 to-emerald-500',
    },
    {
      title: `Jours ${type === 'weekly' ? 'cette semaine' : 'ce mois'}`,
      value: stats.totalDays,
      icon: Calendar,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      gradient: 'from-blue-400 to-blue-500',
    },
    {
      title: 'Jours actifs',
      value: `${activeDaysPercentage}%`,
      icon: Flower,
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100',
      gradient: 'from-purple-400 to-purple-500',
    },
    {
      title: 'Moyenne quotidienne',
      value: averagePerDay,
      icon: Scale,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
      gradient: 'from-amber-400 to-yellow-500',
      hasTooltip: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} rounded-3xl p-6 md:p-8 border ${card.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 relative group overflow-hidden`}
        >
          {/* Effet de brillance au survol */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          
          {/* Contenu principal */}
          <div className="relative z-10">
            {/* En-tête avec icône et titre */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className="w-7 h-7 text-white" />
                </div>
                
                <div>
                  <h3 className={`text-lg font-bold ${card.color} mb-1`}>
                    {card.title}
                  </h3>
                  <p className={`text-sm ${card.color} opacity-75`}>
                    {type === 'weekly' ? 'Cette semaine' : 'Ce mois'}
                  </p>
                </div>
              </div>
              
              {/* Tooltip pour la moyenne quotidienne */}
              {card.hasTooltip && (
                <div className="relative">
                  <button
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className={`${card.color} opacity-60 hover:opacity-100 transition-opacity`}
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  
                  {showTooltip && (
                    <div className="absolute top-6 right-0 bg-gray-900 text-white text-xs rounded-lg p-2 w-48 z-20 shadow-xl">
                      Moyenne calculée sur la période sélectionnée
                      <div className="absolute -top-1 right-2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Valeur principale */}
            <div className="mb-4">
              <div className={`text-4xl md:text-5xl font-bold ${card.color} mb-2`}>
                {card.value}
              </div>
              <div className={`text-sm ${card.color} opacity-75`}>
                {card.title.includes('Moyenne') ? 'activités/jour' : 
                 card.title.includes('Jours actifs') ? 'de régularité' :
                 card.title.includes('total') ? 'activités' : 'jours'}
              </div>
            </div>
            
            {/* Indicateur de tendance (optionnel) */}
            <div className={`text-xs ${card.color} opacity-60`}>
              {card.title.includes('Jours actifs') && (
                <span className="inline-flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${activeDaysPercentage >= 70 ? 'bg-green-500' : activeDaysPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                  {activeDaysPercentage >= 70 ? 'Excellent!' : activeDaysPercentage >= 50 ? 'Bien!' : 'À améliorer'}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}