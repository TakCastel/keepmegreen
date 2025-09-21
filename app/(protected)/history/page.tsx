'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWeekActivities, useMonthActivities, useAllActivities } from '@/hooks/useActivities';
import { StatsCardSkeleton, ChartSkeleton } from '@/components/ui/Skeleton';
import ActivityStatsCards from '@/components/history/ActivityStatsCards';
import ActivityStatsChart from '@/components/history/ActivityStatsChart';
import { BarChart3, TrendingUp, Activity, Dumbbell, Users, Utensils, Calendar, Zap } from 'lucide-react';
import { DayActivities } from '@/types';

export default function HistoryPage() {
  const { user } = useAuth();
  const [viewType, setViewType] = useState<'weekly' | 'monthly'>('weekly');
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: weeklyData = [], isLoading: weeklyLoading } = useWeekActivities(
    user?.uid, 
    currentDate
  );
  
  const { data: monthlyData = [], isLoading: monthlyLoading } = useMonthActivities(
    user?.uid, 
    currentDate
  );

  // Utiliser toutes les activités comme fallback si les données filtrées sont vides
  const { data: allActivities = [] } = useAllActivities(user?.uid);
  
  const currentData = viewType === 'weekly' ? weeklyData : monthlyData;
  const isLoading = viewType === 'weekly' ? weeklyLoading : monthlyLoading;
  
  // Filtrer les données selon la période sélectionnée
  const getFilteredData = () => {
    // Prioriser les données spécifiques à la période si disponibles
    if (currentData.length > 0) {
      return currentData;
    }
    
    // Si pas de données filtrées, filtrer manuellement toutes les activités
    const startDate = new Date(currentDate);
    const endDate = new Date(currentDate);
    
    if (viewType === 'weekly') {
      // Semaine de la date courante (lundi à dimanche)
      const dayOfWeek = currentDate.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Dimanche = 0, donc -6 pour aller au lundi
      startDate.setDate(currentDate.getDate() + mondayOffset);
      endDate.setDate(startDate.getDate() + 6); // Dimanche
    } else {
      // Mois de la date courante
      startDate.setDate(1); // 1er du mois
      endDate.setMonth(endDate.getMonth() + 1, 0); // Dernier jour du mois
    }
    
    // Normaliser les dates pour la comparaison
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    
    return allActivities.filter(activity => {
      const activityDate = new Date(activity.date);
      activityDate.setHours(12, 0, 0, 0); // Milieu de journée pour éviter les problèmes de fuseau horaire
      return activityDate >= startDate && activityDate <= endDate;
    });
  };
  
  const dataToUse = getFilteredData();

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
      const dayOfWeek = currentDate.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Dimanche = 0, donc -6 pour aller au lundi
      weekStart.setDate(currentDate.getDate() + mondayOffset);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      return `${weekStart.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${weekEnd.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    } else {
      return currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    }
  };

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="hidden md:flex w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl items-center justify-center shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl md:text-2xl font-light text-gray-800">
            Historique des <span className="font-semibold text-emerald-600">activités</span>
          </h1>
        </div>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
          Consultez l'historique de vos activités positives et analysez vos tendances
        </p>
      </div>

      {/* Navigation */}
      <div className="bg-white/70 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-white/20">
        <div className="space-y-3">
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
            </div>
            <div className="text-sm font-medium text-gray-600">
              {formatDateRange()}
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => navigateTime('prev')}
              className="flex items-center justify-center w-10 h-10 bg-white/80 hover:bg-white text-gray-700 rounded-xl border border-gray-200 transition-all shadow-sm"
            >
              ←
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
              className="flex items-center justify-center w-10 h-10 bg-white/80 hover:bg-white text-gray-700 rounded-xl border border-gray-200 transition-all shadow-sm"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      {isLoading ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <StatsCardSkeleton key={i} />
            ))}
          </div>
          <ChartSkeleton />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Cartes de statistiques */}
          <ActivityStatsCards activities={dataToUse} type={viewType} />
          
          {/* Graphiques */}
          <ActivityStatsChart activities={dataToUse} type={viewType} />
        </div>
      )}
    </div>
  );
}
