'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { createOrUpdateUserProfile, getUserProfile, UserProfile, getEffectivePlan } from '@/lib/firestore';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Attendre un peu pour s'assurer que l'authentification est complète
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Créer ou mettre à jour le profil utilisateur
        try {
          const profile = await createOrUpdateUserProfile(user);
          setUserProfile(profile);
        } catch (error) {
          console.error('Erreur lors de la création/mise à jour du profil:', error);
          // En cas d'erreur, essayer de récupérer le profil existant
          try {
            const existingProfile = await getUserProfile(user.uid);
            setUserProfile(existingProfile);
          } catch (profileError) {
            console.error('Erreur lors de la récupération du profil:', profileError);
            // Créer un profil par défaut en cas d'échec
            setUserProfile({
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || null,
              photoURL: user.photoURL || null,
              plan: 'free',
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        }
      } else {
        setUserProfile(null);
      }
      
      // Ne mettre loading à false qu'après avoir chargé le profil utilisateur
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (error: any) {
      setError(getErrorMessage(error.code));
    }
  };

  // Fonction pour rafraîchir le profil utilisateur
  const refreshProfile = async () => {
    if (user) {
      try {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } catch (error) {
        console.error('Erreur lors du rafraîchissement du profil:', error);
      }
    }
  };

  // Fonction utilitaire pour obtenir le plan effectif
  const getCurrentPlan = useCallback((): 'free' | 'premium' | 'premium-plus' | null => {
    if (!userProfile) return null; // Retourner null si pas encore chargé
    
    try {
      return getEffectivePlan(userProfile);
    } catch (error) {
      console.error('Erreur lors de la récupération du plan effectif:', error);
      // En cas d'erreur, retourner le plan stocké directement
      return userProfile.plan || 'free';
    }
  }, [userProfile]);

  // Fonction utilitaire pour vérifier si l'utilisateur a accès à une fonctionnalité
  const hasAccess = (feature: string): boolean | null => {
    const plan = getCurrentPlan();
    
    // Si le plan n'est pas encore chargé, retourner null
    if (plan === null) return null;
    
    switch (feature) {
      case 'advancedStats':
        return plan === 'premium' || plan === 'premium-plus';
      case 'detailedBreakdown':
        return plan === 'premium' || plan === 'premium-plus';
      case 'unlimitedHistory':
        return plan === 'premium' || plan === 'premium-plus';
      case 'fullCalendar':
        return plan === 'premium' || plan === 'premium-plus';
      case 'customThemes':
        return plan === 'premium' || plan === 'premium-plus';
      case 'customCategories':
        return plan === 'premium' || plan === 'premium-plus';
      case 'challenges':
        return plan === 'premium-plus';
      case 'mobileWidgets':
        return plan === 'premium-plus';
      case 'offlineMode':
        return plan === 'premium-plus';
      case 'exclusiveResources':
        return plan === 'premium-plus';
      default:
        return false;
    }
  };

  return {
    user,
    userProfile,
    loading,
    error,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    logout,
    refreshProfile,
    getCurrentPlan,
    hasAccess,
  };
};

const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'Aucun utilisateur trouvé avec cet email.';
    case 'auth/wrong-password':
      return 'Mot de passe incorrect.';
    case 'auth/email-already-in-use':
      return 'Cet email est déjà utilisé.';
    case 'auth/weak-password':
      return 'Le mot de passe doit contenir au moins 6 caractères.';
    case 'auth/invalid-email':
      return 'Email invalide.';
    case 'auth/popup-closed-by-user':
      return 'Connexion annulée.';
    default:
      return 'Une erreur est survenue. Veuillez réessayer.';
  }
};
