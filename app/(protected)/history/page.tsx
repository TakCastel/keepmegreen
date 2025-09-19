'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWeekConsumptions, useMonthConsumptions } from '@/hooks/useConsumptions';
import StatsCards from '@/components/history/StatsCards';
import StatsChart from '@/components/history/StatsChart';
import CategoryBreakdown from '@/components/history/CategoryBreakdown';
import { StatsCardSkeleton, ChartSkeleton } from '@/components/ui/Skeleton';
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

  // Pas de skeleton ici, on affiche la structure normale

  return (
    <div className="space-y-10">
      {/* En-tête */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-4 md:mb-6">
          <div className="hidden md:flex w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-3xl items-center justify-center shadow-xl">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-4xl font-light text-gray-800">
            Réflexion et <span className="font-semibold text-emerald-600">évolution</span>
          </h1>
        </div>
        <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
          Contemplez votre parcours avec compassion et observez vos patterns de conscience
        </p>
      </div>

      {/* Contrôles de navigation */}
      <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
        <div className="space-y-6">
          {/* Sélecteur de vue et bouton aujourd'hui */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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

            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-2xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Aujourd&apos;hui
            </button>
          </div>

          {/* Affichage de la période */}
          <div className="text-center">
            <div className="inline-block bg-emerald-50 rounded-2xl px-6 py-3 border border-emerald-100">
              <div className="text-lg font-medium text-emerald-800">
                {formatDateRange()}
              </div>
            </div>
          </div>

          {/* Navigation temporelle */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigateTime('prev')}
              className="flex-1 sm:flex-none px-4 py-3 bg-white/70 hover:bg-white text-gray-700 rounded-2xl transition-all shadow-md hover:shadow-lg backdrop-blur-sm border border-gray-200"
            >
              ← Précédent
            </button>
            
            <button
              onClick={() => navigateTime('next')}
              className="flex-1 sm:flex-none px-4 py-3 bg-white/70 hover:bg-white text-gray-700 rounded-2xl transition-all shadow-md hover:shadow-lg backdrop-blur-sm border border-gray-200"
            >
              Suivant →
            </button>
          </div>
        </div>
      </div>

      {/* Cartes de statistiques */}
      {!user || isLoading ? (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <StatsCards consumptions={currentData} type={viewType} />
      )}

      {/* Graphiques */}
      {!user || isLoading ? (
        <ChartSkeleton />
      ) : currentData.length > 0 ? (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-light text-gray-800 mb-2">
              Visualisation <span className="font-semibold text-emerald-600">harmonieuse</span>
            </h2>
            <p className="text-gray-600">Observez vos patterns avec sérénité</p>
          </div>
          <StatsChart consumptions={currentData} type={viewType} />
        </div>
      ) : null}

      {/* Répartition par catégorie */}
      <div className="space-y-8">
        <div className="text-center">
          {!user || isLoading ? (
            <>
              <div className="h-8 bg-gray-200 rounded-2xl w-64 mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-2xl w-48 mx-auto animate-pulse"></div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-light text-gray-800 mb-2">
                Exploration <span className="font-semibold text-emerald-600">détaillée</span>
              </h2>
              <p className="text-gray-600">Comprenez vos habitudes avec compassion</p>
            </>
          )}
        </div>
        {!user || isLoading ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white/70 rounded-3xl p-8 border border-gray-200 animate-pulse">
                <div className="h-16 bg-gray-200 rounded-2xl mb-6"></div>
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-6 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <CategoryBreakdown consumptions={currentData} />
        )}
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
