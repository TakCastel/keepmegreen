'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from './useAuth';
import { SubscriptionPlan, SubscriptionLimits } from '@/types/subscription';

export const useSubscription = () => {
  const { userProfile, getCurrentPlan, hasAccess: authHasAccess } = useAuth();
  const [subscription, setSubscription] = useState<{
    plan: SubscriptionPlan;
    limits: SubscriptionLimits;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Définir les limites selon le plan (mémorisé pour éviter les recalculs)
  const getLimitsForPlan = useMemo(() => (plan: SubscriptionPlan): SubscriptionLimits => {
    switch (plan) {
      case 'free':
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
      case 'premium':
        return {
          calendarMonthsAccess: 12,
          calendarYearsAccess: 3,
          historyDaysAccess: 365,
          advancedStats: true,
          detailedBreakdown: true,
          timeComparison: true,
          exportEnabled: true,
          exportFormats: ['csv', 'pdf'],
          customThemes: true,
          customCategories: true,
          smartNotifications: true,
          challenges: false,
          badges: false,
          widgets: false,
          premiumResources: false,
          offlineMode: false,
          advancedSearch: true,
        };
      case 'premium-plus':
        return {
          calendarMonthsAccess: -1,
          calendarYearsAccess: -1,
          historyDaysAccess: -1,
          advancedStats: true,
          detailedBreakdown: true,
          timeComparison: true,
          exportEnabled: true,
          exportFormats: ['csv', 'pdf', 'image'],
          customThemes: true,
          customCategories: true,
          smartNotifications: true,
          challenges: true,
          badges: true,
          widgets: true,
          premiumResources: true,
          offlineMode: true,
          advancedSearch: true,
        };
      default:
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
  }, []);

  useEffect(() => {
    if (!userProfile) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const currentPlan = getCurrentPlan();
    const subscriptionData = {
      plan: currentPlan,
      limits: getLimitsForPlan(currentPlan)
    };

    setSubscription(subscriptionData);
    setLoading(false);
  }, [userProfile, getCurrentPlan, getLimitsForPlan]);

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