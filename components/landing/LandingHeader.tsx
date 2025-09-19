'use client';

import Link from 'next/link';
import { Sprout, LogIn } from 'lucide-react';

export default function LandingHeader() {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const headerHeight = 80; // Hauteur du header sticky
      const elementPosition = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };
  return (
    <header className="bg-white/90 backdrop-blur-lg border-b border-emerald-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl text-gray-800 font-poppins tracking-tight">
              <span className="font-bold text-emerald-600">Keepme</span><span className="font-light">green</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#features" 
              onClick={(e) => handleSmoothScroll(e, 'features')}
              className="text-gray-600 hover:text-emerald-600 transition-colors font-medium cursor-pointer"
            >
              Fonctionnalités
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => handleSmoothScroll(e, 'how-it-works')}
              className="text-gray-600 hover:text-emerald-600 transition-colors font-medium cursor-pointer"
            >
              Comment ça marche
            </a>
            <a 
              href="#testimonials" 
              onClick={(e) => handleSmoothScroll(e, 'testimonials')}
              className="text-gray-600 hover:text-emerald-600 transition-colors font-medium cursor-pointer"
            >
              Avis
            </a>
          </nav>

          {/* Bouton de connexion */}
          <Link
            href="/login"
            className="flex items-center gap-1 md:gap-2 px-2 md:px-6 py-2 md:py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl md:rounded-2xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <LogIn className="w-4 h-4 md:w-4 md:h-4" />
            <span className="hidden md:inline font-medium text-base">Se connecter</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
