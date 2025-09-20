'use client';

import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { Edit3, Lock, Crown } from 'lucide-react';
import { CalendarDay, DayConsumption } from '@/types';
import { 
  ALCOHOL_CONFIG, 
  CIGARETTE_CONFIG, 
  JUNKFOOD_CONFIG 
} from '@/types';
import { Sprout, Wine, Cigarette, Utensils, Flower, Leaf, Sun, Sunrise } from 'lucide-react';
import DynamicIcon from '@/components/ui/DynamicIcon';
import { CATEGORY_COLORS } from '@/constants/colors';
import Modal from '@/components/ui/Modal';
import Paywall from '@/components/subscription/Paywall';
import { usePaywall } from '@/contexts/PaywallContext';

interface CalendarDayModalProps {
  day: CalendarDay;
  dayConsumption?: DayConsumption | null;
  onClose: () => void;
  showPaywall?: boolean; // Si true, affiche le paywall, sinon affiche les données
}

export default function CalendarDayModal({ day, dayConsumption, onClose, showPaywall = false }: CalendarDayModalProps) {
  const { user } = useAuth();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const router = useRouter();
  
  // Utiliser les données passées en prop (pas besoin de faire une nouvelle requête)
  const finalDayConsumption = dayConsumption;
  

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
          description="Ce jour fait partie de votre historique étendu. Passez à Premium pour accéder à tous vos jours passés avec le détail complet de vos consommations."
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
    router.push(`/settings?date=${day.date}`);
    onClose();
  };

  const handleUpgrade = () => {
    router.push('/subscription');
    onClose();
  };

  const colorConfig = {
    green: { bg: 'bg-emerald-500', text: 'Journée sereine !', icon: Flower },
    yellow: { bg: 'bg-amber-400', text: 'En équilibre', icon: Leaf },
    orange: { bg: 'bg-orange-400', text: 'Avec bienveillance', icon: Sun },
    red: { bg: 'bg-rose-400', text: 'Journée intense', icon: Sunrise },
  };

  const currentColorConfig = colorConfig[day.color];


  return (
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
      {!finalDayConsumption || day.totalConsumptions === 0 ? (
        // Afficher le message de journée sereine si pas de données
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sprout className="w-10 h-10 text-white" />
          </div>
          <p className="text-emerald-600 text-xl font-semibold mb-2">Journée sereine !</p>
          <p className="text-gray-600">Aucune prise de conscience enregistrée pour cette journée</p>
        </div>
      ) : (
        // Afficher l'historique complet
        <div className="space-y-6">
          {/* Résumé */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <currentColorConfig.icon className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="text-3xl font-light text-gray-800 mb-1">{day.totalConsumptions}</div>
            <div className="text-gray-600 font-medium">
              {day.totalConsumptions === 1 ? 'prise de conscience' : 'prises de conscience'}
            </div>
          </div>

          {/* Détail par catégorie */}
          <div className="space-y-4">
            {/* Alcool */}
            {finalDayConsumption?.alcohol && finalDayConsumption.alcohol.length > 0 && (
              <div className={`${CATEGORY_COLORS.alcohol.chartLight} rounded-2xl p-6 border border-pink-200`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-500 rounded-xl flex items-center justify-center">
                    <Wine className="w-5 h-5 text-white" />
                  </div>
                  <span className={`font-semibold ${CATEGORY_COLORS.alcohol.textMedium}`}>Alcool</span>
                </div>
                <div className="space-y-3">
                  {finalDayConsumption?.alcohol?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <DynamicIcon name={ALCOHOL_CONFIG[item.type].icon} className={`w-5 h-5 ${CATEGORY_COLORS.alcohol.textMedium}`} />
                        <div>
                          <span className={`${CATEGORY_COLORS.alcohol.textMedium} font-medium`}>{ALCOHOL_CONFIG[item.type].label}</span>
                          {ALCOHOL_CONFIG[item.type].volume && (
                            <span className={`${CATEGORY_COLORS.alcohol.textLight} text-sm ml-1`}>
                              ({ALCOHOL_CONFIG[item.type].volume})
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`${CATEGORY_COLORS.alcohol.textDark} font-medium bg-pink-100 px-2 py-1 rounded-full text-sm`}>×{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cigarettes */}
            {finalDayConsumption?.cigarettes && finalDayConsumption.cigarettes.length > 0 && (
              <div className={`${CATEGORY_COLORS.cigarettes.chartLight} rounded-2xl p-6 border border-violet-200`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-violet-500 rounded-xl flex items-center justify-center">
                    <Cigarette className="w-5 h-5 text-white" />
                  </div>
                  <span className={`font-semibold ${CATEGORY_COLORS.cigarettes.textMedium}`}>Cigarettes</span>
                </div>
                <div className="space-y-3">
                  {finalDayConsumption?.cigarettes?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <DynamicIcon name={CIGARETTE_CONFIG[item.type].icon} className={`w-5 h-5 ${CATEGORY_COLORS.cigarettes.textMedium}`} />
                        <span className={`${CATEGORY_COLORS.cigarettes.textMedium} font-medium`}>{CIGARETTE_CONFIG[item.type].label}</span>
                      </div>
                      <span className={`${CATEGORY_COLORS.cigarettes.textDark} font-medium bg-violet-100 px-2 py-1 rounded-full text-sm`}>×{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nutrition */}
            {finalDayConsumption?.junkfood && finalDayConsumption.junkfood.length > 0 && (
              <div className={`${CATEGORY_COLORS.junkfood.chartLight} rounded-2xl p-6 border border-blue-200`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
                    <Utensils className="w-5 h-5 text-white" />
                  </div>
                  <span className={`font-semibold ${CATEGORY_COLORS.junkfood.textMedium}`}>Nutrition</span>
                </div>
                <div className="space-y-3">
                  {finalDayConsumption?.junkfood?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <DynamicIcon name={JUNKFOOD_CONFIG[item.type].icon} className={`w-5 h-5 ${CATEGORY_COLORS.junkfood.textMedium}`} />
                        <span className={`${CATEGORY_COLORS.junkfood.textMedium} font-medium`}>{JUNKFOOD_CONFIG[item.type].label}</span>
                      </div>
                      <span className={`${CATEGORY_COLORS.junkfood.textDark} font-medium bg-blue-100 px-2 py-1 rounded-full text-sm`}>×{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
