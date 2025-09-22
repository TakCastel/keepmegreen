'use client';

import { useAuth } from '@/hooks/useAuth';
import { useAddActivity } from '@/hooks/useActivities';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import ActivityButton from '@/components/dashboard/ActivityButton';
import TodayActivities from '@/components/dashboard/TodayActivities';
import SubscriptionStatus from '@/components/dashboard/SubscriptionStatus';
import InfoBanner from '@/components/ui/InfoBanner';
import CalendarDebug from '@/components/debug/CalendarDebug';
// import { ActivityButtonSkeleton } from '@/components/ui/Skeleton';
import { SportType, SocialType, NutritionType } from '@/types';
import { Sprout, Heart, Leaf, Flower, LifeBuoy } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const addActivity = useAddActivity();

  const handleAddActivity = async (
    category: 'sport' | 'social' | 'nutrition',
    type: SportType | SocialType | NutritionType
  ) => {
    if (!user) return;

    const today = format(new Date(), 'yyyy-MM-dd');

    try {
      await addActivity.mutateAsync({
        userId: user.uid,
        date: today,
        category,
        type,
        quantity: 1,
      });
      
      // Toast de succès
      toast.success('Activité ajoutée !', {
        duration: 2000,
      });
    } catch {
      toast.error('Erreur lors de l\'ajout de l\'activité');
    }
  };

  return (
    <div className="space-y-10">
      {/* En-tête */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="hidden md:flex w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl items-center justify-center shadow-lg">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl md:text-2xl font-light text-gray-800">
            Votre espace de <span className="font-semibold text-emerald-600">bien-être</span>
          </h1>
        </div>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
          Enregistrez vos activités positives quotidiennes et célébrez vos progrès
        </p>
      </div>

      {/* Boutons d'ajout d'activités */}
      <div className="relative z-10">
        <InfoBanner />
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <ActivityButton
            category="sport"
            onAdd={(type) => handleAddActivity('sport', type as SportType)}
            disabled={addActivity.isPending}
            isLoading={addActivity.isPending}
          />
          
          <ActivityButton
            category="social"
            onAdd={(type) => handleAddActivity('social', type as SocialType)}
            disabled={addActivity.isPending}
            isLoading={addActivity.isPending}
          />
          
          <ActivityButton
            category="nutrition"
            onAdd={(type) => handleAddActivity('nutrition', type as NutritionType)}
            disabled={addActivity.isPending}
            isLoading={addActivity.isPending}
          />
        </div>

      </div>

      {/* Activités du jour */}
      <TodayActivities />

      {/* Debug calendrier */}
      <CalendarDebug />

      {/* Statut d'abonnement */}
      <SubscriptionStatus />

      {/* Conseils motivationnels */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-3xl p-8 border border-emerald-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-light text-gray-800">
            Conseils <span className="font-semibold text-emerald-600">motivationnels</span>
          </h3>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Sprout className="w-5 h-5 text-emerald-500 mt-1" />
              <p className="text-gray-700">
                Célébrez chaque <span className="text-emerald-600 font-medium">petite victoire</span>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Leaf className="w-5 h-5 text-emerald-500 mt-1" />
              <p className="text-gray-700">
                Construisez des habitudes positives progressivement
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Flower className="w-5 h-5 text-emerald-500 mt-1" />
              <p className="text-gray-700">
                Notez chaque <span className="text-emerald-600 font-medium">activité positive</span>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <LifeBuoy className="w-5 h-5 text-emerald-500 mt-1" />
              <p className="text-gray-700">
                Visualisez vos progrès et restez motivé
              </p>
            </div>
          </div>
        </div>
        
        {/* Disclaimers légaux et médicaux */}
        <div className="mt-8 pt-6 border-t border-emerald-200">
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                <strong>Disclaimer médical :</strong> Cette application ne remplace pas un suivi médical professionnel. 
                Consultez un professionnel de santé pour toute question concernant votre bien-être.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                <strong>Usage motivationnel :</strong> Cette application vous aide à célébrer vos activités positives. 
                Chaque petite action compte dans votre parcours de bien-être.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                <strong>Confidentialité :</strong> Vos données sont privées et ne sont pas partagées avec des tiers. 
                Vous restez maître de vos informations personnelles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
