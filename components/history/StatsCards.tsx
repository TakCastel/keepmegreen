'use client';

import { DayConsumption } from '@/types';
import { getAggregatedStats, getAverageConsumptionsPerDay, getGreenDaysPercentage } from '@/utils/stats';
import { generateCalendarData } from '@/utils/stats';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { User, Calendar, Flower, Scale, Info } from 'lucide-react';
import { useState } from 'react';

interface StatsCardsProps {
  consumptions: DayConsumption[];
  type: 'weekly' | 'monthly';
}

export default function StatsCards({ consumptions, type }: StatsCardsProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const stats = getAggregatedStats(consumptions);
  
  // Générer les données du calendrier pour calculer les jours verts
  const today = new Date();
  const startDate = type === 'weekly' 
    ? startOfWeek(today, { weekStartsOn: 1 }) 
    : startOfMonth(today);
  const endDate = type === 'weekly' 
    ? endOfWeek(today, { weekStartsOn: 1 }) 
    : endOfMonth(today);
  
  const calendarDays = generateCalendarData(consumptions, startDate, endDate);
  const greenDaysPercentage = getGreenDaysPercentage(calendarDays);
  const averagePerDay = getAverageConsumptionsPerDay(consumptions);

  const cards = [
    {
      title: 'Prises de conscience',
      value: stats.totalConsumptions,
      icon: User,
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
      title: 'Sérénité',
      value: `${greenDaysPercentage}%`,
      icon: Flower,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      gradient: 'from-emerald-400 to-green-500',
    },
    {
      title: 'Équilibre quotidien',
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
    <div className="hidden md:grid grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} rounded-2xl p-6 border ${card.borderColor} shadow-lg hover:shadow-xl transition-all relative`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-md`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-600">{card.title}</span>
            {card.hasTooltip && (
              <div className="relative ml-auto">
                <button
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="w-5 h-5 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                >
                  <Info className="w-3 h-3 text-gray-600" />
                </button>
                {showTooltip && (
                  <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg z-50">
                    <div className="font-medium mb-1">Équilibre quotidien</div>
                    <div className="text-gray-300">
                      Nombre moyen de consommations par jour. 
                      Plus ce chiffre est bas, plus vos journées sont sereines et équilibrées.
                    </div>
                    <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className={`text-3xl font-light ${card.color} mb-1`}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}
