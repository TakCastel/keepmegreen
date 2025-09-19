'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWeekConsumptions, useMonthConsumptions } from '@/hooks/useConsumptions';
import StatsCards from '@/components/history/StatsCards';
import StatsChart from '@/components/history/StatsChart';
import CategoryBreakdown from '@/components/history/CategoryBreakdown';
import { BarChart3, User } from 'lucide-react';

export default function HistoryPage() {
  const { user } = useAuth();
  const [viewType, setViewType] = useState<'weekly' | 'monthly'>('weekly');
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: weeklyData = [], isLoading: weeklyLoading } = useWeekConsumptions(
    user?.uid, 
    currentDate
  );
  
  const { data: monthlyData = [], isLoading: monthlyLoading } = useMonthConsumptions(
    user?.uid, 
    currentDate
  );

  const currentData = viewType === 'weekly' ? weeklyData : monthlyData;
  const isLoading = viewType === 'weekly' ? weeklyLoading : monthlyLoading;

  const navigateTime = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewType === 'weekly') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const formatDateRange = () => {
    if (viewType === 'weekly') {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - currentDate.getDay() + 1);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      return `${weekStart.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${weekEnd.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    } else {
      return currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-2xl w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded-2xl w-48 mx-auto"></div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white/70 rounded-3xl p-6 animate-pulse">
              <div className="h-16 bg-gray-200 rounded-2xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* En-tête */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-3xl flex items-center justify-center shadow-xl">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-light text-gray-800">
            Réflexion et <span className="font-semibold text-emerald-600">évolution</span>
          </h1>
        </div>
        <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
          Contemplez votre parcours avec compassion et observez vos patterns de conscience
        </p>
      </div>

      {/* Contrôles de navigation */}
      <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Sélecteur de vue */}
          <div className="flex bg-emerald-50 rounded-2xl p-2 border border-emerald-100">
            <button
              onClick={() => setViewType('weekly')}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                viewType === 'weekly'
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg'
                  : 'text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Semaine
            </button>
            <button
              onClick={() => setViewType('monthly')}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                viewType === 'monthly'
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg'
                  : 'text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Mois
            </button>
          </div>

          {/* Navigation temporelle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateTime('prev')}
              className="px-4 py-3 bg-white/70 hover:bg-white text-gray-700 rounded-2xl transition-all shadow-md hover:shadow-lg backdrop-blur-sm border border-gray-200"
            >
              ← Précédent
            </button>
            
            <div className="text-center min-w-[200px] bg-emerald-50 rounded-2xl px-6 py-3 border border-emerald-100">
              <div className="text-lg font-medium text-emerald-800">
                {formatDateRange()}
              </div>
            </div>
            
            <button
              onClick={() => navigateTime('next')}
              className="px-4 py-3 bg-white/70 hover:bg-white text-gray-700 rounded-2xl transition-all shadow-md hover:shadow-lg backdrop-blur-sm border border-gray-200"
            >
              Suivant →
            </button>
          </div>

          {/* Bouton pour revenir à aujourd'hui */}
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-2xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Aujourd&apos;hui
          </button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <StatsCards consumptions={currentData} type={viewType} />

      {/* Graphiques */}
      {currentData.length > 0 && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-light text-gray-800 mb-2">
              Visualisation <span className="font-semibold text-emerald-600">harmonieuse</span>
            </h2>
            <p className="text-gray-600">Observez vos patterns avec sérénité</p>
          </div>
          <StatsChart consumptions={currentData} type={viewType} />
        </div>
      )}

      {/* Répartition par catégorie */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-light text-gray-800 mb-2">
            Exploration <span className="font-semibold text-emerald-600">détaillée</span>
          </h2>
          <p className="text-gray-600">Comprenez vos habitudes avec compassion</p>
        </div>
        <CategoryBreakdown consumptions={currentData} />
      </div>

      {/* Message si pas de données */}
      {currentData.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <User className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-light text-gray-800 mb-3">
            Espace de <span className="font-semibold text-emerald-600">contemplation</span>
          </h3>
          <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
            Commencez votre voyage de conscience en enregistrant vos premières prises de conscience
          </p>
        </div>
      )}
    </div>
  );
}
