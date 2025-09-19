'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { updateProfile, deleteUser } from 'firebase/auth';
import { User, Mail, Trash2, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AccountSettings() {
  const { user, logout } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const handleUpdateProfile = async () => {
    if (!user) return;

    setIsUpdating(true);
    try {
      await updateProfile(user, {
        displayName: displayName || null,
      });

      toast.success('Profil mis à jour !');
    } catch {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || deleteConfirmText !== 'SUPPRIMER') return;

    try {
      await deleteUser(user);
      toast.success('Compte supprimé');
    } catch (error: unknown) {
      if ((error as { code?: string }).code === 'auth/requires-recent-login') {
        toast.error('Vous devez vous reconnecter avant de supprimer votre compte');
        await logout();
      } else {
        toast.error('Erreur lors de la suppression du compte');
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Informations du profil */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-6 flex items-center gap-2">
          <User className="w-5 h-5" />
          Informations du profil
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom d&#39;affichage
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Votre nom"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">{user?.email}</span>
              <span className="text-xs text-gray-500 ml-auto bg-gray-200 px-2 py-1 rounded-full">Non modifiable</span>
            </div>
          </div>

          <button
            onClick={handleUpdateProfile}
            disabled={isUpdating}
            className="w-full bg-slate-500 hover:bg-slate-600 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-xl transition-colors shadow-md"
          >
            {isUpdating ? 'Mise à jour...' : 'Mettre à jour le profil'}
          </button>
        </div>
      </div>

      {/* Informations du compte */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Informations du compte
        </h3>
        
        <div className="space-y-4 text-sm text-gray-700">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <span className="font-medium">Compte créé le :</span>
            <span>{user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('fr-FR') : 'Inconnu'}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <span className="font-medium">Dernière connexion :</span>
            <span>{user?.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString('fr-FR') : 'Inconnu'}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <span className="font-medium">Méthode de connexion :</span>
            <span>{user?.providerData[0]?.providerId === 'google.com' ? 'Google' : 'Email/Mot de passe'}</span>
          </div>
        </div>
      </div>

      {/* Zone dangereuse */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
        <h3 className="text-lg font-medium text-red-700 mb-6 flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          Zone dangereuse
        </h3>
        
        <div className="space-y-6">
          <p className="text-red-700 text-sm bg-red-100 p-4 rounded-xl">
            La suppression de votre compte est définitive. Toutes vos données seront perdues et ne pourront pas être récupérées.
          </p>
          
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-xl transition-colors shadow-md"
            >
              Supprimer mon compte
            </button>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">
                  Tapez &quot;SUPPRIMER&quot; pour confirmer :
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="SUPPRIMER"
                  className="w-full px-4 py-3 bg-white border border-red-300 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== 'SUPPRIMER'}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-medium py-3 px-6 rounded-xl transition-colors shadow-md"
                >
                  Confirmer la suppression
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText('');
                  }}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-medium py-3 px-6 rounded-xl transition-colors shadow-md"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
