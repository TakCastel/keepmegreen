'use client';

interface CalendarControlsProps {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  hasAdvancedStats: boolean;
  displayYear: number;
  setShowYearPaywall: (show: boolean) => void;
  activeDaysPercentage: number;
}

export default function CalendarControls({
  selectedYear,
  setSelectedYear,
  hasAdvancedStats,
  displayYear,
  setShowYearPaywall,
  activeDaysPercentage
}: CalendarControlsProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="bg-white/70 text-gray-800 rounded-2xl px-4 py-3 border border-gray-200 shadow-md backdrop-blur-sm">
        {hasAdvancedStats ? (
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-transparent text-sm font-medium focus:outline-none"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{displayYear}</span>
            <button
              onClick={() => setShowYearPaywall(true)}
              className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-700 hover:text-amber-800 rounded-lg text-xs font-medium transition-colors duration-200"
              title="Changement d'année - Fonctionnalité Premium"
            >
              Premium
            </button>
          </div>
        )}
      </div>
      
      <div className="bg-blue-50 rounded-2xl px-4 py-3 border border-blue-100 text-center flex items-center justify-center">
        <div className="flex items-center gap-1">
          <div className="text-2xl font-light text-blue-700">{activeDaysPercentage}%</div>
          <div className="text-xs text-blue-600 font-medium">de jours actifs</div>
        </div>
      </div>
    </div>
  );
}
