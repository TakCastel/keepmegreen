'use client';

import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { X, Plus, Minus, Trash2, Calendar, ArrowRight } from 'lucide-react';
import { CalendarDay, DayActivities, SportType, SocialType, NutritionType } from '@/types';
import { SPORT_CONFIG, SOCIAL_CONFIG, NUTRITION_CONFIG } from '@/types';
import DynamicIcon from '@/components/ui/DynamicIcon';
import { useRemoveActivity, useMoveActivity } from '@/hooks/useActivities';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';

interface ActivityDayModalProps {
  day: CalendarDay;
  dayActivities: DayActivities | undefined;
  onClose: () => void;
  showPaywall?: boolean;
}

export default function ActivityDayModal({ 
  day, 
  dayActivities, 
  onClose, 
  showPaywall = false 
}: ActivityDayModalProps) {
  const { user } = useAuth();
  const removeActivity = useRemoveActivity();
  const moveActivity = useMoveActivity();

  const handleRemoveActivity = async (
    category: 'sport' | 'social' | 'nutrition',
    type: SportType | SocialType | NutritionType,
    quantity: number = 1
  ) => {
    if (!user) return;

    try {
      await removeActivity.mutateAsync({
        userId: user.uid,
        date: day.date,
        category,
        type,
        quantity
      });
      toast.success('Activité supprimée !');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleMoveActivity = async (
    category: 'sport' | 'social' | 'nutrition',
    type: SportType | SocialType | NutritionType,
    quantity: number
  ) => {
    if (!user) return;

    const today = format(new Date(), 'yyyy-MM-dd');
    
    try {
      await moveActivity.mutateAsync({
        userId: user.uid,
        oldDate: day.date,
        newDate: today,
        category,
        type,
        quantity
      });
      toast.success('Activité déplacée vers aujourd\'hui !');
    } catch (error) {
      toast.error('Erreur lors du déplacement');
    }
  };

  const getActivityConfig = (category: 'sport' | 'social' | 'nutrition', type: string) => {
    switch (category) {
      case 'sport':
        return SPORT_CONFIG[type as SportType];
      case 'social':
        return SOCIAL_CONFIG[type as SocialType];
      case 'nutrition':
        return NUTRITION_CONFIG[type as NutritionType];
      default:
        return { icon: 'Circle', label: 'Activité', description: '' };
    }
  };

  const getCategoryColor = (category: 'sport' | 'social' | 'nutrition') => {
    switch (category) {
      case 'sport':
        return 'emerald';
      case 'social':
        return 'blue';
      case 'nutrition':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const getCategoryLabel = (category: 'sport' | 'social' | 'nutrition') => {
    switch (category) {
      case 'sport':
        return 'Sport';
      case 'social':
        return 'Social';
      case 'nutrition':
        return 'Nutrition';
      default:
        return 'Activité';
    }
  };

  const totalActivities = dayActivities ? 
    (dayActivities.sport.length + dayActivities.social.length + dayActivities.nutrition.length) : 0;
  const safeTotalActivities = isNaN(totalActivities) ? 0 : totalActivities;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 border-b border-emerald-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {format(new Date(day.date), 'dd MMMM yyyy', { locale: fr })}
                </h2>
                <p className="text-sm text-gray-600">
                  {safeTotalActivities} activité{safeTotalActivities > 1 ? 's' : ''} enregistrée{safeTotalActivities > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/80 hover:bg-white rounded-2xl flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {showPaywall ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Historique Premium
              </h3>
              <p className="text-gray-600 mb-6">
                Accédez à l'historique complet de vos activités avec un abonnement Premium.
              </p>
              <button
                onClick={() => window.location.href = '/subscription'}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl font-medium hover:from-emerald-600 hover:to-green-700 transition-all duration-200"
              >
                Découvrir Premium
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Sport */}
              {dayActivities?.sport && dayActivities.sport.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-emerald-700 flex items-center gap-2">
                    <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <DynamicIcon name="Zap" className="w-4 h-4 text-emerald-600" />
                    </div>
                    Sport
                  </h3>
                  <div className="space-y-2">
                    {dayActivities.sport.map((activity, index) => {
                      const config = getActivityConfig('sport', activity.type);
                      return (
                        <div key={index} className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-emerald-200 rounded-xl flex items-center justify-center">
                                <DynamicIcon name={config.icon} className="w-5 h-5 text-emerald-700" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-800">{config.label}</div>
                                <div className="text-sm text-gray-600">{config.description}</div>
                                <div className="text-xs text-emerald-600 font-medium">
                                  Quantité: {activity.quantity}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleRemoveActivity('sport', activity.type, 1)}
                                className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors"
                                title="Supprimer 1"
                              >
                                <Minus className="w-4 h-4 text-red-600" />
                              </button>
                              <button
                                onClick={() => handleMoveActivity('sport', activity.type, activity.quantity)}
                                className="w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors"
                                title="Déplacer vers aujourd'hui"
                              >
                                <ArrowRight className="w-4 h-4 text-blue-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Social */}
              {dayActivities?.social && dayActivities.social.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                      <DynamicIcon name="Users" className="w-4 h-4 text-blue-600" />
                    </div>
                    Social
                  </h3>
                  <div className="space-y-2">
                    {dayActivities.social.map((activity, index) => {
                      const config = getActivityConfig('social', activity.type);
                      return (
                        <div key={index} className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-200 rounded-xl flex items-center justify-center">
                                <DynamicIcon name={config.icon} className="w-5 h-5 text-blue-700" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-800">{config.label}</div>
                                <div className="text-sm text-gray-600">{config.description}</div>
                                <div className="text-xs text-blue-600 font-medium">
                                  Quantité: {activity.quantity}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleRemoveActivity('social', activity.type, 1)}
                                className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors"
                                title="Supprimer 1"
                              >
                                <Minus className="w-4 h-4 text-red-600" />
                              </button>
                              <button
                                onClick={() => handleMoveActivity('social', activity.type, activity.quantity)}
                                className="w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors"
                                title="Déplacer vers aujourd'hui"
                              >
                                <ArrowRight className="w-4 h-4 text-blue-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Nutrition */}
              {dayActivities?.nutrition && dayActivities.nutrition.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-orange-700 flex items-center gap-2">
                    <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                      <DynamicIcon name="Apple" className="w-4 h-4 text-orange-600" />
                    </div>
                    Nutrition
                  </h3>
                  <div className="space-y-2">
                    {dayActivities.nutrition.map((activity, index) => {
                      const config = getActivityConfig('nutrition', activity.type);
                      return (
                        <div key={index} className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-orange-200 rounded-xl flex items-center justify-center">
                                <DynamicIcon name={config.icon} className="w-5 h-5 text-orange-700" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-800">{config.label}</div>
                                <div className="text-sm text-gray-600">{config.description}</div>
                                <div className="text-xs text-orange-600 font-medium">
                                  Quantité: {activity.quantity}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleRemoveActivity('nutrition', activity.type, 1)}
                                className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors"
                                title="Supprimer 1"
                              >
                                <Minus className="w-4 h-4 text-red-600" />
                              </button>
                              <button
                                onClick={() => handleMoveActivity('nutrition', activity.type, activity.quantity)}
                                className="w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors"
                                title="Déplacer vers aujourd'hui"
                              >
                                <ArrowRight className="w-4 h-4 text-blue-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Message si aucune activité */}
              {safeTotalActivities === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    Aucune activité enregistrée
                  </h3>
                  <p className="text-gray-500">
                    Commencez à enregistrer vos activités positives !
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
