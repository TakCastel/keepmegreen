'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAllConsumptions, useRemoveConsumption } from '@/hooks/useConsumptions';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Trash2, Edit3, Calendar, Search } from 'lucide-react';
import DynamicIcon from '@/components/ui/DynamicIcon';
import { toast } from 'react-hot-toast';
import { 
  ALCOHOL_CONFIG, 
  CIGARETTE_CONFIG, 
  JUNKFOOD_CONFIG,
  DayConsumption 
} from '@/types';

export default function ConsumptionEditor() {
  const { user } = useAuth();
  const { data: consumptions = [], isLoading } = useAllConsumptions(user?.uid);
  const removeConsumption = useRemoveConsumption();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

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
    type: string,
    quantity: number
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
    } catch (error) {
      toast.error('Erreur lors de la suppression', {
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
    item: any,
    index: number
  ) => {
    const configs = {
      alcohol: ALCOHOL_CONFIG,
      cigarettes: CIGARETTE_CONFIG,
      junkfood: JUNKFOOD_CONFIG,
    };

    const config = configs[category][item.type as keyof typeof configs[typeof category]];
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
            onClick={() => handleRemoveConsumption(day.date, category, item.type, item.quantity)}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {day.alcohol.map((item, index) => 
                  renderConsumptionItem(day, 'alcohol', item, index)
                )}
                
                {/* Cigarettes */}
                {day.cigarettes.map((item, index) => 
                  renderConsumptionItem(day, 'cigarettes', item, index)
                )}
                
                {/* Malbouffe */}
                {day.junkfood.map((item, index) => 
                  renderConsumptionItem(day, 'junkfood', item, index)
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
