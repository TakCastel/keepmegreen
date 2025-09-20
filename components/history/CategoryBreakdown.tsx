'use client';

import { DayConsumption, ConsumptionConfig } from '@/types';
import { getAggregatedStats } from '@/utils/stats';
import { 
  ALCOHOL_CONFIG, 
  CIGARETTE_CONFIG, 
  JUNKFOOD_CONFIG 
} from '@/types';
import { Wine, Cigarette, Utensils, Flower, LucideIcon } from 'lucide-react';
import DynamicIcon from '@/components/ui/DynamicIcon';
import { CATEGORY_COLORS } from '@/constants/colors';

interface CategoryBreakdownProps {
  consumptions: DayConsumption[];
}

interface CategoryData {
  title: string;
  icon: LucideIcon;
  total: number;
  breakdown: Record<string, number>;
  config: Record<string, ConsumptionConfig>;
  color: string;
  bgColor: string;
  borderColor: string;
  progressColor: string;
  iconGradient: string;
}

export default function CategoryBreakdown({ consumptions }: CategoryBreakdownProps) {
  const stats = getAggregatedStats(consumptions);

  const categories: CategoryData[] = [
    {
      title: 'Alcool',
      icon: Wine,
      total: stats.alcohol.total,
      breakdown: stats.alcohol.breakdown,
      config: ALCOHOL_CONFIG,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-100',
      progressColor: 'bg-rose-400',
      iconGradient: 'from-rose-400 to-rose-500',
    },
    {
      title: 'Cigarettes',
      icon: Cigarette,
      total: stats.cigarettes.total,
      breakdown: stats.cigarettes.breakdown,
      config: CIGARETTE_CONFIG,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100',
      progressColor: 'bg-purple-400',
      iconGradient: 'from-purple-400 to-purple-500',
    },
    {
      title: 'Nutrition',
      icon: Utensils,
      total: stats.junkfood.total,
      breakdown: stats.junkfood.breakdown,
      config: JUNKFOOD_CONFIG,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      progressColor: 'bg-blue-400',
      iconGradient: 'from-blue-400 to-blue-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {categories.map((category) => (
        <div
          key={category.title}
          className={`${category.bgColor} ${category.borderColor} border rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all`}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 bg-gradient-to-br ${category.iconGradient} rounded-2xl flex items-center justify-center shadow-lg`}>
              <category.icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className={`text-xl font-light ${category.color}`}>
                {category.title}
              </h3>
              <p className="text-gray-600 text-sm font-medium">
                {category.total} {category.total === 1 ? 'consommation' : 'consommations'}
              </p>
            </div>
          </div>

          {Object.keys(category.breakdown).length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Flower className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="text-emerald-600 font-medium">Aucune consommation</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(category.breakdown)
                .sort(([, a], [, b]) => b - a) // Trier par quantité décroissante
                .map(([type, quantity]) => {
                  const config: ConsumptionConfig | undefined = category.config[type];
                  
                  // Vérification de sécurité - ne pas afficher si config n'existe pas
                  if (!config) {
                    console.warn(`Configuration manquante pour le type: ${type}`);
                    return null;
                  }
                  
                  const percentage = Math.round((quantity / category.total) * 100);
                  
                  return (
                    <div key={type} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/70 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                            <DynamicIcon name={config.icon} className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <span className={`${category.color} text-sm font-medium`}>
                              {config.label}
                            </span>
                            {config.volume && (
                              <span className="text-gray-500 text-xs block">
                                ({config.volume})
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`${category.color} font-semibold`}>{quantity}</div>
                          <div className="text-gray-500 text-xs">{percentage}%</div>
                        </div>
                      </div>
                      
                      {/* Barre de progression */}
                      <div className="w-full bg-white/50 rounded-full h-3 backdrop-blur-sm">
                        <div
                          className={`h-3 rounded-full ${category.progressColor} shadow-sm`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
                .filter(Boolean)} {/* Éliminer les valeurs null */}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
