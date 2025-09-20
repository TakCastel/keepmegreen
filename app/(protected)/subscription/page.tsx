'use client';

import { useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { Crown, Check, Zap, ChevronDown, AlertTriangle, Loader2, BarChart3 } from 'lucide-react';
import PaymentStatus from '@/components/subscription/PaymentStatus';
import SubscriptionManagement from '@/components/subscription/SubscriptionManagement';
import { ConfirmModal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';

export default function SubscriptionPage() {
  const { subscription, loading } = useSubscription();
  const { user, userProfile, loading: authLoading } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'lifetime'>('monthly');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showDowngradeConfirm, setShowDowngradeConfirm] = useState(false);
  const [isDowngrading, setIsDowngrading] = useState(false);

  // Si les données sont encore en cours de chargement, afficher un skeleton complet
  if (loading || authLoading || !userProfile) {
    return (
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Skeleton pour PaymentStatus */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>

        {/* Skeleton pour l'en-tête */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-2xl animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
        </div>

        {/* Skeleton pour les plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 border border-gray-200 animate-pulse">
              <div className="text-center space-y-4">
                <div className="h-6 bg-gray-200 rounded w-24 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
                <div className="h-8 bg-gray-200 rounded w-16 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
                <div className="space-y-3 pt-4">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                      <div className="h-4 bg-gray-200 rounded flex-1"></div>
                    </div>
                  ))}
                </div>
                <div className="pt-6">
                  <div className="h-12 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Skeleton pour la FAQ */}
        <div className="space-y-8">
          <div className="text-center">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentPlan = subscription?.plan || 'free';

  const plans = [
    {
      id: 'free',
      name: 'Gratuit',
      price: '0€',
      period: 'Pour toujours',
      description: 'Fonctionnalités de base',
      features: [
        'Statistiques de base',
        'Historique 7 jours',
        'Calendrier du mois',
      ],
      buttonText: currentPlan === 'free' ? 'Plan actuel' : 'Rétrograder',
      buttonStyle: 'bg-gray-100 text-gray-600',
      popular: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '1,99€',
      period: 'par mois',
      description: 'Toutes les fonctionnalités',
      features: [
        'Statistiques avancées',
        'Historique 1 an',
        'Calendrier complet',
        'Répartition détaillée',
      ],
      buttonText: currentPlan === 'free' ? 'Passer à Premium' : currentPlan === 'premium' ? 'Plan actuel' : 'Changer de plan',
      buttonStyle: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white',
      popular: true,
    },
    {
      id: 'premium-plus',
      name: 'Premium+',
      price: '19,99€',
      period: 'à vie',
      description: 'Accès complet',
      features: [
        'Toutes les fonctionnalités Premium',
        'Historique illimité',
        'Calendrier illimité',
        'Défis et badges',
        'Widgets mobile',
        'Mode hors-ligne',
        'Ressources exclusives',
      ],
      buttonText: 'Prochainement',
      buttonStyle: 'bg-gray-100 text-gray-500 cursor-not-allowed',
      popular: false,
      disabled: true,
    },
  ];

  const handleUpgrade = async (plan: 'premium' | 'premium-plus') => {
    // Vérifier que l'utilisateur est connecté et a un email
    if (!user?.email) {
      alert('Vous devez être connecté pour effectuer un paiement');
      return;
    }
    
    try {
      // Appel de la Firebase Function
      const response = await fetch(`https://createcheckoutsession-utblwfn7oa-uc.a.run.app?plan=${plan}&email=${encodeURIComponent(user.email)}`);
      
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

  const handleDowngrade = async () => {
    if (!user?.email) {
      alert('Vous devez être connecté pour modifier votre abonnement');
      return;
    }

    setIsDowngrading(true);

    try {
      // TODO: Créer une Firebase Function pour le downgrade
      const response = await fetch('https://us-central1-greenme-415fa.cloudfunctions.net/downgradeSubscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la rétrogradation');
      }

      const result = await response.json();
      
      if (result.success) {
        alert('Abonnement rétrogradé avec succès ! Vous avez maintenant accès au plan Gratuit.');
        setShowDowngradeConfirm(false);
        window.location.reload();
      } else {
        throw new Error(result.error || 'Erreur inconnue');
      }
    } catch (error: any) {
      console.error('Erreur rétrogradation:', error);
      alert(error.message || 'Erreur lors de la rétrogradation de l\'abonnement');
    } finally {
      setIsDowngrading(false);
    }
  };

  const faqData = [
    {
      question: "Puis-je annuler à tout moment ?",
      answer: "Oui, vous pouvez annuler votre abonnement mensuel à tout moment. L'accès Premium+ à vie est permanent."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Absolument. Vos données sont chiffrées et stockées de manière sécurisée."
    },
    {
      question: "Que se passe-t-il si je passe à Premium+ ?",
      answer: "Premium+ est actuellement en développement. Vous obtiendrez accès à toutes les fonctionnalités avancées : défis, widgets mobile, mode hors-ligne et ressources exclusives dès sa sortie."
    },
    {
      question: "Puis-je changer de plan ?",
      answer: "Premium+ est en développement. Vous pourrez passer de Premium à Premium+ dès sa sortie."
    },
    {
      question: "Les prix incluent-ils les taxes ?",
      answer: "Les prix affichés sont TTC. Aucun frais supplémentaire ne sera ajouté."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      {/* Statut de paiement */}
      <PaymentStatus />

      {/* Contenu différent selon le plan */}
      {currentPlan === 'free' ? (
        <>
          {/* En-tête pour utilisateurs gratuits */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Choisissez votre plan
              </h1>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Débloquez toutes les fonctionnalités pour un suivi complet de vos consommations
            </p>
          </div>

          {/* Plans d'abonnement pour utilisateurs gratuits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-3xl p-8 shadow-lg transition-all duration-300 flex flex-col ${
                  plan.popular
                    ? 'ring-2 ring-emerald-500 scale-105'
                    : plan.disabled
                    ? 'border border-gray-200 opacity-75'
                    : 'border border-gray-200 hover:shadow-xl'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                      Recommandé
                    </div>
                  </div>
                )}
                

                {/* Badge "Prochainement" pour Premium+ */}
                {plan.id === 'premium-plus' && plan.disabled && (
                  <div className="absolute -top-2 -right-2 transform rotate-12">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg">
                      Prochainement
                    </div>
                  </div>
                )}

                <div className="text-center space-y-4 flex-1 flex flex-col">
                  <div>
                    <h3 className={`text-2xl font-bold ${plan.disabled ? 'text-gray-400' : 'text-gray-900'}`}>{plan.name}</h3>
                    <p className={`${plan.disabled ? 'text-gray-400' : 'text-gray-600'}`}>{plan.description}</p>
                  </div>

                  <div className="space-y-2">
                    <div className={`text-4xl font-bold ${plan.disabled ? 'text-gray-400' : 'text-gray-900'}`}>{plan.price}</div>
                    <div className={`${plan.disabled ? 'text-gray-400' : 'text-gray-500'}`}>{plan.period}</div>
                  </div>

                  <div className="space-y-3 pt-4 flex-1">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.disabled ? 'bg-gray-300' : 'bg-emerald-500'}`}>
                          <Check className={`w-3 h-3 ${plan.disabled ? 'text-gray-500' : 'text-white'}`} />
                        </div>
                        <span className={`${plan.disabled ? 'text-gray-400' : 'text-gray-700'}`}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-auto">
                  <button
                    onClick={() => {
                      if (plan.id === 'premium') handleUpgrade('premium');
                      if (plan.id === 'premium-plus' && !plan.disabled) handleUpgrade('premium-plus');
                      if (plan.id === 'free' && currentPlan !== 'free') setShowDowngradeConfirm(true);
                    }}
                    disabled={plan.disabled}
                    className={`w-full py-3 px-6 rounded-xl font-medium transition-all ${
                      plan.disabled
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200'
                        : plan.buttonStyle + ' shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* En-tête pour utilisateurs premium */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestion de votre abonnement
              </h1>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Gérez votre abonnement Premium et accédez à toutes les fonctionnalités avancées
            </p>
          </div>

          {/* Gestion d'abonnement pour les utilisateurs Premium */}
          <SubscriptionManagement />

          {/* Bouton Premium+ pour les utilisateurs Premium */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl p-8 border border-purple-200">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Premium+ en préparation
                </h2>
              </div>
              
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Nous travaillons sur ces fonctionnalités avancées. La sortie dépendra de notre temps de développement disponible.
              </p>

              {/* Fonctionnalités Premium+ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/70 rounded-2xl p-6 border border-purple-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Défis & Badges</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Défis personnalisés, système de badges et récompenses pour maintenir votre motivation
                  </p>
                </div>

                <div className="bg-white/70 rounded-2xl p-6 border border-purple-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Crown className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Widgets Mobile</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Widgets iOS/Android pour un suivi rapide directement depuis votre écran d'accueil
                  </p>
                </div>

                <div className="bg-white/70 rounded-2xl p-6 border border-purple-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Check className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Mode Hors-ligne</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Synchronisation automatique et accès complet même sans connexion internet
                  </p>
                </div>

                <div className="bg-white/70 rounded-2xl p-6 border border-purple-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Ressources Exclusives</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Guides, conseils d'experts et contenus premium pour optimiser votre parcours
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">19,99€</div>
                  <div className="text-gray-500">à vie</div>
                </div>
              </div>

              <button
                disabled
                className="inline-flex items-center gap-3 bg-gray-100 text-gray-500 px-8 py-4 rounded-2xl text-lg font-semibold cursor-not-allowed border border-gray-200"
              >
                <Crown className="w-6 h-6" />
                En développement
              </button>

              <p className="text-sm text-gray-500">
                Nous vous tiendrons informés de l'avancement
              </p>
            </div>
          </div>
        </>
      )}

      {/* Avantages Premium - seulement pour les utilisateurs gratuits */}
      {currentPlan === 'free' && (
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-3xl p-12">
          <div className="text-center space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Pourquoi passer à Premium ?
              </h2>
              <p className="text-gray-600 text-lg">
                Accédez à des analyses approfondies et un suivi complet
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Analyse complète</h3>
                <p className="text-gray-600">
                  Graphiques détaillés et statistiques mensuelles
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Historique étendu</h3>
                <p className="text-gray-600">
                  Accédez à 1 an d'historique complet
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Fonctionnalités avancées</h3>
                <p className="text-gray-600">
                  Fonctionnalités avancées et personnalisation
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {currentPlan === 'free' ? 'Questions fréquentes' : 'Support et aide'}
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 ease-out hover:shadow-lg"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-200 ease-out"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4 transition-colors duration-200">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-all duration-300 ease-out flex-shrink-0 ${
                    openFAQ === index ? 'rotate-180 text-emerald-600' : 'hover:text-gray-700'
                  }`}
                />
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ease-out ${
                  openFAQ === index 
                    ? 'max-h-96 opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-5">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-600 leading-relaxed transform transition-all duration-300 ease-out">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de confirmation de rétrogradation */}
      <ConfirmModal
        isOpen={showDowngradeConfirm}
        onClose={() => setShowDowngradeConfirm(false)}
        onConfirm={handleDowngrade}
        title="Confirmer la rétrogradation"
        message="Êtes-vous sûr de vouloir rétrograder vers le plan Gratuit ? Vous perdrez l'accès aux fonctionnalités Premium à la fin de votre période de facturation actuelle. Vous conserverez vos données mais n'aurez plus accès aux statistiques avancées et au calendrier complet."
        confirmText="Confirmer la rétrogradation"
        cancelText="Garder Premium"
        confirmVariant="danger"
        isLoading={isDowngrading}
        icon={<AlertTriangle className="w-8 h-8 text-red-600" />}
      />
    </div>
  );
}