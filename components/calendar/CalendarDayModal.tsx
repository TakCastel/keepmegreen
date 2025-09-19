'use client';

import { createPortal } from 'react-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDayConsumption } from '@/hooks/useConsumptions';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { X, Edit3 } from 'lucide-react';
import { CalendarDay } from '@/types';
import { 
  ALCOHOL_CONFIG, 
  CIGARETTE_CONFIG, 
  JUNKFOOD_CONFIG 
} from '@/types';
import { Sprout, Wine, Cigarette, Utensils, Flower, Leaf, Sun, Sunrise } from 'lucide-react';
import DynamicIcon from '@/components/ui/DynamicIcon';

interface CalendarDayModalProps {
  day: CalendarDay;
  onClose: () => void;
}

export default function CalendarDayModal({ day, onClose }: CalendarDayModalProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { data: dayConsumption, isLoading } = useDayConsumption(user?.uid, day.date);

  const handleEditDay = () => {
    router.push(`/settings?date=${day.date}`);
    onClose();
  };

  const colorConfig = {
    green: { bg: 'bg-emerald-500', text: 'Journée sereine !', icon: Flower },
    yellow: { bg: 'bg-amber-400', text: 'En équilibre', icon: Leaf },
    orange: { bg: 'bg-orange-400', text: 'Avec bienveillance', icon: Sun },
    red: { bg: 'bg-rose-400', text: 'Journée difficile', icon: Sunrise },
  };

  const currentColorConfig = colorConfig[day.color];

  if (typeof window === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto border border-white/20">
        {/* En-tête */}
        <div className="flex items-center justify-between p-8 border-b border-gray-200">
          <div>
            <h3 className="text-2xl font-light text-gray-800 mb-2">
              {format(new Date(day.date), 'dd MMMM yyyy', { locale: fr })}
            </h3>
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${currentColorConfig.bg} shadow-md`}></div>
              <span className="text-gray-600 text-sm font-medium">{currentColorConfig.text}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleEditDay}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors duration-200 text-slate-700 hover:text-slate-800 text-sm font-medium"
              title="Modifier les données de ce jour"
            >
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:inline">Modifier</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-8">
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded-2xl animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-2xl animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded-2xl animate-pulse w-1/2"></div>
            </div>
          ) : !dayConsumption || day.totalConsumptions === 0 ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Sprout className="w-10 h-10 text-white" />
              </div>
              <p className="text-emerald-600 text-xl font-semibold mb-2">Journée sereine !</p>
              <p className="text-gray-600">Aucune prise de conscience enregistrée pour cette journée</p>
            </div>
          ) : (
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
                {dayConsumption.alcohol && dayConsumption.alcohol.length > 0 && (
                  <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center">
                        <Wine className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold text-purple-700">Alcool</span>
                    </div>
                    <div className="space-y-3">
                      {dayConsumption.alcohol.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <DynamicIcon name={ALCOHOL_CONFIG[item.type].icon} className="w-5 h-5 text-purple-600" />
                            <div>
                              <span className="text-purple-700 font-medium">{ALCOHOL_CONFIG[item.type].label}</span>
                              {ALCOHOL_CONFIG[item.type].volume && (
                                <span className="text-purple-600 text-sm ml-1">
                                  ({ALCOHOL_CONFIG[item.type].volume})
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-purple-800 font-medium bg-purple-100 px-2 py-1 rounded-full text-sm">×{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cigarettes */}
                {dayConsumption.cigarettes && dayConsumption.cigarettes.length > 0 && (
                  <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center">
                        <Cigarette className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold text-orange-700">Cigarettes</span>
                    </div>
                    <div className="space-y-3">
                      {dayConsumption.cigarettes.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <DynamicIcon name={CIGARETTE_CONFIG[item.type].icon} className="w-5 h-5 text-orange-600" />
                            <span className="text-orange-700 font-medium">{CIGARETTE_CONFIG[item.type].label}</span>
                          </div>
                          <span className="text-orange-800 font-medium bg-orange-100 px-2 py-1 rounded-full text-sm">×{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nutrition */}
                {dayConsumption.junkfood && dayConsumption.junkfood.length > 0 && (
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
                        <Utensils className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold text-blue-700">Nutrition</span>
                    </div>
                    <div className="space-y-3">
                      {dayConsumption.junkfood.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <DynamicIcon name={JUNKFOOD_CONFIG[item.type].icon} className="w-5 h-5 text-blue-600" />
                            <span className="text-blue-700 font-medium">{JUNKFOOD_CONFIG[item.type].label}</span>
                          </div>
                          <span className="text-blue-800 font-medium bg-blue-100 px-2 py-1 rounded-full text-sm">×{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
