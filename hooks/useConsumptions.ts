'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from 'date-fns';
import { 
  getDayConsumption, 
  addConsumption, 
  removeConsumption, 
  moveConsumption,
  getConsumptionsInRange,
  getAllUserConsumptions
} from '@/services/firestore';
import { 
  DayConsumption, 
  AlcoholType, 
  CigaretteType, 
  JunkfoodType 
} from '@/types';
import { useSubscription } from './useSubscription';
import { useAuth } from './useAuth';

// Hook pour obtenir les consommations d'un jour
export const useDayConsumption = (userId: string | undefined, date: string) => {
  return useQuery({
    queryKey: ['consumptions', userId, date],
    queryFn: () => userId ? getDayConsumption(userId, date) : null,
    enabled: !!userId,
    staleTime: 30 * 1000, // 30 secondes de cache pour éviter les refetch trop fréquents
    refetchOnWindowFocus: false, // Pas de refetch au focus (trop agressif)
    refetchOnMount: true, // Refetch à chaque montage
    refetchInterval: false, // Pas de refetch automatique
    initialData: null, // Données initiales pour éviter le loading state
  });
};

// Hook pour obtenir les consommations d'une semaine
export const useWeekConsumptions = (userId: string | undefined, date: Date) => {
  const { getLimits, canAccessPeriod } = useSubscription();
  const limits = getLimits();
  
  // Limiter la période selon l'abonnement
  const maxDate = limits.maxHistoryDays > 0 ? subDays(new Date(), limits.maxHistoryDays) : new Date(0);
  const startDate = format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const endDate = format(endOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  
  // Vérifier si l'utilisateur peut accéder à cette période
  const canAccess = canAccessPeriod(date);
  
  return useQuery({
    queryKey: ['consumptions', 'week', userId, startDate, endDate],
    queryFn: () => userId && canAccess ? getConsumptionsInRange(userId, startDate, endDate) : [],
    enabled: !!userId && canAccess,
    initialData: [], // Données initiales pour éviter le loading state
  });
};

// Hook pour obtenir les consommations d'un mois
export const useMonthConsumptions = (userId: string | undefined, date: Date) => {
  const { canAccessPeriod } = useSubscription();
  
  const startDate = format(startOfMonth(date), 'yyyy-MM-dd');
  const endDate = format(endOfMonth(date), 'yyyy-MM-dd');
  
  // Vérifier si l'utilisateur peut accéder à cette période
  const canAccess = canAccessPeriod(date);
  
  return useQuery({
    queryKey: ['consumptions', 'month', userId, startDate, endDate],
    queryFn: () => userId && canAccess ? getConsumptionsInRange(userId, startDate, endDate) : [],
    enabled: !!userId && canAccess,
    initialData: [], // Données initiales pour éviter le loading state
  });
};

// Hook pour obtenir toutes les consommations
export const useAllConsumptions = (userId: string | undefined) => {
  const { hasAccess } = useSubscription();
  const { userProfile, loading } = useAuth();
  
  const hasAdvancedStats = hasAccess('advancedStats');
  
  return useQuery({
    queryKey: ['consumptions', 'all', userId],
    queryFn: () => userId ? getAllUserConsumptions(userId) : [],
    enabled: !!userId && !loading && !!userProfile,
    staleTime: 0, // Pas de cache pour voir les nouvelles données immédiatement
    initialData: [], // Données initiales pour éviter le loading state
  });
};

// Hook pour ajouter une consommation
export const useAddConsumption = () => {
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
      category: 'alcohol' | 'cigarettes' | 'junkfood';
      type: AlcoholType | CigaretteType | JunkfoodType;
      quantity?: number;
    }) => addConsumption(userId, date, category, type, quantity),
    onSuccess: (_, variables) => {
      // Mise à jour optimiste du cache - ajouter directement l'élément
      const queryKey = ['consumptions', variables.userId, variables.date];
      const currentData = queryClient.getQueryData(queryKey) as DayConsumption | null;
      
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
        // Si pas de données en cache pour ce jour, créer une journée et la placer en cache immédiatement
        const newDay: DayConsumption = {
          date: variables.date,
          alcohol: variables.category === 'alcohol' ? [{
            type: variables.type as AlcoholType,
            quantity: variables.quantity || 1,
            timestamp: new Date().toISOString()
          }] : [],
          cigarettes: variables.category === 'cigarettes' ? [{
            type: variables.type as CigaretteType,
            quantity: variables.quantity || 1,
            timestamp: new Date().toISOString()
          }] : [],
          junkfood: variables.category === 'junkfood' ? [{
            type: variables.type as JunkfoodType,
            quantity: variables.quantity || 1,
            timestamp: new Date().toISOString()
          }] : []
        };

        queryClient.setQueryData(queryKey, newDay);
      }
      
      // Mise à jour optimiste de useAllConsumptions
      const allConsumptionsKey = ['consumptions', 'all', variables.userId];
      const allConsumptionsData = queryClient.getQueryData(allConsumptionsKey) as DayConsumption[] | undefined;
      
      if (allConsumptionsData) {
        // Trouver l'index de la date dans les données
        const dayIndex = allConsumptionsData.findIndex(day => day.date === variables.date);
        
        if (dayIndex !== -1) {
          // Mettre à jour la journée existante
          const updatedAllData = [...allConsumptionsData];
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
          
          queryClient.setQueryData(allConsumptionsKey, updatedAllData);
        } else {
          // Créer une nouvelle journée
          const newDay: DayConsumption = {
            date: variables.date,
            alcohol: variables.category === 'alcohol' ? [{
              type: variables.type as AlcoholType,
              quantity: variables.quantity || 1,
              timestamp: new Date().toISOString()
            }] : [],
            cigarettes: variables.category === 'cigarettes' ? [{
              type: variables.type as CigaretteType,
              quantity: variables.quantity || 1,
              timestamp: new Date().toISOString()
            }] : [],
            junkfood: variables.category === 'junkfood' ? [{
              type: variables.type as JunkfoodType,
              quantity: variables.quantity || 1,
              timestamp: new Date().toISOString()
            }] : []
          };
          
          const updatedAllData = [...allConsumptionsData, newDay].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          
          queryClient.setQueryData(allConsumptionsKey, updatedAllData);
        }
      }
      
      // Invalider les autres requêtes (plus légères)
      queryClient.invalidateQueries({ 
        queryKey: ['consumptions', 'week', variables.userId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['consumptions', 'month', variables.userId] 
      });
    },
  });
};

