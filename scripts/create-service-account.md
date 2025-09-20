# Créer un Service Account pour Firebase Functions

## Étapes dans Google Cloud Console :

1. **Allez dans IAM & Admin → Service Accounts**
   - URL: https://console.cloud.google.com/iam-admin/serviceaccounts?project=greenme-415fa

2. **Cliquez sur "Create Service Account"**

3. **Configurez le service account :**
   - Name: `firebase-functions-deploy`
   - Description: `Service account pour déployer Firebase Functions`

4. **Ajoutez ces rôles :**
   - `Firebase Admin`
   - `Cloud Functions Admin`
   - `Cloud Functions Developer`
   - `Service Account User`
   - `Storage Admin` (pour Firebase Hosting)

5. **Créez et téléchargez la clé JSON**

6. **Ajoutez la clé dans GitHub Secrets :**
   - Nom: `FIREBASE_SERVICE_ACCOUNT_GREENME_415FA`
   - Valeur: Contenu du fichier JSON téléchargé

## Alternative : Utiliser Firebase CLI local

Si les permissions ne fonctionnent pas, vous pouvez déployer manuellement :

```bash
# Dans le dossier functions/
npm run build
firebase deploy --only functions --project greenme-415fa
```
