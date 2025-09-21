'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StatisticsNavigationProps {
  viewType: 'weekly' | 'monthly' | 'yearly';
  setViewType: (type: 'weekly' | 'monthly' | 'yearly') => void;
  currentDate: Date;
  navigateTime: (direction: 'prev' | 'next') => void;
  formatDateRange: () => string;
  canNavigateToDate: (date: Date) => boolean;
  setCurrentDate: (date: Date) => void;
}

export default function StatisticsNavigation({
  viewType,
  setViewType,
  currentDate,
  navigateTime,
  formatDateRange,
  canNavigateToDate,
  setCurrentDate
}: StatisticsNavigationProps) {
  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-white/20">
      <div className="space-y-3">
        {/* Sélection du type de vue */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewType('weekly')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewType === 'weekly'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semaine
            </button>
            <button
              onClick={() => setViewType('monthly')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewType === 'monthly'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Mois
            </button>
            <button
              onClick={() => setViewType('yearly')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewType === 'yearly'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Année
            </button>
          </div>
          
          <div className="text-sm font-medium text-gray-600">
            {formatDateRange()}
          </div>
        </div>

        {/* Navigation temporelle */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => navigateTime('prev')}
            disabled={!canNavigateToDate(new Date(currentDate.getTime() - (viewType === 'weekly' ? 7 : viewType === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000))}
            className="flex items-center justify-center w-10 h-10 bg-white/80 hover:bg-white text-gray-700 rounded-xl border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            title="Période précédente"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex-1 text-center">
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-medium transition-colors text-sm"
            >
              Aujourd'hui
            </button>
          </div>
          
          <button
            onClick={() => navigateTime('next')}
            disabled={!canNavigateToDate(new Date(currentDate.getTime() + (viewType === 'weekly' ? 7 : viewType === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000))}
            className="flex items-center justify-center w-10 h-10 bg-white/80 hover:bg-white text-gray-700 rounded-xl border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            title="Période suivante"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
