'use client';

import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useDayActivities } from '@/hooks/useActivities';
import { useAuth } from '@/hooks/useAuth';
import { getTotalActivities, calculateDayScore, getDayMoodIcon } from '@/utils/stats';
import { Zap, Users, Apple, Calendar, TrendingUp, Target, Edit3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DynamicIcon from '@/components/ui/DynamicIcon';
import { SPORT_CONFIG, SOCIAL_CONFIG, NUTRITION_CONFIG } from '@/types';

export default function TodayActivities() {
  const { user } = useAuth();
  const router = useRouter();
  const today = format(new Date(), 'yyyy-MM-dd');
  const { data: dayActivities, isLoading } = useDayActivities(user?.uid, today);

  const handleEditToday = () => {
    router.push(`/settings?date=${today}`);
  };

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const totalActivities = dayActivities ? getTotalActivities(dayActivities) : 0;
  const positiveScore = dayActivities ? calculateDayScore(dayActivities) : 0;
  
  // Vérifier que les valeurs ne sont pas NaN
  const safeTotalActivities = isNaN(totalActivities) ? 0 : totalActivities;
  const safePositiveScore = isNaN(positiveScore) ? 0 : positiveScore;
  const moodIcon = getDayMoodIcon(dayActivities);

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
          <Edit3 className="w-4 h-4" />
          <span className="hidden sm:inline">Modifier</span>
        </button>
      </div>

      {/* Score et humeur */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 border border-emerald-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${moodIcon.bgGradient}`}>
              <moodIcon.icon className={`w-5 h-5 ${moodIcon.color}`} />
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-700">{safePositiveScore}</div>
              <div className="text-xs text-emerald-600 font-medium">Score positif</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-200 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-700">{safeTotalActivities}</div>
              <div className="text-xs text-blue-600 font-medium">Activités totales</div>
            </div>
          </div>
        </div>
      </div>

      {/* Activités par catégorie */}
      <div className="space-y-4">
        {/* Sport */}
        {dayActivities?.sport && dayActivities.sport.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-emerald-600" />
              </div>
              <h4 className="font-medium text-emerald-700">Sport</h4>
              <span className="text-sm text-emerald-600">
                ({dayActivities.sport.length} activité{dayActivities.sport.length > 1 ? 's' : ''})
              </span>
            </div>
            <div className="space-y-1">
              {dayActivities.sport.map((activity, index) => {
                const config = getActivityConfig('sport', activity.type);
                return (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <DynamicIcon name={config.icon} className="w-4 h-4 text-emerald-600" />
                    <span className="text-gray-700">{config.label}</span>
                    <span className="text-emerald-600 font-medium">×{activity.quantity}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Social */}
        {dayActivities?.social && dayActivities.social.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <h4 className="font-medium text-blue-700">Social</h4>
              <span className="text-sm text-blue-600">
                ({dayActivities.social.length} activité{dayActivities.social.length > 1 ? 's' : ''})
              </span>
            </div>
            <div className="space-y-1">
              {dayActivities.social.map((activity, index) => {
                const config = getActivityConfig('social', activity.type);
                return (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <DynamicIcon name={config.icon} className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">{config.label}</span>
                    <span className="text-blue-600 font-medium">×{activity.quantity}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Nutrition */}
        {dayActivities?.nutrition && dayActivities.nutrition.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                <Apple className="w-4 h-4 text-orange-600" />
              </div>
              <h4 className="font-medium text-orange-700">Nutrition</h4>
              <span className="text-sm text-orange-600">
                ({dayActivities.nutrition.length} activité{dayActivities.nutrition.length > 1 ? 's' : ''})
              </span>
            </div>
            <div className="space-y-1">
              {dayActivities.nutrition.map((activity, index) => {
                const config = getActivityConfig('nutrition', activity.type);
                return (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <DynamicIcon name={config.icon} className="w-4 h-4 text-orange-600" />
                    <span className="text-gray-700">{config.label}</span>
                    <span className="text-orange-600 font-medium">×{activity.quantity}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
