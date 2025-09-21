'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays } from 'date-fns';
import { 
  getDayActivities, 
  addActivity, 
  removeActivity, 
  moveActivity,
  getActivitiesInRange,
  getAllUserActivities,
  getAccessibleActivities
} from '@/services/activities';
import { 
  DayActivities, 
  SportType, 
  SocialType, 
  NutritionType 
} from '@/types';
import { useSubscription } from './useSubscription';
import { useAuth } from './useAuth';

// Hook pour obtenir les activités d'un jour
export const useDayActivities = (userId: string | undefined, date: string) => {
  return useQuery({
    queryKey: ['activities', userId, date],
    queryFn: () => userId ? getDayActivities(userId, date) : null,
    enabled: !!userId,
    staleTime: 30 * 1000, // 30 secondes de cache pour éviter les refetch trop fréquents
    refetchOnWindowFocus: false, // Pas de refetch au focus (trop agressif)
    refetchOnMount: true, // Refetch à chaque montage
    refetchInterval: false, // Pas de refetch automatique
    initialData: null, // Données initiales pour éviter le loading state
  });
};

// Hook pour obtenir les activités d'une semaine
export const useWeekActivities = (userId: string | undefined, date: Date) => {
  const { getLimits, canAccessPeriod } = useSubscription();
  const limits = getLimits();
  
  // Limiter la période selon l'abonnement
  const maxDate = limits.maxHistoryDays > 0 ? subDays(new Date(), limits.maxHistoryDays) : new Date(0);
  const startDate = format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const endDate = format(endOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  
  // Vérifier si l'utilisateur peut accéder à cette période
  const canAccess = canAccessPeriod(date);
  
  return useQuery({
    queryKey: ['activities', 'week', userId, startDate, endDate],
    queryFn: () => userId && canAccess ? getActivitiesInRange(userId, startDate, endDate) : [],
    enabled: !!userId && canAccess,
    initialData: [], // Données initiales pour éviter le loading state
  });
};

// Hook pour obtenir les activités d'un mois
export const useMonthActivities = (userId: string | undefined, date: Date) => {
  const { canAccessPeriod } = useSubscription();
  
  const startDate = format(startOfMonth(date), 'yyyy-MM-dd');
  const endDate = format(endOfMonth(date), 'yyyy-MM-dd');
  
  // Vérifier si l'utilisateur peut accéder à cette période
  const canAccess = canAccessPeriod(date);
  
  return useQuery({
    queryKey: ['activities', 'month', userId, startDate, endDate],
    queryFn: () => userId && canAccess ? getActivitiesInRange(userId, startDate, endDate) : [],
    enabled: !!userId && canAccess,
    initialData: [], // Données initiales pour éviter le loading state
  });
};

// Hook pour obtenir les activités d'une année
export const useYearActivities = (userId: string | undefined, date: Date) => {
  const { canAccessPeriod } = useSubscription();
  
  const startDate = format(startOfYear(date), 'yyyy-MM-dd');
  const endDate = format(endOfYear(date), 'yyyy-MM-dd');
  
  // Vérifier si l'utilisateur peut accéder à cette période
  const canAccess = canAccessPeriod(date);
  
  return useQuery({
    queryKey: ['activities', 'year', userId, startDate, endDate],
    queryFn: () => userId && canAccess ? getActivitiesInRange(userId, startDate, endDate) : [],
    enabled: !!userId && canAccess,
    initialData: [], // Données initiales pour éviter le loading state
  });
};

// Hook pour obtenir toutes les activités
export const useAllActivities = (userId: string | undefined) => {
  const { hasAccess } = useSubscription();
  const { userProfile, loading } = useAuth();
  
  const hasAdvancedStats = hasAccess('advancedStats');
  
  return useQuery({
    queryKey: ['activities', 'all', userId],
    queryFn: () => userId ? getAllUserActivities(userId) : [],
    enabled: !!userId && !loading && !!userProfile,
    staleTime: 0, // Pas de cache pour voir les nouvelles données immédiatement
    initialData: [], // Données initiales pour éviter le loading state
  });
};

// Hook pour obtenir les activités accessibles selon l'abonnement
export const useAccessibleActivities = (userId: string | undefined) => {
  const { hasAccess } = useSubscription();
  const { userProfile, loading } = useAuth();
  
  const hasAdvancedStats = hasAccess('advancedStats');
  
  return useQuery({
    queryKey: ['activities', 'accessible', userId, hasAdvancedStats],
    queryFn: () => userId ? getAccessibleActivities(userId, hasAdvancedStats) : [],
    enabled: !!userId && !loading && !!userProfile,
    staleTime: 0, // Pas de cache pour voir les nouvelles données immédiatement
    refetchOnWindowFocus: true, // Refetch quand la fenêtre reprend le focus
    refetchOnMount: true, // Refetch quand le composant se monte
    initialData: [], // Données initiales pour éviter le loading state
  });
};

// Hook pour ajouter une activité
export const useAddActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      userId,
      date,
      category,
      type,
      quantity
    }: {
      userId: string;
      date: string;
      category: 'sport' | 'social' | 'nutrition';
      type: SportType | SocialType | NutritionType;
      quantity?: number;
    }) => addActivity(userId, date, category, type, quantity),
    onSuccess: (_, variables) => {
      // Mise à jour optimiste du cache - ajouter directement l'élément
      const queryKey = ['activities', variables.userId, variables.date];
      const currentData = queryClient.getQueryData(queryKey) as DayActivities | null;
      
      if (currentData) {
        // Vérifier si l'élément existe déjà
        const existingItemIndex = (currentData[variables.category] || []).findIndex(
          item => item.type === variables.type
        );
        
        let updatedCategoryData;
        if (existingItemIndex !== -1) {
          // Incrémenter la quantité de l'élément existant
          updatedCategoryData = [...(currentData[variables.category] || [])];
          updatedCategoryData[existingItemIndex] = {
            ...updatedCategoryData[existingItemIndex],
            quantity: updatedCategoryData[existingItemIndex].quantity + (variables.quantity || 1),
            timestamp: new Date().toISOString()
          };
        } else {
          // Ajouter un nouvel élément
          const newItem = {
            type: variables.type,
            quantity: variables.quantity || 1,
            timestamp: new Date().toISOString()
          };
          updatedCategoryData = [
            ...(currentData[variables.category] || []),
            newItem
          ];
        }
        
        // Mettre à jour les données en cache
        const updatedData = {
          ...currentData,
          [variables.category]: updatedCategoryData
        };
        
        // Mettre à jour le cache immédiatement
        queryClient.setQueryData(queryKey, updatedData);
      } else {
        // Si pas de données en cache, invalider pour déclencher un refetch
        queryClient.invalidateQueries({ queryKey });
      }
      
      // Mise à jour optimiste de useAllActivities
      const allActivitiesKey = ['activities', 'all', variables.userId];
      const allActivitiesData = queryClient.getQueryData(allActivitiesKey) as DayActivities[] | undefined;
      
      if (allActivitiesData) {
        // Trouver l'index de la date dans les données
        const dayIndex = allActivitiesData.findIndex(day => day.date === variables.date);
        
        if (dayIndex !== -1) {
          // Mettre à jour la journée existante
          const updatedAllData = [...allActivitiesData];
          const dayData = updatedAllData[dayIndex];
          
          // Vérifier si l'élément existe déjà
          const existingItemIndex = (dayData[variables.category] || []).findIndex(
            item => item.type === variables.type
          );
          
          let updatedCategoryData;
          if (existingItemIndex !== -1) {
            // Incrémenter la quantité de l'élément existant
            updatedCategoryData = [...(dayData[variables.category] || [])];
            updatedCategoryData[existingItemIndex] = {
              ...updatedCategoryData[existingItemIndex],
              quantity: updatedCategoryData[existingItemIndex].quantity + (variables.quantity || 1),
              timestamp: new Date().toISOString()
            };
          } else {
            // Ajouter un nouvel élément
            const newItem = {
              type: variables.type,
              quantity: variables.quantity || 1,
              timestamp: new Date().toISOString()
            };
            updatedCategoryData = [
              ...(dayData[variables.category] || []),
              newItem
            ];
          }
          
          updatedAllData[dayIndex] = {
            ...dayData,
            [variables.category]: updatedCategoryData
          };
          
          queryClient.setQueryData(allActivitiesKey, updatedAllData);
        } else {
          // Créer une nouvelle journée
          const newDay: DayActivities = {
            date: variables.date,
            sport: variables.category === 'sport' ? [{
              type: variables.type as SportType,
              quantity: variables.quantity || 1,
              timestamp: new Date().toISOString()
            }] : [],
            social: variables.category === 'social' ? [{
              type: variables.type as SocialType,
              quantity: variables.quantity || 1,
              timestamp: new Date().toISOString()
            }] : [],
            nutrition: variables.category === 'nutrition' ? [{
              type: variables.type as NutritionType,
              quantity: variables.quantity || 1,
              timestamp: new Date().toISOString()
            }] : []
          };
          
          const updatedAllData = [...allActivitiesData, newDay].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          
          queryClient.setQueryData(allActivitiesKey, updatedAllData);
        }
      }
      
      // Invalider les autres requêtes (plus légères)
      queryClient.invalidateQueries({ 
        queryKey: ['activities', 'week', variables.userId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['activities', 'month', variables.userId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['activities', 'accessible', variables.userId] 
      });
      
      // Forcer le refetch immédiat pour le calendrier
      queryClient.refetchQueries({ 
        queryKey: ['activities', 'accessible', variables.userId] 
      });
    },
  });
};

