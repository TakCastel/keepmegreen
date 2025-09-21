'use client';

import { DayActivities } from '@/types';
import { getAggregatedStats, getAverageActivitiesPerDay, getActiveDaysPercentage } from '@/utils/stats';
import { generateCalendarData } from '@/utils/stats';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { Activity, Calendar, Flower, Scale, Info } from 'lucide-react';
import { useState } from 'react';

interface StatsCardsProps {
  activities: DayActivities[];
  type: 'weekly' | 'monthly';
}

export default function StatsCards({ activities, type }: StatsCardsProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const stats = getAggregatedStats(activities);
  
  // Générer les données du calendrier pour calculer les jours verts
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
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100',
      gradient: 'from-purple-400 to-purple-500',
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
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      gradient: 'from-emerald-400 to-green-500',
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
                  <h3 className="text-sm md:text-base font-semibold text-gray-700 leading-tight">
                    {card.title}
                  </h3>
                  {card.hasTooltip && (
                    <div className="relative mt-1">
                      <button
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        className="w-4 h-4 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                      >
                        <Info className="w-2.5 h-2.5 text-gray-600" />
                      </button>
                      {showTooltip && (
                        <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg z-50">
                          <div className="font-medium mb-1">Moyenne quotidienne</div>
                          <div className="text-gray-300">
                            Nombre moyen de consommations par jour. 
                            Ce chiffre vous aide à comprendre vos patterns de consommation.
                          </div>
                          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Valeur principale */}
            <div className={`text-4xl md:text-5xl font-bold ${card.color} mb-2 group-hover:scale-105 transition-transform duration-300`}>
              {typeof card.value === 'number' ? card.value.toFixed(1) : card.value}
            </div>
            
            {/* Sous-informations contextuelles */}
            <div className="text-xs md:text-sm text-gray-500 font-medium">
              {index === 0 && (
                <span>Total cette période</span>
              )}
              {index === 1 && (
                <span>Jours avec données</span>
              )}
              {index === 2 && (
                <span>Sans consommation</span>
              )}
              {index === 3 && (
                <span>Par jour en moyenne</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
