'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { Edit3, Lock, Crown } from 'lucide-react';
import { CalendarDay, DayActivities } from '@/types';
import { 
  SPORT_CONFIG,
  SOCIAL_CONFIG,
  NUTRITION_CONFIG
} from '@/types';
import { Sprout, Flower, Leaf, Sun, Sunrise } from 'lucide-react';
import DynamicIcon from '@/components/ui/DynamicIcon';
import { CATEGORY_COLORS } from '@/constants/colors';
import Modal from '@/components/ui/Modal';
import Paywall from '@/components/subscription/Paywall';
import { usePaywall } from '@/contexts/PaywallContext';

interface CalendarDayModalProps {
  day: CalendarDay;
  dayActivities?: DayActivities | null;
  onClose: () => void;
  showPaywall?: boolean; // Si true, affiche le paywall, sinon affiche les données
}

export default function CalendarDayModal({ day, dayActivities, onClose, showPaywall = false }: CalendarDayModalProps) {
  const { user } = useAuth();
  const { subscription, loading: subscriptionLoading, canAccessPeriod } = useSubscription();
  const router = useRouter();
  const [showEditPaywall, setShowEditPaywall] = useState(false);
  
  // Utiliser les données passées en prop (pas besoin de faire une nouvelle requête)
  

  // 1. Skeleton pendant le chargement de l'abonnement
  if (subscriptionLoading) {
    return (
      <Modal
        isOpen={true}
        onClose={onClose}
        title={format(new Date(day.date), 'dd MMMM yyyy', { locale: fr })}
        subtitle={
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse"></div>
            <span className="text-gray-400 text-sm font-medium">Chargement...</span>
          </div>
        }
        size="lg"
      >
        <div className="py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-32 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </Modal>
    );
  }

  // 2. Si showPaywall est true → Afficher le paywall
  if (showPaywall) {
    return (
      <Modal
        isOpen={true}
        onClose={onClose}
        title={format(new Date(day.date), 'dd MMMM yyyy', { locale: fr })}
        subtitle={
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-amber-500 shadow-md"></div>
            <span className="text-amber-600 text-sm font-medium">Fonctionnalité Premium</span>
          </div>
        }
        size="lg"
      >
        <Paywall 
          feature="unlimitedHistory"
          title="Accès à l'historique complet"
          description="Ce jour fait partie de votre historique étendu. Passez à Premium pour accéder à tous vos jours passés."
          compact={true}
          onUpgrade={() => {
            router.push('/subscription');
            onClose();
          }}
        />
      </Modal>
    );
  }

  // 3. Sinon → Afficher l'historique directement (les données sont déjà disponibles)

  const handleEditDay = () => {
    // Vérifier si l'utilisateur peut accéder à cette date
    const [year, month, dayOfMonth] = day.date.split('-').map(Number);
    const dayDate = new Date(year, month - 1, dayOfMonth);
    const canAccessThisDate = canAccessPeriod(dayDate);
    
    if (canAccessThisDate) {
      // L'utilisateur peut accéder à cette date, rediriger vers les paramètres avec la date présélectionnée
      router.push(`/settings?date=${day.date}`);
      onClose();
    } else {
      // L'utilisateur ne peut pas accéder à cette date, afficher le paywall
      setShowEditPaywall(true);
    }
  };

  const handleUpgrade = () => {
    router.push('/subscription');
    onClose();
  };

  const colorConfig = {
    'dark-blue': { bg: 'bg-blue-700', text: 'Journée parfaite !', icon: Flower },
    blue: { bg: 'bg-blue-500', text: 'Journée équilibrée', icon: Leaf },
    'light-blue': { bg: 'bg-blue-300', text: 'Journée d\'apprentissage', icon: Sun },
    'blue-purple': { bg: 'bg-purple-600', text: 'Journée exceptionnelle', icon: Sunrise },
    neutral: { bg: 'bg-gray-400', text: 'Journée neutre', icon: Sprout },
  };

  const currentColorConfig = colorConfig[day.color] || colorConfig.blue;


  return (
    <>
      <Modal
        isOpen={true}
        onClose={onClose}
        title={format(new Date(day.date), 'dd MMMM yyyy', { locale: fr })}
        subtitle={
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${currentColorConfig.bg} shadow-md`}></div>
            <span className="text-gray-600 text-sm font-medium">{currentColorConfig.text}</span>
          </div>
        }
        headerActions={
          <button
            onClick={handleEditDay}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors duration-200 text-slate-700 hover:text-slate-800 text-sm font-medium"
            title="Modifier les données de ce jour"
          >
            <Edit3 className="w-4 h-4" />
            <span className="hidden sm:inline">Modifier</span>
          </button>
        }
        size="lg"
      >
      {/* 4. Afficher l'historique complet (on arrive ici seulement si on a accès) */}
      {!dayActivities || day.totalActivities === 0 ? (
        // Afficher le message de journée sereine si pas de données
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sprout className="w-10 h-10 text-white" />
          </div>
          <p className="text-slate-600 text-xl font-semibold mb-2">Journée libre</p>
          <p className="text-gray-600">Une nouvelle page à écrire, un nouveau jour à observer</p>
        </div>
      ) : (
        // Afficher l'historique complet
        <div className="space-y-6">
          {/* Résumé */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <currentColorConfig.icon className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-3xl font-light text-gray-800 mb-1">
              {dayActivities ? 
                (dayActivities.sport?.reduce((sum, item) => sum + item.quantity, 0) || 0) +
                (dayActivities.social?.reduce((sum, item) => sum + item.quantity, 0) || 0) +
                (dayActivities.nutrition?.reduce((sum, item) => sum + item.quantity, 0) || 0)
                : 0
              }
            </div>
            <div className="text-gray-600 font-medium">
              {(() => {
                const totalActivities = dayActivities ? 
                  ((dayActivities.sport?.reduce((sum, item) => sum + item.quantity, 0) || 0) +
                  (dayActivities.social?.reduce((sum, item) => sum + item.quantity, 0) || 0) +
                  (dayActivities.nutrition?.reduce((sum, item) => sum + item.quantity, 0) || 0))
                  : 0;
                return totalActivities === 1 ? 'activité' : 'activités';
              })()}
            </div>
          </div>

          {/* Détail par catégorie */}
          <div className="space-y-4">

            {/* Sport */}
            {dayActivities?.sport && dayActivities.sport.length > 0 && (
              <div className={`${CATEGORY_COLORS.sport.chartLight} rounded-2xl p-6 border border-emerald-200`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center">
                    <DynamicIcon name="Zap" className="w-5 h-5 text-white" />
                  </div>
                  <span className={`font-semibold ${CATEGORY_COLORS.sport.textMedium}`}>Sport</span>
                </div>
                <div className="space-y-3">
                  {dayActivities.sport.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <DynamicIcon name={SPORT_CONFIG[item.type].icon} className={`w-5 h-5 ${CATEGORY_COLORS.sport.textMedium}`} />
                        <span className={`${CATEGORY_COLORS.sport.textMedium} font-medium`}>{SPORT_CONFIG[item.type].label}</span>
                      </div>
                      <span className={`${CATEGORY_COLORS.sport.textDark} font-medium bg-emerald-100 px-2 py-1 rounded-full text-sm`}>×{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social */}
            {dayActivities?.social && dayActivities.social.length > 0 && (
              <div className={`${CATEGORY_COLORS.social.chartLight} rounded-2xl p-6 border border-blue-200`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
                    <DynamicIcon name="Users" className="w-5 h-5 text-white" />
                  </div>
                  <span className={`font-semibold ${CATEGORY_COLORS.social.textMedium}`}>Social</span>
                </div>
                <div className="space-y-3">
                  {dayActivities.social.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <DynamicIcon name={SOCIAL_CONFIG[item.type].icon} className={`w-5 h-5 ${CATEGORY_COLORS.social.textMedium}`} />
                        <span className={`${CATEGORY_COLORS.social.textMedium} font-medium`}>{SOCIAL_CONFIG[item.type].label}</span>
                      </div>
                      <span className={`${CATEGORY_COLORS.social.textDark} font-medium bg-blue-100 px-2 py-1 rounded-full text-sm`}>×{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nutrition (Activités) */}
            {dayActivities?.nutrition && dayActivities.nutrition.length > 0 && (
              <div className={`${CATEGORY_COLORS.nutrition.chartLight} rounded-2xl p-6 border border-orange-200`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <DynamicIcon name="Apple" className="w-5 h-5 text-white" />
                  </div>
                  <span className={`font-semibold ${CATEGORY_COLORS.nutrition.textMedium}`}>Nutrition</span>
                </div>
                <div className="space-y-3">
                  {dayActivities.nutrition.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <DynamicIcon name={NUTRITION_CONFIG[item.type].icon} className={`w-5 h-5 ${CATEGORY_COLORS.nutrition.textMedium}`} />
                        <span className={`${CATEGORY_COLORS.nutrition.textMedium} font-medium`}>{NUTRITION_CONFIG[item.type].label}</span>
                      </div>
                      <span className={`${CATEGORY_COLORS.nutrition.textDark} font-medium bg-orange-100 px-2 py-1 rounded-full text-sm`}>×{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>

    {/* Modal de paywall pour l'édition */}
    <Modal
      isOpen={showEditPaywall}
      onClose={() => setShowEditPaywall(false)}
      title="Modifier les données"
      subtitle={
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-amber-500 shadow-md"></div>
          <span className="text-amber-600 text-sm font-medium">Fonctionnalité Premium</span>
        </div>
      }
      size="lg"
    >
      <Paywall 
        feature="unlimitedHistory"
        title="Modifier les données"
        description="Modifiez et gérez vos données passées avec l'éditeur avancé."
        compact={true}
        onUpgrade={() => {
          router.push('/subscription');
          setShowEditPaywall(false);
        }}
      />
    </Modal>
    </>
  );
}