// Hook pour supprimer une activité
export const useRemoveActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      userId,
      date,
      category,
      type,
      quantity
    }: {
      userId: string;
      date: string;
      category: 'sport' | 'social' | 'nutrition';
      type: SportType | SocialType | NutritionType;
      quantity?: number;
    }) => removeActivity(userId, date, category, type, quantity),
    onSuccess: (_, variables) => {
      // Mise à jour optimiste du cache - supprimer directement l'élément
      const queryKey = ['activities', variables.userId, variables.date];
      const currentData = queryClient.getQueryData(queryKey) as DayActivities | null;
      
      if (currentData) {
        // Trouver l'élément à modifier
        const existingItemIndex = (currentData[variables.category] || []).findIndex(
          item => item.type === variables.type
        );
        
        let updatedCategoryData;
        if (existingItemIndex !== -1) {
          // Décrémenter la quantité de l'élément existant
          updatedCategoryData = [...(currentData[variables.category] || [])];
          const newQuantity = updatedCategoryData[existingItemIndex].quantity - (variables.quantity || 1);
          
          if (newQuantity <= 0) {
            // Supprimer l'élément si la quantité devient 0 ou négative
            updatedCategoryData = updatedCategoryData.filter((_, index) => index !== existingItemIndex);
          } else {
            // Mettre à jour la quantité
            updatedCategoryData[existingItemIndex] = {
              ...updatedCategoryData[existingItemIndex],
              quantity: newQuantity,
              timestamp: new Date().toISOString()
            };
          }
        } else {
          updatedCategoryData = currentData[variables.category] || [];
        }
        
        // Mettre à jour les données en cache
        const updatedData = {
          ...currentData,
          [variables.category]: updatedCategoryData
        };
        
        // Mettre à jour le cache immédiatement
        queryClient.setQueryData(queryKey, updatedData);
      }
      
      // Mise à jour optimiste de useAllActivities
      const allActivitiesKey = ['activities', 'all', variables.userId];
      const allActivitiesData = queryClient.getQueryData(allActivitiesKey) as DayActivities[] | undefined;
      
      if (allActivitiesData) {
        // Trouver l'index de la date dans les données
        const dayIndex = allActivitiesData.findIndex(day => day.date === variables.date);
        
        if (dayIndex !== -1) {
          // Mettre à jour la journée existante
          const updatedAllData = [...allActivitiesData];
          const dayData = updatedAllData[dayIndex];
          
          // Trouver l'élément à modifier
          const existingItemIndex = (dayData[variables.category] || []).findIndex(
            item => item.type === variables.type
          );
          
          let updatedCategoryData;
          if (existingItemIndex !== -1) {
            // Décrémenter la quantité de l'élément existant
            updatedCategoryData = [...(dayData[variables.category] || [])];
            const newQuantity = updatedCategoryData[existingItemIndex].quantity - (variables.quantity || 1);
            
            if (newQuantity <= 0) {
              // Supprimer l'élément si la quantité devient 0 ou négative
              updatedCategoryData = updatedCategoryData.filter((_, index) => index !== existingItemIndex);
            } else {
              // Mettre à jour la quantité
              updatedCategoryData[existingItemIndex] = {
                ...updatedCategoryData[existingItemIndex],
                quantity: newQuantity,
                timestamp: new Date().toISOString()
              };
            }
          } else {
            updatedCategoryData = dayData[variables.category] || [];
          }
          
          updatedAllData[dayIndex] = {
            ...dayData,
            [variables.category]: updatedCategoryData
          };
          
          // Supprimer la journée si elle est vide
          const hasAnyActivity = updatedAllData[dayIndex].sport.length > 0 || 
                                   updatedAllData[dayIndex].social.length > 0 || 
                                   updatedAllData[dayIndex].nutrition.length > 0;
          
          if (!hasAnyActivity) {
            updatedAllData.splice(dayIndex, 1);
          }
          
          queryClient.setQueryData(allActivitiesKey, updatedAllData);
        }
      }
      
      // Invalider les autres requêtes (plus légères)
      queryClient.invalidateQueries({ 
        queryKey: ['activities', 'week', variables.userId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['activities', 'month', variables.userId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['activities', 'accessible', variables.userId] 
      });
      
      // Forcer le refetch immédiat pour le calendrier
      queryClient.refetchQueries({ 
        queryKey: ['activities', 'accessible', variables.userId] 
      });
    },
  });
};

// Hook pour déplacer une activité
export const useMoveActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      userId,
      oldDate,
      newDate,
      category,
      type,
      quantity
    }: {
      userId: string;
      oldDate: string;
      newDate: string;
      category: 'sport' | 'social' | 'nutrition';
      type: SportType | SocialType | NutritionType;
      quantity: number;
    }) => moveActivity(userId, oldDate, newDate, category, type, quantity),
    onSuccess: (_, variables) => {
      // Invalider les requêtes liées aux deux dates et cet utilisateur
      queryClient.invalidateQueries({ 
        queryKey: ['activities', variables.userId, variables.oldDate] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['activities', variables.userId, variables.newDate] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['activities', 'week', variables.userId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['activities', 'month', variables.userId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['activities', 'all', variables.userId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['activities', 'accessible', variables.userId] 
      });
      
      // Forcer le refetch immédiat pour le calendrier
      queryClient.refetchQueries({ 
        queryKey: ['activities', 'accessible', variables.userId] 
      });
    },
  });
};
