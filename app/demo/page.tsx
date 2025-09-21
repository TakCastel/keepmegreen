'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import ActivityButton from '@/components/dashboard/ActivityButton';
import TodayActivities from '@/components/dashboard/TodayActivities';
import InfoBanner from '@/components/ui/InfoBanner';
import { SportType, SocialType, NutritionType } from '@/types';
import { Sprout, Heart, Leaf, Flower, LifeBuoy, Eye, X, Zap, Users, Apple } from 'lucide-react';
import Link from 'next/link';

// Types pour les données de démo
interface DemoActivity {
  id: string;
  userId: string;
  date: string;
  category: 'sport' | 'social' | 'nutrition';
  type: SportType | SocialType | NutritionType;
  quantity: number;
  timestamp: number;
}

// Données factices initiales pour la démo
const generateDemoData = (): DemoActivity[] => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(new Date(Date.now() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  const twoDaysAgo = format(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  
  return [
    {
      id: 'demo-1',
      userId: 'demo-user',
      date: twoDaysAgo,
      category: 'sport',
      type: 'running',
      quantity: 1,
      timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000
    },
    {
      id: 'demo-2',
      userId: 'demo-user',
      date: twoDaysAgo,
      category: 'social',
      type: 'friends',
      quantity: 1,
      timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000 + 1000
    },
    {
      id: 'demo-3',
      userId: 'demo-user',
      date: yesterday,
      category: 'nutrition',
      type: 'balanced_meal',
      quantity: 2,
      timestamp: Date.now() - 24 * 60 * 60 * 1000
    },
    {
      id: 'demo-4',
      userId: 'demo-user',
      date: yesterday,
      category: 'sport',
      type: 'yoga',
      quantity: 1,
      timestamp: Date.now() - 24 * 60 * 60 * 1000 + 1000
    },
    {
      id: 'demo-5',
      userId: 'demo-user',
      date: today,
      category: 'social',
      type: 'family',
      quantity: 1,
      timestamp: Date.now() - 2 * 60 * 60 * 1000
    }
  ];
};

export default function DemoPage() {
  const [activities, setActivities] = useState<DemoActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialiser les données de démo
  useEffect(() => {
    const storedData = localStorage.getItem('demo-activities');
    if (storedData) {
      setActivities(JSON.parse(storedData));
    } else {
      const initialData = generateDemoData();
      setActivities(initialData);
      localStorage.setItem('demo-activities', JSON.stringify(initialData));
    }
  }, []);

  // Nettoyer les données à la fermeture de la page
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('demo-activities');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      localStorage.removeItem('demo-activities');
    };
  }, []);

  const handleAddActivity = async (
    category: 'sport' | 'social' | 'nutrition',
    type: SportType | SocialType | NutritionType
  ) => {
    setIsLoading(true);
    
    // Simuler un délai d'API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const today = format(new Date(), 'yyyy-MM-dd');
    const newActivity: DemoActivity = {
      id: `demo-${Date.now()}`,
      userId: 'demo-user',
      date: today,
      category,
      type,
      quantity: 1,
      timestamp: Date.now()
    };

    const updatedActivities = [...activities, newActivity];
    setActivities(updatedActivities);
    localStorage.setItem('demo-activities', JSON.stringify(updatedActivities));
    
    setIsLoading(false);
    
    toast.success('Activité ajoutée !', {
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50">
      {/* Bandeau de démo */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5" />
            <span className="font-medium">Mode Démo - Données factices</span>
            <span className="text-blue-100 text-sm">Toutes les données seront perdues à la fermeture</span>
          </div>
          <Link 
            href="/"
            className="flex items-center gap-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm"
          >
            <X className="w-4 h-4" />
            Fermer la démo
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-10">
          {/* En-tête */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="hidden md:flex w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl items-center justify-center shadow-lg">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl md:text-2xl font-light text-gray-800">
                Démo - Espace de <span className="font-semibold text-emerald-600">bien-être</span>
              </h1>
            </div>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
              Testez l'application avec des données factices et célébrez vos activités positives !
            </p>
          </div>

          {/* Boutons d'ajout d'activités */}
          <div className="relative z-10">
            <InfoBanner />
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <ActivityButton
                category="sport"
                onAdd={(type) => handleAddActivity('sport', type as SportType)}
                disabled={isLoading}
              />
              
              <ActivityButton
                category="social"
                onAdd={(type) => handleAddActivity('social', type as SocialType)}
                disabled={isLoading}
              />
              
              <ActivityButton
                category="nutrition"
                onAdd={(type) => handleAddActivity('nutrition', type as NutritionType)}
                disabled={isLoading}
              />
            </div>

            {isLoading && (
              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-50 rounded-full">
                  <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-emerald-700 font-medium">Enregistrement en cours...</span>
                </div>
              </div>
            )}
          </div>

          {/* Statistiques du jour - adapté pour la démo */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-light text-gray-800">
                Aujourd'hui - <span className="font-semibold text-emerald-600">Démo</span>
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['sport', 'social', 'nutrition'].map((category) => {
                const todayActivities = activities.filter(
                  a => a.date === format(new Date(), 'yyyy-MM-dd') && a.category === category
                );
                const total = todayActivities.reduce((sum, a) => sum + a.quantity, 0);
                
                const categoryInfo = {
                  sport: { label: 'Sport', icon: '⚡', color: 'text-emerald-600' },
                  social: { label: 'Social', icon: '👥', color: 'text-blue-600' },
                  nutrition: { label: 'Nutrition', icon: '🍎', color: 'text-orange-600' }
                }[category as keyof typeof categoryInfo];
                
                return (
                  <div key={category} className="text-center p-4 bg-gray-50 rounded-2xl">
                    <div className="text-2xl mb-2">{categoryInfo.icon}</div>
                    <div className={`text-2xl font-bold ${categoryInfo.color} mb-1`}>
                      {total}
                    </div>
                    <div className="text-sm text-gray-600">{categoryInfo.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

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
                  <Zap className="w-5 h-5 text-emerald-500 mt-1" />
                  <p className="text-gray-700">
                    Célébrez chaque <span className="text-emerald-600 font-medium">petite victoire</span>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-emerald-500 mt-1" />
                  <p className="text-gray-700">
                    Partagez vos moments positifs avec vos proches
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Apple className="w-5 h-5 text-emerald-500 mt-1" />
                  <p className="text-gray-700">
                    Prenez plaisir à faire de <span className="text-emerald-600 font-medium">bons choix</span>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Sprout className="w-5 h-5 text-emerald-500 mt-1" />
                  <p className="text-gray-700">
                    Regardez votre calendrier se remplir de couleurs positives !
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
                    Chaque activité enregistrée compte pour votre bien-être.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>
                    <strong>Mode démo :</strong> Toutes les données de cette démo sont factices et seront perdues à la fermeture de la page.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA pour s'inscrire */}
          <div className="text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Prêt à célébrer vos activités positives ?
              </h3>
              <p className="text-gray-600 mb-6">
                Créez votre compte gratuit pour sauvegarder vos données et accéder à toutes les fonctionnalités
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl font-medium"
              >
                Créer mon compte gratuit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
