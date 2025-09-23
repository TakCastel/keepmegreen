'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { createOrUpdateUserProfile, getUserProfile, UserProfile, getEffectivePlan } from '@/lib/firestore';
import { FEATURE_MATRIX, Plan } from '@/constants/subscription';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Attendre un peu pour s'assurer que l'authentification est complète
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setProfileError(null);
        // Charger le profil; si absent, le créer; sinon ne pas masquer les erreurs
        try {
          const existingProfile = await getUserProfile(user.uid);
          if (existingProfile) {
            setUserProfile(existingProfile);
          } else {
            const created = await createOrUpdateUserProfile(user);
            setUserProfile(created);
          }
        } catch (e: any) {
          console.error('Erreur profil utilisateur:', e);
          setProfileError('Impossible de charger le profil utilisateur.');
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
        setProfileError(null);
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

  const sendPasswordReset = async (email: string) => {
    try {
      setError(null);
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      return { success: true } as const;
    } catch (error: any) {
      setError(getErrorMessage(error.code));
      return { success: false, error: getErrorMessage(error.code) } as const;
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

  // Fonction pour forcer la mise à jour de l'utilisateur Firebase Auth
  const refreshUser = async () => {
    if (auth.currentUser) {
      try {
        // Recharger l'utilisateur depuis Firebase Auth pour obtenir les dernières données
        await auth.currentUser.reload();
        
        // Attendre un petit délai pour s'assurer que les données sont bien mises à jour
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Forcer la mise à jour de l'état local avec les nouvelles données
        const updatedUser = auth.currentUser;
        setUser(updatedUser);
        
        // Mettre à jour le profil utilisateur dans Firestore si nécessaire
        if (updatedUser) {
          try {
            const profile = await createOrUpdateUserProfile(updatedUser);
            setUserProfile(profile);
          } catch (profileError) {
            console.error('Erreur lors de la mise à jour du profil:', profileError);
          }
        }
        
        // Forcer un re-render en incrémentant la clé de refresh
        setRefreshKey(prev => prev + 1);
        
        console.log('Utilisateur rafraîchi:', updatedUser.displayName);
      } catch (error) {
        console.error('Erreur lors du rafraîchissement de l\'utilisateur:', error);
      }
    }
  };

  // Fonction utilitaire pour obtenir le plan effectif
  const getCurrentPlan = useCallback((): Plan | null => {
    if (!userProfile) return null; // Retourner null si pas encore chargé
    
    try {
      return getEffectivePlan(userProfile) as Plan;
    } catch (error) {
      console.error('Erreur lors de la récupération du plan effectif:', error);
      // En cas d'erreur, retourner le plan stocké directement
      return (userProfile.plan || 'free') as Plan;
    }
  }, [userProfile]);

  // Fonction utilitaire pour vérifier si l'utilisateur a accès à une fonctionnalité
  const hasAccess = (feature: string): boolean | null => {
    const plan = getCurrentPlan();
    if (plan === null) return null;

    const aliasMap: Record<string, keyof typeof FEATURE_MATRIX.free> = {
      advancedStats: 'advancedStats',
      detailedBreakdown: 'detailedBreakdown',
      unlimitedHistory: 'historyDaysAccess',
      fullCalendar: 'calendarMonthsAccess',
      customThemes: 'customThemes',
      customCategories: 'customCategories',
      advancedSearch: 'advancedSearch',
      challenges: 'challenges',
      mobileWidgets: 'widgets',
      offlineMode: 'offlineMode',
      exclusiveResources: 'premiumResources',
    };

    const key = aliasMap[feature];
    if (!key) return false;

    const limitsForPlan = FEATURE_MATRIX[plan];
    const value = limitsForPlan[key as keyof typeof limitsForPlan];
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value === -1 || value > 0;
    return false;
  };

  return {
    user,
    userProfile,
    loading,
    error,
    profileError,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    sendPasswordReset,
    logout,
    refreshProfile,
    refreshUser,
    getCurrentPlan,
    hasAccess,
    refreshKey,
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
