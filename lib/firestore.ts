import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  plan: 'free' | 'premium' | 'premium-plus';
  subscriptionEnds?: string; // ISO date string
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: any;
  updatedAt: any;
}

/**
 * Crée ou met à jour le profil utilisateur dans Firestore
 */
export async function createOrUpdateUserProfile(user: User, additionalData?: Partial<UserProfile>) {
  if (!user || !user.uid) {
    throw new Error('Utilisateur non authentifié');
  }

  const userRef = doc(db, 'users', user.uid);
  
  try {
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Nouvel utilisateur - créer le profil avec plan gratuit par défaut
      const userData: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
        plan: 'free',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...additionalData
      };

      await setDoc(userRef, userData);
      return userData;
    } else {
      // Utilisateur existant - mettre à jour seulement les champs modifiés
      const updateData = {
        email: user.email || '',
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
        updatedAt: serverTimestamp(),
        ...additionalData
      };

      await updateDoc(userRef, updateData);
      return { ...userSnap.data(), ...updateData } as UserProfile;
    }
  } catch (error) {
    console.error('Erreur dans createOrUpdateUserProfile:', error);
    throw error;
  }
}

/**
 * Récupère le profil utilisateur depuis Firestore
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }

  return null;
}

/**
 * Met à jour le plan d'abonnement de l'utilisateur
 */
export async function updateUserSubscription(
  uid: string, 
  plan: 'free' | 'premium' | 'premium-plus',
  subscriptionEnds?: string,
  stripeCustomerId?: string,
  stripeSubscriptionId?: string
) {
  const userRef = doc(db, 'users', uid);
  const updateData: Partial<UserProfile> = {
    plan,
    updatedAt: serverTimestamp()
  };

  if (subscriptionEnds) {
    updateData.subscriptionEnds = subscriptionEnds;
  }

  if (stripeCustomerId) {
    updateData.stripeCustomerId = stripeCustomerId;
  }

  if (stripeSubscriptionId) {
    updateData.stripeSubscriptionId = stripeSubscriptionId;
  }

  await updateDoc(userRef, updateData);
}

/**
 * Vérifie si l'abonnement de l'utilisateur est encore valide
 */
export function isSubscriptionValid(userProfile: UserProfile): boolean {
  if (userProfile.plan === 'free') {
    return true; // Le plan gratuit est toujours valide
  }

  // Pour Premium+, pas de date d'expiration (abonnement à vie)
  if (userProfile.plan === 'premium-plus') {
    return true;
  }

  // Pour Premium, si pas de date de fin, considérer comme valide (correction temporaire)
  if (userProfile.plan === 'premium' && !userProfile.subscriptionEnds) {
    return true;
  }

  // Si on a une date de fin, vérifier qu'elle n'est pas expirée
  if (userProfile.subscriptionEnds) {
    const now = new Date();
    const subscriptionEnd = new Date(userProfile.subscriptionEnds);
    return subscriptionEnd > now;
  }

  return true; // Par défaut, considérer comme valide
}

/**
 * Récupère le plan effectif de l'utilisateur (prend en compte l'expiration)
 */
export function getEffectivePlan(userProfile: UserProfile): 'free' | 'premium' | 'premium-plus' {
  // Si pas de profil, retourner gratuit
  if (!userProfile) {
    return 'free';
  }

  // Si le plan est premium ou premium-plus, vérifier la validité
  if (userProfile.plan === 'premium' || userProfile.plan === 'premium-plus') {
    if (!isSubscriptionValid(userProfile)) {
      return 'free';
    }
    return userProfile.plan;
  }

  // Pour le plan gratuit, toujours valide
  return userProfile.plan;
}
