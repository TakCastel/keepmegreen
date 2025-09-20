import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Configuration Firebase Admin
const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

// Initialiser Firebase Admin (une seule fois)
const adminApp = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];

// Exporter les services
export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);

// Fonction pour mettre à jour l'abonnement avec Admin SDK
export async function updateUserSubscriptionAdmin(
  uid: string, 
  plan: 'free' | 'premium' | 'premium-plus',
  subscriptionEnds?: string,
  stripeCustomerId?: string,
  stripeSubscriptionId?: string
) {
  const userRef = adminDb.collection('users').doc(uid);
  
  const updateData: any = {
    plan,
    updatedAt: new Date()
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

  await userRef.update(updateData);
}

// Fonction pour récupérer l'UID depuis l'email avec Admin SDK
export async function getFirebaseUidFromEmailAdmin(email: string): Promise<string | null> {
  try {
    const usersSnapshot = await adminDb.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();
    
    if (!usersSnapshot.empty) {
      const userDoc = usersSnapshot.docs[0];
      return userDoc.id;
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'UID Firebase (Admin):', error);
    return null;
  }
}

export default adminApp;
