'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { updateUserSubscription } from '@/lib/firestore';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';

export default function PaymentVerifier() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [status, setStatus] = useState<'checking' | 'success' | 'error' | 'none'>('checking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');
      const success = searchParams.get('success');

      if (success === 'true' && sessionId && user) {
        try {
          // Vérifier le paiement avec Stripe
          const response = await fetch('https://us-central1-greenme-415fa.cloudfunctions.net/verifyPayment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId })
          });

          const data = await response.json();

          if (data.success) {
            // Mettre à jour l'abonnement côté client
            await updateUserSubscription(
              user.uid, 
              data.plan as 'premium' | 'premium-plus'
            );
            
            setStatus('success');
            setMessage('Paiement vérifié et abonnement activé !');
            
            // Rafraîchir la page après 2 secondes
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            setStatus('error');
            setMessage('Paiement non confirmé');
          }
        } catch (error) {
          console.error('Erreur vérification:', error);
          setStatus('error');
          setMessage('Erreur lors de la vérification');
        }
      } else {
        setStatus('none');
      }
    };

    verifyPayment();
  }, [searchParams, user]);

  if (status === 'none') return null;

  return (
    <div className={`rounded-2xl border-2 p-6 mb-8 ${
      status === 'success' ? 'border-green-200 bg-green-50' :
      status === 'error' ? 'border-red-200 bg-red-50' :
      'border-blue-200 bg-blue-50'
    }`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          status === 'success' ? 'bg-green-100' :
          status === 'error' ? 'bg-red-100' :
          'bg-blue-100'
        }`}>
          {status === 'checking' ? (
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          ) : status === 'success' ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <AlertCircle className="w-6 h-6 text-red-600" />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${
            status === 'success' ? 'text-green-800' :
            status === 'error' ? 'text-red-800' :
            'text-blue-800'
          }`}>
            {status === 'checking' && 'Vérification du paiement...'}
            {status === 'success' && 'Paiement confirmé !'}
            {status === 'error' && 'Erreur de vérification'}
          </h3>
          <p className={`${
            status === 'success' ? 'text-green-700' :
            status === 'error' ? 'text-red-700' :
            'text-blue-700'
          }`}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
