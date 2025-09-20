'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

export default function QueryProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes - données fraîches plus longtemps
        gcTime: 30 * 60 * 1000, // 30 minutes - garde en mémoire très longtemps (renommé de cacheTime)
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: true, // Permettre le refetch au montage pour s'assurer que les données sont chargées
        refetchOnReconnect: true, // Refetch lors de la reconnexion
        // Optimisations pour la vitesse
        networkMode: 'online',
        notifyOnChangeProps: 'tracked',
      },
    },
  }));

  // Sauvegarder et restaurer le cache dans localStorage pour la persistance
  useEffect(() => {
    // Restaurer le cache au démarrage
    const restoreCache = () => {
      try {
        const cachedData = localStorage.getItem('query-cache');
        if (cachedData) {
          const queries = JSON.parse(cachedData);
          queries.forEach((query: unknown) => {
            if (query.data !== undefined) {
              queryClient.setQueryData(query.queryKey, query.data);
            }
          });
        }
      } catch (error) {
        console.warn('Impossible de restaurer le cache:', error);
      }
    };

    // Sauvegarder le cache avant de quitter
    const handleBeforeUnload = () => {
      const cache = queryClient.getQueryCache();
      const queries = cache.getAll();
      const cacheData = queries.map(query => ({
        queryKey: query.queryKey,
        data: query.state.data,
        dataUpdatedAt: query.state.dataUpdatedAt,
      }));
      
      try {
        localStorage.setItem('query-cache', JSON.stringify(cacheData));
      } catch (error) {
        console.warn('Impossible de sauvegarder le cache:', error);
      }
    };

    // Restaurer immédiatement
    restoreCache();

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
