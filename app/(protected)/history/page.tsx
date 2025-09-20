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
import { BarChart3, User, ChevronLeft, ChevronRight, Crown, Lock } from 'lucide-react';

export default function HistoryPage() {
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

        {/* Paywall principal */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-8 md:p-12 border border-emerald-200 shadow-xl">
          <div className="text-center space-y-6">
            {/* Icône premium */}
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Crown className="w-10 h-10 text-white" />
            </div>

            {/* Titre */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Statistiques <span className="text-emerald-600">Premium</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Débloquez l'accès complet à vos statistiques détaillées, graphiques avancés et analyses de tendances
              </p>
            </div>

            {/* Fonctionnalités */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/70 rounded-2xl p-6 border border-emerald-100">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Graphiques avancés</h3>
                <p className="text-gray-600 text-sm">Courbes de tendance et histogrammes détaillés</p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-emerald-100">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <User className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Statistiques complètes</h3>
                <p className="text-gray-600 text-sm">Analyses hebdomadaires et mensuelles détaillées</p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 border border-emerald-100">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Répartition par catégorie</h3>
                <p className="text-gray-600 text-sm">Détail des consommations par type</p>
              </div>
            </div>

            {/* Bouton d'upgrade */}
            <div className="pt-6">
              <a
                href="/subscription"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Crown className="w-6 h-6" />
                Passer à Premium
              </a>
              <p className="text-sm text-gray-500 mt-3">
                À partir de 1,99€/mois • Annulation possible à tout moment
              </p>
            </div>
          </div>
        </div>

        {/* Aperçu des fonctionnalités */}
        <div className="bg-white/50 rounded-2xl p-6 border border-gray-200">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Aperçu des <span className="text-emerald-600">fonctionnalités</span>
            </h3>
            <p className="text-gray-600">Découvrez ce qui vous attend avec Premium</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Aperçu graphiques */}
            <div className="bg-white/70 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                <h4 className="font-semibold text-gray-800">Graphiques de tendance</h4>
              </div>
              <div className="h-32 bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg flex items-center justify-center">
                <div className="text-gray-500 text-sm">📊 Graphiques interactifs</div>
              </div>
            </div>

            {/* Aperçu statistiques */}
            <div className="bg-white/70 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <User className="w-5 h-5 text-emerald-600" />
                <h4 className="font-semibold text-gray-800">Statistiques détaillées</h4>
              </div>
              <div className="h-32 bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg flex items-center justify-center">
                <div className="text-gray-500 text-sm">📈 Analyses complètes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          Statistiques hebdomadaires et mensuelles avec graphiques détaillés
        </p>
      </div>

      {/* Contrôles de navigation */}
      <div className="bg-white/70 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-white/20">
        <div className="space-y-3">
          {/* Ligne 1: Semaine/Mois + Aujourd'hui */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex bg-emerald-50 rounded-xl p-1 border border-emerald-100">
              <button
                onClick={() => setViewType('weekly')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewType === 'weekly'
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md'
                    : 'text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                Semaine
              </button>
              <button
                onClick={() => setViewType('monthly')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewType === 'monthly'
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md'
                    : 'text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                Mois
              </button>
            </div>

            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              Aujourd&apos;hui
            </button>
          </div>

          {/* Ligne 2: Précédent + Date + Suivant */}
          <div className="flex items-center justify-between gap-2">
            {(() => {
              const prevDate = new Date(currentDate);
              if (viewType === 'weekly') {
                prevDate.setDate(prevDate.getDate() - 7);
              } else {
                prevDate.setMonth(prevDate.getMonth() - 1);
              }
              const isPrevDisabled = !canNavigateToDate(prevDate);
              
              return (
                <button
                  onClick={() => navigateTime('prev')}
                  disabled={isPrevDisabled}
                  className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all shadow-sm backdrop-blur-sm border ${
                    isPrevDisabled 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                      : 'bg-white/70 hover:bg-white text-gray-700 hover:shadow-md border-gray-200'
                  }`}
                  title={isPrevDisabled ? "L'historique de plus d'un an arrive bientôt" : "Période précédente"}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              );
            })()}
            
            <div className="flex-1 mx-2">
              <div className="bg-emerald-50 rounded-xl px-3 py-2 border border-emerald-100 text-center">
                <div className="text-sm font-medium text-emerald-800">
                  {formatDateRange()}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => navigateTime('next')}
              className="flex items-center justify-center w-10 h-10 bg-white/70 hover:bg-white text-gray-700 rounded-xl transition-all shadow-sm hover:shadow-md backdrop-blur-sm border border-gray-200"
              title="Période suivante"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Cartes de statistiques - seulement si l'utilisateur a accès aux stats avancées */}
      {hasAdvancedStats && (
        <>
          {!user || isLoading ? (
            <div className="hidden md:grid grid-cols-2 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <StatsCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <StatsCards consumptions={currentData} type={viewType} />
          )}
        </>
      )}

      {/* Graphiques - seulement si l'utilisateur a accès aux stats avancées */}
      {hasAdvancedStats && (
        <>
          {!user || isLoading ? (
            <ChartSkeleton />
          ) : currentData.length > 0 ? (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-light text-gray-800 mb-2">
                  Graphiques de <span className="font-semibold text-emerald-600">tendance</span>
                </h2>
                <p className="text-gray-600">Courbes d'évolution et histogrammes de vos consommations</p>
              </div>
              <StatsChart consumptions={currentData} type={viewType} />
            </div>
          ) : null}
        </>
      )}

      {/* Répartition par catégorie - seulement si l'utilisateur a accès aux stats avancées */}
      {hasAdvancedStats && (
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
                  Répartition par <span className="font-semibold text-emerald-600">catégorie</span>
                </h2>
                <p className="text-gray-600">Détail des consommations par type : alcool, cigarettes et nourriture transformée</p>
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
      )}

      {/* Message si pas de données - seulement si l'utilisateur a accès aux stats avancées */}
      {hasAdvancedStats && currentData.length === 0 && (
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
