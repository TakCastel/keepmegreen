'use client';

import { useAuth } from '@/hooks/useAuth';
import { useAddConsumption } from '@/hooks/useConsumptions';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import ConsumptionButton from '@/components/dashboard/ConsumptionButton';
import TodayStats from '@/components/dashboard/TodayStats';
import InfoBanner from '@/components/ui/InfoBanner';
// import { ConsumptionButtonSkeleton } from '@/components/ui/Skeleton';
import { AlcoholType, CigaretteType, JunkfoodType } from '@/types';
import { Sprout, Heart, Leaf, Flower, LifeBuoy } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const addConsumption = useAddConsumption();

  const handleAddConsumption = async (
    category: 'alcohol' | 'cigarettes' | 'junkfood',
    type: AlcoholType | CigaretteType | JunkfoodType
  ) => {
    if (!user) return;

    const today = format(new Date(), 'yyyy-MM-dd');

    try {
      await addConsumption.mutateAsync({
        userId: user.uid,
        date: today,
        category,
        type,
        quantity: 1,
      });
      
      // Toast de succès
      toast.success('Consommation ajoutée !', {
        duration: 2000,
      });
    } catch {
      toast.error('Erreur lors de l\'ajout de la consommation');
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
            Votre espace <span className="font-semibold text-emerald-600">bien-être</span>
          </h1>
        </div>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
          Enregistrez vos consommations quotidiennes et suivez votre progression vers un mode de vie plus équilibré
        </p>
      </div>

      {/* Boutons d'ajout de consommations */}
      <div className="relative z-10">
        <InfoBanner />
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <ConsumptionButton
            category="alcohol"
            onAdd={(type) => handleAddConsumption('alcohol', type as AlcoholType)}
            disabled={addConsumption.isPending}
          />
          
          <ConsumptionButton
            category="cigarettes"
            onAdd={(type) => handleAddConsumption('cigarettes', type as CigaretteType)}
            disabled={addConsumption.isPending}
          />
          
          <ConsumptionButton
            category="junkfood"
            onAdd={(type) => handleAddConsumption('junkfood', type as JunkfoodType)}
            disabled={addConsumption.isPending}
          />
        </div>

        {addConsumption.isPending && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-50 rounded-full">
              <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-emerald-700 font-medium">Enregistrement en cours...</span>
            </div>
          </div>
        )}
      </div>

      {/* Statistiques du jour */}
      <TodayStats />

      {/* Conseils zen */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-3xl p-8 border border-emerald-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-light text-gray-800">
            Méditation <span className="font-semibold text-emerald-600">quotidienne</span>
          </h3>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Sprout className="w-5 h-5 text-emerald-500 mt-1" />
              <p className="text-gray-700">
                Cultivez la <span className="text-emerald-600 font-medium">bienveillance</span> envers vous-même
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Leaf className="w-5 h-5 text-emerald-500 mt-1" />
              <p className="text-gray-700">
                Observez vos habitudes sans jugement
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Flower className="w-5 h-5 text-emerald-500 mt-1" />
              <p className="text-gray-700">
                Célébrez chaque petit <span className="text-emerald-600 font-medium">progrès</span>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <LifeBuoy className="w-5 h-5 text-emerald-500 mt-1" />
              <p className="text-gray-700">
                Cherchez l&apos;équilibre, pas la perfection
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
                <strong>Usage personnel :</strong> Cette application sert uniquement à prendre conscience de vos habitudes. 
                Aucun jugement n'est porté sur vos choix personnels.
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
