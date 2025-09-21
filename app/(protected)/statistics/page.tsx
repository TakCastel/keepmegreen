'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useWeekActivities, useMonthActivities, useYearActivities, useAllActivities } from '@/hooks/useActivities';
import { StatsCardSkeleton, ChartSkeleton } from '@/components/ui/Skeleton';
import StatisticsPaywall from '@/components/statistics/StatisticsPaywall';
import { BarChart3, TrendingUp, Target, Award, Activity, Dumbbell, Users, Utensils, Calendar, Zap } from 'lucide-react';
import { DayActivities } from '@/types';
import { getAggregatedStats, calculateDayScore, getTotalActivities, getMonthlyStatsForYear, getQuarterlyStatsForYear, getYearlyTrends } from '@/utils/stats';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

export default function StatisticsPage() {
  const { user, userProfile, loading } = useAuth();
  const { subscription, hasAccess, loading: subscriptionLoading } = useSubscription();

  // Tous les hooks doivent être appelés avant toute logique conditionnelle
  const [viewType, setViewType] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: weeklyData = [], isLoading: weeklyLoading } = useWeekActivities(
    user?.uid, 
    currentDate
  );
  
  const { data: monthlyData = [], isLoading: monthlyLoading } = useMonthActivities(
    user?.uid, 
    currentDate
  );

  const { data: yearlyData = [], isLoading: yearlyLoading } = useYearActivities(
    user?.uid, 
    currentDate
  );

  // Utiliser toutes les activités comme fallback si les données filtrées sont vides
  const { data: allActivities = [] } = useAllActivities(user?.uid);
  
  const currentData = viewType === 'weekly' ? weeklyData : viewType === 'monthly' ? monthlyData : yearlyData;
  const isLoading = viewType === 'weekly' ? weeklyLoading : viewType === 'monthly' ? monthlyLoading : yearlyLoading;
  
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
    } else if (viewType === 'monthly') {
      // Mois de la date courante
      startDate.setDate(1); // 1er du mois
      endDate.setMonth(endDate.getMonth() + 1, 0); // Dernier jour du mois
    } else {
      // Année de la date courante
      startDate.setMonth(0, 1); // 1er janvier
      endDate.setMonth(11, 31); // 31 décembre
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
    } else if (viewType === 'monthly') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else {
      newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const canNavigateToDate = (date: Date): boolean => {
    // Pour l'instant, permettre la navigation vers toutes les dates
    // On pourrait ajouter des restrictions selon l'abonnement ici
    return true;
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
    } else if (viewType === 'monthly') {
      return currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    } else {
      return currentDate.toLocaleDateString('fr-FR', { year: 'numeric' });
    }
  };

  // Si le profil utilisateur ou l'abonnement est encore en cours de chargement, afficher un skeleton
  if (loading || !userProfile || subscriptionLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="hidden md:flex w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="h-8 bg-gray-200 rounded-2xl w-64 animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded-2xl w-96 mx-auto animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>
        <ChartSkeleton />
      </div>
    );
  }

  // Vérifier le statut premium avant d'afficher le contenu
  const hasAdvancedStats = hasAccess('advancedStats');
  
  // Si l'utilisateur n'a pas accès aux statistiques avancées, afficher le paywall
  if (hasAdvancedStats === false) {
    return <StatisticsPaywall />;
  }

  return (
    <div className="space-y-8">
      {/* En-tête simplifié */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="hidden md:flex w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl items-center justify-center shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl md:text-2xl font-light text-gray-800">
            Vos <span className="font-semibold text-emerald-600">statistiques</span> premium
          </h1>
        </div>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
          Analysez vos activités positives avec des graphiques clairs et des insights personnalisés
        </p>
      </div>

      {/* Navigation simplifiée */}
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
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => navigateTime('prev')}
              disabled={!canNavigateToDate(new Date(currentDate.getTime() - (viewType === 'weekly' ? 7 : viewType === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000))}
              className="flex items-center justify-center w-10 h-10 bg-white/80 hover:bg-white text-gray-700 rounded-xl border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
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
              disabled={!canNavigateToDate(new Date(currentDate.getTime() + (viewType === 'weekly' ? 7 : viewType === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000))}
              className="flex items-center justify-center w-10 h-10 bg-white/80 hover:bg-white text-gray-700 rounded-xl border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
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
        <PremiumStatisticsContent activities={dataToUse} viewType={viewType} />
      )}
    </div>
  );
}

