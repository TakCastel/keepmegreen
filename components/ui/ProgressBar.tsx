'use client';

import React from 'react';

interface ProgressBarProps {
  progress: number; // Valeur entre 0 et 100
  color?: string;
  height?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
  showPercentage?: boolean;
}

export default function ProgressBar({ 
  progress, 
  color = 'bg-emerald-500', 
  height = 'md',
  animated = true,
  className = '',
  showPercentage = false
}: ProgressBarProps) {
  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-gray-200 rounded-full ${heightClasses[height]} overflow-hidden`}>
        <div
          className={`${heightClasses[height]} rounded-full ${color} shadow-sm ${
            animated ? 'transition-all duration-2000 ease-out' : ''
          }`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-xs text-gray-500 mt-1 text-right">
          {clampedProgress.toFixed(1)}%
        </div>
      )}
    </div>
  );
}
