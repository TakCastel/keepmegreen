'use client';

import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useDayActivities, useRemoveActivity } from '@/hooks/useActivities';
import { useAuth } from '@/hooks/useAuth';
import { getTotalActivities, calculateDayScore, getDayMoodIcon } from '@/utils/stats';
import { Zap, Users, Apple, Calendar, TrendingUp, Target, Edit3, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DynamicIcon from '@/components/ui/DynamicIcon';
import Gauge from '@/components/ui/Gauge';
import AnimatedLabel from '@/components/ui/AnimatedLabel';
import { SPORT_CONFIG, SOCIAL_CONFIG, NUTRITION_CONFIG } from '@/types';

export default function TodayActivities() {
  const { user } = useAuth();
  const router = useRouter();
  const today = format(new Date(), 'yyyy-MM-dd');
  const { data: dayActivities, isLoading } = useDayActivities(user?.uid, today);
  const removeActivity = useRemoveActivity();

  const handleEditToday = () => {
    router.push(`/settings?date=${today}`);
  };

  // Ne pas afficher de skeleton complet pour éviter les sauts d'interface
  // On affiche le contenu avec des données vides si isLoading

  const totalActivities = dayActivities ? getTotalActivities(dayActivities) : 0;
  const positiveScore = dayActivities ? calculateDayScore(dayActivities) : 0;
  
  // Vérifier que les valeurs ne sont pas NaN
  const safeTotalActivities = isNaN(totalActivities) ? 0 : totalActivities;
  const safePositiveScore = isNaN(positiveScore) ? 0 : positiveScore;
  const moodIcon = getDayMoodIcon(dayActivities);

  // Calcul pondéré par catégorie en réutilisant calculateDayScore
  const getCategoryWeightedScore = (category: 'sport' | 'social' | 'nutrition') => {
    if (!dayActivities) return 0;
    const emptyDay = { date: dayActivities.date, sport: [], social: [], nutrition: [] } as typeof dayActivities;
    const catDay = { ...emptyDay, [category]: dayActivities[category] } as typeof dayActivities;
    const score = calculateDayScore(catDay);
    return isNaN(score) ? 0 : score;
  };

  // Convertit un score pondéré en progression de jauge sur une cible de 5
  const getGaugeProgress = (weightedScore: number) => {
    const target = 5; // 5 sections à remplir
    const progress = Math.max(0, Math.min(1, weightedScore / target));
    return progress;
  };


  const getActivityConfig = (category: 'sport' | 'social' | 'nutrition', type: string) => {
    switch (category) {
      case 'sport':
        return SPORT_CONFIG[type as keyof typeof SPORT_CONFIG];
      case 'social':
        return SOCIAL_CONFIG[type as keyof typeof SOCIAL_CONFIG];
      case 'nutrition':
        return NUTRITION_CONFIG[type as keyof typeof NUTRITION_CONFIG];
      default:
        return { icon: 'Circle', label: 'Activité', description: '' };
    }
  };

  const categoryStyles: Record<'sport' | 'social' | 'nutrition', { bg: string; hover: string; icon: string }> = {
    sport: { bg: 'bg-emerald-500', hover: 'hover:bg-emerald-600', icon: 'text-emerald-600' },
    social: { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', icon: 'text-blue-600' },
    nutrition: { bg: 'bg-orange-500', hover: 'hover:bg-orange-600', icon: 'text-orange-600' },
  };

  const handleRemoveActivity = async (
    category: 'sport' | 'social' | 'nutrition',
    type: string,
    quantity: number
  ) => {
    if (!user) return;
    
    try {
      await removeActivity.mutateAsync({
        userId: user.uid,
        date: today,
        category,
        type: type as any,
        quantity: 1, // Supprimer une unité à la fois
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };


  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200 shadow-lg">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Aujourd'hui - {format(new Date(), 'dd MMMM', { locale: fr })}
            </h3>
            <p className="text-sm text-gray-600">
              {safeTotalActivities} activité{safeTotalActivities > 1 ? 's' : ''} enregistrée{safeTotalActivities > 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleEditToday}
          className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors duration-200 text-slate-700 hover:text-slate-800 text-sm font-medium"
          title="Modifier les données d'aujourd'hui"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Edit3 className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">{isLoading ? 'Chargement...' : 'Modifier'}</span>
        </button>
      </div>

      {/* Section des cartes supprimée */}

      {/* Activités par catégorie */}
      <div className="space-y-4">
        {/* Sport */}
        <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-emerald-600" />
              </div>
              <h4 className="font-medium text-emerald-700">Sport</h4>
            {dayActivities && (
              <span className="text-sm text-emerald-600">
                ({dayActivities.sport.length} activité{dayActivities.sport.length > 1 ? 's' : ''})
              </span>
            )}
            </div>
          <Gauge progress={getGaugeProgress(getCategoryWeightedScore('sport'))} category="sport" className="gauge-slow" />
            <div className="flex flex-wrap gap-2 pt-1">
            {(dayActivities?.sport ?? []).map((activity, index) => {
                const config = getActivityConfig('sport', activity.type);
                return (
                  <AnimatedLabel
                    key={`${activity.type}-${index}`}
                    category="sport"
                    iconName={config.icon}
                    label={config.label}
                    quantity={activity.quantity}
                    type={activity.type}
                    onRemove={() => handleRemoveActivity('sport', activity.type, activity.quantity)}
                    disabled={removeActivity.isPending}
                    index={index}
                  />
                );
              })}
            </div>
        </div>

        {/* Social */}
        <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <h4 className="font-medium text-blue-700">Social</h4>
            {dayActivities && (
              <span className="text-sm text-blue-600">
                ({dayActivities.social.length} activité{dayActivities.social.length > 1 ? 's' : ''})
              </span>
            )}
            </div>
          <Gauge progress={getGaugeProgress(getCategoryWeightedScore('social'))} category="social" className="gauge-slow" />
            <div className="flex flex-wrap gap-2 pt-1">
            {(dayActivities?.social ?? []).map((activity, index) => {
                const config = getActivityConfig('social', activity.type);
                return (
                  <AnimatedLabel
                    key={`${activity.type}-${index}`}
                    category="social"
                    iconName={config.icon}
                    label={config.label}
                    quantity={activity.quantity}
                    type={activity.type}
                    onRemove={() => handleRemoveActivity('social', activity.type, activity.quantity)}
                    disabled={removeActivity.isPending}
                    index={index}
                  />
                );
              })}
            </div>
        </div>

        {/* Nutrition */}
        <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                <Apple className="w-4 h-4 text-orange-600" />
              </div>
              <h4 className="font-medium text-orange-700">Nutrition</h4>
            {dayActivities && (
              <span className="text-sm text-orange-600">
                ({dayActivities.nutrition.length} activité{dayActivities.nutrition.length > 1 ? 's' : ''})
              </span>
            )}
            </div>
          <Gauge progress={getGaugeProgress(getCategoryWeightedScore('nutrition'))} category="nutrition" className="gauge-slow" />
            <div className="flex flex-wrap gap-2 pt-1">
            {(dayActivities?.nutrition ?? []).map((activity, index) => {
                const config = getActivityConfig('nutrition', activity.type);
                return (
                  <AnimatedLabel
                    key={`${activity.type}-${index}`}
                    category="nutrition"
                    iconName={config.icon}
                    label={config.label}
                    quantity={activity.quantity}
                    type={activity.type}
                    onRemove={() => handleRemoveActivity('nutrition', activity.type, activity.quantity)}
                    disabled={removeActivity.isPending}
                    index={index}
                  />
                );
              })}
            </div>
        </div>

        {/* Message si aucune activité */}
        {safeTotalActivities === 0 && (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">Aucune activité aujourd'hui</p>
            <p className="text-sm text-gray-500 mt-1">
              Commencez à enregistrer vos activités positives !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
