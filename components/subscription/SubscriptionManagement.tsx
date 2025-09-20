'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { 
  Crown, 
  CreditCard, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Loader2,
  Trash2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ConfirmModal } from '@/components/ui/Modal';

export default function SubscriptionManagement() {
  const { userProfile } = useAuth();
  const { subscription, loading } = useSubscription();
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!userProfile || !subscription || subscription.plan === 'free') {
    return null;
  }

  const currentPlan = subscription.plan;
  const isPremium = currentPlan === 'premium';
  const isPremiumPlus = currentPlan === 'premium-plus';

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCancelSubscription = async () => {
    if (!userProfile?.stripeSubscriptionId) {
      toast.error('Aucun abonnement Stripe trouvé');
      return;
    }

    setIsCancelling(true);
    
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: userProfile.stripeSubscriptionId
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'annulation');
      }

      const result = await response.json();
      
      if (result.success) {
        toast.success('Abonnement annulé avec succès');
        setShowCancelConfirm(false);
        // Recharger la page pour mettre à jour l'état
        window.location.reload();
      } else {
        throw new Error(result.error || 'Erreur inconnue');
      }
    } catch (error: any) {
      console.error('Erreur annulation:', error);
      toast.error(error.message || 'Erreur lors de l\'annulation de l\'abonnement');
    } finally {
      setIsCancelling(false);
    }
  };

  const getPlanInfo = () => {
    switch (currentPlan) {
      case 'premium':
        return {
          name: 'Premium',
          color: 'amber',
          icon: Crown,
          description: '1,99€ par mois',
          isRecurring: true
        };
      case 'premium-plus':
        return {
          name: 'Premium+',
          color: 'purple',
          icon: Crown,
          description: '19,99€ à vie',
          isRecurring: false
        };
      default:
        return null;
    }
  };

  const planInfo = getPlanInfo();
  if (!planInfo) return null;

  const Icon = planInfo.icon;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
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

      {/* Actions de gestion */}
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
                onClick={() => setShowCancelConfirm(true)}
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

      {/* Informations légales */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="font-medium text-gray-900 mb-4">Informations légales</h4>
        
        <div className="space-y-4 text-sm text-gray-600">
          <div>
            <h5 className="font-medium text-gray-800 mb-2">Conditions d'annulation</h5>
            <p>
              Vous pouvez annuler votre abonnement à tout moment. L'annulation prend effet à la fin de votre période de facturation actuelle. 
              Aucun remboursement ne sera effectué pour la période déjà payée.
            </p>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-800 mb-2">Remboursements</h5>
            <p>
              Les paiements sont non remboursables. En cas d'annulation, vous conservez l'accès aux fonctionnalités Premium jusqu'à la fin de votre période de facturation.
            </p>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-800 mb-2">Données personnelles</h5>
            <p>
              Vos données de consommation restent stockées même après l'annulation de votre abonnement. 
              Vous pouvez demander la suppression de vos données en nous contactant.
            </p>
          </div>
          
          <div className="pt-2">
            <p className="text-xs text-gray-500">
              En utilisant ce service, vous acceptez nos{' '}
              <a href="/cgu" className="text-emerald-600 hover:text-emerald-700 underline">
                Conditions Générales d'Utilisation
              </a>{' '}
              et notre{' '}
              <a href="/politique-confidentialite" className="text-emerald-600 hover:text-emerald-700 underline">
                Politique de Confidentialité
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Modal de confirmation d'annulation */}
      <ConfirmModal
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={handleCancelSubscription}
        title="Confirmer l'annulation"
        message="Êtes-vous sûr de vouloir annuler votre abonnement Premium ? Vous perdrez l'accès aux fonctionnalités Premium à la fin de votre période de facturation actuelle. Vous conserverez vos données mais n'aurez plus accès aux statistiques avancées et au calendrier complet."
        confirmText="Confirmer l'annulation"
        cancelText="Garder l'abonnement"
        confirmVariant="danger"
        isLoading={isCancelling}
        icon={<AlertTriangle className="w-8 h-8 text-red-600" />}
      />
    </div>
  );
}
