#!/bin/bash

# Script pour déployer les Firebase Functions manuellement
# Utilisez ce script si le déploiement automatique ne fonctionne pas

echo "🚀 Déploiement des Firebase Functions..."

# Aller dans le dossier functions
cd functions

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm ci

# Construire les functions
echo "🔨 Construction des functions..."
npm run build

# Déployer les functions
echo "🚀 Déploiement sur Firebase..."
firebase deploy --only functions --project greenme-415fa

echo "✅ Déploiement terminé !"
