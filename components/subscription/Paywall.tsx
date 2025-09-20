'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Lock, 
  Crown, 
  Star, 
  Zap, 
  Check, 
  ArrowRight,
  BarChart3,
  Calendar,
  Download,
  Trophy,
  Bell,
  Wifi
} from 'lucide-react';

interface PaywallProps {
  feature: string;
  title?: string;
  description?: string;
  showComparison?: boolean;
}

export default function Paywall({ 
  feature, 
  title, 
  description, 
  showComparison = true 
}: PaywallProps) {
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'premium-plus'>('premium');

  const getFeatureInfo = (feature: string) => {
    switch (feature) {
      case 'advancedStats':
        return {
          title: 'Statistiques Avancées',
          description: 'Graphiques détaillés, comparaisons temporelles et analyses approfondies',
          icon: BarChart3,
          color: 'emerald'
        };
      case 'detailedBreakdown':
        return {
          title: 'Répartition Détaillée',
          description: 'Analyse par type de consommation avec graphiques spécialisés',
          icon: BarChart3,
          color: 'emerald'
        };
      case 'unlimitedHistory':
        return {
          title: 'Historique Illimité',
          description: 'Accédez à toutes vos données passées sans limitation de temps',
          icon: Calendar,
          color: 'emerald'
        };
      case 'fullCalendar':
        return {
          title: 'Calendrier Complet',
          description: 'Visualisez plusieurs années et naviguez dans votre historique complet',
          icon: Calendar,
          color: 'emerald'
        };
      case 'export':
        return {
          title: 'Export des Données',
          description: 'Téléchargez vos données en CSV, PDF ou image pour vos archives',
          icon: Download,
          color: 'emerald'
        };
      case 'challenges':
        return {
          title: 'Défis et Badges',
          description: 'Défis personnalisés et système de récompenses pour vous motiver',
          icon: Trophy,
          color: 'purple'
        };
      case 'mobileWidgets':
        return {
          title: 'Widgets Mobile',
          description: 'Affichez votre progression directement sur votre écran d\'accueil',
          icon: Zap,
          color: 'purple'
        };
      case 'offlineMode':
        return {
          title: 'Mode Hors-ligne',
          description: 'Synchronisation automatique quand vous retrouvez internet',
          icon: Wifi,
          color: 'purple'
        };
      case 'exclusiveResources':
        return {
          title: 'Ressources Exclusives',
          description: 'Articles, podcasts, méditations et conseils d\'experts',
          icon: Star,
          color: 'purple'
        };
      default:
        return {
          title: title || 'Fonctionnalité Premium',
          description: description || 'Cette fonctionnalité nécessite un abonnement Premium',
          icon: Lock,
          color: 'emerald'
        };
    }
  };

  const featureInfo = getFeatureInfo(feature);
  const Icon = featureInfo.icon;

  const handleUpgrade = () => {
    // Redirection vers Stripe Checkout
    window.location.href = `/api/create-checkout-session?plan=${selectedPlan}`;
  };

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border border-gray-200 shadow-xl max-w-2xl mx-auto">
      {/* En-tête */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {featureInfo.title}
        </h2>
        <p className="text-gray-600">
          {featureInfo.description}
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
                <div className="text-3xl font-bold text-amber-600 mb-2">1,99€</div>
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
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-gray-700">Export des données</span>
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
                <div className="text-3xl font-bold text-gray-400 mb-2">19,99€</div>
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
