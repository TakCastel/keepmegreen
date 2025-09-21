'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { addActivity } from '@/services/activities';
import { format, subDays, addDays } from 'date-fns';
import { 
  SportType, 
  SocialType, 
  NutritionType, 
  SPORT_CONFIG, 
  SOCIAL_CONFIG, 
  NUTRITION_CONFIG 
} from '@/types';
import { Database, Loader2 } from 'lucide-react';

export default function TestDataGenerator() {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDays, setGeneratedDays] = useState(0);

  // Vérifier si c'est l'utilisateur de test
  const isTestUser = user?.email === 'takcastel@gmail.com';

  if (!isTestUser) {
    return null;
  }

  const generateRandomActivity = (type: SportType | SocialType | NutritionType, category: 'sport' | 'social' | 'nutrition') => {
    const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 activités
    return {
      type,
      quantity,
      timestamp: new Date().toISOString()
    };
  };

  const generateDayData = async (date: string) => {
    const activities = {
      sport: [] as any[],
      social: [] as any[],
      nutrition: [] as any[]
    };

    // Générer des activités sport (probabilité 60%)
    if (Math.random() < 0.6) {
      const sportTypes = Object.keys(SPORT_CONFIG) as SportType[];
      const randomSport = sportTypes[Math.floor(Math.random() * sportTypes.length)];
      activities.sport.push(generateRandomActivity(randomSport, 'sport'));
    }

    // Générer des activités sociales (probabilité 40%)
    if (Math.random() < 0.4) {
      const socialTypes = Object.keys(SOCIAL_CONFIG) as SocialType[];
      const randomSocial = socialTypes[Math.floor(Math.random() * socialTypes.length)];
      activities.social.push(generateRandomActivity(randomSocial, 'social'));
    }

    // Générer des activités nutrition (probabilité 80%)
    if (Math.random() < 0.8) {
      const nutritionTypes = Object.keys(NUTRITION_CONFIG) as NutritionType[];
      const randomNutrition = nutritionTypes[Math.floor(Math.random() * nutritionTypes.length)];
      activities.nutrition.push(generateRandomActivity(randomNutrition, 'nutrition'));
      
      // Parfois ajouter une deuxième activité nutrition
      if (Math.random() < 0.5) {
        const anotherNutrition = nutritionTypes[Math.floor(Math.random() * nutritionTypes.length)];
        activities.nutrition.push(generateRandomActivity(anotherNutrition, 'nutrition'));
      }
    }

    // Ajouter les activités à la base de données
    const userId = user?.uid;
    if (!userId) return;

    try {
      // Créer le document de la journée
      const { setDoc, doc, serverTimestamp } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      
      const docRef = doc(db, 'users', userId, 'activities', date);
      await setDoc(docRef, {
        date,
        sport: activities.sport,
        social: activities.social,
        nutrition: activities.nutrition,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Erreur lors de la génération des données:', error);
      throw error;
    }
  };

  const generateTestData = async () => {
    if (!user?.uid) return;

    setIsGenerating(true);
    setGeneratedDays(0);

    try {
      const today = new Date();
      const threeMonthsAgo = subDays(today, 90); // 3 mois = ~90 jours
      
      let currentDate = threeMonthsAgo;
      let processedDays = 0;

      while (currentDate <= today) {
        const dateString = format(currentDate, 'yyyy-MM-dd');
        
        // Générer des données pour environ 70% des jours (pour simuler des jours sans activité)
        if (Math.random() < 0.7) {
          await generateDayData(dateString);
          processedDays++;
        }
        
        setGeneratedDays(processedDays);
        currentDate = addDays(currentDate, 1);
        
        // Petite pause pour éviter de surcharger Firebase
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      alert(`Données de test générées avec succès ! ${processedDays} jours d'activités créés sur les 3 derniers mois.`);
    } catch (error) {
      console.error('Erreur lors de la génération des données de test:', error);
      alert('Erreur lors de la génération des données de test. Vérifiez la console pour plus de détails.');
    } finally {
      setIsGenerating(false);
      setGeneratedDays(0);
    }
  };

  const generateSingleDay = async () => {
    if (!user?.uid) return;

    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      await generateDayData(today);
      alert(`Données générées pour aujourd'hui (${today}) !`);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération des données du jour.');
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
          <Database className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-purple-800">
            Générateur de données de test
          </h3>
          <p className="text-sm text-purple-600">
            Outil de développement - Génère 3 mois de données aléatoires
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="bg-white/70 rounded-xl p-4 border border-purple-200">
          <p className="text-sm text-purple-700 mb-3">
            Cet outil génère automatiquement 3 mois de données d'activités aléatoires 
            réparties sur différentes catégories (sport, social, nutrition) pour faciliter 
            les tests de l'application.
          </p>
          
          {isGenerating && (
            <div className="bg-purple-100 rounded-lg p-3 mb-3">
              <div className="flex items-center gap-2 text-purple-700">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">
                  Génération en cours... {generatedDays} jours traités
                </span>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <button
              onClick={generateTestData}
              disabled={isGenerating}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                isGenerating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  Générer 3 mois de données de test
                </>
              )}
            </button>
            
            <button
              onClick={generateSingleDay}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition-all bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg text-sm"
            >
              <Database className="w-4 h-4" />
              Générer données pour aujourd'hui
            </button>
          </div>
        </div>
        
        <div className="text-xs text-purple-600 bg-purple-50 rounded-lg p-3 border border-purple-200">
          <p className="font-medium mb-1">⚠️ Attention :</p>
          <p>Cette fonctionnalité est uniquement disponible pour les utilisateurs de test. 
             Les données générées sont aléatoires et ne reflètent pas de vraies habitudes.</p>
        </div>
      </div>
    </div>
  );
}
