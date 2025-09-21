'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CalendarDay, DayActivities } from '@/types';

interface CalendarModalContextType {
  selectedDay: CalendarDay | null;
  dayActivities: DayActivities | null;
  showPaywall: boolean;
  openModal: (day: CalendarDay, dayConsumption?: any, dayActivities?: DayActivities | null, showPaywall?: boolean) => void;
  closeModal: () => void;
}

const CalendarModalContext = createContext<CalendarModalContextType | undefined>(undefined);

export function CalendarModalProvider({ children }: { children: ReactNode }) {
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [dayActivities, setDayActivities] = useState<DayActivities | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  const openModal = (day: CalendarDay, dayConsumption?: any, dayActivities?: DayActivities | null, showPaywall: boolean = false) => {
    setSelectedDay(day);
    setDayActivities(dayActivities || null);
    setShowPaywall(showPaywall);
  };

  const closeModal = () => {
    setSelectedDay(null);
    setDayActivities(null);
    setShowPaywall(false);
  };

  return (
    <CalendarModalContext.Provider value={{
      selectedDay,
      dayActivities,
      showPaywall,
      openModal,
      closeModal
    }}>
      {children}
    </CalendarModalContext.Provider>
  );
}

export function useCalendarModal() {
  const context = useContext(CalendarModalContext);
  if (context === undefined) {
    throw new Error('useCalendarModal must be used within a CalendarModalProvider');
  }
  return context;
}
