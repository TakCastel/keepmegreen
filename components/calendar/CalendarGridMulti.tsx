'use client';

import CalendarMonth from './CalendarMonth';
import { CalendarDay as CalendarDayType } from '@/types';

interface CalendarGridMultiProps {
  monthsData: any[];
  currentMonthIndex: number;
  maxMonths: number;
  screenSize: 'mobile' | 'tablet' | 'desktop';
  displayYear: number;
  canAccessPeriod: (date: Date) => boolean;
  onDayClick: (dayData: CalendarDayType, dayActivities: any, showPaywall: boolean) => void;
  activities: any[];
}

export default function CalendarGridMulti({
  monthsData,
  currentMonthIndex,
  maxMonths,
  screenSize,
  displayYear,
  canAccessPeriod,
  onDayClick,
  activities
}: CalendarGridMultiProps) {
  return (
    <div className={`grid gap-6 ${
      screenSize === 'desktop' ? 'grid-cols-4' : 
      screenSize === 'tablet' ? 'grid-cols-3' : 
      'grid-cols-1'
    }`}>
      {Array.from({ length: maxMonths }, (_, index) => {
        const monthIndex = currentMonthIndex + index;
        const month = monthsData[monthIndex];
        
        if (!month) return null;
        
        return (
          <CalendarMonth
            key={monthIndex}
            month={month}
            displayYear={displayYear}
            canAccessPeriod={canAccessPeriod}
            onDayClick={onDayClick}
            activities={activities}
            size="small"
            showStats={true}
          />
        );
      })}
    </div>
  );
}
