'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import CalendarDay from './CalendarDay';
import { CalendarDay as CalendarDayType } from '@/types';

interface CalendarMonthProps {
  month: {
    month: number;
    name: string;
    shortName: string;
    weeks: any[][];
  };
  displayYear: number;
  canAccessPeriod: (date: Date) => boolean;
  onDayClick: (dayData: CalendarDayType, dayActivities: any, showPaywall: boolean) => void;
  activities: any[];
  size?: 'small' | 'medium' | 'large';
  showStats?: boolean;
}

export default function CalendarMonth({
  month,
  displayYear,
  canAccessPeriod,
  onDayClick,
  activities,
  size = 'medium',
  showStats = true
}: CalendarMonthProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
      {/* En-tête du mois */}
      <div className="text-center mb-6">
        <h3 className={`${size === 'small' ? 'text-lg' : 'text-2xl'} font-semibold text-gray-800 capitalize`}>
          {size === 'small' ? month.shortName : month.shortName}
        </h3>
        <div className="text-sm text-gray-600">{displayYear}</div>
      </div>
      
      {/* En-têtes des jours de la semaine */}
      <div className={`grid grid-cols-7 ${size === 'small' ? 'gap-1 mb-2' : 'gap-2 mb-4'}`}>
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
          <div key={index} className={`${size === 'small' ? 'text-xs' : 'text-sm'} font-medium text-gray-500 text-center py-2`}>
            {day}
          </div>
        ))}
      </div>
      
      {/* Grille des jours du mois */}
      <div className={size === 'small' ? 'space-y-1' : 'space-y-2'}>
        {month.weeks.map((week, weekIndex) => (
          <div key={weekIndex} className={`grid grid-cols-7 ${size === 'small' ? 'gap-1' : 'gap-2'}`}>
            {week.map((day, dayIndex) => {
              const dayData = {
                date: day.date,
                color: day.color,
                totalActivities: day.totalActivities,
                hasData: day.hasData
              } as CalendarDayType;
              
              // Vérifier si l'utilisateur peut accéder à cette date
              const [year, month, dayOfMonth] = day.date.split('-').map(Number);
              const dayDate = new Date(year, month - 1, dayOfMonth);
              const canAccess = canAccessPeriod(dayDate);
              
              return (
                <CalendarDay
                  key={dayIndex}
                  day={day}
                  dayData={dayData}
                  canAccess={canAccess}
                  canAccessPeriod={canAccessPeriod}
                  onDayClick={onDayClick}
                  activities={activities}
                  size={size}
                />
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Statistiques du mois */}
      {showStats && (
        <div className={`mt-6 pt-4 border-t border-gray-200 ${size === 'small' ? 'text-xs' : 'text-sm'}`}>
          {size === 'small' ? (
            <div className="text-gray-600">
              <div className="flex justify-between">
                <span>Actifs</span>
                <span className="font-medium text-blue-600">
                  {month.weeks.flat().filter(d => d.isCurrentMonth && d.color !== 'neutral').length}
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Total</span>
                <span className="font-medium text-blue-600">
                  {month.weeks.flat().reduce((sum, d) => d.isCurrentMonth ? sum + (d.totalActivities || 0) : sum, 0)}
                </span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className={`${size === 'medium' ? 'text-2xl' : 'text-3xl'} font-light text-blue-600`}>
                  {month.weeks.flat().filter(d => d.isCurrentMonth && d.color !== 'neutral').length}
                </div>
                <div className="text-gray-600 font-medium">Jours actifs</div>
              </div>
              <div className="text-center">
                <div className={`${size === 'medium' ? 'text-2xl' : 'text-3xl'} font-light text-blue-600`}>
                  {month.weeks.flat().reduce((sum, d) => d.isCurrentMonth ? sum + (d.totalActivities || 0) : sum, 0)}
                </div>
                <div className="text-gray-600 font-medium">Activités totales</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
