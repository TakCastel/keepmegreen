'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';

const WeightTooltip = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      {/* Icône d'information */}
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
        aria-label="Informations sur la pondération"
      >
        <Info className="w-3 h-3 text-gray-600" />
      </button>

      {/* Tooltip */}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 w-80 max-w-sm">
            <h3 className="text-sm font-semibold text-gray-800 mb-4 text-center">
              Système de pondération
            </h3>
            
            {/* Cigarettes */}
            <div className="mb-4">
              <h4 className="text-xs font-medium text-orange-600 mb-2 flex items-center gap-1">
Cigarettes (plus grave)
              </h4>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Classique/Roulée</span>
                  <span className="font-medium">3 pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Cigare</span>
                  <span className="font-medium">4 pts</span>
                </div>
                <div className="flex justify-between">
                  <span>E-cigarette</span>
                  <span className="font-medium">1.5 pts</span>
                </div>
              </div>
            </div>

            {/* Alcool */}
            <div className="mb-4">
              <h4 className="text-xs font-medium text-purple-600 mb-2 flex items-center gap-1">
Alcool (modéré à élevé)
              </h4>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Bière</span>
                  <span className="font-medium">2 pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Vin</span>
                  <span className="font-medium">2.5 pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Shot/Spiritueux</span>
                  <span className="font-medium">3-3.5 pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Cocktail</span>
                  <span className="font-medium">2.5 pts</span>
                </div>
              </div>
            </div>

            {/* Nutrition */}
            <div className="mb-4">
              <h4 className="text-xs font-medium text-blue-600 mb-2 flex items-center gap-1">
Nutrition (faible à modéré)
              </h4>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Sucreries</span>
                  <span className="font-medium">0.5 pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Soda</span>
                  <span className="font-medium">0.8 pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Frites</span>
                  <span className="font-medium">1 pt</span>
                </div>
                <div className="flex justify-between">
                  <span>Pizza</span>
                  <span className="font-medium">1.5 pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Burger</span>
                  <span className="font-medium">2 pts</span>
                </div>
              </div>
            </div>

            {/* Seuils de couleur */}
            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-xs font-medium text-gray-700 mb-2">
                Seuils de couleur
              </h4>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between items-center">
                  <span>Sérénité</span>
                  <span className="font-medium">0 pt</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Éveil</span>
                  <span className="font-medium">≤ 2 pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Vigilance</span>
                  <span className="font-medium">≤ 6 pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Attention</span>
                  <span className="font-medium">&gt; 6 pts</span>
                </div>
              </div>
            </div>

            {/* Flèche du tooltip */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="w-3 h-3 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeightTooltip;
