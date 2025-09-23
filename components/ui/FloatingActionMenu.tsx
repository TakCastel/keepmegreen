'use client';

import React, { useMemo, useState } from 'react';
import { Plus, X, Dumbbell, Users, Utensils } from 'lucide-react';
import {
  SPORT_CONFIG,
  SOCIAL_CONFIG,
  NUTRITION_CONFIG,
  SportType,
  SocialType,
  NutritionType,
} from '@/types';
import DynamicIcon from '@/components/ui/DynamicIcon';

type Category = 'sport' | 'social' | 'nutrition';

interface FloatingActionMenuProps {
  onSelect: (
    category: Category,
    type: SportType | SocialType | NutritionType
  ) => void;
  disabled?: boolean;
}

export default function FloatingActionMenu({ onSelect, disabled }: FloatingActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const categoryButtons = useMemo(
    () => [
      {
        key: 'sport' as const,
        icon: Dumbbell,
        label: 'Sport',
        bg: 'from-emerald-500 to-green-500',
      },
      {
        key: 'social' as const,
        icon: Users,
        label: 'Social',
        bg: 'from-amber-400 to-orange-500',
      },
      {
        key: 'nutrition' as const,
        icon: Utensils,
        label: 'Nutrition',
        bg: 'from-sky-400 to-blue-500',
      },
    ],
    []
  );

  const options = useMemo(() => {
    if (selectedCategory === 'sport') return Object.entries(SPORT_CONFIG) as [SportType, any][];
    if (selectedCategory === 'social') return Object.entries(SOCIAL_CONFIG) as [SocialType, any][];
    if (selectedCategory === 'nutrition') return Object.entries(NUTRITION_CONFIG) as [NutritionType, any][];
    return [];
  }, [selectedCategory]);

  const closeAll = () => {
    setIsOpen(false);
    setStep(0);
    setSelectedCategory(null);
  };

  const handleMain = () => {
    if (disabled) return;
    if (!isOpen) {
      setIsOpen(true);
      setStep(1);
    } else {
      closeAll();
    }
  };

  const handlePickCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setStep(2);
  };

  const handlePickOption = (
    type: SportType | SocialType | NutritionType
  ) => {
    if (!selectedCategory) return;
    onSelect(selectedCategory, type);
    // micro-delay pour laisser l'animation se lancer
    setTimeout(() => closeAll(), 60);
  };

  return (
    <div className="md:hidden">
      {/* Overlay pour clic extérieur */}
      {isOpen && (
        <button
          aria-label="Fermer le menu"
          onClick={closeAll}
          className="fixed inset-0 bg-black/10 backdrop-blur-[1px] z-40"
        />
      )}

      {/* Conteneur FAB */}
      <div className="fixed left-auto right-4 bottom-5 z-50">
        {/* Etape 2 : options de la catégorie sélectionnée */}
        {step === 2 && selectedCategory && (
          <div className="mb-3 mr-1 origin-bottom-right transform transition-all duration-200 ease-out opacity-100 scale-100 flex justify-end">
            <div className="max-w-[88vw] w-[88vw] sm:max-w-sm bg-white/95 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-3">
              <div className="flex items-center justify-start px-1 pb-2">
                <div className="text-sm font-medium text-gray-700">
                  {categoryButtons.find((c) => c.key === selectedCategory)?.label}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {options.map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => handlePickOption(key)}
                    className="group flex flex-col items-center rounded-2xl p-2 bg-white/80 hover:bg-white transition shadow-sm border border-white/60"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 grid place-items-center mb-1">
                      <DynamicIcon name={cfg.icon} className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] leading-tight text-gray-700 text-center">
                      {cfg.label}
                    </span>
                  </button>
                ))}
              </div>
              {/* Footer avec bouton "Fermer" à droite */}
              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 px-4 h-10 rounded-xl text-white bg-gradient-to-br from-emerald-500 to-green-500 hover:brightness-110 shadow-md border border-white/40"
                >
                  <X className="w-4 h-4" />
                  <span className="text-sm font-medium">Fermer</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Etape 1 : choix des catégories (menu vertical ascendant, icônes alignées sur le +) */}
        {step === 1 && (
          <div className="absolute left-auto right-4 bottom-[4.25rem] flex flex-col items-end z-50">
            {categoryButtons.map((c, idx) => (
              <button
                key={c.key}
                onClick={() => handlePickCategory(c.key)}
                className="mb-2 focus:outline-none"
                style={{ transitionDelay: `${idx * 70}ms` }}
              >
                <div
                  className={`flex items-center justify-end gap-2 translate-y-2 opacity-0
                    transition-all duration-200 ease-out
                    ${isOpen ? 'translate-y-0 opacity-100' : ''}`}
                >
                  {/* Label à gauche */}
                  <div className="px-3 py-2 rounded-2xl shadow-lg bg-white/95 border border-white/60 backdrop-blur-xl">
                    <span className="text-xs font-medium text-gray-800">{c.label}</span>
                  </div>
                  {/* Icône alignée avec le + */}
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.bg} text-white grid place-items-center shadow-md`}>
                    {c.icon && <c.icon className="w-5 h-5" />}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Bouton principal */}
        <button
          aria-label={isOpen ? 'Fermer' : 'Ajouter'}
          onClick={handleMain}
          disabled={disabled}
          className={`relative inline-flex items-center gap-2 h-14 rounded-2xl shadow-2xl border border-white/40 backdrop-blur-xl active:scale-95 overflow-hidden will-change-transform
            ${isOpen ? 'w-14 justify-center px-0' : 'w-[128px] justify-between pl-4 pr-5'}
            transition-[width,padding] duration-200 ease-out
            ${disabled ? 'bg-gray-300 text-white' : 'bg-gradient-to-br from-emerald-500 to-green-500 text-white hover:brightness-110'}
          `}
        >
          <span
            className={`text-[13px] font-medium whitespace-nowrap transition-opacity duration-150 ${
              isOpen ? 'opacity-0' : 'opacity-100'
            }`}
          >
            Ajouter
          </span>
          <div className={`transition-transform duration-200 will-change-transform ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
            <Plus className="w-6 h-6" />
          </div>
        </button>
      </div>
    </div>
  );
}


