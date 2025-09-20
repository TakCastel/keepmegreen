'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Crown, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface SubscriptionManagerProps {
  plan: 'premium' | 'premium-plus';
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function SubscriptionManager({ 
  plan, 
  onSuccess, 
  onError 
}: SubscriptionManagerProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpgrade = async () => {
    if (!user?.email) {
      const error = 'Vous devez être connecté pour effectuer un paiement';
      setErrorMessage(error);
      setStatus('error');
      onError?.(error);
      return;
    }

    setLoading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      // Appel de la Firebase Function
      const response = await fetch(`https://us-central1-greenme-415fa.cloudfunctions.net/createCheckoutSession?plan=${plan}&email=${encodeURIComponent(user.email)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la session de paiement');
      }

      // Rediriger vers Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de redirection manquante');
      }
      
    } catch (error: any) {
      console.error('Erreur lors de l\'upgrade:', error);
      const errorMsg = error.message || 'Une erreur est survenue';
      setErrorMessage(errorMsg);
      setStatus('error');
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getPlanInfo = () => {
    switch (plan) {
      case 'premium':
        return {
          name: 'Premium',
          price: '1,99€',
          period: 'par mois',
          color: 'amber',
          bgColor: 'from-amber-500 to-orange-500',
          hoverColor: 'hover:from-amber-600 hover:to-orange-600'
        };
      case 'premium-plus':
        return {
          name: 'Premium+',
          price: '19,99€',
          period: 'à vie',
          color: 'purple',
          bgColor: 'from-purple-500 to-purple-600',
          hoverColor: 'hover:from-purple-600 hover:to-purple-700'
        };
      default:
        return {
          name: 'Premium',
          price: '1,99€',
          period: 'par mois',
          color: 'amber',
          bgColor: 'from-amber-500 to-orange-500',
          hoverColor: 'hover:from-amber-600 hover:to-orange-600'
        };
    }
  };

  const planInfo = getPlanInfo();

  if (status === 'success') {
    return (
      <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <span className="text-green-700 font-medium">
          Redirection vers le paiement...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleUpgrade}
        disabled={loading || !user?.email}
        className={`w-full py-4 px-6 rounded-xl font-medium text-white transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none bg-gradient-to-r ${planInfo.bgColor} ${planInfo.hoverColor}`}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Préparation du paiement...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Crown className="w-5 h-5" />
            <span>Passer à {planInfo.name}</span>
          </div>
        )}
      </button>

      {status === 'error' && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-700 text-sm">
            {errorMessage}
          </span>
        </div>
      )}

      <div className="text-center">
        <p className="text-gray-500 text-sm">
          Annulation à tout moment
        </p>
      </div>
    </div>
  );
}
