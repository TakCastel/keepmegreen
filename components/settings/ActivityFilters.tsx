'use client';

import { Calendar, Search } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ActivityFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  hasAdvancedSearch: boolean;
  setShowSearchPaywall: (show: boolean) => void;
  presetDate?: string;
}

export default function ActivityFilters({
  searchTerm,
  setSearchTerm,
  selectedDate,
  setSelectedDate,
  hasAdvancedSearch,
  setShowSearchPaywall,
  presetDate
}: ActivityFiltersProps) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Filtres</h3>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rechercher par date
            {!hasAdvancedSearch && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                Premium
              </span>
            )}
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                if (!hasAdvancedSearch && e.target.value) {
                  return;
                }
                setSearchTerm(e.target.value);
              }}
              onClick={() => {
                if (!hasAdvancedSearch) {
                  setShowSearchPaywall(true);
                }
              }}
              placeholder={hasAdvancedSearch ? "Ex: septembre, 2024, 09, ou 2024-09-15..." : "Recherche avancée - Premium requis"}
              className={`w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition-all ${
                !hasAdvancedSearch ? 'cursor-pointer hover:border-amber-300' : ''
              }`}
              readOnly={!hasAdvancedSearch}
            />
          </div>
          {!hasAdvancedSearch && (
            <p className="text-xs text-gray-500 mt-1">
              Passez à Premium pour rechercher par mois, année ou période
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date spécifique
            {presetDate && (
              <span className="ml-2 px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                {format(new Date(presetDate), 'dd MMMM yyyy', { locale: fr })} présélectionnée
              </span>
            )}
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition-all ${
                presetDate 
                  ? 'border-slate-400 bg-slate-50' 
                  : 'border-gray-300'
              }`}
            />
          </div>
        </div>
      </div>
      
      {(searchTerm || selectedDate) && (
        <div className="mt-4">
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedDate('');
            }}
            className="text-slate-600 hover:text-slate-800 text-sm font-medium transition-colors"
         >
            Effacer les filtres
          </button>
        </div>
      )}
    </div>
  );
}


