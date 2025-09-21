'use client';

import { ReactNode } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import UpgradePrompt from './UpgradePrompt';

interface DataLimiterProps {
  children: ReactNode;
  feature: string;
  dataCount: number;
  maxCount: number;
  className?: string;
}

export default function DataLimiter({ 
  children, 
  feature, 
  dataCount, 
  maxCount, 
  className = '' 
}: DataLimiterProps) {
  const { subscription, hasAccess } = useSubscription();
  
  // Si l'utilisateur a accès illimité ou si les données sont dans la limite
  if (maxCount === -1 || dataCount <= maxCount) {
    return <>{children}</>;
  }

  // Si l'utilisateur n'a pas accès à cette fonctionnalité
  if (!hasAccess('advancedStats')) {
    return (
      <div className={className}>
        <UpgradePrompt 
          feature={feature}
          currentPlan={subscription?.plan || 'free'}
        />
      </div>
    );
  }

  // Afficher un message de limitation
  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-2xl p-6 ${className}`}>
      <div className="text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-lg">DATA</span>
        </div>
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          Limite atteinte
        </h3>
        <p className="text-blue-700 mb-4">
          Vous avez atteint la limite de {maxCount} éléments pour la version gratuite.
          <br />
          <strong>{dataCount - maxCount} éléments supplémentaires</strong> sont disponibles avec Premium.
        </p>
        <UpgradePrompt 
          feature={feature}
          currentPlan={subscription?.plan || 'free'}
        />
      </div>
    </div>
  );
}