// Hook pour supprimer une consommation
export const useRemoveConsumption = () => {
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
      category: 'alcohol' | 'cigarettes' | 'junkfood';
      type: AlcoholType | CigaretteType | JunkfoodType;
      quantity?: number;
    }) => removeConsumption(userId, date, category, type, quantity),
    onSuccess: (_, variables) => {
      // Mise à jour optimiste du cache - supprimer directement l'élément
      const queryKey = ['consumptions', variables.userId, variables.date];
      const currentData = queryClient.getQueryData(queryKey) as DayConsumption | null;
      
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
      
      // Mise à jour optimiste de useAllConsumptions
      const allConsumptionsKey = ['consumptions', 'all', variables.userId];
      const allConsumptionsData = queryClient.getQueryData(allConsumptionsKey) as DayConsumption[] | undefined;
      
      if (allConsumptionsData) {
        // Trouver l'index de la date dans les données
        const dayIndex = allConsumptionsData.findIndex(day => day.date === variables.date);
        
        if (dayIndex !== -1) {
          // Mettre à jour la journée existante
          const updatedAllData = [...allConsumptionsData];
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
          const hasAnyConsumption = updatedAllData[dayIndex].alcohol.length > 0 || 
                                   updatedAllData[dayIndex].cigarettes.length > 0 || 
                                   updatedAllData[dayIndex].junkfood.length > 0;
          
          if (!hasAnyConsumption) {
            updatedAllData.splice(dayIndex, 1);
          }
          
          queryClient.setQueryData(allConsumptionsKey, updatedAllData);
        }
      }
      
      // Invalider les autres requêtes (plus légères)
      queryClient.invalidateQueries({ 
        queryKey: ['consumptions', 'week', variables.userId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['consumptions', 'month', variables.userId] 
      });
    },
  });
};

// Hook pour déplacer une consommation
export const useMoveConsumption = () => {
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
      category: 'alcohol' | 'cigarettes' | 'junkfood';
      type: AlcoholType | CigaretteType | JunkfoodType;
      quantity: number;
    }) => moveConsumption(userId, oldDate, newDate, category, type, quantity),
    onSuccess: (_, variables) => {
      // Invalider les requêtes liées aux deux dates et cet utilisateur
      queryClient.invalidateQueries({ 
        queryKey: ['consumptions', variables.userId, variables.oldDate] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['consumptions', variables.userId, variables.newDate] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['consumptions', 'week', variables.userId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['consumptions', 'month', variables.userId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['consumptions', 'all', variables.userId] 
      });
    },
  });
};
