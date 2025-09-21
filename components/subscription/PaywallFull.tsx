'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FUNCTIONS_CONFIG } from '@/lib/functions-config';
import toast from 'react-hot-toast';
import { 
  Crown, 
  Check, 
  ArrowRight
} from 'lucide-react';

interface PaywallFullProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  showComparison?: boolean;
  onUpgrade?: () => void;
}

export default function PaywallFull({
  title,
  description,
  icon: Icon,
  showComparison = true,
  onUpgrade
}: PaywallFullProps) {
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'premium-plus'>('premium');

  const handleUpgrade = async () => {
    // Si une fonction personnalisée est fournie, l'utiliser
    if (onUpgrade) {
      onUpgrade();
      return;
    }

    try {
      // Appel de la Firebase Function
      const response = await fetch(`${FUNCTIONS_CONFIG.createCheckoutSession}?plan=${selectedPlan}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Aucune URL de paiement reçue');
      }
    } catch (error) {
      console.error('Erreur lors de la création de la session Stripe:', error);
      toast.error('Erreur lors de la création de la session de paiement. Veuillez réessayer.');
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border border-gray-200 shadow-xl max-w-2xl mx-auto">
      {/* En-tête */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {title}
        </h2>
        <p className="text-gray-600">
          {description}
        </p>
      </div>

      {/* Message d'encouragement */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 mb-8 border border-emerald-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
            <Crown className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-emerald-800">
            Débloquez cette fonctionnalité
          </h3>
        </div>
        <p className="text-emerald-700">
          Passez à Premium pour accéder à toutes les fonctionnalités avancées et optimiser votre suivi.
        </p>
      </div>

      {/* Sélection du plan */}
      {showComparison && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Choisissez votre plan
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Plan Premium */}
            <div 
              className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedPlan === 'premium' 
                  ? 'border-amber-300 bg-amber-50' 
                  : 'border-gray-200 bg-white hover:border-amber-200'
              }`}
              onClick={() => setSelectedPlan('premium')}
            >
              {selectedPlan === 'premium' && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Recommandé
                  </div>
                </div>
              )}
              
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Premium</h4>
                <div className="text-3xl font-bold text-amber-600 mb-2">3,99€</div>
                <p className="text-gray-500 text-sm">par mois</p>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-gray-700">Statistiques avancées</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-gray-700">Historique complet</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-gray-700">Calendrier complet</span>
                </div>
              </div>
            </div>

            {/* Plan Premium+ */}
            <div 
              className="relative p-6 rounded-2xl border-2 border-gray-200 bg-white opacity-60 cursor-not-allowed"
            >
              {/* Badge "Prochainement" */}
              <div className="absolute -top-2 -right-2 transform rotate-12">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg">
                  Prochainement
                </div>
              </div>
              
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-400 mb-2">Premium+</h4>
                <div className="text-3xl font-bold text-gray-400 mb-2">39,99€</div>
                <p className="text-gray-400 text-sm">à vie</p>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-gray-300" />
                  <span className="text-gray-400">Tout Premium</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-gray-300" />
                  <span className="text-gray-400">Défis et badges</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-gray-300" />
                  <span className="text-gray-400">Widgets mobile</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-gray-300" />
                  <span className="text-gray-400">Mode hors-ligne</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bouton d'upgrade */}
      <div className="text-center">
        <button
          onClick={handleUpgrade}
          disabled={selectedPlan === 'premium-plus'}
          className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-medium transition-all ${
            selectedPlan === 'premium-plus'
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200'
              : selectedPlan === 'premium'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          }`}
        >
          <Crown className="w-5 h-5" />
          Passer à {selectedPlan === 'premium' ? 'Premium' : 'Premium+'}
          {selectedPlan !== 'premium-plus' && <ArrowRight className="w-5 h-5" />}
        </button>
        
        <p className="text-gray-500 text-sm mt-3">
          Annulation à tout moment
        </p>
      </div>

      {/* Lien vers la page d'abonnement */}
      <div className="text-center mt-6">
        <Link 
          href="/subscription" 
          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
        >
          Voir tous les plans et fonctionnalités →
        </Link>
      </div>
    </div>
  );
}
