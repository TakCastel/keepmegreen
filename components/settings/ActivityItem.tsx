'use client';

import { Trash2, Edit3, Plus, Minus } from 'lucide-react';
import DynamicIcon from '@/components/ui/DynamicIcon';
import { 
  SPORT_CONFIG,
  SOCIAL_CONFIG,
  NUTRITION_CONFIG,
  DayActivities,
  SportType,
  SocialType,
  NutritionType,
  ActivityConfig
} from '@/types';
import { CATEGORY_COLORS } from '@/constants/colors';

interface ActivityItemProps {
  day: DayActivities;
  category: 'sport' | 'social' | 'nutrition';
  item: { type: string; quantity: number };
  index: number;
  onRemove: (date: string, category: 'sport' | 'social' | 'nutrition', type: SportType | SocialType | NutritionType, currentQuantity: number) => void;
  onAdd: (date: string, category: 'sport' | 'social' | 'nutrition', type: SportType | SocialType | NutritionType) => void;
  onEdit: (date: string, category: 'sport' | 'social' | 'nutrition', type: SportType | SocialType | NutritionType, quantity: number) => void;
  onDelete: (date: string, category: 'sport' | 'social' | 'nutrition', type: SportType | SocialType | NutritionType) => void;
  isRemovePending: boolean;
  isAddPending: boolean;
  isMovePending: boolean;
}

export default function ActivityItem({
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
}: ActivityItemProps) {
  const configs = {
    sport: SPORT_CONFIG,
    social: SOCIAL_CONFIG,
    nutrition: NUTRITION_CONFIG
  };
  
  let config: ActivityConfig | undefined;
  switch (category) {
    case 'sport':
      config = configs.sport[item.type as SportType];
      break;
    case 'social':
      config = configs.social[item.type as SocialType];
      break;
    case 'nutrition':
      config = configs.nutrition[item.type as NutritionType];
      break;
  }
  
  const colors = CATEGORY_COLORS[category];
  
  if (!config) return null;

  return (
    <div key={`${category}-${index}`} className={`${colors.chartLight} rounded-2xl p-4 border border-gray-200`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 bg-gradient-to-br ${colors.primary} rounded-xl flex items-center justify-center`}>
            <DynamicIcon name={config.icon} className="w-5 h-5 text-gray-700" />
          </div>
          <div>
            <div className={`font-medium ${colors.textMedium}`}>
              {config.label}
            </div>
            <div className="text-gray-600 text-sm">
              {item.quantity} activité{item.quantity > 1 ? 's' : ''}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/80 rounded-xl border border-gray-200 px-2 py-1">
            <button
              onClick={() => onRemove(day.date, category, item.type as SportType | SocialType | NutritionType, item.quantity)}
              disabled={isRemovePending || item.quantity <= 1}
              className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              title={item.quantity <= 1 ? "Quantité minimale (1)" : "Diminuer la quantité"}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            
            <span className="text-gray-800 font-medium min-w-[2.5rem] text-center">×{item.quantity}</span>
            
            <button
              onClick={() => onAdd(day.date, category, item.type as SportType | SocialType | NutritionType)}
              disabled={isAddPending}
              className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
              title="Augmenter la quantité"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <button
            onClick={() => onEdit(day.date, category, item.type as SportType | SocialType | NutritionType, item.quantity)}
            disabled={isMovePending}
            className="p-2 text-slate-500 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-50"
            title="Modifier le moment"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onDelete(day.date, category, item.type as SportType | SocialType | NutritionType)}
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
