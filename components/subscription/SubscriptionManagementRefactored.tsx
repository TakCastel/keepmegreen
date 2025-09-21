'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { 
  Crown, 
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ConfirmModal } from '@/components/ui/Modal';
import SubscriptionInfo from './SubscriptionInfo';
import SubscriptionActions from './SubscriptionActions';
import SubscriptionLegal from './SubscriptionLegal';

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

  const handleCancelSubscription = async () => {
    if (!userProfile?.stripeSubscriptionId) {
      toast.error('Aucun abonnement Stripe trouvé');
      return;
    }

    setIsCancelling(true);
    
    try {
      const response = await fetch('https://us-central1-greenme-415fa.cloudfunctions.net/cancelSubscription', {
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
          description: '3,99€ par mois',
          isRecurring: true
        };
      case 'premium-plus':
        return {
          name: 'Premium+',
          color: 'purple',
          icon: Crown,
          description: '39,99€ à vie',
          isRecurring: false
        };
      default:
        return null;
    }
  };

  const planInfo = getPlanInfo();
  if (!planInfo) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
      {/* Informations de l'abonnement */}
      <SubscriptionInfo
        planInfo={planInfo}
        userProfile={userProfile}
        isPremium={isPremium}
        isPremiumPlus={isPremiumPlus}
      />

      {/* Actions de gestion */}
      <SubscriptionActions
        isPremium={isPremium}
        isPremiumPlus={isPremiumPlus}
        onCancelSubscription={() => setShowCancelConfirm(true)}
      />

      {/* Informations légales */}
      <SubscriptionLegal />

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
