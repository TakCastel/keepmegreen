'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useAllConsumptions, useRemoveConsumption, useMoveConsumption, useAddConsumption } from '@/hooks/useConsumptions';
import { useAllActivities, useRemoveActivity, useMoveActivity, useAddActivity } from '@/hooks/useActivities';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import { 
  DayConsumption,
  DayActivities,
  AlcoholType,
  CigaretteType,
  JunkfoodType,
  SportType,
  SocialType,
  NutritionType,
} from '@/types';

export interface EditModalState {
  isOpen: boolean;
  date: string;
  category: 'alcohol' | 'cigarettes' | 'junkfood' | 'sport' | 'social' | 'nutrition';
  type: AlcoholType | CigaretteType | JunkfoodType | SportType | SocialType | NutritionType;
  quantity: number;
  newDate: string;
  isActivity?: boolean;
}

export interface DeleteModalState {
  isOpen: boolean;
  date: string;
  category: 'alcohol' | 'cigarettes' | 'junkfood' | 'sport' | 'social' | 'nutrition';
  type: AlcoholType | CigaretteType | JunkfoodType | SportType | SocialType | NutritionType;
  quantity: number;
  label: string;
  isActivity?: boolean;
}

export interface AddModalState {
  isOpen: boolean;
  date: string;
}

