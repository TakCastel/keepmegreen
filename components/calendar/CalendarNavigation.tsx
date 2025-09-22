'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarNavigationProps {
  currentMonthIndex: number;
  monthsData: any[];
  hasAdvancedStats: boolean;
  maxMonths: number;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  goToCurrentMonth: () => void;
}

export default function CalendarNavigation({
  currentMonthIndex,
  monthsData,
  hasAdvancedStats,
  maxMonths,
  goToPreviousMonth,
  goToNextMonth,
  goToCurrentMonth
}: CalendarNavigationProps) {
  // Déterminer le titre affiché
  const isMobileView = maxMonths === 1;
  // Sommes-nous sur la dernière fenêtre (donc les X derniers mois) ?
  const isLastWindow = hasAdvancedStats && !isMobileView && currentMonthIndex === Math.max(0, 12 - maxMonths);
  const firstIdx = currentMonthIndex;
  const lastIdx = Math.min(currentMonthIndex + maxMonths - 1, (monthsData?.length || 1) - 1);

  const title = hasAdvancedStats
    ? (isMobileView
        ? (monthsData[currentMonthIndex]?.name || 'Chargement...')
        : (isLastWindow
            ? `${maxMonths} derniers mois`
            : `${monthsData[firstIdx]?.shortName || ''} – ${monthsData[lastIdx]?.shortName || ''}`))
    : (monthsData[currentMonthIndex]?.name || 'Chargement...');

  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={goToPreviousMonth}
        disabled={currentMonthIndex === 0}
        className={`flex items-center justify-center w-12 h-12 rounded-2xl border transition-all duration-200 shadow-md backdrop-blur-sm ${
          currentMonthIndex === 0 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-white/70 text-gray-700 hover:bg-white/90'
        }`}
        title="Mois précédent"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 capitalize">
          {title}
        </h3>
        {hasAdvancedStats && (
          <button
            onClick={goToCurrentMonth}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Retour à aujourd'hui
          </button>
        )}
      </div>
      
      <button
        onClick={goToNextMonth}
        disabled={currentMonthIndex === (hasAdvancedStats ? 11 : maxMonths - 1)}
        className={`flex items-center justify-center w-12 h-12 rounded-2xl border transition-all duration-200 shadow-md backdrop-blur-sm ${
          currentMonthIndex === (hasAdvancedStats ? 11 : maxMonths - 1) 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-white/70 text-gray-700 hover:bg-white/90'
        }`}
        title="Mois suivant"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
