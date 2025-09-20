'use client';

import { useSubscription } from '@/hooks/useSubscription';
import { Crown, Star, Zap } from 'lucide-react';
import Link from 'next/link';

export default function SubscriptionStatus() {
  const { subscription, hasAccess } = useSubscription();

  if (!subscription || subscription.plan === 'premium-plus') {
    return null; // Pas besoin d'afficher si Premium+ ou pas d'abonnement
  }

  const getStatusInfo = () => {
    switch (subscription.plan) {
      case 'free':
        return {
          icon: Star,
          title: 'Version gratuite',
          description: 'Accédez à toutes les fonctionnalités avec Premium',
          color: 'from-blue-500 to-blue-600',
          bgColor: 'from-blue-50 to-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
        };
      case 'premium':
        return {
          icon: Crown,
          title: 'Premium actif',
          description: 'Débloquez encore plus avec Premium+',
          color: 'from-amber-500 to-orange-500',
          bgColor: 'from-amber-50 to-orange-100',
          textColor: 'text-amber-800',
          borderColor: 'border-amber-200',
        };
      default:
        return null;
    }
  };

  const statusInfo = getStatusInfo();
  if (!statusInfo) return null;

  const Icon = statusInfo.icon;

  return (
    <div className={`bg-gradient-to-r ${statusInfo.bgColor} rounded-2xl p-6 border ${statusInfo.borderColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${statusInfo.color} rounded-xl flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${statusInfo.textColor} mb-1`}>
              {statusInfo.title}
            </h3>
            <p className={`text-sm ${statusInfo.textColor} opacity-80`}>
              {statusInfo.description}
            </p>
          </div>
        </div>
        
        <Link
          href="/subscription"
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            subscription.plan === 'premium'
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200'
              : `bg-gradient-to-r ${statusInfo.color} hover:opacity-90 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`
          }`}
        >
          {subscription.plan === 'free' ? 'Passer à Premium' : 'Passer à Premium+'}
        </Link>
      </div>
      
      {/* Fonctionnalités disponibles */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className={statusInfo.textColor}>Dashboard complet</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${hasAccess('advancedStats') ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className={statusInfo.textColor}>Statistiques avancées</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${hasAccess('advancedStats') ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className={statusInfo.textColor}>Calendrier complet</span>
          </div>
        </div>
      </div>
    </div>
  );
}
