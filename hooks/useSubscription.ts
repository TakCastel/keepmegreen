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
          maxHistoryDays: 7,
          maxCalendarYears: 1,
          maxCustomCategories: 0,
          maxThemes: 1,
          hasAdvancedStats: false,
          hasDetailedBreakdown: false,
          hasExport: false,
          hasChallenges: false,
          hasMobileWidgets: false,
          hasOfflineMode: false,
          hasExclusiveResources: false,
        };
      case 'premium':
        return {
          maxHistoryDays: 365, // 1 an
          maxCalendarYears: 3,
          maxCustomCategories: 5,
          maxThemes: 5,
          hasAdvancedStats: true,
          hasDetailedBreakdown: true,
          hasExport: true,
          hasChallenges: false,
          hasMobileWidgets: false,
          hasOfflineMode: false,
          hasExclusiveResources: false,
        };
      case 'premium-plus':
        return {
          maxHistoryDays: -1, // Illimité
          maxCalendarYears: -1, // Illimité
          maxCustomCategories: -1, // Illimité
          maxThemes: -1, // Illimité
          hasAdvancedStats: true,
          hasDetailedBreakdown: true,
          hasExport: true,
          hasChallenges: true,
          hasMobileWidgets: true,
          hasOfflineMode: true,
          hasExclusiveResources: true,
        };
      default:
        return {
          maxHistoryDays: 7,
          maxCalendarYears: 1,
          maxCustomCategories: 0,
          maxThemes: 1,
          hasAdvancedStats: false,
          hasDetailedBreakdown: false,
          hasExport: false,
          hasChallenges: false,
          hasMobileWidgets: false,
          hasOfflineMode: false,
          hasExclusiveResources: false,
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
    
    return subscription.limits.maxHistoryDays === -1 || daysDiff <= subscription.limits.maxHistoryDays;
  };

  const canAccessYear = (year: number): boolean => {
    if (!subscription) return false;
    
    const currentYear = new Date().getFullYear();
    const yearsDiff = Math.abs(currentYear - year);
    
    return subscription.limits.maxCalendarYears === -1 || yearsDiff <= subscription.limits.maxCalendarYears;
  };

  const getLimits = (): SubscriptionLimits => {
    if (!subscription) {
      // Retourner les limites par défaut si pas d'abonnement
      return {
        maxHistoryDays: 7,
        maxCalendarYears: 1,
        maxCustomCategories: 0,
        maxThemes: 1,
        hasAdvancedStats: false,
        hasDetailedBreakdown: false,
        hasExport: false,
        hasChallenges: false,
        hasMobileWidgets: false,
        hasOfflineMode: false,
        hasExclusiveResources: false,
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