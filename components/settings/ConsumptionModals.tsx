'use client';

import { createPortal } from 'react-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Trash2, Plus } from 'lucide-react';
import DynamicIcon from '@/components/ui/DynamicIcon';
import { 
  SPORT_CONFIG,
  SOCIAL_CONFIG,
  NUTRITION_CONFIG,
  SportType,
  SocialType,
  NutritionType
} from '@/types';
import { EditModalState, DeleteModalState, AddModalState } from '@/hooks/useConsumptionEditor';

interface ConsumptionModalsProps {
  editModal: EditModalState;
  setEditModal: (modal: EditModalState) => void;
  deleteModal: DeleteModalState;
  setDeleteModal: (modal: DeleteModalState) => void;
  addModal: AddModalState;
  setAddModal: (modal: AddModalState) => void;
  onMoveConsumption: () => void;
  onConfirmDelete: () => void;
  onAddActivity: (date: string, category: 'sport' | 'social' | 'nutrition', type: SportType | SocialType | NutritionType) => void;
  isMoveConsumptionPending: boolean;
  isMoveActivityPending: boolean;
  isRemoveConsumptionPending: boolean;
  isRemoveActivityPending: boolean;
  isAddActivityPending: boolean;
}

export default function ConsumptionModals({
  editModal,
  setEditModal,
  deleteModal,
  setDeleteModal,
  addModal,
  setAddModal,
  onMoveConsumption,
  onConfirmDelete,
  onAddActivity,
  isMoveConsumptionPending,
  isMoveActivityPending,
  isRemoveConsumptionPending,
  isRemoveActivityPending,
  isAddActivityPending
}: ConsumptionModalsProps) {
  return (
    <>
      {/* Modal de modification de date */}
      {editModal.isOpen && typeof window !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center p-4 z-[99999]">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-6 w-full max-w-md border border-white/20">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Modifier le moment
            </h3>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Déplacer cette {editModal.isActivity ? 'activité' : 'observation'} vers une nouvelle date :
              </p>
              
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="text-sm text-gray-700">
                  <strong>Date actuelle :</strong> {format(new Date(editModal.date), 'dd MMMM yyyy', { locale: fr })}
                </div>
                <div className="text-sm text-gray-700">
                  <strong>Quantité :</strong> ×{editModal.quantity}
                </div>
              </div>
              
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nouvelle date
              </label>
              <input
                type="date"
                value={editModal.newDate}
                onChange={(e) => setEditModal(prev => ({ ...prev, newDate: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition-all"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setEditModal(prev => ({ ...prev, isOpen: false }))}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                onClick={onMoveConsumption}
                disabled={(editModal.isActivity ? isMoveActivityPending : isMoveConsumptionPending) || !editModal.newDate || editModal.newDate === editModal.date}
                className="flex-1 px-4 py-3 bg-slate-500 text-white rounded-xl hover:bg-slate-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {(editModal.isActivity ? isMoveActivityPending : isMoveConsumptionPending) ? 'Modification...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal de confirmation de suppression */}
      {deleteModal.isOpen && typeof window !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center p-4 z-[99999]">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-6 w-full max-w-md border border-white/20">
            <div className="text-center mb-6">
              {/* Icône d'alerte */}
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Supprimer la consommation
              </h3>
              
              <p className="text-gray-600 text-sm mb-4">
                Cette action est irréversible. Voulez-vous vraiment supprimer cette consommation ?
              </p>
            </div>
            
            {/* Informations sur l'élément à supprimer */}
            <div className="bg-red-50/70 border border-red-200 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-gray-800 font-medium">{deleteModal.label}</div>
                  <div className="text-sm text-gray-600">
                    Quantité : ×{deleteModal.quantity} • {format(new Date(deleteModal.date), 'dd MMMM yyyy', { locale: fr })}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                onClick={onConfirmDelete}
                disabled={deleteModal.isActivity ? isRemoveActivityPending : isRemoveConsumptionPending}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {(deleteModal.isActivity ? isRemoveActivityPending : isRemoveConsumptionPending) ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal d'ajout d'activité */}
      {addModal.isOpen && typeof window !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center p-4 z-[99999]">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-4 w-full max-w-lg max-h-[85vh] overflow-y-auto border border-white/20">
            <div className="text-center mb-4">
              {/* Icône d'ajout */}
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Plus className="w-6 h-6 text-emerald-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Qu'est-ce que tu as fait de positif ?
              </h3>
              
              <p className="text-gray-600 text-sm mb-3">
                {format(new Date(addModal.date), 'dd MMMM yyyy', { locale: fr })}
              </p>
            </div>
            
            {/* Boutons de catégories */}
            <div className="space-y-2 mb-4">
              {/* Sport */}
              <div className="space-y-1">
                <h4 className="text-xs font-medium text-gray-700">Sport</h4>
                <div className="grid grid-cols-3 gap-1.5">
                  {Object.entries(SPORT_CONFIG).map(([type, config]) => (
                    <button
                      key={type}
                      onClick={() => onAddActivity(addModal.date, 'sport', type as SportType)}
                      disabled={isAddActivityPending}
                      className="flex items-center gap-1.5 p-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <DynamicIcon name={config.icon} className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-xs font-medium text-emerald-700 truncate">{config.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Social */}
              <div className="space-y-1">
                <h4 className="text-xs font-medium text-gray-700">Social</h4>
                <div className="grid grid-cols-3 gap-1.5">
                  {Object.entries(SOCIAL_CONFIG).map(([type, config]) => (
                    <button
                      key={type}
                      onClick={() => onAddActivity(addModal.date, 'social', type as SocialType)}
                      disabled={isAddActivityPending}
                      className="flex items-center gap-1.5 p-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <DynamicIcon name={config.icon} className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-xs font-medium text-blue-700 truncate">{config.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nutrition */}
              <div className="space-y-1">
                <h4 className="text-xs font-medium text-gray-700">Nutrition</h4>
                <div className="grid grid-cols-3 gap-1.5">
                  {Object.entries(NUTRITION_CONFIG).map(([type, config]) => (
                    <button
                      key={type}
                      onClick={() => onAddActivity(addModal.date, 'nutrition', type as NutritionType)}
                      disabled={isAddActivityPending}
                      className="flex items-center gap-1.5 p-2 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <DynamicIcon name={config.icon} className="w-3.5 h-3.5 text-orange-600" />
                      <span className="text-xs font-medium text-orange-700 truncate">{config.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setAddModal({ isOpen: false, date: '' })}
                className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
