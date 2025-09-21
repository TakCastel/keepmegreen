'use client';

import { Trash2, Edit3, Plus, Minus } from 'lucide-react';
import DynamicIcon from '@/components/ui/DynamicIcon';
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

interface ConsumptionItemProps {
  day: DayConsumption;
  category: 'alcohol' | 'cigarettes' | 'junkfood';
  item: { type: string; quantity: number };
  index: number;
  onRemove: (date: string, category: 'alcohol' | 'cigarettes' | 'junkfood', type: AlcoholType | CigaretteType | JunkfoodType, currentQuantity: number) => void;
  onAdd: (date: string, category: 'alcohol' | 'cigarettes' | 'junkfood', type: AlcoholType | CigaretteType | JunkfoodType) => void;
  onEdit: (date: string, category: 'alcohol' | 'cigarettes' | 'junkfood', type: AlcoholType | CigaretteType | JunkfoodType, quantity: number) => void;
  onDelete: (date: string, category: 'alcohol' | 'cigarettes' | 'junkfood', type: AlcoholType | CigaretteType | JunkfoodType) => void;
  isRemovePending: boolean;
  isAddPending: boolean;
  isMovePending: boolean;
}

export default function ConsumptionItem({
  day,
  category,
  item,
  index,
  onRemove,
  onAdd,
  onEdit,
  onDelete,
  isRemovePending,
  isAddPending,
  isMovePending
}: ConsumptionItemProps) {
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
            onClick={() => onRemove(day.date, category, item.type as AlcoholType | CigaretteType | JunkfoodType, item.quantity)}
            disabled={isRemovePending || item.quantity <= 1}
            className="p-2 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-700 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-gray-200"
          >
            <Minus className="w-3 h-3" />
          </button>
          
          <span className="text-gray-800 font-medium min-w-[2.5rem] text-center px-2">×{item.quantity}</span>
          
          <button
            onClick={() => onAdd(day.date, category, item.type as AlcoholType | CigaretteType | JunkfoodType)}
            disabled={isAddPending}
            className="p-2 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-700 rounded-lg transition-colors disabled:opacity-50 border border-gray-200"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
        
        {/* Actions - Mobile */}
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onEdit(day.date, category, item.type as AlcoholType | CigaretteType | JunkfoodType, item.quantity)}
            disabled={isMovePending}
            className="p-2 text-slate-500 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-50"
            title="Modifier le moment"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onDelete(day.date, category, item.type as AlcoholType | CigaretteType | JunkfoodType)}
            disabled={isRemovePending}
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
              onClick={() => onRemove(day.date, category, item.type as AlcoholType | CigaretteType | JunkfoodType, item.quantity)}
              disabled={isRemovePending || item.quantity <= 1}
              className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              title={item.quantity <= 1 ? "Observation minimale (1)" : "Diminuer l'observation"}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            
            <span className="text-gray-800 font-medium min-w-[2.5rem] text-center">×{item.quantity}</span>
            
            <button
              onClick={() => onAdd(day.date, category, item.type as AlcoholType | CigaretteType | JunkfoodType)}
              disabled={isAddPending}
              className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
              title="Augmenter l'observation"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <button
            onClick={() => onEdit(day.date, category, item.type as AlcoholType | CigaretteType | JunkfoodType, item.quantity)}
            disabled={isMovePending}
            className="p-2 text-slate-500 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-50"
            title="Modifier le moment"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onDelete(day.date, category, item.type as AlcoholType | CigaretteType | JunkfoodType)}
            disabled={isRemovePending}
            className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Supprimer complètement"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
