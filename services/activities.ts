import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { format } from 'date-fns';
import { db } from '@/lib/firebase';
import { 
  DayActivities, 
  SportType, 
  SocialType, 
  NutritionType,
  SportActivity,
  SocialActivity,
  NutritionActivity
} from '@/types';

// Obtenir les activités d'un jour spécifique
export const getDayActivities = async (
  userId: string, 
  date: string
): Promise<DayActivities | null> => {
  try {
    const docRef = doc(db, 'users', userId, 'activities', date);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as DayActivities;
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération des activités:', error);
    throw error;
  }
};

// Ajouter une activité
export const addActivity = async (
  userId: string,
  date: string,
  category: 'sport' | 'social' | 'nutrition',
  type: SportType | SocialType | NutritionType,
  quantity: number = 1
): Promise<void> => {
  try {
    const docRef = doc(db, 'users', userId, 'activities', date);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // Le document existe, mettre à jour
      const existingData = docSnap.data() as DayActivities;
      const existingCategory = existingData[category] || [];
      
      // Vérifier si l'activité existe déjà
      const existingIndex = existingCategory.findIndex(item => item.type === type);
      
      if (existingIndex !== -1) {
        // Incrémenter la quantité
        const updatedCategory = [...existingCategory];
        updatedCategory[existingIndex] = {
          ...updatedCategory[existingIndex],
          quantity: updatedCategory[existingIndex].quantity + quantity,
          timestamp: new Date().toISOString()
        };
        
        await updateDoc(docRef, {
          [category]: updatedCategory,
          updatedAt: serverTimestamp()
        });
      } else {
        // Ajouter une nouvelle activité
        const newActivity = {
          type,
          quantity,
          timestamp: new Date().toISOString()
        };
        
        await updateDoc(docRef, {
          [category]: [...existingCategory, newActivity],
          updatedAt: serverTimestamp()
        });
      }
    } else {
      // Le document n'existe pas, le créer
      const newDayActivities: DayActivities = {
        date,
        sport: category === 'sport' ? [{
          type: type as SportType,
          quantity,
          timestamp: new Date().toISOString()
        }] : [],
        social: category === 'social' ? [{
          type: type as SocialType,
          quantity,
          timestamp: new Date().toISOString()
        }] : [],
        nutrition: category === 'nutrition' ? [{
          type: type as NutritionType,
          quantity,
          timestamp: new Date().toISOString()
        }] : [],
        createdAt: new Date().toISOString()
      };
      
      await setDoc(docRef, {
        ...newDayActivities,
        createdAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'activité:', error);
    throw error;
  }
};

// Supprimer une activité
export const removeActivity = async (
  userId: string,
  date: string,
  category: 'sport' | 'social' | 'nutrition',
  type: SportType | SocialType | NutritionType,
  quantity: number = 1
): Promise<void> => {
  try {
    const docRef = doc(db, 'users', userId, 'activities', date);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const existingData = docSnap.data() as DayActivities;
      const existingCategory = existingData[category] || [];
      
      // Trouver l'activité à modifier
      const existingIndex = existingCategory.findIndex(item => item.type === type);
      
      if (existingIndex !== -1) {
        const updatedCategory = [...existingCategory];
        const newQuantity = updatedCategory[existingIndex].quantity - quantity;
        
        if (newQuantity <= 0) {
          // Supprimer complètement l'activité
          updatedCategory.splice(existingIndex, 1);
        } else {
          // Mettre à jour la quantité
          updatedCategory[existingIndex] = {
            ...updatedCategory[existingIndex],
            quantity: newQuantity,
            timestamp: new Date().toISOString()
          };
        }
        
        // Vérifier si le document est vide
        const hasAnyActivity = updatedCategory.length > 0 || 
                              (category !== 'sport' && existingData.sport.length > 0) ||
                              (category !== 'social' && existingData.social.length > 0) ||
                              (category !== 'nutrition' && existingData.nutrition.length > 0);
        
        if (hasAnyActivity) {
          await updateDoc(docRef, {
            [category]: updatedCategory,
            updatedAt: serverTimestamp()
          });
        } else {
          // Supprimer le document s'il est vide
          await deleteDoc(docRef);
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'activité:', error);
    throw error;
  }
};

// Déplacer une activité d'un jour à un autre
export const moveActivity = async (
  userId: string,
  oldDate: string,
  newDate: string,
  category: 'sport' | 'social' | 'nutrition',
  type: SportType | SocialType | NutritionType,
  quantity: number
): Promise<void> => {
  try {
    // Supprimer de l'ancienne date
    await removeActivity(userId, oldDate, category, type, quantity);
    
    // Ajouter à la nouvelle date
    await addActivity(userId, newDate, category, type, quantity);
  } catch (error) {
    console.error('Erreur lors du déplacement de l\'activité:', error);
    throw error;
  }
};

// Obtenir les activités dans une plage de dates
export const getActivitiesInRange = async (
  userId: string,
  startDate: string,
  endDate: string
): Promise<DayActivities[]> => {
  try {
    const activitiesRef = collection(db, 'users', userId, 'activities');
    const q = query(
      activitiesRef,
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const activities: DayActivities[] = [];
    
    querySnapshot.forEach((doc) => {
      activities.push(doc.data() as DayActivities);
    });
    
    return activities;
  } catch (error) {
    console.error('Erreur lors de la récupération des activités:', error);
    throw error;
  }
};

// Obtenir toutes les activités d'un utilisateur
export const getAllUserActivities = async (userId: string): Promise<DayActivities[]> => {
  try {
    const activitiesRef = collection(db, 'users', userId, 'activities');
    const q = query(activitiesRef, orderBy('date', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const activities: DayActivities[] = [];
    
    querySnapshot.forEach((doc) => {
      activities.push(doc.data() as DayActivities);
    });
    
    return activities;
  } catch (error) {
    console.error('Erreur lors de la récupération de toutes les activités:', error);
    throw error;
  }
};

// Obtenir les activités accessibles selon l'abonnement
export const getAccessibleActivities = async (
  userId: string,
  hasAdvancedStats: boolean
): Promise<DayActivities[]> => {
  try {
    if (hasAdvancedStats) {
      // Utilisateur premium : accès à toutes les activités
      return await getAllUserActivities(userId);
    } else {
      // Utilisateur gratuit : seulement les 30 derniers jours
      const thirtyDaysAgo = format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
      const today = format(new Date(), 'yyyy-MM-dd');
      
      return await getActivitiesInRange(userId, thirtyDaysAgo, today);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des activités accessibles:', error);
    throw error;
  }
};