// Composant pour le contenu des statistiques premium
function PremiumStatisticsContent({ activities, viewType }: { activities: DayActivities[], viewType: 'weekly' | 'monthly' | 'yearly' }) {
  const stats = getAggregatedStats(activities);
  
  // Calculer les statistiques principales
  const totalActivities = stats.totalActivities;
  const averageScore = activities.length > 0 
    ? activities.reduce((sum, day) => sum + calculateDayScore(day), 0) / activities.length
    : 0;
  
  const activeDays = activities.filter(day => getTotalActivities(day) > 0).length;
  const activeDaysPercentage = activities.length > 0 ? Math.round((activeDays / activities.length) * 100) : 0;

  // Calculer la série la plus longue
  const getLongestStreak = () => {
    if (activities.length === 0) return 0;
    
    let maxStreak = 0;
    let currentStreak = 0;
    
    const sortedActivities = [...activities].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    sortedActivities.forEach(day => {
      const dayScore = calculateDayScore(day);
      if (dayScore > 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    
    return maxStreak;
  };

  const longestStreak = getLongestStreak();

  // Statistiques spécifiques à l'année
  const yearlyTrends = viewType === 'yearly' ? getYearlyTrends(activities) : null;
  const monthlyStats = viewType === 'yearly' ? getMonthlyStatsForYear(activities) : null;

  // Données pour les graphiques
  const chartData = {
    // Graphique en barres - évolution temporelle
    barData: viewType === 'yearly' ? {
      labels: getMonthlyStatsForYear(activities).map(month => month.month),
      datasets: [
        {
          label: 'Sport',
          data: getMonthlyStatsForYear(activities).map(month => month.sport),
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 0,
          borderRadius: 8,
        },
        {
          label: 'Social',
          data: getMonthlyStatsForYear(activities).map(month => month.social),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 0,
          borderRadius: 8,
        },
        {
          label: 'Nutrition',
          data: getMonthlyStatsForYear(activities).map(month => month.nutrition),
          backgroundColor: 'rgba(168, 85, 247, 0.8)',
          borderColor: 'rgb(168, 85, 247)',
          borderWidth: 0,
          borderRadius: 8,
        },
      ],
    } : {
      labels: activities.slice(0, 7).reverse().map(a => {
        const date = new Date(a.date);
        return viewType === 'weekly' 
          ? date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })
          : date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
      }),
      datasets: [
        {
          label: 'Sport',
          data: activities.slice(0, 7).reverse().map(a => 
            a.sport.reduce((sum, item) => sum + item.quantity, 0)
          ),
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 0,
          borderRadius: 8,
        },
        {
          label: 'Social',
          data: activities.slice(0, 7).reverse().map(a => 
            a.social.reduce((sum, item) => sum + item.quantity, 0)
          ),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 0,
          borderRadius: 8,
        },
        {
          label: 'Nutrition',
          data: activities.slice(0, 7).reverse().map(a => 
            a.nutrition.reduce((sum, item) => sum + item.quantity, 0)
          ),
          backgroundColor: 'rgba(168, 85, 247, 0.8)',
          borderColor: 'rgb(168, 85, 247)',
          borderWidth: 0,
          borderRadius: 8,
        },
      ],
    },
    
    // Graphique en camembert - répartition
    pieData: {
      labels: ['Sport', 'Social', 'Nutrition'],
      datasets: [
        {
          data: [stats.sport.total, stats.social.total, stats.nutrition.total],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(168, 85, 247, 0.8)',
          ],
          borderColor: [
            'rgb(34, 197, 94)',
            'rgb(59, 130, 246)',
            'rgb(168, 85, 247)',
          ],
          borderWidth: 3,
          hoverOffset: 10,
        },
      ],
    },
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14,
            weight: '600' as const,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#f9fafb',
        bodyColor: '#e5e7eb',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 12,
            weight: '500',
          },
          color: '#6b7280',
        },
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            weight: '500',
          },
          color: '#6b7280',
        },
        border: {
          display: false,
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14,
            weight: '500' as const,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 12,
      },
    },
  };

  return (
          <div className="space-y-8">
      {/* Cartes de statistiques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-6 border border-emerald-200 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-emerald-700">Total</h3>
              <p className="text-xs text-emerald-600">Activités</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-emerald-600 mb-2">
            {totalActivities}
          </div>
          <div className="text-xs text-emerald-500 bg-emerald-100 px-2 py-1 rounded-full">
            Cette période
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-6 border border-blue-200 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-blue-700">Score moyen</h3>
              <p className="text-xs text-blue-600">Points/jour</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {averageScore.toFixed(1)}
          </div>
          <div className="text-xs text-blue-500 bg-blue-100 px-2 py-1 rounded-full">
            {averageScore >= 8 ? 'Excellent!' : averageScore >= 5 ? 'Bien!' : 'Continuez!'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-6 border border-purple-200 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-purple-700">Régularité</h3>
              <p className="text-xs text-purple-600">Jours actifs</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {activeDaysPercentage}%
          </div>
          <div className="text-xs text-purple-500 bg-purple-100 px-2 py-1 rounded-full">
            {activeDaysPercentage >= 80 ? 'Très régulier' : activeDaysPercentage >= 50 ? 'Régulier' : 'À améliorer'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-6 border border-orange-200 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-orange-700">Série</h3>
              <p className="text-xs text-orange-600">Jours consécutifs</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {longestStreak}
          </div>
          <div className="text-xs text-orange-500 bg-orange-100 px-2 py-1 rounded-full">
            {longestStreak > 0 ? 'En cours!' : 'Commencez!'}
          </div>
        </div>

      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Graphique en barres */}
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Évolution des activités
            </h3>
            <p className="text-gray-600 text-sm">
              {viewType === 'yearly' 
                ? 'Répartition par catégorie sur l\'année' 
                : 'Répartition par catégorie sur les 7 derniers jours'
              }
            </p>
          </div>
          <div className="h-80">
            <Bar data={chartData.barData} options={chartOptions} />
          </div>
        </div>

        {/* Graphique en camembert */}
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Répartition par catégorie
            </h3>
            <p className="text-gray-600 text-sm">
              Distribution des activités par type
            </p>
          </div>
          <div className="h-80">
            <Doughnut data={chartData.pieData} options={pieOptions} />
          </div>
        </div>
      </div>

      {/* Stats par catégorie */}
      <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Statistiques par catégorie
          </h3>
          <p className="text-gray-600">
            Analyse détaillée de vos activités positives
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sport */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-emerald-700">Sport & Fitness</h4>
                <p className="text-sm text-emerald-600">Activités physiques</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-emerald-600 mb-2">
              {stats.sport.total}
            </div>
            <div className="text-sm text-emerald-600 mb-4">
              {Object.keys(stats.sport.breakdown).length} types différents
            </div>
            <div className="space-y-2">
              {Object.entries(stats.sport.breakdown)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center text-sm">
                    <span className="text-emerald-700">{type}</span>
                    <span className="font-semibold text-emerald-600">{count}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Social */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-blue-700">Social & Relations</h4>
                <p className="text-sm text-blue-600">Interactions sociales</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.social.total}
            </div>
            <div className="text-sm text-blue-600 mb-4">
              {Object.keys(stats.social.breakdown).length} types différents
            </div>
            <div className="space-y-2">
              {Object.entries(stats.social.breakdown)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center text-sm">
                    <span className="text-blue-700">{type}</span>
                    <span className="font-semibold text-blue-600">{count}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Nutrition */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-purple-700">Nutrition & Bien-être</h4>
                <p className="text-sm text-purple-600">Alimentation saine</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats.nutrition.total}
            </div>
            <div className="text-sm text-purple-600 mb-4">
              {Object.keys(stats.nutrition.breakdown).length} types différents
            </div>
            <div className="space-y-2">
              {Object.entries(stats.nutrition.breakdown)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center text-sm">
                    <span className="text-purple-700">{type}</span>
                    <span className="font-semibold text-purple-600">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>

        {/* Section supplémentaire pour la vue annuelle */}
        {viewType === 'yearly' && monthlyStats && (
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Statistiques mensuelles détaillées
              </h3>
              <p className="text-gray-600">
                Vue d'ensemble de vos performances par mois
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {monthlyStats.map((month, index) => (
                <div key={index} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-slate-700">{month.month}</h4>
                    <div className="text-sm text-slate-500">
                      {month.activeDays}/{month.totalDays} jours
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Total</span>
                      <span className="font-semibold text-slate-700">{month.totalActivities}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-emerald-600">Sport</span>
                        <span className="font-medium text-emerald-700">{month.sport}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-blue-600">Social</span>
                        <span className="font-medium text-blue-700">{month.social}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-purple-600">Nutrition</span>
                        <span className="font-medium text-purple-700">{month.nutrition}</span>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-slate-200">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">Score moyen</span>
                        <span className="font-semibold text-slate-700">{month.averageScore}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
