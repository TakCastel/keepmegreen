'use client';

import { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';

const InfoBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fermé le banner
    const hasClosedBanner = localStorage.getItem('infoBannerClosed');
    if (!hasClosedBanner) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Enregistrer dans localStorage que l'utilisateur a fermé le banner
    localStorage.setItem('infoBannerClosed', 'true');
  };

  if (!isVisible) {
    return null; // Ne rend rien quand fermé
  }

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6 mb-8 relative">
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-emerald-600 hover:text-emerald-800 transition-colors p-1 hover:bg-emerald-100 rounded-full"
        aria-label="Fermer"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="flex items-start gap-4 pr-8">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <Info className="w-5 h-5 text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-emerald-800 mb-3">
            Comment utiliser Keepmegreen ?
          </h3>
          <div className="text-emerald-700 leading-relaxed mb-4 space-y-2">
            <p className="text-sm">
              <span className="font-medium">1. Observez sans jugement</span> - Quand vous consommez quelque chose, cliquez sur le bouton correspondant ci-dessous.
            </p>
            <p className="text-sm">
              <span className="font-medium">2. Prenez conscience</span> - Chaque clic est un moment de pleine conscience, pas une punition.
            </p>
            <p className="text-sm">
              <span className="font-medium">3. Cultivez l'équilibre</span> - Observez vos patterns avec bienveillance et célébrez vos progrès.
            </p>
          </div>
          
          <button
            onClick={handleClose}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200"
          >
            J'ai compris
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoBanner;
