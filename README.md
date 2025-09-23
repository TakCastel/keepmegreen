# GrowDaily

Application web Next.js 15 pour célébrer et suivre vos activités positives quotidiennes dans trois domaines : sport, social et nutrition.

## Fonctionnalités

- **Dashboard interactif** : Enregistrez vos activités positives en quelques clics
- **Calendrier visuel** : Visualisez votre progression avec un calendrier coloré style GitHub
- **Statistiques détaillées** : Analysez vos habitudes positives avec des graphiques et des métriques
- **Gestion des données** : Modifiez et supprimez vos activités
- **Authentification sécurisée** : Connexion via email/mot de passe ou Google
- **Interface moderne** : Design moderne et responsive avec TailwindCSS

## Technologies utilisées

- **Next.js 15** avec App Router et React Server Components
- **TypeScript** pour la sécurité des types
- **TailwindCSS** pour le styling (thème sombre par défaut)
- **Firebase Auth** pour l'authentification
- **Firestore** pour le stockage des données
- **React Query** pour la gestion d'état et cache
- **Chart.js** pour les graphiques
- **React Hot Toast** pour les notifications

## Installation et configuration

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd growdaily
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration Firebase

1. Créez un projet Firebase sur [https://console.firebase.google.com](https://console.firebase.google.com)

2. Activez l'authentification :
   - Allez dans "Authentication" > "Sign-in method"
   - Activez "Email/Password" et "Google"

3. Créez une base de données Firestore :
   - Allez dans "Firestore Database"
   - Créez une base de données en mode production
   - Configurez les règles de sécurité (voir section ci-dessous)

4. Récupérez la configuration Firebase :
   - Allez dans les paramètres du projet > "Paramètres du projet"
   - Ajoutez une application web
   - Copiez la configuration

### 4. Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# (Dev) Activer les émulateurs Firebase côté app (Auth/Firestore)
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
```

### 5. Règles de sécurité Firestore

Dans la console Firebase, allez dans "Firestore Database" > "Règles" et configurez :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Les utilisateurs ne peuvent accéder qu'à leurs propres données
    match /users/{userId}/activities/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 6. Lancer l'application

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

### 7. (Optionnel) Utiliser les émulateurs Firebase en local

Les émulateurs permettent de développer sans toucher aux données de production.

1) Pré-requis (une seule fois):
```bash
npm i -g firebase-tools
firebase login
```

2) Démarrer les émulateurs dans un second terminal:
```bash
firebase emulators:start --only auth,firestore
```

3) Côté app, assurez-vous d’avoir dans `.env.local`:
```env
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
```

Par défaut: Auth sur 127.0.0.1:9099, Firestore sur 127.0.0.1:8080, UI Emulator Suite sur http://localhost:4000.

## Utilisation

### 1. Authentification
- Créez un compte ou connectez-vous avec email/mot de passe ou Google
- Vous serez automatiquement redirigé vers le dashboard

### 2. Enregistrer des activités positives
- Sur le dashboard, cliquez sur une catégorie (Sport, Social, Nutrition)
- Sélectionnez le type spécifique dans le sous-menu
- L'activité est automatiquement enregistrée pour la date du jour

### 3. Visualiser votre progression
- **Calendrier** : Consultez la grille colorée style GitHub
  - Gris : Jour neutre
  - Bleu clair : Quelques activités positives
  - Bleu : Bonne journée d'activités
  - Vert : Excellente journée d'activités

### 4. Analyser vos habitudes
- **Historique** : Consultez les statistiques hebdomadaires/mensuelles
- Graphiques en barres et camemberts
- Métriques détaillées par catégorie

### 5. Gérer vos données
- **Paramètres** : Modifiez ou supprimez des activités
- Filtrez par date ou recherche textuelle
- Gérez votre compte utilisateur

## Structure des données

Chaque activité est stockée par jour avec cette structure :

```typescript
{
  date: "2025-09-19",
  sport: [
    { type: "running", quantity: 1 },
    { type: "yoga", quantity: 1 }
  ],
  social: [
    { type: "friends", quantity: 1 }
  ],
  nutrition: [
    { type: "balanced_meal", quantity: 2 },
    { type: "hydration", quantity: 1 }
  ],
  createdAt: "2025-09-19T12:00:00Z"
}
```

## Customisation

L'application utilise un design moderne avec TailwindCSS. Les couleurs principales :
- Gris : Jour neutre
- Bleu clair : Quelques activités positives
- Bleu : Bonne journée d'activités
- Vert : Excellente journée d'activités
- Fond clair pour un confort visuel

## Scripts disponibles

```bash
npm run dev          # Développement avec Turbopack
npm run build        # Build de production avec Turbopack
npm start            # Lancement en production
npm run lint         # Vérification ESLint
```

## Notes techniques

- Persistance React Query: la couche de cache utilise `@tanstack/react-query-persist-client` + localStorage pour améliorer l’UX et préserver les données entre rafraîchissements. La persistance est configurée dans `components/providers/QueryProvider.tsx`.
- Abonnements: la matrice des fonctionnalités/limites par plan est centralisée dans `constants/subscription.ts` et consommée par les hooks (`useAuth`, `useSubscription`).

## Licence

Ce projet est développé pour un usage personnel de suivi des activités positives.

## Support

Pour toute question ou problème :
1. Vérifiez que Firebase est correctement configuré
2. Assurez-vous que les variables d'environnement sont correctes
3. Consultez la console du navigateur pour les erreurs JavaScript
4. Vérifiez les règles de sécurité Firestore

---

**Objectif : Célébrez vos activités positives et remplissez votre calendrier de couleurs vives !**