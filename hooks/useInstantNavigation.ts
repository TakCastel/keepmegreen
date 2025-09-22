'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';

/**
 * Hook pour forcer le refetch des données lors de la navigation
 * Utilisé pour s'assurer que les données sont à jour quand l'utilisateur navigue
 */
export function useInstantNavigation() {
  const queryClient = useQueryClient();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user?.uid && !loading) {
      // Invalider toutes les requêtes d'activités pour forcer un refetch
      queryClient.invalidateQueries({ 
        queryKey: ['activities'],
        exact: false // Invalider toutes les requêtes qui commencent par 'activities'
      });
    }
  }, [user?.uid, loading, queryClient]);

  return {
    invalidateActivities: () => {
      if (user?.uid) {
        queryClient.invalidateQueries({ 
          queryKey: ['activities'],
          exact: false
        });
      }
    }
  };
}