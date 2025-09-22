'use client';

import React, { useState, useEffect } from 'react';

interface AnimatedPipProps {
  colorClass: string;
  index: number;
  totalCount: number;
}

export default function AnimatedPip({ colorClass, index, totalCount }: AnimatedPipProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 30); // Délai échelonné plus rapide pour les pips

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <>
      <style jsx>{`
        @keyframes pipFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-pipFadeIn {
          animation: pipFadeIn 0.2s ease-out forwards;
        }
      `}</style>
      
      <span
        className={`inline-block w-2 h-2 rounded-full ${colorClass} shadow-[0_0_0_1px_rgba(0,0,0,0.05)] ${
          isVisible ? 'animate-pipFadeIn' : 'opacity-0'
        }`}
      />
    </>
  );
}
