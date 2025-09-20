import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
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
  DayConsumption, 
  AlcoholType, 
  CigaretteType, 
  JunkfoodType,
  AlcoholConsumption,
  CigaretteConsumption,
  JunkfoodConsumption
} from '@/types';

// Obtenir les consommations d'un jour spécifique
export const getDayConsumption = async (
  userId: string, 
  date: string
): Promise<DayConsumption | null> => {
  try {
    const docRef = doc(db, 'users', userId, 'consumptions', date);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as DayConsumption;
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération des consommations:', error);
    throw error;
  }
};

// Ajouter une consommation
export const addConsumption = async (
  userId: string,
  date: string,
  category: 'alcohol' | 'cigarettes' | 'junkfood',
  type: AlcoholType | CigaretteType | JunkfoodType,
  quantity: number = 1
) => {
  try {
    const docRef = doc(db, 'users', userId, 'consumptions', date);
    const docSnap = await getDoc(docRef);
    
    let dayData: DayConsumption;
    
    if (docSnap.exists()) {
      // Mettre à jour le document existant
      dayData = docSnap.data() as DayConsumption;
      
      // Trouver si le type existe déjà
      const categoryArray = dayData[category];
      const existingIndex = categoryArray.findIndex(item => item.type === type);
      
      if (existingIndex >= 0) {
        // Incrémenter la quantité existante
        categoryArray[existingIndex].quantity += quantity;
      } else {
        // Ajouter un nouvel élément
        categoryArray.push({ type, quantity } as any);
      }
      
      await updateDoc(docRef, {
        [category]: categoryArray,
      });
    } else {
      // Créer un nouveau document
      dayData = {
        date,
        alcohol: [],
        cigarettes: [],
        junkfood: [],
        createdAt: new Date().toISOString(),
      };
      
      dayData[category].push({ type, quantity } as any);
      
      await setDoc(docRef, dayData);
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la consommation:', error);
    throw error;
  }
};

// Obtenir les consommations d'une période
export const getConsumptionsInRange = async (
  userId: string,
  startDate: string,
  endDate: string
): Promise<DayConsumption[]> => {
  try {
    const consumptionsRef = collection(db, 'users', userId, 'consumptions');
    const q = query(
      consumptionsRef,
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const consumptions: DayConsumption[] = [];
    
    querySnapshot.forEach((doc) => {
      consumptions.push(doc.data() as DayConsumption);
    });
    
    return consumptions;
  } catch (error) {
    console.error('Erreur lors de la récupération des consommations:', error);
    throw error;
  }
};

// Supprimer une consommation spécifique
export const removeConsumption = async (
  userId: string,
  date: string,
  category: 'alcohol' | 'cigarettes' | 'junkfood',
  type: AlcoholType | CigaretteType | JunkfoodType,
  quantity: number = 1
) => {
  try {
    const docRef = doc(db, 'users', userId, 'consumptions', date);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Aucune consommation trouvée pour cette date');
    }
    
    const dayData = docSnap.data() as DayConsumption;
    const categoryArray = dayData[category];
    const existingIndex = categoryArray.findIndex(item => item.type === type);
    
    if (existingIndex >= 0) {
      if (categoryArray[existingIndex].quantity > quantity) {
        // Réduire la quantité
        categoryArray[existingIndex].quantity -= quantity;
      } else {
        // Supprimer complètement l'élément
        categoryArray.splice(existingIndex, 1);
      }
      
      await updateDoc(docRef, {
        [category]: categoryArray,
      });
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de la consommation:', error);
    throw error;
  }
};

// Déplacer une consommation d'une date à une autre
export const moveConsumption = async (
  userId: string,
  oldDate: string,
  newDate: string,
  category: 'alcohol' | 'cigarettes' | 'junkfood',
  type: AlcoholType | CigaretteType | JunkfoodType,
  quantity: number
) => {
  try {
    // Supprimer de l'ancienne date
    await removeConsumption(userId, oldDate, category, type, quantity);
    
    // Ajouter à la nouvelle date
    await addConsumption(userId, newDate, category, type, quantity);
  } catch (error) {
    console.error('Erreur lors du déplacement de la consommation:', error);
    throw error;
  }
};

// Obtenir toutes les consommations d'un utilisateur (limitées à l'année courante pour les performances)
export const getAllUserConsumptions = async (userId: string): Promise<DayConsumption[]> => {
  try {
    const currentYear = new Date().getFullYear();
    const startOfYear = `${currentYear}-01-01`;
    const endOfYear = `${currentYear}-12-31`;
    
    const consumptionsRef = collection(db, 'users', userId, 'consumptions');
    const q = query(
      consumptionsRef, 
      where('date', '>=', startOfYear),
      where('date', '<=', endOfYear),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const consumptions: DayConsumption[] = [];
    
    querySnapshot.forEach((doc) => {
      consumptions.push(doc.data() as DayConsumption);
    });
    
    return consumptions;
  } catch (error) {
    console.error('Erreur lors de la récupération de toutes les consommations:', error);
    throw error;
  }
};

// Obtenir les consommations accessibles selon l'abonnement
export const getAccessibleConsumptions = async (
  userId: string, 
  hasAdvancedStats: boolean
): Promise<DayConsumption[]> => {
  try {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    let startDate: string;
    let endDate: string;
    
    if (hasAdvancedStats) {
      // Premium : accès à toute l'année courante
      startDate = `${currentYear}-01-01`;
      endDate = `${currentYear}-12-31`;
    } else {
      // Gratuit : accès aux 7 derniers jours
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      startDate = sevenDaysAgo.toISOString().split('T')[0];
      endDate = today.toISOString().split('T')[0];
    }
    
    const consumptionsRef = collection(db, 'users', userId, 'consumptions');
    const q = query(
      consumptionsRef, 
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const consumptions: DayConsumption[] = [];
    
    querySnapshot.forEach((doc) => {
      consumptions.push(doc.data() as DayConsumption);
    });
    
    return consumptions;
  } catch (error) {
    console.error('Erreur lors de la récupération des consommations accessibles:', error);
    throw error;
  }
};