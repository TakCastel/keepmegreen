'use client';

import { DayActivities } from '@/types';
import { getAggregatedStats } from '@/utils/stats';
import { 
  SPORT_CONFIG, 
  SOCIAL_CONFIG, 
  NUTRITION_CONFIG 
} from '@/types';
import { 
  Dumbbell, 
  Users, 
  Utensils, 
  TrendingUp, 
  LucideIcon,
  Zap,
  Target,
  Award,
  Trophy,
  BarChart3
} from 'lucide-react';
import DynamicIcon from '@/components/ui/DynamicIcon';

interface ActivityCategoryBreakdownProps {
  activities: DayActivities[];
}

interface CategoryData {
  title: string;
  icon: LucideIcon;
  total: number;
  breakdown: Record<string, number>;
  config: Record<string, any>;
  color: string;
  bgColor: string;
  borderColor: string;
  progressColor: string;
  iconGradient: string;
  description: string;
}

export default function ActivityCategoryBreakdown({ activities }: ActivityCategoryBreakdownProps) {
  const stats = getAggregatedStats(activities);

  const categories: CategoryData[] = [
    {
      title: 'Sport & Fitness',
      icon: Dumbbell,
      total: stats.sport.total,
      breakdown: stats.sport.breakdown,
      config: SPORT_CONFIG,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      progressColor: 'bg-emerald-400',
      iconGradient: 'from-emerald-400 to-emerald-500',
      description: 'Activités physiques et sportives'
    },
    {
      title: 'Social & Relations',
      icon: Users,
      total: stats.social.total,
      breakdown: stats.social.breakdown,
      config: SOCIAL_CONFIG,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      progressColor: 'bg-blue-400',
      iconGradient: 'from-blue-400 to-blue-500',
      description: 'Interactions sociales et communautaires'
    },
    {
      title: 'Nutrition & Bien-être',
      icon: Utensils,
      total: stats.nutrition.total,
      breakdown: stats.nutrition.breakdown,
      config: NUTRITION_CONFIG,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100',
      progressColor: 'bg-purple-400',
      iconGradient: 'from-purple-400 to-purple-500',
      description: 'Alimentation et habitudes saines'
    }
  ];

  // Calculer le total pour les pourcentages
  const grandTotal = stats.sport.total + stats.social.total + stats.nutrition.total;

  return (
    <div className="space-y-8">
      {/* En-tête avec statistiques globales */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Analyse détaillée par catégorie
        </h2>
        <p className="text-gray-600 text-lg">
          Répartition complète de vos activités positives
        </p>
        
        {/* Statistiques globales améliorées */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-6 border border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-semibold text-emerald-700">Total</span>
            </div>
            <div className="text-4xl font-bold text-emerald-600 mb-2">
              {grandTotal}
            </div>
            <div className="text-sm text-emerald-600 font-medium">
              Activités cette période
            </div>
            <div className="mt-3 text-xs text-emerald-500 bg-emerald-100 px-3 py-1 rounded-full">
              Objectif atteint!
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-6 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-semibold text-blue-700">Équilibre</span>
            </div>
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {grandTotal > 0 ? Math.round((Math.min(stats.sport.total, stats.social.total, stats.nutrition.total) / Math.max(stats.sport.total, stats.social.total, stats.nutrition.total)) * 100) : 0}%
            </div>
            <div className="text-sm text-blue-600 font-medium">
              Score d'équilibre
            </div>
            <div className="mt-3 text-xs text-blue-500 bg-blue-100 px-3 py-1 rounded-full">
              Bien équilibré
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-6 border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-semibold text-purple-700">Diversité</span>
            </div>
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {Object.keys(stats.sport.breakdown).length + Object.keys(stats.social.breakdown).length + Object.keys(stats.nutrition.breakdown).length}
            </div>
            <div className="text-sm text-purple-600 font-medium">
              Types d'activités
            </div>
            <div className="mt-3 text-xs text-purple-500 bg-purple-100 px-3 py-1 rounded-full">
              Très varié
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl p-6 border border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-semibold text-amber-700">Performance</span>
            </div>
            <div className="text-4xl font-bold text-amber-600 mb-2">
              {grandTotal > 0 ? Math.round((grandTotal / activities.length) * 10) / 10 : 0}
            </div>
            <div className="text-sm text-amber-600 font-medium">
              Moyenne par jour
            </div>
            <div className="mt-3 text-xs text-amber-500 bg-amber-100 px-3 py-1 rounded-full">
              Excellente!
            </div>
          </div>
        </div>
      </div>

      {/* Cartes de catégories */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {categories.map((category, index) => {
          const percentage = grandTotal > 0 ? (category.total / grandTotal) * 100 : 0;
          const topActivity = Object.entries(category.breakdown)
            .sort(([,a], [,b]) => b - a)[0];
          
          return (
            <div
              key={index}
              className={`${category.bgColor} rounded-3xl p-8 border ${category.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden`}
            >
              {/* Effet de brillance au survol */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              {/* Contenu principal */}
              <div className="relative z-10">
                {/* En-tête de la catégorie */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.iconGradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${category.color} mb-1`}>
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {category.description}
                    </p>
                  </div>
                </div>

              {/* Statistiques principales */}
              <div className="mb-6">
                <div className={`text-4xl font-bold ${category.color} mb-2`}>
                  {category.total}
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600 font-medium">
                    Total des activités
                  </span>
                  <span className={`text-sm font-semibold ${category.color}`}>
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                
                {/* Barre de progression */}
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full ${category.progressColor} rounded-full transition-all duration-2000 ease-out`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Activité la plus populaire */}
              {topActivity && (
                <div className="mb-6 p-5 bg-white/60 rounded-2xl border border-white/30 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-semibold text-gray-700">
                      Activité favorite
                    </span>
                    <div className="ml-auto bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      Top
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DynamicIcon 
                      name={category.config[topActivity[0]]?.icon || 'Activity'} 
                      className="w-6 h-6 text-gray-600" 
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      {category.config[topActivity[0]]?.label || topActivity[0]}
                    </span>
                    <span className={`text-lg font-bold ${category.color} ml-auto`}>
                      {topActivity[1]}
                    </span>
                  </div>
                </div>
              )}

              {/* Liste des activités */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Toutes les activités
                </h4>
                {Object.entries(category.breakdown)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([type, quantity], idx) => (
                    <div key={type} className="flex items-center justify-between p-4 bg-white/40 rounded-xl border border-white/20 hover:bg-white/50 transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                          <DynamicIcon 
                            name={category.config[type]?.icon || 'Activity'} 
                            className="w-4 h-4 text-gray-600" 
                          />
                        </div>
                        <span className="text-sm text-gray-700 font-semibold">
                          {category.config[type]?.label || type}
                        </span>
                        {idx === 0 && (
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-2 py-1 rounded-full font-semibold">
                            #1
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${category.color}`}>
                          {quantity}
                        </span>
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                
                {Object.keys(category.breakdown).length > 5 && (
                  <div className="text-xs text-gray-500 text-center pt-3 bg-white/20 rounded-xl py-2">
                    +{Object.keys(category.breakdown).length - 5} autres activités
                  </div>
                )}
              </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
