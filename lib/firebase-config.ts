import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialiser Firebase seulement s'il n'est pas déjà initialisé
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialiser les services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configuration pour l'émulateur Firebase en développement
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Vérifier si les émulateurs ne sont pas déjà connectés
  if (!auth._delegate._config?.emulator) {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    } catch (error) {
      // L'émulateur est peut-être déjà connecté
    }
  }

  if (!db._delegate._settings?.host?.includes('localhost')) {
    try {
      connectFirestoreEmulator(db, 'localhost', 8080);
    } catch (error) {
      // L'émulateur est peut-être déjà connecté
    }
  }
}

export default app;
