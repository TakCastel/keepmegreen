'use client';

import { DayConsumption } from '@/types';
import { getAggregatedStats, getAverageConsumptionsPerDay, getGreenDaysPercentage } from '@/utils/stats';
import { generateCalendarData } from '@/utils/stats';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { User, Calendar, Flower, Scale } from 'lucide-react';

interface StatsCardsProps {
  consumptions: DayConsumption[];
  type: 'weekly' | 'monthly';
}

export default function StatsCards({ consumptions, type }: StatsCardsProps) {
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
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} rounded-2xl p-6 border ${card.borderColor} shadow-lg hover:shadow-xl transition-all`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-md`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-600">{card.title}</span>
          </div>
          <div className={`text-3xl font-light ${card.color} mb-1`}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}
