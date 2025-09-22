'use client';

import React from 'react';

interface GaugeProps {
  progress: number; // Valeur entre 0 et 1
  steps?: number;
  colorSteps?: string[];
  category?: 'sport' | 'social' | 'nutrition';
  showLabels?: boolean;
  className?: string;
}

export default function Gauge({ 
  progress, 
  steps = 5,
  colorSteps,
  category = 'sport',
  showLabels = true,
  className = ''
}: GaugeProps) {
  // Couleurs par défaut selon la catégorie
  const defaultColorSteps = {
    sport: ['bg-emerald-200', 'bg-emerald-300', 'bg-emerald-400', 'bg-emerald-500', 'bg-emerald-600'],
    social: ['bg-blue-200', 'bg-blue-300', 'bg-blue-400', 'bg-blue-500', 'bg-blue-600'],
    nutrition: ['bg-orange-200', 'bg-orange-300', 'bg-orange-400', 'bg-orange-500', 'bg-orange-600'],
  };

  const colors = colorSteps || defaultColorSteps[category];
  const currentStep = Math.floor(progress * steps);
  const currentColor = colors[Math.min(currentStep, colors.length - 1)] || colors[colors.length - 1];

  return (
    <div className={`w-full ${className}`}>
      <div className="relative h-6 rounded-full bg-slate-100 overflow-hidden border border-slate-200 shadow-inner">
        {/* Barre de progression animée */}
        <div
          className={`h-full ${currentColor} transition-all duration-2000 ease-out`}
          style={{ width: `${progress * 100}%` }}
        />
        
        {/* Séparateurs d'étapes */}
        {Array.from({ length: steps - 1 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 h-full w-0.5 bg-white/80 shadow-sm"
            style={{ left: `${((i + 1) / steps) * 100}%` }}
          />
        ))}
        
        {/* Labels des étapes */}
        {showLabels && (
          <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-gray-500">
            {Array.from({ length: steps }).map((_, i) => (
              <span 
                key={i} 
                className={`transition-colors duration-300 ${
                  i <= currentStep ? 'text-gray-700 font-medium' : 'text-gray-400'
                }`}
              >
                {i + 1}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
