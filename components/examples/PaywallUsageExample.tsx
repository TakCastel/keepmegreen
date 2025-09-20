'use client';

import { usePaywall } from '@/contexts/PaywallContext';
import Paywall from '@/components/subscription/Paywall';

/**
 * Exemple d'utilisation du PaywallContext
 * 
 * Ce composant montre comment utiliser le contexte PaywallContext
 * pour gérer l'affichage conditionnel du paywall dans votre application.
 */
export default function PaywallUsageExample() {
  const { showPaywall, setShowPaywall, paywallConfig, setPaywallConfig } = usePaywall();

  const handleShowPaywall = () => {
    // Configurer le paywall avec les informations spécifiques
    setPaywallConfig({
      feature: 'unlimitedHistory',
      title: 'Accès à l\'historique complet',
      description: 'Ce jour fait partie de votre historique étendu. Passez à Premium pour accéder à tous vos jours passés avec le détail complet de vos consommations.'
    });
    
    // Afficher le paywall
    setShowPaywall(true);
  };

  const handleUpgrade = () => {
    // Rediriger vers la page d'abonnement
    window.location.href = '/subscription';
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Exemple d'utilisation du PaywallContext</h2>
      
      <button
        onClick={handleShowPaywall}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Afficher le paywall
      </button>

      {/* Le paywall s'affiche conditionnellement */}
      {showPaywall && paywallConfig && (
        <div className="mt-4">
          <Paywall
            feature={paywallConfig.feature}
            title={paywallConfig.title}
            description={paywallConfig.description}
            onUpgrade={handleUpgrade}
          />
          
          <button
            onClick={() => setShowPaywall(false)}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Fermer le paywall
          </button>
        </div>
      )}
    </div>
  );
}
