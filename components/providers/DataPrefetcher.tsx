'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { 
  getDayConsumption, 
  getConsumptionsInRange,
  getAllUserConsumptions
} from '@/services/firestore';

export default function DataPrefetcher() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.uid) return;

    const today = format(new Date(), 'yyyy-MM-dd');
    const startOfCurrentWeek = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
    const endOfCurrentWeek = format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
    const startOfCurrentMonth = format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd');
    const endOfCurrentMonth = format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'yyyy-MM-dd');

    // Précharger les données en arrière-plan sans bloquer
    const prefetchInBackground = async () => {
      try {
        // Précharger les données du jour (dashboard)
        await queryClient.prefetchQuery({
          queryKey: ['consumption', user.uid, today],
          queryFn: () => getDayConsumption(user.uid, today),
          staleTime: 2 * 60 * 1000,
        });

        // Précharger les données de la semaine courante (statistics)
        await queryClient.prefetchQuery({
          queryKey: ['consumptions', 'week', user.uid, startOfCurrentWeek, endOfCurrentWeek],
          queryFn: () => getConsumptionsInRange(user.uid, startOfCurrentWeek, endOfCurrentWeek),
          staleTime: 2 * 60 * 1000,
        });

        // Précharger les données du mois courant (statistics)
        await queryClient.prefetchQuery({
          queryKey: ['consumptions', 'month', user.uid, startOfCurrentMonth, endOfCurrentMonth],
          queryFn: () => getConsumptionsInRange(user.uid, startOfCurrentMonth, endOfCurrentMonth),
          staleTime: 2 * 60 * 1000,
        });

        // Précharger toutes les données (calendar) avec un petit délai
        setTimeout(async () => {
          await queryClient.prefetchQuery({
            queryKey: ['consumptions', 'all', user.uid],
            queryFn: () => getAllUserConsumptions(user.uid),
            staleTime: 5 * 60 * 1000,
          });
        }, 500);
        
      } catch (error) {
        console.warn('Erreur lors du préchargement des données:', error);
      }
    };

    // Précharger en arrière-plan sans bloquer l'interface
    prefetchInBackground();
  }, [user?.uid, queryClient]);

  return null; // Ce composant ne rend rien
}
