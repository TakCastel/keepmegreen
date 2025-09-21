'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarDay as CalendarDayType } from '@/types';

interface CalendarDayProps {
  day: {
    date: string;
    day: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    isFuture: boolean;
    color: string;
    totalActivities: number;
    hasData: boolean;
  };
  dayData: CalendarDayType;
  canAccess: boolean;
  canAccessPeriod: (date: Date) => boolean;
  onDayClick: (dayData: CalendarDayType, dayActivities: any, showPaywall: boolean) => void;
  activities: any[];
  size?: 'small' | 'medium' | 'large';
}

const colorClasses = {
  neutral: 'bg-gray-100 text-gray-800',
  'light-blue': 'bg-blue-100 text-blue-800',
  blue: 'bg-blue-200 text-blue-900',
  'dark-blue': 'bg-blue-300 text-blue-900',
  'blue-purple': 'bg-purple-200 text-purple-900',
};

const sizeClasses = {
  small: 'w-8 h-8 text-xs',
  medium: 'w-10 h-10 text-sm',
  large: 'w-12 h-12 text-sm',
};

export default function CalendarDay({
  day,
  dayData,
  canAccess,
  canAccessPeriod,
  onDayClick,
  activities,
  size = 'medium'
}: CalendarDayProps) {
  const isClickable = day.isCurrentMonth && !day.isFuture;
  
  const handleClick = () => {
    if (isClickable) {
      const dayActivities = activities.find(a => a.date === dayData.date);
      const [year, month, dayOfMonth] = dayData.date.split('-').map(Number);
      const dayDate = new Date(year, month - 1, dayOfMonth);
      const showPaywall = !canAccessPeriod(dayDate);
      onDayClick(dayData, dayActivities, showPaywall);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!day.isCurrentMonth || day.isFuture}
      className={`
        relative ${sizeClasses[size]} rounded-xl font-medium transition-all duration-200
        flex items-center justify-center
        ${!day.isCurrentMonth 
          ? 'text-gray-300 cursor-default'
          : day.isFuture
          ? 'bg-gray-50 text-gray-400 cursor-default'
          : !canAccess
          ? 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-700 opacity-60 cursor-pointer'
          : `${colorClasses[day.color] || colorClasses.neutral} hover:scale-110 hover:shadow-lg cursor-pointer`
        }
        ${day.isToday && day.isCurrentMonth 
          ? 'ring-2 ring-gray-800' 
          : ''
        }
      `}
      title={
        day.isCurrentMonth 
          ? !canAccess
            ? `${format(new Date(day.date), 'dd MMMM yyyy', { locale: fr })} - Cliquez pour découvrir Premium et accéder à l'historique complet`
            : `${format(new Date(day.date), 'dd MMMM yyyy', { locale: fr })} - ${day.totalActivities} activité${day.totalActivities > 1 ? 's' : ''}`
          : ''
      }
    >
      {day.day}
      
      {/* Indicateur discret pour aujourd'hui */}
      {day.isToday && day.isCurrentMonth && (
        <div className={`absolute -top-0.5 -right-0.5 ${size === 'small' ? 'w-1.5 h-1.5' : 'w-2 h-2'} bg-gray-800 rounded-full`}></div>
      )}
      
      {/* Indicateur pour les dates non accessibles */}
      {!canAccess && day.isCurrentMonth && !day.isFuture && (
        <div className={`absolute -top-0.5 -left-0.5 ${size === 'small' ? 'w-1.5 h-1.5' : 'w-2 h-2'} bg-amber-500 rounded-full`}></div>
      )}
    </button>
  );
}
