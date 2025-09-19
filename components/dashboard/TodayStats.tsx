'use client';

import { useDayConsumption } from '@/hooks/useConsumptions';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { getTotalConsumptions, getDayColor, calculateDayWeight, getDayColorByWeight } from '@/utils/stats';
import { Flower2, Leaf, Sun, Sunrise, Wine, Cigarette, Utensils, Edit3 } from 'lucide-react';
import DayColorInfo from '@/components/ui/DayColorTooltip';
import DynamicIcon from '@/components/ui/DynamicIcon';
import { 
  ALCOHOL_CONFIG, 
  CIGARETTE_CONFIG, 
  JUNKFOOD_CONFIG 
} from '@/types';

export default function TodayStats() {
  const { user } = useAuth();
  const router = useRouter();
  const today = format(new Date(), 'yyyy-MM-dd');
  const { data: dayConsumption, isLoading } = useDayConsumption(user?.uid, today);

  const handleEditToday = () => {
    router.push(`/settings?date=${today}`);
  };

  if (isLoading) {
    return (
      <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 animate-pulse">
        <div className="h-6 bg-gray-200 rounded-2xl mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded-2xl"></div>
          <div className="h-4 bg-gray-200 rounded-2xl w-3/4"></div>
        </div>
      </div>
    );
  }

  const totalConsumptions = dayConsumption ? getTotalConsumptions(dayConsumption) : 0;
  const weightedScore = dayConsumption ? calculateDayWeight(dayConsumption) : 0;
  const dayColor = getDayColorByWeight(weightedScore);
  
  const colorConfig = {
    green: { bg: 'bg-emerald-500', text: 'Journée sereine !', icon: Flower2 },
    yellow: { bg: 'bg-amber-400', text: 'En équilibre', icon: Leaf },
    orange: { bg: 'bg-orange-400', text: 'Avec bienveillance', icon: Sun },
    red: { bg: 'bg-rose-400', text: 'Journée difficile', icon: Sunrise },
  };

  const currentColorConfig = colorConfig[dayColor];

  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-gray-800 mb-2">
            Aujourd&apos;hui
          </h2>
          <p className="text-gray-600 text-sm">
            {format(new Date(), 'EEEE dd MMMM yyyy', { locale: fr })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleEditToday}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors duration-200 text-slate-700 hover:text-slate-800 text-sm font-medium"
            title="Modifier les données d'aujourd'hui"
          >
            <Edit3 className="w-4 h-4" />
            <span className="hidden sm:inline">Modifier</span>
          </button>
          <div className={`w-6 h-6 rounded-full ${currentColorConfig.bg} shadow-md`}></div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center">
          <currentColorConfig.icon className="w-8 h-8 text-emerald-600" />
        </div>
        <div>
          <p className="text-xl font-medium text-gray-800">{currentColorConfig.text}</p>
          <p className="text-gray-600 text-sm">Votre état d&apos;équilibre</p>
        </div>
      </div>

      {totalConsumptions === 0 ? (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Flower2 className="w-10 h-10 text-white" />
          </div>
          <p className="text-emerald-600 text-xl font-semibold mb-2">Journée sereine !</p>
          <p className="text-gray-600">Votre équilibre est parfait aujourd&apos;hui</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-emerald-700">{totalConsumptions}</span>
            </div>
            <p className="text-gray-700 font-medium">
              {totalConsumptions === 1 ? 'Une prise de conscience' : `${totalConsumptions} prises de conscience`}
            </p>
            <p className="text-gray-500 text-sm">aujourd&apos;hui</p>
          </div>

          {/* Détail par catégorie */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Alcool */}
            {dayConsumption?.alcohol && dayConsumption.alcohol.length > 0 && (
              <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                <div className="flex items-center gap-2 mb-3">
                  <Wine className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-700">Alcool</span>
                </div>
                <div className="space-y-2">
                  {dayConsumption.alcohol.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-purple-600 flex items-center gap-2">
                        <DynamicIcon name={ALCOHOL_CONFIG[item.type].icon} className="w-4 h-4" />
                        {ALCOHOL_CONFIG[item.type].label}
                      </span>
                      <span className="text-purple-800 font-medium">×{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cigarettes */}
            {dayConsumption?.cigarettes && dayConsumption.cigarettes.length > 0 && (
              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <div className="flex items-center gap-2 mb-3">
                  <Cigarette className="w-5 h-5 text-orange-600" />
                  <span className="font-medium text-orange-700">Cigarettes</span>
                </div>
                <div className="space-y-2">
                  {dayConsumption.cigarettes.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-orange-600 flex items-center gap-2">
                        <DynamicIcon name={CIGARETTE_CONFIG[item.type].icon} className="w-4 h-4" />
                        {CIGARETTE_CONFIG[item.type].label}
                      </span>
                      <span className="text-orange-800 font-medium">×{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Malbouffe */}
            {dayConsumption?.junkfood && dayConsumption.junkfood.length > 0 && (
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <Utensils className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-700">Nutrition</span>
                </div>
                <div className="space-y-2">
                  {dayConsumption.junkfood.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-blue-600 flex items-center gap-2">
                        <DynamicIcon name={JUNKFOOD_CONFIG[item.type].icon} className="w-4 h-4" />
                        {JUNKFOOD_CONFIG[item.type].label}
                      </span>
                      <span className="text-blue-800 font-medium">×{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
