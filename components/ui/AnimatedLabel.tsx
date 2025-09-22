'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import DynamicIcon from '@/components/ui/DynamicIcon';

interface AnimatedLabelProps {
  category: 'sport' | 'social' | 'nutrition';
  iconName: string;
  label: string;
  quantity: number;
  type: string;
  onRemove: () => void;
  disabled?: boolean;
  index?: number;
}

const categoryStyles: Record<'sport' | 'social' | 'nutrition', { bg: string; hover: string; icon: string }> = {
  sport: { bg: 'bg-emerald-500', hover: 'hover:bg-emerald-600', icon: 'text-emerald-600' },
  social: { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', icon: 'text-blue-600' },
  nutrition: { bg: 'bg-orange-500', hover: 'hover:bg-orange-600', icon: 'text-orange-600' },
};

export default function AnimatedLabel({ 
  category, 
  iconName, 
  label, 
  quantity, 
  type, 
  onRemove, 
  disabled = false,
  index = 0 
}: AnimatedLabelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isDecrementing, setIsDecrementing] = useState(false);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const styles = categoryStyles[category];

  // Animation d'apparition - démarrer immédiatement avec le délai
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setShowRemoveButton(true); // Afficher le bouton en même temps que le label
    }, index * 50); // Délai échelonné pour chaque label

    return () => clearTimeout(timer);
  }, [index]);

  // Animation de suppression
  const handleRemove = () => {
    // Si quantité > 1, on anime uniquement le badge quantité (décrément visuel)
    if (quantity > 1) {
      setIsDecrementing(true);
      // Laisser le temps à l'animation de se jouer, puis déclencher la mutation
      setTimeout(() => {
        onRemove();
        // Réinitialiser l'état après un court délai (la prop quantity se mettra à jour côté parent)
        setTimeout(() => setIsDecrementing(false), 200);
      }, 150);
      return;
    }

    // Si quantité == 1, on supprime visuellement le label
    setIsRemoving(true);
    setTimeout(() => {
      onRemove();
    }, 300); // Délai pour l'animation de sortie
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes fadeOutScale {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.8);
          }
        }

        @keyframes quantityUpdate {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        
        .animate-fadeInScale {
          animation: fadeInScale 0.3s ease-out forwards;
        }
        
        .animate-fadeOutScale {
          animation: fadeOutScale 0.2s ease-in forwards;
        }
        
        .animate-quantityUpdate {
          animation: quantityUpdate 0.2s ease-out;
        }
      `}</style>
      
      <div 
        className={`flex items-center gap-3 p-3 rounded-xl ${styles.bg} ${styles.hover} transition-all duration-300 shadow-sm group ${
          isVisible && !isRemoving ? 'animate-fadeInScale' : 'opacity-0'
        } ${
          isRemoving ? 'animate-fadeOutScale' : ''
        }`}
        title={label}
      >
        <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center shadow-sm">
          <DynamicIcon name={iconName} className={`w-4.5 h-4.5 ${styles.icon}`} />
        </div>
        
        <span className="text-white font-semibold text-sm leading-none">
          {label}
        </span>
        
        {quantity > 1 && (
          <span 
            className={`ml-0.5 text-white/90 font-medium text-xs ${
              isDecrementing ? 'animate-quantityUpdate' : ''
            }`}
          >
            ×{quantity}
          </span>
        )}
        
        {showRemoveButton && (
          <button
            onClick={handleRemove}
            disabled={disabled || isRemoving || isDecrementing}
            className="ml-1 w-5 h-5 rounded-full bg-white hover:bg-red-50 flex items-center justify-center opacity-100 transition-all duration-200 disabled:opacity-50 shadow-sm"
            title="Supprimer cette activité"
          >
            <X className="w-3 h-3 text-red-500" />
          </button>
        )}
      </div>
    </>
  );
}
