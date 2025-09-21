'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useWeekConsumptions, useMonthConsumptions } from '@/hooks/useConsumptions';
import StatsCards from '@/components/history/StatsCards';
import StatsChart from '@/components/history/StatsChart';
import CategoryBreakdown from '@/components/history/CategoryBreakdown';
import { StatsCardSkeleton, ChartSkeleton } from '@/components/ui/Skeleton';
import UpgradePrompt from '@/components/subscription/UpgradePrompt';
import StatisticsNavigation from '@/components/statistics/StatisticsNavigation';
import StatisticsPaywall from '@/components/statistics/StatisticsPaywall';
import { BarChart3 } from 'lucide-react';

export default function StatisticsPage() {
  const { user, userProfile, loading } = useAuth();
  const { subscription, hasAccess, loading: subscriptionLoading } = useSubscription();

  // Tous les hooks doivent être appelés avant toute logique conditionnelle
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
    
    // Vérifier si l'utilisateur premium simple peut accéder à cette date
    if (subscription?.plan === 'premium') {
      const now = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      
      // Si la nouvelle date est plus ancienne qu'un an, empêcher la navigation
      if (newDate < oneYearAgo) {
        // Afficher un message informatif
        alert("L'historique de plus d'un an arrive bientôt ! Restez connecté pour les prochaines mises à jour.");
        return;
      }
    }
    
    setCurrentDate(newDate);
  };

  // Fonction pour vérifier si la navigation vers une date spécifique est possible
  const canNavigateToDate = (date: Date) => {
    if (subscription?.plan === 'premium') {
      const now = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      return date >= oneYearAgo;
    }
    return true;
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

  // Si le profil utilisateur ou l'abonnement est encore en cours de chargement, afficher un skeleton
  if (loading || !userProfile || subscriptionLoading) {
    return (
      <div className="space-y-8">
        {/* En-tête skeleton */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="hidden md:flex w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="h-8 bg-gray-200 rounded-2xl w-64 animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded-2xl w-96 mx-auto animate-pulse"></div>
        </div>

        {/* Contrôles skeleton */}
        <div className="bg-white/70 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-white/20">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="h-10 bg-gray-200 rounded-xl w-48 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-xl w-24 animate-pulse"></div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="h-10 w-10 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-xl flex-1 mx-2 animate-pulse"></div>
              <div className="h-10 w-10 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Cartes skeleton */}
        <div className="hidden md:grid grid-cols-2 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>

        {/* Graphique skeleton */}
        <ChartSkeleton />

        {/* Répartition skeleton */}
        <div className="space-y-8">
          <div className="text-center">
            <div className="h-8 bg-gray-200 rounded-2xl w-64 mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-2xl w-48 mx-auto animate-pulse"></div>
          </div>
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
        </div>
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
      {/* En-tête */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="hidden md:flex w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl items-center justify-center shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl md:text-2xl font-light text-gray-800">
            Réflexion et <span className="font-semibold text-emerald-600">évolution</span>
          </h1>
        </div>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
          Statistiques détaillées et graphiques avancés pour analyser vos tendances
        </p>
      </div>

      {/* Navigation */}
      <StatisticsNavigation
        viewType={viewType}
        setViewType={setViewType}
        currentDate={currentDate}
        navigateTime={navigateTime}
        formatDateRange={formatDateRange}
        canNavigateToDate={canNavigateToDate}
      />

      {/* Contenu principal */}
      {isLoading ? (
        <div className="space-y-8">
          {/* Cartes skeleton */}
          <div className="hidden md:grid grid-cols-2 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <StatsCardSkeleton key={i} />
            ))}
          </div>

          {/* Graphique skeleton */}
          <ChartSkeleton />

          {/* Répartition skeleton */}
          <div className="space-y-8">
            <div className="text-center">
              <div className="h-8 bg-gray-200 rounded-2xl w-64 mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-2xl w-48 mx-auto animate-pulse"></div>
            </div>
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
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Cartes de statistiques */}
          <div className="hidden md:grid grid-cols-2 xl:grid-cols-4 gap-6">
            <StatsCards consumptions={currentData} type={viewType} />
          </div>

          {/* Graphique principal */}
          <StatsChart consumptions={currentData} type={viewType} />

          {/* Répartition par catégorie */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Répartition par catégorie
              </h2>
              <p className="text-gray-600">
                Analyse détaillée de vos activités par type
              </p>
            </div>
            <CategoryBreakdown consumptions={currentData} />
          </div>
        </div>
      )}

      {/* Prompt d'upgrade pour les utilisateurs premium simple */}
      {subscription?.plan === 'premium' && (
        <UpgradePrompt 
          feature="unlimitedHistory"
          title="Historique étendu"
          description="Accédez à plus d'un an d'historique avec Premium+"
        />
      )}
    </div>
  );
}