export function useConsumptionEditor(presetDate?: string) {
  const { user } = useAuth();
  const { getLimits } = useSubscription();
  
  // Hooks pour les données
  const { data: consumptions = [], isLoading: consumptionsLoading, refetch: refetchConsumptions } = useAllConsumptions(user?.uid);
  const { data: activities = [], isLoading: activitiesLoading, refetch: refetchActivities } = useAllActivities(user?.uid);
  
  // Hooks pour les mutations
  const removeConsumption = useRemoveConsumption();
  const moveConsumption = useMoveConsumption();
  const addConsumption = useAddConsumption();
  const removeActivity = useRemoveActivity();
  const moveActivity = useMoveActivity();
  const addActivity = useAddActivity();
  
  // États locaux
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(presetDate || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [showSearchPaywall, setShowSearchPaywall] = useState(false);
  const itemsPerPage = 10;

  // États des modales
  const [editModal, setEditModal] = useState<EditModalState>({
    isOpen: false,
    date: '',
    category: 'alcohol',
    type: 'beer' as AlcoholType,
    quantity: 0,
    newDate: '',
    isActivity: false
  });

  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    isOpen: false,
    date: '',
    category: 'alcohol',
    type: 'beer' as AlcoholType,
    quantity: 0,
    label: '',
    isActivity: false
  });

  const [addModal, setAddModal] = useState<AddModalState>({
    isOpen: false,
    date: ''
  });

  // Fonction pour forcer le refetch des données
  const forceRefresh = async () => {
    await Promise.all([
      refetchConsumptions(),
      refetchActivities()
    ]);
  };

  // Combiner les données de consommations et d'activités par date
  const combinedData = React.useMemo(() => {
    const dataMap = new Map();
    
    // Ajouter les consommations
    consumptions.forEach(day => {
      dataMap.set(day.date, {
        date: day.date,
        consumptions: day,
        activities: null
      });
    });
    
    // Ajouter les activités
    activities.forEach(day => {
      if (dataMap.has(day.date)) {
        dataMap.get(day.date).activities = day;
      } else {
        dataMap.set(day.date, {
          date: day.date,
          consumptions: null,
          activities: day
        });
      }
    });
    
    return Array.from(dataMap.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [consumptions, activities]);

  // Fonction utilitaire pour calculer le nombre total d'activités
  const getTotalItems = (day: any) => {
    let total = 0;
    
    // Compter seulement les activités
    if (day.activities) {
      total += (day.activities.sport?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0);
      total += (day.activities.social?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0);
      total += (day.activities.nutrition?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0);
    }
    
    return total;
  };

  // Vérifier si l'utilisateur a accès à la recherche avancée
  const limits = getLimits();
  const hasAdvancedSearch = limits.advancedSearch;

  // Filtrer les données combinées
  const filteredData = combinedData.filter(day => {
    const matchesDate = selectedDate ? day.date === selectedDate : true;
    
    // Si l'utilisateur n'a pas accès à la recherche avancée et qu'il y a un terme de recherche,
    // ne pas filtrer (afficher toutes les données)
    const matchesSearch = searchTerm && hasAdvancedSearch ? 
      day.date.includes(searchTerm) ||
      format(new Date(day.date), 'dd MMMM yyyy', { locale: fr }).toLowerCase().includes(searchTerm.toLowerCase()) ||
      format(new Date(day.date), 'MMMM yyyy', { locale: fr }).toLowerCase().includes(searchTerm.toLowerCase()) ||
      format(new Date(day.date), 'yyyy', { locale: fr }).includes(searchTerm) ||
      format(new Date(day.date), 'MM', { locale: fr }).includes(searchTerm.padStart(2, '0'))
      : !searchTerm || hasAdvancedSearch;
    
    // Si une date spécifique est sélectionnée, afficher même les jours vides
    if (selectedDate && day.date === selectedDate) {
      return matchesSearch;
    }
    
    // Sinon, afficher seulement les jours avec des activités
    const hasActivities = day.activities && (
      day.activities.sport.length > 0 || 
      day.activities.social.length > 0 || 
      day.activities.nutrition.length > 0
    );
    
    return matchesDate && matchesSearch && hasActivities;
  });

  // Si une date spécifique est sélectionnée mais n'existe pas, créer un jour vide
  const dataToShow = [...filteredData];
  if (selectedDate && !combinedData.find(day => day.date === selectedDate)) {
    dataToShow.push({
      date: selectedDate,
      consumptions: null,
      activities: {
        date: selectedDate,
        sport: [],
        social: [],
        nutrition: []
      }
    });
  }

  // Calculer la pagination
  const totalPages = Math.ceil(dataToShow.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = dataToShow.slice(startIndex, endIndex);

  // Réinitialiser à la page 1 quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDate]);

  // Fonctions de gestion des consommations
  const handleRemoveConsumption = async (
    date: string,
    category: 'alcohol' | 'cigarettes' | 'junkfood',
    type: AlcoholType | CigaretteType | JunkfoodType,
    currentQuantity: number
  ) => {
    if (!user) return;

    // Empêcher de descendre en dessous de 1
    if (currentQuantity <= 1) {
      toast.error('Quantité minimale atteinte (1)', {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        }
      });
      return;
    }

    try {
      await removeConsumption.mutateAsync({
        userId: user.uid,
        date,
        category,
        type,
        quantity: 1, // Retirer une unité à la fois
      });

      toast.success('Quantité diminuée !', {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        }
      });

      // Forcer le refresh des données
      await forceRefresh();
    } catch {
      toast.error('Erreur lors de la modification', {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        }
      });
    }
  };

  const handleAddQuantity = async (
    date: string,
    category: 'alcohol' | 'cigarettes' | 'junkfood',
    type: AlcoholType | CigaretteType | JunkfoodType
  ) => {
    if (!user) return;

    try {
      await addConsumption.mutateAsync({
        userId: user.uid,
        date,
        category,
        type,
        quantity: 1, // Ajouter une unité à la fois
      });

      toast.success('Quantité augmentée !', {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        }
      });

      // Forcer le refresh des données
      await forceRefresh();
    } catch {
      toast.error('Erreur lors de la modification', {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        }
      });
    }
  };

  const handleAddConsumption = async (
    category: 'alcohol' | 'cigarettes' | 'junkfood',
    type: AlcoholType | CigaretteType | JunkfoodType
  ) => {
    if (!user) return;

    try {
      // Vérifier si l'élément existe déjà pour cette date
      const existingDay = consumptions.find(day => day.date === addModal.date);
      const existingItem = existingDay?.[category]?.find(item => item.type === type);
      
      if (existingItem) {
        // Si l'élément existe, incrémenter la quantité de 1
        await addConsumption.mutateAsync({
          userId: user.uid,
          date: addModal.date,
          category,
          type,
          quantity: 1, // Toujours ajouter 1, pas remplacer
        });
        
        toast.success(`+1 ajouté ! (${existingItem.quantity + 1} au total)`, {
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151'
          }
        });
      } else {
        // Si l'élément n'existe pas, l'ajouter avec quantité 1
        await addConsumption.mutateAsync({
          userId: user.uid,
          date: addModal.date,
          category,
          type,
          quantity: 1,
        });
        
        toast.success('Consommation ajoutée !', {
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151'
          }
        });
      }

      // Forcer le refresh des données
      await forceRefresh();
    } catch {
      toast.error('Erreur lors de l\'ajout de la consommation', {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        }
      });
    }
  };

  // Fonctions de gestion des activités
  const handleRemoveActivity = async (
    date: string,
    category: 'sport' | 'social' | 'nutrition',
    type: SportType | SocialType | NutritionType,
    currentQuantity: number
  ) => {
    if (!user) return;

    // Empêcher de descendre en dessous de 1
    if (currentQuantity <= 1) {
      toast.error('Quantité minimale atteinte (1)', {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        }
      });
      return;
    }

    try {
      await removeActivity.mutateAsync({
        userId: user.uid,
        date,
        category,
        type,
        quantity: 1, // Retirer une unité à la fois
      });

      toast.success('Quantité diminuée !', {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        }
      });

      // Forcer le refresh des données
      await forceRefresh();
    } catch {
      toast.error('Erreur lors de la modification', {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        }
      });
    }
  };

  const handleAddActivity = async (
    date: string,
    category: 'sport' | 'social' | 'nutrition',
    type: SportType | SocialType | NutritionType
  ) => {
    if (!user) return;

    try {
      await addActivity.mutateAsync({
        userId: user.uid,
        date,
        category,
        type,
        quantity: 1, // Ajouter une unité à la fois
      });

      toast.success('Quantité augmentée !', {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        }
      });
    } catch {
      toast.error('Erreur lors de la modification', {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        }
      });
    }
  };

  // Fonctions de gestion des modales
  const handleEditConsumption = (
    date: string,
    category: 'alcohol' | 'cigarettes' | 'junkfood',
    type: AlcoholType | CigaretteType | JunkfoodType,
    quantity: number
  ) => {
    setEditModal({
      isOpen: true,
      date,
      category,
      type,
      quantity,
      newDate: date, // Initialiser avec la date actuelle
      isActivity: false
    });
  };

  const handleEditActivity = (
    date: string,
    category: 'sport' | 'social' | 'nutrition',
    type: SportType | SocialType | NutritionType,
    quantity: number
  ) => {
    setEditModal({
      isOpen: true,
      date,
      category,
      type,
      quantity,
      newDate: date, // Initialiser avec la date actuelle
      isActivity: true
    });
  };

  const handleMoveConsumption = async () => {
    if (!user || !editModal.newDate || editModal.newDate === editModal.date) {
      setEditModal(prev => ({ ...prev, isOpen: false }));
      return;
    }

    try {
      if (editModal.isActivity) {
        // Déplacer l'activité
        await moveActivity.mutateAsync({
          userId: user.uid,
          oldDate: editModal.date,
          newDate: editModal.newDate,
          category: editModal.category as 'sport' | 'social' | 'nutrition',
          type: editModal.type as SportType | SocialType | NutritionType,
          quantity: editModal.quantity
        });

        toast.success('Date d\'activité modifiée !', {
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151'
          }
        });
      } else {
        // Déplacer la consommation
        await moveConsumption.mutateAsync({
          userId: user.uid,
          oldDate: editModal.date,
          newDate: editModal.newDate,
          category: editModal.category as 'alcohol' | 'cigarettes' | 'junkfood',
          type: editModal.type as AlcoholType | CigaretteType | JunkfoodType,
          quantity: editModal.quantity
        });

        toast.success('Date de consommation modifiée !', {
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151'
          }
        });
      }

      setEditModal(prev => ({ ...prev, isOpen: false }));

      // Forcer le refresh des données
      await forceRefresh();
    } catch {
      toast.error('Erreur lors de la modification', {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        }
      });
    }
  };

  const confirmDeleteConsumption = async () => {
    if (!user) return;

    try {
      if (deleteModal.isActivity) {
        // Supprimer l'activité
        await removeActivity.mutateAsync({
          userId: user.uid,
          date: deleteModal.date,
          category: deleteModal.category as 'sport' | 'social' | 'nutrition',
          type: deleteModal.type as SportType | SocialType | NutritionType,
          quantity: deleteModal.quantity, // Supprimer toute la quantité
        });

        toast.success('Activité supprimée !', {
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151'
          }
        });
      } else {
        // Supprimer la consommation
        await removeConsumption.mutateAsync({
          userId: user.uid,
          date: deleteModal.date,
          category: deleteModal.category as 'alcohol' | 'cigarettes' | 'junkfood',
          type: deleteModal.type as AlcoholType | CigaretteType | JunkfoodType,
          quantity: deleteModal.quantity, // Supprimer toute la quantité
        });

        toast.success('Consommation supprimée !', {
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151'
          }
        });
      }

      // Fermer la modal
      setDeleteModal(prev => ({ ...prev, isOpen: false }));

      // Forcer le refresh des données
      await forceRefresh();
    } catch {
      toast.error('Erreur lors de la suppression', {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        }
      });
    }
  };

  return {
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
    isLoading: consumptionsLoading || activitiesLoading,
    hasAdvancedSearch,
    
    // Fonctions utilitaires
    getTotalItems,
    forceRefresh,
    
    // Fonctions de gestion
    handleRemoveConsumption,
    handleAddQuantity,
    handleAddConsumption,
    handleRemoveActivity,
    handleAddActivity,
    handleEditConsumption,
    handleEditActivity,
    handleMoveConsumption,
    confirmDeleteConsumption,
    
    // Mutations
    removeConsumption,
    addConsumption,
    moveConsumption,
    removeActivity,
    addActivity,
    moveActivity,
  };
}
