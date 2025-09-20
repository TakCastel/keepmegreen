'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { 
  Crown, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  Calendar,
  Settings,
  Loader2
} from 'lucide-react';
import SubscriptionManager from './SubscriptionManager';

export default function SubscriptionStatus() {
  const { userProfile } = useAuth();
  const { subscription, loading } = useSubscription();
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!userProfile || !subscription) {
    return null;
  }

  const currentPlan = subscription.plan;
  const isPremium = currentPlan === 'premium' || currentPlan === 'premium-plus';
  const isPremiumPlus = currentPlan === 'premium-plus';

  const getPlanInfo = () => {
    switch (currentPlan) {
      case 'free':
        return {
          name: 'Gratuit',
          color: 'gray',
          icon: CheckCircle,
          description: 'Plan de base'
        };
      case 'premium':
        return {
          name: 'Premium',
          color: 'amber',
          icon: Crown,
          description: '1,99€/mois'
        };
      case 'premium-plus':
        return {
          name: 'Premium+',
          color: 'purple',
          icon: Crown,
          description: '19,99€ à vie'
        };
      default:
        return {
          name: 'Gratuit',
          color: 'gray',
          icon: CheckCircle,
          description: 'Plan de base'
        };
    }
  };

  const planInfo = getPlanInfo();
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
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
      {/* En-tête du plan actuel */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            planInfo.color === 'gray' ? 'bg-gray-100' :
            planInfo.color === 'amber' ? 'bg-gradient-to-br from-amber-400 to-orange-500' :
            'bg-gradient-to-br from-purple-500 to-purple-600'
          }`}>
            <Icon className={`w-6 h-6 ${
              planInfo.color === 'gray' ? 'text-gray-600' : 'text-white'
            }`} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Plan {planInfo.name}
            </h3>
            <p className="text-gray-600">{planInfo.description}</p>
          </div>
        </div>

        {!isPremiumPlus && (
          <button
            onClick={() => setShowUpgrade(!showUpgrade)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Gérer
          </button>
        )}
      </div>

      {/* Informations d'abonnement */}
      {isPremium && (
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Informations d'abonnement
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Début:</span>
              <span className="font-medium">
                {formatDate(userProfile.createdAt?.toDate?.()?.toISOString()) || 'N/A'}
              </span>
            </div>
            
            {userProfile.subscriptionEnds && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Renouvellement:</span>
                <span className="font-medium">
                  {formatDate(userProfile.subscriptionEnds)}
                </span>
              </div>
            )}
          </div>

          {isPremiumPlus && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-purple-800">
                <Crown className="w-4 h-4" />
                <span className="font-medium">Accès à vie</span>
              </div>
              <p className="text-purple-700 text-sm mt-1">
                Votre abonnement Premium+ est permanent et ne nécessite aucun renouvellement.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Boutons d'upgrade */}
      {showUpgrade && !isPremiumPlus && (
        <div className="border-t border-gray-200 pt-6 space-y-4">
          <h4 className="font-medium text-gray-900">Changer de plan</h4>
          
          {!isPremium && (
            <div className="space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h5 className="font-medium text-amber-900">Premium</h5>
                    <p className="text-amber-700 text-sm">1,99€ par mois</p>
                  </div>
                  <div className="text-2xl font-bold text-amber-600">1,99€</div>
                </div>
                <SubscriptionManager plan="premium" />
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h5 className="font-medium text-purple-900">Premium+</h5>
                    <p className="text-purple-700 text-sm">19,99€ à vie</p>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">19,99€</div>
                </div>
                <SubscriptionManager plan="premium-plus" />
              </div>
            </div>
          )}

          {isPremium && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h5 className="font-medium text-purple-900">Premium+</h5>
                  <p className="text-purple-700 text-sm">19,99€ à vie</p>
                </div>
                <div className="text-2xl font-bold text-purple-600">19,99€</div>
              </div>
              <SubscriptionManager plan="premium-plus" />
            </div>
          )}
        </div>
      )}

      {/* Fonctionnalités incluses */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="font-medium text-gray-900 mb-3">Fonctionnalités incluses</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-gray-700">Statistiques de base</span>
          </div>
          
          {isPremium && (
            <>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-gray-700">Statistiques avancées</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-gray-700">Historique 1 an</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-gray-700">Export des données</span>
              </div>
            </>
          )}

          {isPremiumPlus && (
            <>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600" />
                <span className="text-gray-700">Historique illimité</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600" />
                <span className="text-gray-700">Défis et badges</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600" />
                <span className="text-gray-700">Widgets mobile</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600" />
                <span className="text-gray-700">Mode hors-ligne</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
