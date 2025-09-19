'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAllConsumptions, useRemoveConsumption, useMoveConsumption } from '@/hooks/useConsumptions';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Trash2, Edit3, Calendar, Search } from 'lucide-react';
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

export default function ConsumptionEditor() {
  const { user } = useAuth();
  const { data: consumptions = [], isLoading } = useAllConsumptions(user?.uid);
  const removeConsumption = useRemoveConsumption();
  const moveConsumption = useMoveConsumption();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  
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

  // Filtrer les consommations
  const filteredConsumptions = consumptions.filter(day => {
    const matchesDate = selectedDate ? day.date === selectedDate : true;
    const matchesSearch = searchTerm ? 
      day.date.includes(searchTerm) ||
      format(new Date(day.date), 'dd MMMM yyyy', { locale: fr }).toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    return matchesDate && matchesSearch && (
      day.alcohol.length > 0 || day.cigarettes.length > 0 || day.junkfood.length > 0
    );
  });

  const handleRemoveConsumption = async (
    date: string,
    category: 'alcohol' | 'cigarettes' | 'junkfood',
    type: AlcoholType | CigaretteType | JunkfoodType
  ) => {
    if (!user) return;

    try {
      await removeConsumption.mutateAsync({
        userId: user.uid,
        date,
        category,
        type,
        quantity: 1, // Retirer une unité à la fois
      });

      toast.success('Consommation supprimée !', {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        }
      });
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
      alcohol: 'text-purple-600',
      cigarettes: 'text-orange-600',
      junkfood: 'text-red-600',
    };

    return (
      <div key={`${category}-${index}`} className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-gray-200">
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
        
        <div className="flex items-center gap-3">
          <span className="text-gray-800 font-medium">×{item.quantity}</span>
          
          <button
            onClick={() => handleEditConsumption(day.date, category, item.type as AlcoholType | CigaretteType | JunkfoodType, item.quantity)}
            disabled={moveConsumption.isPending}
            className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
            title="Modifier la date"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => handleRemoveConsumption(day.date, category, item.type as AlcoholType | CigaretteType | JunkfoodType)}
            disabled={removeConsumption.isPending}
            className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Supprimer une unité"
          >
            <Trash2 className="w-4 h-4" />
          </button>
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
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition-all"
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
          </span>
        </div>

        {filteredConsumptions.length === 0 ? (
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
          filteredConsumptions.map((day) => (
            <div key={day.date} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
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
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de modification de date */}
      {editModal.isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
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
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
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
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {moveConsumption.isPending ? 'Modification...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
