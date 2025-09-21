'use client';

import { 
  Lock, 
  BarChart3, 
  Calendar, 
  Trophy, 
  Zap, 
  Wifi, 
  Star, 
  Search
} from 'lucide-react';
import PaywallCompact from './PaywallCompact';
import PaywallFull from './PaywallFull';

interface PaywallProps {
  feature: string;
  title?: string;
  description?: string;
  showComparison?: boolean;
  compact?: boolean;
  onUpgrade?: () => void;
}

export default function Paywall({ 
  feature, 
  title, 
  description, 
  showComparison = true,
  compact = false,
  onUpgrade
}: PaywallProps) {
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
      case 'advancedSearch':
        return {
          title: 'Recherche Avancée',
          description: 'Recherchez vos données par mois, année ou période spécifique',
          icon: Search,
          color: 'emerald'
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

  // Version compacte
  if (compact) {
    return (
      <PaywallCompact
        title={featureInfo.title}
        description={featureInfo.description}
        icon={featureInfo.icon}
        onUpgrade={onUpgrade || (() => {})}
      />
    );
  }

  // Version complète
  return (
    <PaywallFull
      title={featureInfo.title}
      description={featureInfo.description}
      icon={featureInfo.icon}
      showComparison={showComparison}
      onUpgrade={onUpgrade}
    />
  );
}
