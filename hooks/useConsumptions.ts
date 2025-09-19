'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
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

// Hook pour obtenir les consommations d'un jour
export const useDayConsumption = (userId: string | undefined, date: string) => {
  return useQuery({
    queryKey: ['consumption', userId, date],
    queryFn: () => userId ? getDayConsumption(userId, date) : null,
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes pour les données du jour
    initialData: null, // Données initiales pour éviter le loading state
  });
};

// Hook pour obtenir les consommations d'une semaine
export const useWeekConsumptions = (userId: string | undefined, date: Date) => {
  const startDate = format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const endDate = format(endOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  
  return useQuery({
    queryKey: ['consumptions', 'week', userId, startDate, endDate],
    queryFn: () => userId ? getConsumptionsInRange(userId, startDate, endDate) : [],
    enabled: !!userId,
    initialData: [], // Données initiales pour éviter le loading state
  });
};

// Hook pour obtenir les consommations d'un mois
export const useMonthConsumptions = (userId: string | undefined, date: Date) => {
  const startDate = format(startOfMonth(date), 'yyyy-MM-dd');
  const endDate = format(endOfMonth(date), 'yyyy-MM-dd');
  
  return useQuery({
    queryKey: ['consumptions', 'month', userId, startDate, endDate],
    queryFn: () => userId ? getConsumptionsInRange(userId, startDate, endDate) : [],
    enabled: !!userId,
    initialData: [], // Données initiales pour éviter le loading state
  });
};

// Hook pour obtenir toutes les consommations
export const useAllConsumptions = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['consumptions', 'all', userId],
    queryFn: () => userId ? getAllUserConsumptions(userId) : [],
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes pour toutes les données
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
      // Invalider les requêtes liées à cette date et cet utilisateur
      queryClient.invalidateQueries({ 
        queryKey: ['consumption', variables.userId, variables.date] 
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
      // Invalider les requêtes liées à cette date et cet utilisateur
      queryClient.invalidateQueries({ 
        queryKey: ['consumption', variables.userId, variables.date] 
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
        queryKey: ['consumption', variables.userId, variables.oldDate] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['consumption', variables.userId, variables.newDate] 
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
