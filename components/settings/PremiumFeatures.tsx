'use client';

import { useSubscription } from '@/hooks/useSubscription';
import { 
  Crown, 
  Star, 
  Download, 
  Palette, 
  Trophy, 
  Bell, 
  Wifi,
  Calendar,
  BarChart3,
  Settings as SettingsIcon
} from 'lucide-react';
import Link from 'next/link';

const PREMIUM_FEATURES = [
  {
    name: 'Statistiques avancées',
    icon: BarChart3,
    description: 'Graphiques détaillés et comparaisons temporelles',
    available: true,
  },
  {
    name: 'Calendrier complet',
    icon: Calendar,
    description: 'Navigation illimitée dans les années passées',
    available: true,
  },
  {
    name: 'Défis et badges',
    icon: Trophy,
    description: 'Relevez des défis et gagnez des badges',
    available: false,
  },
  {
    name: 'Notifications intelligentes',
    icon: Bell,
    description: 'Rappels personnalisés et encouragements',
    available: false,
  },
  {
    name: 'Mode hors-ligne',
    icon: Wifi,
    description: 'Utilisez l\'app même sans connexion internet',
    available: false,
  },
];

export default function PremiumFeatures() {
  const { subscription, hasAccess } = useSubscription();

  if (!subscription || subscription.plan === 'premium-plus') {
    return null; // Pas besoin d'afficher si Premium+ ou pas d'abonnement
  }

  const getUpgradeText = () => {
    if (subscription.plan === 'free') {
      return 'Passer à Premium';
    }
    if (subscription.plan === 'premium') {
      return 'Passer à Premium+';
    }
    return '';
  };

  const getUpgradePrice = () => {
    if (subscription.plan === 'free') {
      return '3,99€/mois';
    }
    if (subscription.plan === 'premium') {
      return '39,99€ à vie';
    }
    return '';
  };

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center">
          <Crown className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-amber-800">
            Fonctionnalités Premium
          </h3>
          <p className="text-amber-700">
            Débloquez toutes les fonctionnalités avancées
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {PREMIUM_FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          const isAvailable = hasAccess('advancedStats') && feature.available;
          
          return (
            <div
              key={index}
              className={`flex items-center gap-3 p-4 rounded-2xl border ${
                isAvailable 
                  ? 'bg-white border-green-200' 
                  : 'bg-white/70 border-amber-200'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isAvailable 
                  ? 'bg-gradient-to-br from-green-400 to-green-500' 
                  : 'bg-gradient-to-br from-amber-400 to-orange-500'
              }`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className={`font-medium ${
                  isAvailable ? 'text-green-800' : 'text-amber-800'
                }`}>
                  {feature.name}
                </h4>
                <p className={`text-sm ${
                  isAvailable ? 'text-green-700' : 'text-amber-700'
                }`}>
                  {feature.description}
                </p>
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                isAvailable 
                  ? 'bg-green-100' 
                  : 'bg-amber-100'
              }`}>
                {isAvailable ? (
                  <Star className="w-4 h-4 text-green-600" />
                ) : (
                  <Crown className="w-4 h-4 text-amber-600" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <Link
          href="/subscription"
          className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-medium transition-all ${
            subscription.plan === 'premium'
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          }`}
        >
          <Crown className="w-5 h-5" />
          {getUpgradeText()} - {getUpgradePrice()}
        </Link>
        <p className="text-amber-700 text-sm mt-3">
          Annulation à tout moment
        </p>
      </div>
    </div>
  );
}
