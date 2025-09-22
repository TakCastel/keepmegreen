'use client';

import React from 'react';
import { useActivityEditor } from '@/hooks/useActivityEditor';
import ActivityFilters from './ActivityFilters';
import DayList from './DayList';
import ActivityModals from './ActivityModals';
import Paywall from '@/components/subscription/Paywall';
import Modal from '@/components/ui/Modal';
import { 
  SPORT_CONFIG,
  SOCIAL_CONFIG,
  NUTRITION_CONFIG,
  SportType,
  SocialType,
  NutritionType,
  ActivityConfig
} from '@/types';

interface ActivityEditorProps {
  presetDate?: string;
}

export default function ActivityEditor({ presetDate }: ActivityEditorProps) {
  const {
    // États
    searchTerm,
    setSearchTerm,
    selectedDate,
    setSelectedDate,
    currentPage,
    setCurrentPage,
    showSearchPaywall,
    setShowSearchPaywall,
    editModal,
    setEditModal,
    deleteModal,
    setDeleteModal,
    addModal,
    setAddModal,
    
    // Données
    paginatedData,
    totalPages,
    filteredData,
    isLoading,
    hasAdvancedSearch,
    
    // Fonctions utilitaires
    getTotalItems,
    
    // Fonctions de gestion
    handleRemoveActivity,
    handleAddActivity,
    handleEditActivity,
    handleMoveActivity,
    confirmDeleteActivity,
    
    // Mutations
    removeActivity,
    addActivity,
    moveActivity,
  } = useActivityEditor(presetDate);

  // Fonctions pour gérer les suppressions avec récupération des labels
  const handleDeleteActivity = (
    date: string,
    category: 'sport' | 'social' | 'nutrition',
    type: SportType | SocialType | NutritionType
  ) => {
    // Récupérer les informations de l'activité pour la modal
    const configs = {
      sport: SPORT_CONFIG,
      social: SOCIAL_CONFIG,
      nutrition: NUTRITION_CONFIG,
    };
    
    let config: ActivityConfig | undefined;
    switch (category) {
      case 'sport':
        config = configs.sport[type as SportType];
        break;
      case 'social':
        config = configs.social[type as SocialType];
        break;
      case 'nutrition':
        config = configs.nutrition[type as NutritionType];
        break;
    }

    if (!config) return;

    // Ouvrir la modal de confirmation
    setDeleteModal({
      isOpen: true,
      date,
      category,
      type,
      quantity: 1, // On récupérera la vraie quantité depuis les données
      label: config.label,
    });
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white/70 rounded-2xl p-8 animate-pulse border border-gray-200">
            <div className="h-6 bg-gray-200 rounded-2xl mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded-2xl"></div>
              <div className="h-4 bg-gray-200 rounded-2xl w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <ActivityFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        hasAdvancedSearch={hasAdvancedSearch}
        setShowSearchPaywall={setShowSearchPaywall}
        presetDate={presetDate}
      />

      {/* Liste des jours */}
      <DayList
        paginatedData={paginatedData}
        filteredData={filteredData}
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        getTotalItems={getTotalItems}
        setAddModal={setAddModal}
        onRemoveActivity={handleRemoveActivity}
        onAddActivity={handleAddActivity}
        onEditActivity={handleEditActivity}
        onDeleteActivity={handleDeleteActivity}
        isRemoveActivityPending={removeActivity.isPending}
        isAddActivityPending={addActivity.isPending}
        isMoveActivityPending={moveActivity.isPending}
      />

      {/* Modales */}
      <ActivityModals
        editModal={editModal}
        setEditModal={setEditModal}
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        addModal={addModal}
        setAddModal={setAddModal}
        onMoveActivity={handleMoveActivity}
        onConfirmDelete={confirmDeleteActivity}
        onAddActivity={handleAddActivity}
        isMoveActivityPending={moveActivity.isPending}
        isRemoveActivityPending={removeActivity.isPending}
        isAddActivityPending={addActivity.isPending}
      />

      {/* Paywall pour la recherche avancée */}
      <Modal
        isOpen={showSearchPaywall}
        onClose={() => setShowSearchPaywall(false)}
        title="Recherche Avancée"
        subtitle={
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-amber-500 shadow-md"></div>
            <span className="text-amber-600 text-sm font-medium">Fonctionnalité Premium</span>
          </div>
        }
        size="lg"
      >
        <Paywall 
          feature="advancedSearch"
          compact={true}
        />
      </Modal>
    </div>
  );
}
