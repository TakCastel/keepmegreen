'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from './useAuth';
import { FEATURE_MATRIX, getLimitsFor, Plan } from '@/constants/subscription';

export const useSubscription = () => {
  const { userProfile, getCurrentPlan, hasAccess: authHasAccess } = useAuth();
  const [subscription, setSubscription] = useState<{
    plan: Plan;
    limits: typeof FEATURE_MATRIX.free;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si le profil n'est pas encore disponible, rester en chargement
    if (!userProfile) {
      setSubscription(null);
      setLoading(true);
      return;
    }

    const currentPlan = getCurrentPlan();

    // Si le plan n'est pas encore résolu (tri-state), rester en chargement
    if (!currentPlan) {
      setSubscription(null);
      setLoading(true);
      return;
    }

    const subscriptionData = {
      plan: currentPlan as Plan,
      limits: getLimitsFor(currentPlan as Plan)
    };

    setSubscription(subscriptionData);
    setLoading(false);
  }, [userProfile, getCurrentPlan]);

  const hasAccessToFeature = (feature: string): boolean | null => {
    return authHasAccess(feature);
  };

  const canAccessPeriod = (date: Date): boolean => {
    if (!subscription) {
      return false;
    }
    
    // Normaliser les dates pour éviter les problèmes de fuseau horaire
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const daysDiff = Math.floor((today.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return subscription.limits.historyDaysAccess === -1 || daysDiff <= subscription.limits.historyDaysAccess;
  };

  const canAccessYear = (year: number): boolean => {
    if (!subscription) return false;
    
    const currentYear = new Date().getFullYear();
    const yearsDiff = Math.abs(currentYear - year);
    
    return subscription.limits.calendarYearsAccess === -1 || yearsDiff <= subscription.limits.calendarYearsAccess;
  };

  const getLimits = (): SubscriptionLimits => {
    if (!subscription) {
      // Retourner les limites par défaut si pas d'abonnement
      return {
        calendarMonthsAccess: 1,
        calendarYearsAccess: 1,
        historyDaysAccess: 7,
        advancedStats: false,
        detailedBreakdown: false,
        timeComparison: false,
        exportEnabled: false,
        exportFormats: [],
        customThemes: false,
        customCategories: false,
        smartNotifications: false,
        challenges: false,
        badges: false,
        widgets: false,
        premiumResources: false,
        offlineMode: false,
        advancedSearch: false,
      };
    }
    return subscription.limits;
  };

  return {
    subscription,
    loading,
    hasAccess: hasAccessToFeature,
    canAccessPeriod,
    canAccessYear,
    getLimits,
    isPremium: subscription?.plan === 'premium' || subscription?.plan === 'premium-plus',
    isPremiumPlus: subscription?.plan === 'premium-plus',
  };
};