#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (!projectId) {
  console.error('❌ NEXT_PUBLIC_FIREBASE_PROJECT_ID non défini dans les variables d\'environnement');
  process.exit(1);
}

const rulesFile = process.env.NODE_ENV === 'development' 
  ? 'firestore.rules.dev' 
  : 'firestore.rules';

if (!fs.existsSync(rulesFile)) {
  console.error(`❌ Fichier ${rulesFile} non trouvé`);
  process.exit(1);
}

try {
  
  execSync(`firebase deploy --only firestore:rules --project ${projectId}`, {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
} catch (error) {
  console.error('❌ Erreur lors du déploiement des règles Firestore:', error.message);
  process.exit(1);
}
