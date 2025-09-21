'use client';

import { Crown, CreditCard, Calendar, CheckCircle } from 'lucide-react';

interface SubscriptionInfoProps {
  planInfo: {
    name: string;
    color: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    isRecurring: boolean;
  };
  userProfile: any;
  isPremium: boolean;
  isPremiumPlus: boolean;
}

export default function SubscriptionInfo({
  planInfo,
  userProfile,
  isPremium,
  isPremiumPlus
}: SubscriptionInfoProps) {
  const Icon = planInfo.icon;

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            planInfo.color === 'amber' ? 'bg-gradient-to-br from-amber-400 to-orange-500' :
            'bg-gradient-to-br from-purple-500 to-purple-600'
          }`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Plan {planInfo.name}
            </h3>
            <p className="text-gray-600">{planInfo.description}</p>
          </div>
        </div>
      </div>

      {/* Statut de l'abonnement */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-4">
        <h4 className="font-medium text-gray-900 flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Statut de l'abonnement
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Début:</span>
            <span className="font-medium">
              {formatDate(userProfile.createdAt?.toDate?.()?.toISOString()) || 'N/A'}
            </span>
          </div>
          
          {isPremium && userProfile.subscriptionEnds && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Prochain paiement:</span>
              <span className="font-medium">
                {formatDate(userProfile.subscriptionEnds)}
              </span>
            </div>
          )}

          {isPremiumPlus && (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-gray-600">Statut:</span>
              <span className="font-medium text-green-600">Accès à vie</span>
            </div>
          )}
        </div>

        {/* Badge spécial pour Premium+ */}
        {isPremiumPlus && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-purple-800">
              <Crown className="w-4 h-4" />
              <span className="font-medium">Abonnement permanent</span>
            </div>
            <p className="text-purple-700 text-sm mt-1">
              Votre abonnement Premium+ est permanent et ne nécessite aucun renouvellement.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
