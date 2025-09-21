'use client';

export default function SubscriptionLegal() {
  return (
    <div className="border-t border-gray-200 pt-6">
      <h4 className="font-medium text-gray-900 mb-4">Informations légales</h4>
      
      <div className="space-y-4 text-sm text-gray-600">
        <div>
          <h5 className="font-medium text-gray-800 mb-2">Conditions d'annulation</h5>
          <p>
            Vous pouvez annuler votre abonnement à tout moment. L'annulation prend effet à la fin de votre période de facturation actuelle. 
            Aucun remboursement ne sera effectué pour la période déjà payée.
          </p>
        </div>
        
        <div>
          <h5 className="font-medium text-gray-800 mb-2">Remboursements</h5>
          <p>
            Les paiements sont non remboursables. En cas d'annulation, vous conservez l'accès aux fonctionnalités Premium jusqu'à la fin de votre période de facturation.
          </p>
        </div>
        
        <div>
          <h5 className="font-medium text-gray-800 mb-2">Données personnelles</h5>
          <p>
            Vos données de consommation restent stockées même après l'annulation de votre abonnement. 
            Vous pouvez demander la suppression de vos données en nous contactant.
          </p>
        </div>
        
        <div className="pt-2">
          <p className="text-xs text-gray-500">
            En utilisant ce service, vous acceptez nos{' '}
            <a href="/cgu" className="text-emerald-600 hover:text-emerald-700 underline">
              Conditions Générales d'Utilisation
            </a>{' '}
            et notre{' '}
            <a href="/politique-confidentialite" className="text-emerald-600 hover:text-emerald-700 underline">
              Politique de Confidentialité
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
