// Configuration des émulateurs Firebase pour le développement
// À utiliser seulement si tu veux tester avec les émulateurs locaux

import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { auth, db } from './firebase';

export function connectFirebaseEmulators() {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      connectFirestoreEmulator(db, 'localhost', 8080);
      console.log('✅ Émulateurs Firebase connectés');
    } catch (error) {
      console.log('❌ Impossible de connecter les émulateurs Firebase:', error);
    }
  }
}

// Pour utiliser les émulateurs, appelle cette fonction dans ton app
// connectFirebaseEmulators();
