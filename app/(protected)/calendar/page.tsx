'use client';

import CalendarGrid from '@/components/calendar/CalendarGrid';
import { Calendar, User, BarChart3, Flower, Leaf } from 'lucide-react';
import { useInstantNavigation } from '@/hooks/useInstantNavigation';
import FloatingActionMenu from '@/components/ui/FloatingActionMenu';
import { useAuth } from '@/hooks/useAuth';
import { useAddActivity } from '@/hooks/useActivities';
import { format } from 'date-fns';
import { SportType, SocialType, NutritionType } from '@/types';

export default function CalendarPage() {
  // Forcer le refetch des données à chaque navigation vers cette page
  useInstantNavigation();
  const { user } = useAuth();
  const addActivity = useAddActivity();

  const handleAddActivity = async (
    category: 'sport' | 'social' | 'nutrition',
    type: SportType | SocialType | NutritionType
  ) => {
    if (!user) return;
    const today = format(new Date(), 'yyyy-MM-dd');
    await addActivity.mutateAsync({
      userId: user.uid,
      date: today,
      category,
      type,
      quantity: 1,
    });
  };

  return (
    <div className="space-y-6 md:space-y-10">
      {/* En-tête */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="hidden md:flex w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl items-center justify-center shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl md:text-2xl font-light text-gray-800">
            Calendrier d&apos;<span className="font-semibold text-emerald-600">observation</span>
          </h1>
        </div>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
          Visualisez votre année complète avec un calendrier coloré qui révèle vos patterns de consommation jour après jour
        </p>
      </div>

      {/* Grille du calendrier */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-white/20">
        <CalendarGrid />
      </div>

      {/* FAB mobile flottant */}
      <FloatingActionMenu
        disabled={addActivity.isPending}
        onSelect={(category, type) =>
          handleAddActivity(
            category,
            type as SportType | SocialType | NutritionType
          )
        }
      />

      {/* Conseils zen */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl md:rounded-3xl p-4 md:p-8 border border-emerald-100">
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl md:rounded-2xl flex items-center justify-center">
            <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <h3 className="text-lg md:text-xl font-light text-gray-800">
            Navigation <span className="font-semibold text-emerald-600">interactive</span>
          </h3>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Flower className="w-5 h-5 text-emerald-500 mt-1" />
              <p className="text-gray-700">
                Cliquez sur un jour pour explorer vos <span className="text-emerald-600 font-medium">consommations</span>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Leaf className="w-5 h-5 text-emerald-500 mt-1" />
              <p className="text-gray-700">
                Observez vos <span className="text-emerald-600 font-medium">patterns</span> dans chaque journée
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-emerald-500 mt-1" />
              <p className="text-gray-700">
                Naviguez dans le temps pour observer vos <span className="text-emerald-600 font-medium">tendances</span>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <BarChart3 className="w-5 h-5 text-emerald-500 mt-1" />
              <p className="text-gray-700">
                Les métriques vous offrent une vue d&apos;ensemble claire
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
