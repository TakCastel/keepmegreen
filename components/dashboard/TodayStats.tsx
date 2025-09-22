'use client';

import { useDayConsumption } from '@/hooks/useConsumptions';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { getTotalConsumptions, calculateDayWeight, getDayColorByWeight, getConsumptionMoodIcon } from '@/utils/stats';
import { Flower2, Leaf, Sun, Sunrise, Wine, Cigarette, Utensils, Edit3 } from 'lucide-react';
// import DayColorInfo from '@/components/ui/DayColorTooltip';
import DynamicIcon from '@/components/ui/DynamicIcon';
import AnimatedPip from '@/components/ui/AnimatedPip';
import { 
  ALCOHOL_CONFIG, 
  CIGARETTE_CONFIG, 
  JUNKFOOD_CONFIG 
} from '@/types';
import { CATEGORY_COLORS } from '@/constants/colors';

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
      <div className="bg-transparent md:bg-white/70 backdrop-blur-lg rounded-3xl p-8 md:shadow-xl md:border md:border-white/20 animate-pulse">
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
  
  // Obtenir l'icône, la couleur et le fond appropriés selon l'état d'équilibre réel
  const { icon: MoodIcon, color: moodColor, bgGradient: moodBgGradient } = getConsumptionMoodIcon(dayConsumption);
  
  const colorConfig = {
    green: { bg: 'bg-emerald-500', text: 'Journée sereine !' },
    yellow: { bg: 'bg-amber-400', text: 'En équilibre' },
    orange: { bg: 'bg-orange-400', text: 'Avec bienveillance' },
    red: { bg: 'bg-rose-400', text: 'Journée intense' },
  };

  const currentColorConfig = colorConfig[dayColor];

  // Affichage façon "points de vie" (pips) pour représenter les quantités
  const renderPips = (count: number, colorClass: string) => {
    const maxVisible = 12;
    const visible = Math.min(count, maxVisible);
    const extra = count - visible;
    return (
      <div className="flex items-center gap-1 flex-wrap">
        {Array.from({ length: visible }).map((_, i) => (
          <AnimatedPip
            key={i}
            colorClass={colorClass}
            index={i}
            totalCount={visible}
          />
        ))}
        {extra > 0 && (
          <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 animate-pulse">+{extra}</span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-transparent md:bg-white/70 backdrop-blur-lg rounded-3xl p-8 md:shadow-xl md:border md:border-white/20">
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
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className={`w-16 h-16 bg-gradient-to-br ${moodBgGradient} rounded-full flex items-center justify-center`}>
          <MoodIcon className={`w-8 h-8 ${moodColor}`} />
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
              <div className={`${CATEGORY_COLORS.alcohol.chartLight} rounded-2xl p-4 border border-pink-200`}>
                <div className="flex items-center gap-2 mb-3">
                  <Wine className={`w-5 h-5 ${CATEGORY_COLORS.alcohol.textMedium}`} />
                  <span className={`font-medium ${CATEGORY_COLORS.alcohol.textMedium}`}>Alcool</span>
                </div>
                <div className="space-y-2">
                  {dayConsumption.alcohol.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className={`${CATEGORY_COLORS.alcohol.textMedium} flex items-center gap-2`}>
                        <DynamicIcon name={ALCOHOL_CONFIG[item.type].icon} className="w-4 h-4" />
                        {ALCOHOL_CONFIG[item.type].label}
                      </span>
                      <span className="flex items-center">
                        {renderPips(item.quantity, CATEGORY_COLORS.alcohol.bgDot || 'bg-pink-500')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cigarettes */}
            {dayConsumption?.cigarettes && dayConsumption.cigarettes.length > 0 && (
              <div className={`${CATEGORY_COLORS.cigarettes.chartLight} rounded-2xl p-4 border border-violet-200`}>
                <div className="flex items-center gap-2 mb-3">
                  <Cigarette className={`w-5 h-5 ${CATEGORY_COLORS.cigarettes.textMedium}`} />
                  <span className={`font-medium ${CATEGORY_COLORS.cigarettes.textMedium}`}>Cigarettes</span>
                </div>
                <div className="space-y-2">
                  {dayConsumption.cigarettes.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className={`${CATEGORY_COLORS.cigarettes.textMedium} flex items-center gap-2`}>
                        <DynamicIcon name={CIGARETTE_CONFIG[item.type].icon} className="w-4 h-4" />
                        {CIGARETTE_CONFIG[item.type].label}
                      </span>
                      <span className="flex items-center">
                        {renderPips(item.quantity, CATEGORY_COLORS.cigarettes.bgDot || 'bg-violet-500')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Malbouffe */}
            {dayConsumption?.junkfood && dayConsumption.junkfood.length > 0 && (
              <div className={`${CATEGORY_COLORS.junkfood.chartLight} rounded-2xl p-4 border border-blue-200`}>
                <div className="flex items-center gap-2 mb-3">
                  <Utensils className={`w-5 h-5 ${CATEGORY_COLORS.junkfood.textMedium}`} />
                  <span className={`font-medium ${CATEGORY_COLORS.junkfood.textMedium}`}>Nutrition</span>
                </div>
                <div className="space-y-2">
                  {dayConsumption.junkfood.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className={`${CATEGORY_COLORS.junkfood.textMedium} flex items-center gap-2`}>
                        <DynamicIcon name={JUNKFOOD_CONFIG[item.type].icon} className="w-4 h-4" />
                        {JUNKFOOD_CONFIG[item.type].label}
                      </span>
                      <span className="flex items-center">
                        {renderPips(item.quantity, CATEGORY_COLORS.junkfood.bgDot || 'bg-blue-500')}
                      </span>
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
