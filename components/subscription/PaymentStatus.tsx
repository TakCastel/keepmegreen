'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, AlertCircle, Loader2, Crown, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function PaymentStatus() {
  const searchParams = useSearchParams();
  const { refreshProfile, userProfile } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'canceled' | 'error' | null>(null);
  const [message, setMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    const sessionId = searchParams.get('session_id');

    if (success === 'true' && sessionId) {
      setStatus('success');
      setMessage('Paiement réussi ! Votre abonnement a été activé.');
      // Rafraîchir automatiquement le profil après un paiement réussi
      setTimeout(() => {
        refreshProfile();
      }, 2000); // Attendre 2 secondes pour laisser le temps aux webhooks
    } else if (canceled === 'true') {
      setStatus('canceled');
      setMessage('Paiement annulé. Vous pouvez réessayer à tout moment.');
    } else {
      setStatus(null);
    }
  }, [searchParams]);

  if (!status) return null;

  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600',
          titleColor: 'text-green-800',
          textColor: 'text-green-700'
        };
      case 'canceled':
        return {
          icon: AlertCircle,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-600',
          titleColor: 'text-yellow-800',
          textColor: 'text-yellow-700'
        };
      case 'loading':
        return {
          icon: Loader2,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-800',
          textColor: 'text-blue-700'
        };
      default:
        return {
          icon: AlertCircle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600',
          titleColor: 'text-red-800',
          textColor: 'text-red-700'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`rounded-2xl border-2 ${config.borderColor} ${config.bgColor} p-6 mb-8`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${config.bgColor} border-2 ${config.borderColor}`}>
          {status === 'loading' ? (
            <Loader2 className={`w-6 h-6 ${config.iconColor} animate-spin`} />
          ) : (
            <Icon className={`w-6 h-6 ${config.iconColor}`} />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${config.titleColor} mb-1`}>
            {status === 'success' && 'Paiement réussi !'}
            {status === 'canceled' && 'Paiement annulé'}
            {status === 'loading' && 'Traitement en cours...'}
          </h3>
          <p className={config.textColor}>
            {message}
          </p>
        </div>

        {status === 'success' && (
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-green-600" />
            <span className="text-green-700 font-medium">Premium activé</span>
          </div>
        )}
      </div>

      {status === 'success' && (
        <div className="mt-4 pt-4 border-t border-green-200">
          <div className="flex items-center justify-between">
            <p className="text-green-700 text-sm">
              🎉 Félicitations ! Vous avez maintenant accès à toutes les fonctionnalités Premium.
            </p>
            <button
              onClick={async () => {
                setRefreshing(true);
                await refreshProfile();
                setRefreshing(false);
              }}
              disabled={refreshing}
              className="ml-4 flex items-center gap-2 px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Actualisation...' : 'Actualiser'}
            </button>
          </div>
          <p className="text-green-600 text-xs mt-2">
            Plan actuel : <span className="font-medium">{userProfile?.plan || 'Chargement...'}</span>
          </p>
        </div>
      )}

      {status === 'canceled' && (
        <div className="mt-4 pt-4 border-t border-yellow-200">
          <p className="text-yellow-700 text-sm">
            Vous pouvez réessayer votre paiement à tout moment. Aucun frais ne vous a été facturé.
          </p>
        </div>
      )}
    </div>
  );
}
