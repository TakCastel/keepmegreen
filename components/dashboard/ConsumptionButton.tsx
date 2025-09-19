'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Plus, Wine, Cigarette, Beef } from 'lucide-react';
import DynamicIcon from '@/components/ui/DynamicIcon';
import { 
  ALCOHOL_CONFIG, 
  CIGARETTE_CONFIG, 
  JUNKFOOD_CONFIG
} from '@/types';
import { CATEGORY_COLORS, CategoryType } from '@/constants/colors';

interface ConsumptionButtonProps {
  category: 'alcohol' | 'cigarettes' | 'junkfood';
  onAdd: (type: string) => void;
  disabled?: boolean;
}

const CATEGORY_CONFIG = {
  alcohol: {
    icon: Wine,
    label: 'Alcool',
    config: ALCOHOL_CONFIG,
  },
  cigarettes: {
    icon: Cigarette,
    label: 'Cigarettes',
    config: CIGARETTE_CONFIG,
  },
  junkfood: {
    icon: Beef,
    label: 'Nutrition',
    config: JUNKFOOD_CONFIG,
  },
};

export default function ConsumptionButton({ category, onAdd, disabled }: ConsumptionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [isClosing, setIsClosing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const categoryData = CATEGORY_CONFIG[category];
  const colors = CATEGORY_COLORS[category as CategoryType];
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Détecter si on est en mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // xl breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Fonction pour scroller vers l'accordéon en mobile
  const scrollToAccordion = () => {
    if (isMobile && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const headerHeight = 200; // Hauteur du header mobile (176px) + marge supplémentaire
      const scrollPosition = window.scrollY + buttonRect.top - headerHeight;
      
      // Scroll plus fluide avec une durée personnalisée
      const startPosition = window.scrollY;
      const distance = scrollPosition - startPosition;
      const duration = Math.min(Math.abs(distance) * 0.8, 800); // Durée adaptative, max 800ms
      
      let startTime: number;
      
      const animateScroll = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Fonction d'easing pour un mouvement plus naturel
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        
        window.scrollTo(0, startPosition + distance * easeOutCubic);
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };
      
      requestAnimationFrame(animateScroll);
    }
  };

  // Fonction pour ouvrir le dropdown (accordéon en mobile)
  const handleOpen = () => {
    setIsOpen(true);
    // En mobile, scroller vers l'accordéon après l'ouverture
    if (isMobile) {
      setTimeout(() => {
        scrollToAccordion();
      }, 200);
    }
  };

  // Fonction pour fermer avec animation
  const handleClose = () => {
    setIsClosing(true);
    setVisibleItems([]);
    
    // Fermer complètement après l'animation
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300);
  };

  // Gérer l'ouverture avec stagger
  useEffect(() => {
    if (isOpen) {
      const configEntries = Object.entries(categoryData.config);
      setVisibleItems([]);
      
      configEntries.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems(prev => [...prev, index]);
        }, index * 150);
      });
    } else {
      setVisibleItems([]);
    }
  }, [isOpen, categoryData.config]);

  const handleTypeSelect = (type: string) => {
    onAdd(type);
    handleClose();
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes fadeOut {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-20px) scale(0.9);
          }
        }
        
        @keyframes slideInFromTop {
          0% {
            opacity: 0;
            transform: translateY(-20px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0) rotate(-10deg);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2) rotate(5deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-fadeOut {
          animation: fadeOut 0.3s ease-in forwards;
        }
      `}</style>
      
      <div className="relative" ref={dropdownRef}>
        {/* Bouton principal */}
        <button
          ref={buttonRef}
          onClick={() => isOpen ? handleClose() : handleOpen()}
          disabled={disabled}
          className={`w-full p-8 rounded-3xl bg-gradient-to-br ${colors.primary} ${colors.primaryHover} disabled:opacity-50 disabled:cursor-not-allowed ${colors.text} font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm ${colors.iconBg}`}>
                <categoryData.icon className={`w-8 h-8 ${colors.iconColor}`} />
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
        {(isOpen || isClosing) && (
          <div className={`${
            isMobile 
              ? `relative mt-4 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 ${
                  isClosing ? 'opacity-0' : 'opacity-100'
                }` 
              : 'absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-md md:bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden'
          } ${
            !isMobile && (isClosing ? 'animate-fadeOut' : 'animate-fadeIn')
          }`}>
            {Object.entries(categoryData.config).map(([type, config], index) => (
              <div
                key={type}
                className={`transition-all duration-300 ${
                  visibleItems.includes(index) && !isClosing
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform -translate-y-4'
                }`}
                style={{
                  animationDelay: visibleItems.includes(index) && !isClosing ? '0ms' : '0ms',
                  animation: visibleItems.includes(index) && !isClosing ? 'slideInFromTop 0.4s ease-out forwards' : 'none'
                }}
              >
                <button
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
                  <div 
                    className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center group-hover:bg-emerald-600 transition-colors"
                    style={{
                      animationDelay: visibleItems.includes(index) && !isClosing ? '200ms' : '0ms',
                      animation: visibleItems.includes(index) && !isClosing ? 'popIn 0.5s ease-out forwards' : 'none'
                    }}
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}