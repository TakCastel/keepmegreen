'use client';

import { Trash2, CheckCircle } from 'lucide-react';

interface SubscriptionActionsProps {
  isPremium: boolean;
  isPremiumPlus: boolean;
  onCancelSubscription: () => void;
}

export default function SubscriptionActions({
  isPremium,
  isPremiumPlus,
  onCancelSubscription
}: SubscriptionActionsProps) {
  return (
    <div className="border-t border-gray-200 pt-6">
      <h4 className="font-medium text-gray-900 mb-4">Gestion de l'abonnement</h4>
      
      <div className="space-y-3">
        {/* Annulation pour Premium seulement */}
        {isPremium && (
          <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl">
            <div>
              <h5 className="font-medium text-red-900">Annuler l'abonnement</h5>
              <p className="text-red-700 text-sm">
                Vous perdrez l'accès aux fonctionnalités Premium à la fin de votre période de facturation.
              </p>
            </div>
            <button
              onClick={onCancelSubscription}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Annuler
            </button>
          </div>
        )}

        {/* Information pour Premium+ */}
        {isPremiumPlus && (
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
            <div>
              <h5 className="font-medium text-green-900">Abonnement permanent</h5>
              <p className="text-green-700 text-sm">
                Votre abonnement Premium+ est permanent. Aucune action requise.
              </p>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Actif</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
