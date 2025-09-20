'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAllConsumptions, useRemoveConsumption, useMoveConsumption, useAddConsumption } from '@/hooks/useConsumptions';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { Trash2, Edit3, Calendar, Search, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import DynamicIcon from '@/components/ui/DynamicIcon';
import { toast } from 'react-hot-toast';
import { 
  ALCOHOL_CONFIG, 
  CIGARETTE_CONFIG, 
  JUNKFOOD_CONFIG,
  DayConsumption,
  AlcoholType,
  CigaretteType,
  JunkfoodType,
  ConsumptionConfig
} from '@/types';
import { CATEGORY_COLORS } from '@/constants/colors';

interface ConsumptionEditorProps {
  presetDate?: string;
}

export default function ConsumptionEditor({ presetDate }: ConsumptionEditorProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { data: consumptions = [], isLoading } = useAllConsumptions(user?.uid);
  const removeConsumption = useRemoveConsumption();
  const moveConsumption = useMoveConsumption();
  const addConsumption = useAddConsumption();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(presetDate || '');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // État pour la modal de modification de date
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    date: string;
    category: 'alcohol' | 'cigarettes' | 'junkfood';
    type: AlcoholType | CigaretteType | JunkfoodType;
    quantity: number;
    newDate: string;
  }>({
    isOpen: false,
    date: '',
    category: 'alcohol',
    type: 'beer' as AlcoholType,
    quantity: 0,
    newDate: ''
  });

  // État pour la modal de suppression
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    date: string;
    category: 'alcohol' | 'cigarettes' | 'junkfood';
    type: AlcoholType | CigaretteType | JunkfoodType;
    quantity: number;
    label: string;
  }>({
    isOpen: false,
    date: '',
    category: 'alcohol',
    type: 'beer' as AlcoholType,
    quantity: 0,
    label: ''
  });

  // État pour la modal d'ajout de consommation
  const [addModal, setAddModal] = useState<{
    isOpen: boolean;
    date: string;
  }>({
    isOpen: false,
    date: ''
  });

  // Filtrer les consommations
  const filteredConsumptions = consumptions.filter(day => {
    const matchesDate = selectedDate ? day.date === selectedDate : true;
    const matchesSearch = searchTerm ? 
      day.date.includes(searchTerm) ||
      format(new Date(day.date), 'dd MMMM yyyy', { locale: fr }).toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    // Si une date spécifique est sélectionnée, afficher même les jours vides
    if (selectedDate && day.date === selectedDate) {
      return matchesSearch;
    }
    
    // Sinon, afficher seulement les jours avec des consommations
    return matchesDate && matchesSearch && (
      day.alcohol.length > 0 || day.cigarettes.length > 0 || day.junkfood.length > 0
    );
  });

  // Si une date spécifique est sélectionnée mais n'existe pas, créer un jour vide
  const consumptionsToShow = [...filteredConsumptions];
  if (selectedDate && !consumptions.find(day => day.date === selectedDate)) {
    consumptionsToShow.push({
      date: selectedDate,
      alcohol: [],
      cigarettes: [],
      junkfood: []
    });
  }

  // Calculer la pagination
  const totalPages = Math.ceil(consumptionsToShow.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedConsumptions = consumptionsToShow.slice(startIndex, endIndex);

  // Réinitialiser à la page 1 quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDate]);

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

  const handleDeleteConsumption = (
    date: string,
    category: 'alcohol' | 'cigarettes' | 'junkfood',
    type: AlcoholType | CigaretteType | JunkfoodType
  ) => {
    if (!user) return;

    // Récupérer les informations de la consommation pour la modal
    const currentConsumptions = consumptions.find(day => day.date === date);
    if (!currentConsumptions) return;

    const categoryArray = currentConsumptions[category];
    const currentItem = categoryArray.find(item => item.type === type);
    if (!currentItem) return;

    // Récupérer le label de l'élément
    const configs = {
      alcohol: ALCOHOL_CONFIG,
      cigarettes: CIGARETTE_CONFIG,
      junkfood: JUNKFOOD_CONFIG,
    };
    
    let config: ConsumptionConfig | undefined;
    switch (category) {
      case 'alcohol':
        config = configs.alcohol[type as AlcoholType];
        break;
      case 'cigarettes':
        config = configs.cigarettes[type as CigaretteType];
        break;
      case 'junkfood':
        config = configs.junkfood[type as JunkfoodType];
        break;
    }

    if (!config) return;

    // Ouvrir la modal de confirmation
    setDeleteModal({
      isOpen: true,
      date,
      category,
      type,
      quantity: currentItem.quantity,
      label: config.label
    });
  };

  const confirmDeleteConsumption = async () => {
    if (!user) return;

    try {
      // Supprimer la quantité totale pour effacer complètement l'élément
      await removeConsumption.mutateAsync({
        userId: user.uid,
        date: deleteModal.date,
        category: deleteModal.category,
        type: deleteModal.type,
        quantity: deleteModal.quantity, // Supprimer toute la quantité
      });

      toast.success('Consommation supprimée !', {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        }
      });

      // Fermer la modal
      setDeleteModal(prev => ({ ...prev, isOpen: false }));
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
      newDate: date // Initialiser avec la date actuelle
    });
  };

  const handleMoveConsumption = async () => {
    if (!user || !editModal.newDate || editModal.newDate === editModal.date) {
      setEditModal(prev => ({ ...prev, isOpen: false }));
      return;
    }

    try {
      await moveConsumption.mutateAsync({
        userId: user.uid,
        oldDate: editModal.date,
        newDate: editModal.newDate,
        category: editModal.category,
        type: editModal.type,
        quantity: editModal.quantity
      });

      toast.success('Date de consommation modifiée !', {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        }
      });

      setEditModal(prev => ({ ...prev, isOpen: false }));
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

  const renderConsumptionItem = (
    day: DayConsumption,
    category: 'alcohol' | 'cigarettes' | 'junkfood',
    item: { type: string; quantity: number },
    index: number
  ) => {
    const configs = {
      alcohol: ALCOHOL_CONFIG,
      cigarettes: CIGARETTE_CONFIG,
      junkfood: JUNKFOOD_CONFIG,
    };

    let config: ConsumptionConfig | undefined;
    
    // Récupération sécurisée de la configuration selon la catégorie
    switch (category) {
      case 'alcohol':
        config = configs.alcohol[item.type as AlcoholType];
        break;
      case 'cigarettes':
        config = configs.cigarettes[item.type as CigaretteType];
        break;
      case 'junkfood':
        config = configs.junkfood[item.type as JunkfoodType];
        break;
      default:
        config = undefined;
    }
    
    // Vérification de sécurité
    if (!config) {
      console.warn(`Configuration manquante pour ${category}.${item.type}`);
      return null;
    }
    const categoryLabels = {
      alcohol: 'Alcool',
      cigarettes: 'Cigarettes',
      junkfood: 'Nutrition',
    };

    const categoryColors = {
      alcohol: CATEGORY_COLORS.alcohol.textMedium,
      cigarettes: CATEGORY_COLORS.cigarettes.textMedium,
      junkfood: CATEGORY_COLORS.junkfood.textMedium,
    };

    return (
      <div key={`${category}-${index}`} className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
        {/* Version mobile - Layout vertical */}
        <div className="block sm:hidden p-4 space-y-4">
          {/* En-tête avec icône et infos */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-sm">
              <DynamicIcon name={config.icon} className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="text-gray-800 font-semibold text-lg">{config.label}</div>
              <div className="text-sm text-gray-500">
                <span className={categoryColors[category]}>{categoryLabels[category]}</span>
                {config.volume && <span className="ml-1">({config.volume})</span>}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">×{item.quantity}</div>
            </div>
          </div>
          
          {/* Contrôles de quantité - Mobile */}
          <div className="flex items-center justify-center gap-1">
            <button
              onClick={() => handleRemoveConsumption(day.date, category, item.type as AlcoholType | CigaretteType | JunkfoodType, item.quantity)}
              disabled={removeConsumption.isPending || item.quantity <= 1}
              className="p-2 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-700 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-gray-200"
            >
              <Minus className="w-3 h-3" />
            </button>
            
            <span className="text-gray-800 font-medium min-w-[2.5rem] text-center px-2">×{item.quantity}</span>
            
            <button
              onClick={() => handleAddQuantity(day.date, category, item.type as AlcoholType | CigaretteType | JunkfoodType)}
              disabled={addConsumption.isPending}
              className="p-2 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-700 rounded-lg transition-colors disabled:opacity-50 border border-gray-200"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          
          {/* Actions - Mobile */}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleEditConsumption(day.date, category, item.type as AlcoholType | CigaretteType | JunkfoodType, item.quantity)}
              disabled={moveConsumption.isPending}
              className="p-2 text-slate-500 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-50"
              title="Modifier la date"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => handleDeleteConsumption(day.date, category, item.type as AlcoholType | CigaretteType | JunkfoodType)}
              disabled={removeConsumption.isPending}
              className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="Supprimer complètement"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Version desktop - Layout horizontal */}
        <div className="hidden sm:flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <DynamicIcon name={config.icon} className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="text-gray-800 font-medium">{config.label}</div>
              <div className="text-sm text-gray-500">
                <span className={categoryColors[category]}>{categoryLabels[category]}</span>
                {config.volume && <span className="ml-1">({config.volume})</span>}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Contrôles de quantité */}
            <div className="flex items-center gap-1 bg-white/80 rounded-xl border border-gray-200 px-2 py-1">
              <button
                onClick={() => handleRemoveConsumption(day.date, category, item.type as AlcoholType | CigaretteType | JunkfoodType, item.quantity)}
                disabled={removeConsumption.isPending || item.quantity <= 1}
                className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title={item.quantity <= 1 ? "Quantité minimale (1)" : "Diminuer la quantité"}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              
              <span className="text-gray-800 font-medium min-w-[2.5rem] text-center">×{item.quantity}</span>
              
              <button
                onClick={() => handleAddQuantity(day.date, category, item.type as AlcoholType | CigaretteType | JunkfoodType)}
                disabled={addConsumption.isPending}
                className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                title="Augmenter la quantité"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <button
              onClick={() => handleEditConsumption(day.date, category, item.type as AlcoholType | CigaretteType | JunkfoodType, item.quantity)}
              disabled={moveConsumption.isPending}
              className="p-2 text-slate-500 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-50"
              title="Modifier la date"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => handleDeleteConsumption(day.date, category, item.type as AlcoholType | CigaretteType | JunkfoodType)}
              disabled={removeConsumption.isPending}
              className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="Supprimer complètement"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
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
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Filtres</h3>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher par date
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ex: 2024-01 ou janvier..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition-all"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date spécifique
              {presetDate && (
                <span className="ml-2 px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                  {format(new Date(presetDate), 'dd MMMM yyyy', { locale: fr })} présélectionnée
                </span>
              )}
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition-all ${
                  presetDate 
                    ? 'border-slate-400 bg-slate-50' 
                    : 'border-gray-300'
                }`}
              />
            </div>
          </div>
        </div>
        
        {(searchTerm || selectedDate) && (
          <div className="mt-4">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDate('');
              }}
              className="text-slate-600 hover:text-slate-800 text-sm font-medium transition-colors"
            >
              Effacer les filtres
            </button>
          </div>
        )}
      </div>

      {/* Liste des consommations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            Consommations enregistrées
          </h3>
          <span className="text-gray-400 text-sm">
            {filteredConsumptions.length} jour{filteredConsumptions.length > 1 ? 's' : ''} trouvé{filteredConsumptions.length > 1 ? 's' : ''}
            {totalPages > 1 && (
              <span className="ml-2">
                • Page {currentPage} sur {totalPages}
              </span>
            )}
          </span>
        </div>

        {consumptionsToShow.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              Aucune consommation trouvée
            </h3>
            <p className="text-gray-600">
              {searchTerm || selectedDate 
                ? 'Essayez de modifier vos filtres'
                : 'Commencez à enregistrer vos consommations pour les voir ici'
              }
            </p>
          </div>
        ) : (
          paginatedConsumptions.map((day) => (
            <div key={day.date} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <div className="mb-4">
                {/* Version mobile - Layout vertical */}
                <div className="block sm:hidden">
                  <h4 className="text-lg font-medium text-gray-800 mb-1">
                    {format(new Date(day.date), 'EEEE dd MMMM yyyy', { locale: fr })}
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">
                      {(day.alcohol.reduce((sum, item) => sum + item.quantity, 0) + 
                         day.cigarettes.reduce((sum, item) => sum + item.quantity, 0) + 
                         day.junkfood.reduce((sum, item) => sum + item.quantity, 0))} consommation{(day.alcohol.reduce((sum, item) => sum + item.quantity, 0) + 
                         day.cigarettes.reduce((sum, item) => sum + item.quantity, 0) + 
                         day.junkfood.reduce((sum, item) => sum + item.quantity, 0)) > 1 ? 's' : ''}
                    </span>
                    <button
                      onClick={() => setAddModal({ isOpen: true, date: day.date })}
                      className="flex items-center gap-2 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors font-medium text-sm shadow-md hover:shadow-lg"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">Ajouter</span>
                    </button>
                  </div>
                </div>

                {/* Version desktop - Layout horizontal */}
                <div className="hidden sm:flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h4 className="text-lg font-medium text-gray-800">
                      {format(new Date(day.date), 'EEEE dd MMMM yyyy', { locale: fr })}
                    </h4>
                    <span className="text-gray-500 text-sm">
                      ({(day.alcohol.reduce((sum, item) => sum + item.quantity, 0) + 
                         day.cigarettes.reduce((sum, item) => sum + item.quantity, 0) + 
                         day.junkfood.reduce((sum, item) => sum + item.quantity, 0))} consommation{(day.alcohol.reduce((sum, item) => sum + item.quantity, 0) + 
                         day.cigarettes.reduce((sum, item) => sum + item.quantity, 0) + 
                         day.junkfood.reduce((sum, item) => sum + item.quantity, 0)) > 1 ? 's' : ''})
                    </span>
                  </div>
                  <button
                    onClick={() => setAddModal({ isOpen: true, date: day.date })}
                    className="flex items-center gap-2 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors font-medium text-sm shadow-md hover:shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Ajouter</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {/* Alcool */}
                {day.alcohol
                  .map((item, index) => renderConsumptionItem(day, 'alcohol', item, index))
                  .filter(Boolean)
                }
                
                {/* Cigarettes */}
                {day.cigarettes
                  .map((item, index) => renderConsumptionItem(day, 'cigarettes', item, index))
                  .filter(Boolean)
                }
                
                {/* Malbouffe */}
                {day.junkfood
                  .map((item, index) => renderConsumptionItem(day, 'junkfood', item, index))
                  .filter(Boolean)
                }

                {/* Bouton d'ajout si le jour est vide */}
                {day.alcohol.length === 0 && day.cigarettes.length === 0 && day.junkfood.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-8 h-8 text-slate-600" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">
                      En fait, j'ai oublié quelque chose...
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Cette journée était sereine, mais tu veux ajouter quelque chose que tu n'avais pas noté ?
                    </p>
                    <button
                      onClick={() => setAddModal({ isOpen: true, date: day.date })}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors font-medium shadow-md hover:shadow-lg"
                    >
                      <Plus className="w-5 h-5" />
                      Oui, j'ai oublié quelque chose
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 bg-white/70 hover:bg-white border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Précédent</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-xl transition-colors font-medium ${
                    page === currentPage
                      ? 'bg-slate-600 text-white'
                      : 'bg-white/70 hover:bg-white border border-gray-200 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 bg-white/70 hover:bg-white border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="hidden sm:inline">Suivant</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Portail pour la modal de modification de date */}
      {editModal.isOpen && typeof window !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center p-4 z-[99999]">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-6 w-full max-w-md border border-white/20">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Modifier la date de consommation
            </h3>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Déplacer cette consommation vers une nouvelle date :
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
                onClick={handleMoveConsumption}
                disabled={moveConsumption.isPending || !editModal.newDate || editModal.newDate === editModal.date}
                className="flex-1 px-4 py-3 bg-slate-500 text-white rounded-xl hover:bg-slate-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {moveConsumption.isPending ? 'Modification...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Portail pour la modal de confirmation de suppression */}
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
                onClick={confirmDeleteConsumption}
                disabled={removeConsumption.isPending}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {removeConsumption.isPending ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Portail pour la modal d'ajout de consommation */}
      {addModal.isOpen && typeof window !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center p-4 z-[99999]">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-6 w-full max-w-md border border-white/20">
            <div className="text-center mb-6">
              {/* Icône d'ajout */}
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-emerald-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Qu'est-ce que tu avais oublié ?
              </h3>
              
              <p className="text-gray-600 text-sm mb-4">
                {format(new Date(addModal.date), 'dd MMMM yyyy', { locale: fr })}
              </p>
            </div>
            
            {/* Boutons de catégories */}
            <div className="space-y-3 mb-6">
              {/* Alcool */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Alcool</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(ALCOHOL_CONFIG).map(([type, config]) => (
                    <button
                      key={type}
                      onClick={() => handleAddConsumption('alcohol', type as AlcoholType)}
                      disabled={addConsumption.isPending}
                      className="flex items-center gap-2 p-3 bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <DynamicIcon name={config.icon} className="w-4 h-4 text-pink-600" />
                      <span className="text-sm font-medium text-pink-700">{config.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cigarettes */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Cigarettes</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(CIGARETTE_CONFIG).map(([type, config]) => (
                    <button
                      key={type}
                      onClick={() => handleAddConsumption('cigarettes', type as CigaretteType)}
                      disabled={addConsumption.isPending}
                      className="flex items-center gap-2 p-3 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <DynamicIcon name={config.icon} className="w-4 h-4 text-violet-600" />
                      <span className="text-sm font-medium text-violet-700">{config.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nutrition */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Nutrition</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(JUNKFOOD_CONFIG).map(([type, config]) => (
                    <button
                      key={type}
                      onClick={() => handleAddConsumption('junkfood', type as JunkfoodType)}
                      disabled={addConsumption.isPending}
                      className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <DynamicIcon name={config.icon} className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">{config.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setAddModal({ isOpen: false, date: '' })}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
