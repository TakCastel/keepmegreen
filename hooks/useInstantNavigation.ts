'use client';

import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { format, startOfWeek, endOfWeek } from 'date-fns';

export const useInstantNavigation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const navigateInstant = (href: string) => {
    // Naviguer IMMÉDIATEMENT sans attendre les données
    router.push(href);

    // Précharger les données en arrière-plan (sans bloquer la navigation)
    if (!user?.uid) return;

    const today = format(new Date(), 'yyyy-MM-dd');
    const startOfCurrentWeek = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
    const endOfCurrentWeek = format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');

    // Précharger en arrière-plan sans attendre
    const prefetchInBackground = () => {
      // Dashboard - données du jour
      queryClient.prefetchQuery({
        queryKey: ['consumption', user.uid, today],
        staleTime: 2 * 60 * 1000,
      });

      // History - données de la semaine
      queryClient.prefetchQuery({
        queryKey: ['consumptions', 'week', user.uid, startOfCurrentWeek, endOfCurrentWeek],
        staleTime: 2 * 60 * 1000,
      });

      // Calendar - toutes les données
      queryClient.prefetchQuery({
        queryKey: ['consumptions', 'all', user.uid],
        staleTime: 5 * 60 * 1000,
      });
    };

    // Précharger en arrière-plan sans bloquer
    prefetchInBackground();
  };

  return { navigateInstant };
};
