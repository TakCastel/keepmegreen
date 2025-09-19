'use client';

import { useState } from 'react';
import { ChevronDown, Plus, Wine, Cigarette, Beef } from 'lucide-react';
import DynamicIcon from '@/components/ui/DynamicIcon';
import { 
  ALCOHOL_CONFIG, 
  CIGARETTE_CONFIG, 
  JUNKFOOD_CONFIG,
  AlcoholType,
  CigaretteType,
  JunkfoodType,
  ConsumptionConfig
} from '@/types';

interface ConsumptionButtonProps {
  category: 'alcohol' | 'cigarettes' | 'junkfood';
  onAdd: (type: string) => void;
  disabled?: boolean;
}

const CATEGORY_CONFIG = {
  alcohol: {
    icon: Wine,
    label: 'Alcool',
    bgColor: 'bg-gradient-to-br from-purple-400 to-purple-500',
    hoverColor: 'hover:from-purple-500 hover:to-purple-600',
    textColor: 'text-white',
    config: ALCOHOL_CONFIG,
  },
  cigarettes: {
    icon: Cigarette,
    label: 'Cigarettes',
    bgColor: 'bg-gradient-to-br from-orange-400 to-orange-500',
    hoverColor: 'hover:from-orange-500 hover:to-orange-600',
    textColor: 'text-white',
    config: CIGARETTE_CONFIG,
  },
  junkfood: {
    icon: Beef,
    label: 'Nutrition consciente',
    bgColor: 'bg-gradient-to-br from-red-400 to-red-500',
    hoverColor: 'hover:from-red-500 hover:to-red-600',
    textColor: 'text-white',
    config: JUNKFOOD_CONFIG,
  },
};

export default function ConsumptionButton({ category, onAdd, disabled }: ConsumptionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const categoryData = CATEGORY_CONFIG[category];

  const handleTypeSelect = (type: string) => {
    onAdd(type);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Bouton principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full p-8 rounded-3xl ${categoryData.bgColor} ${categoryData.hoverColor} disabled:opacity-50 disabled:cursor-not-allowed ${categoryData.textColor} font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <categoryData.icon className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <span className="text-xl font-semibold block">{categoryData.label}</span>
              <span className="text-sm opacity-90">Prise de conscience</span>
            </div>
          </div>
          <ChevronDown 
            className={`w-6 h-6 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`} 
          />
        </div>
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 z-10 overflow-hidden">
          {Object.entries(categoryData.config).map(([type, config]) => (
            <button
              key={type}
              onClick={() => handleTypeSelect(type)}
              className="w-full p-4 text-left hover:bg-white/60 transition-all border-b border-gray-100 last:border-b-0 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center">
                  <DynamicIcon name={config.icon} className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="text-gray-800 font-medium">{config.label}</div>
                  {config.volume && (
                    <div className="text-gray-500 text-sm">{config.volume}</div>
                  )}
                </div>
              </div>
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                <Plus className="w-4 h-4 text-white" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Overlay pour fermer le menu */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
