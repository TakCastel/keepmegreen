'use client';

import { useState } from 'react';
import { Crown, Star, Zap, Download, Palette, Trophy, Bell, Wifi } from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscription';

interface UpgradePromptProps {
  feature: string;
  currentPlan: SubscriptionPlan;
  onUpgrade?: () => void;
  className?: string;
}

const FEATURE_ICONS = {
  'calendrier': Crown,
  'statistiques': Star,
  'export': Download,
  'personnalisation': Palette,
  'défis': Trophy,
  'notifications': Bell,
  'hors-ligne': Wifi,
};

const FEATURE_DESCRIPTIONS = {
  'calendrier': 'Accédez à votre calendrier complet avec navigation illimitée dans les années passées',
  'statistiques': 'Débloquez les statistiques avancées avec graphiques détaillés et comparaisons temporelles',
  'export': 'Exportez vos données en CSV, PDF ou image pour garder une trace de votre progression',
  'personnalisation': 'Personnalisez votre interface avec des thèmes et ajoutez vos propres catégories',
  'défis': 'Relevez des défis personnalisés et gagnez des badges pour rester motivé',
  'notifications': 'Recevez des notifications intelligentes et des encouragements personnalisés',
  'hors-ligne': 'Utilisez l\'application même sans connexion internet avec synchronisation automatique',
};

export default function UpgradePrompt({ 
  feature, 
  currentPlan, 
  onUpgrade, 
  className = '' 
}: UpgradePromptProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const Icon = FEATURE_ICONS[feature as keyof typeof FEATURE_ICONS] || Zap;
  const description = FEATURE_DESCRIPTIONS[feature as keyof typeof FEATURE_DESCRIPTIONS] || '';

  const getUpgradeMessage = () => {
    if (currentPlan === 'free') {
      return 'Débloquez cette fonctionnalité avec Premium';
    }
    if (currentPlan === 'premium') {
      return 'Accédez à cette fonctionnalité avec Premium+';
    }
    return '';
  };

  const getUpgradeButtonText = () => {
    if (currentPlan === 'free') {
      return 'Essayer Premium - 1,99€/mois';
    }
    if (currentPlan === 'premium') {
      return 'Passer à Premium+ - 19,99€ à vie';
    }
    return '';
  };

  if (currentPlan === 'premium-plus') {
    return null; // Pas besoin d'afficher si déjà au maximum
  }

  return (
    <div className={`bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-semibold text-amber-800">
              {getUpgradeMessage()}
            </h3>
          </div>
          
          <p className="text-amber-700 mb-4 leading-relaxed">
            {description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onUpgrade}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {getUpgradeButtonText()}
            </button>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-6 py-3 bg-white/70 hover:bg-white text-amber-700 rounded-xl font-medium transition-all border border-amber-200"
            >
              {isExpanded ? 'Moins de détails' : 'Plus de détails'}
            </button>
          </div>
          
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-amber-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold text-amber-800">Premium (1,99€/mois)</h4>
                  <ul className="space-y-1 text-amber-700">
                    <li>• Historique complet (1 an vs 7 jours)</li>
                    <li>• Statistiques avancées</li>
                    <li>• Calendrier complet</li>
                    <li>• Export CSV/PDF</li>
                    <li>• Thèmes personnalisés</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-amber-800">Premium+ (19,99€ à vie)</h4>
                  <ul className="space-y-1 text-amber-700">
                    <li>• Tout Premium +</li>
                    <li>• Défis et badges</li>
                    <li>• Widgets mobile</li>
                    <li>• Mode hors-ligne</li>
                    <li>• Ressources exclusives</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
