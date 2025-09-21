'use client';

import { useCalendarModal } from '@/contexts/CalendarModalContext';
import CalendarDayModal from './CalendarDayModal';

export default function GlobalCalendarModal() {
  const { selectedDay, dayConsumption, dayActivities, showPaywall, closeModal } = useCalendarModal();

  if (!selectedDay) {
    return null;
  }

  return (
    <CalendarDayModal
      day={selectedDay}
      dayConsumption={dayConsumption}
      dayActivities={dayActivities}
      onClose={closeModal}
      showPaywall={showPaywall}
    />
  );
}
