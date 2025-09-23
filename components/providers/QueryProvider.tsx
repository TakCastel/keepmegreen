'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

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

  // Persistance officielle via TanStack
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const persister = createSyncStoragePersister({
      storage: window.localStorage,
      key: 'rq-cache',
      throttleTime: 1000,
    });
    persistQueryClient({
      queryClient,
      persister,
      maxAge: 30 * 60 * 1000,
      dehydrateOptions: {
        shouldDehydrateQuery: (query) => {
          // éviter de persister les queries en erreur
          return query.state.status === 'success';
        },
      },
    });
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
