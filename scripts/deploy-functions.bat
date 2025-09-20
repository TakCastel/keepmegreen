@echo off
REM Script pour déployer les Firebase Functions manuellement sur Windows
REM Utilisez ce script si le déploiement automatique ne fonctionne pas

echo 🚀 Déploiement des Firebase Functions...

REM Aller dans le dossier functions
cd functions

REM Installer les dépendances
echo 📦 Installation des dépendances...
npm ci

REM Construire les functions
echo 🔨 Construction des functions...
npm run build

REM Déployer les functions
echo 🚀 Déploiement sur Firebase...
firebase deploy --only functions --project greenme-415fa

echo ✅ Déploiement terminé !
pause
