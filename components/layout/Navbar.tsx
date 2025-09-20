'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogOut, User, Calendar, History, Settings, BarChart3, Sprout, Crown, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, userProfile, loading, logout, getCurrentPlan } = useAuth();
  const { hasAccess } = useSubscription();
  const router = useRouter();
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Fermer les menus quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleScroll = () => {
      setIsUserMenuOpen(false);
      setIsMobileMenuOpen(false);
    };

    if (isUserMenuOpen || isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [isUserMenuOpen, isMobileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Navigation principale
  const mainNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/calendar', label: 'Calendrier', icon: Calendar },
    { href: '/history', label: 'Historique', icon: History, isPremium: true },
  ];

  // Éléments secondaires
  const secondaryItems = [
    { href: '/settings', label: 'Paramètres', icon: Settings },
    { href: '/subscription', label: 'Abonnement', icon: Crown },
  ];

  const getPlanColor = () => {
    if (loading || !userProfile) return 'text-gray-400';
    const plan = getCurrentPlan();
    if (plan === null) return 'text-gray-400';
    switch (plan) {
      case 'premium': return 'text-amber-600';
      case 'premium-plus': return 'text-purple-600';
      default: return 'text-blue-600';
    }
  };

  const getPlanIcon = () => {
    if (loading || !userProfile) return null;
    const plan = getCurrentPlan();
    if (plan === null) return null;
    return plan === 'free' ? null : <Crown className="w-3 h-3" />;
  };

  return (
    <>
      {/* Header principal */}
      <nav className="bg-white/95 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo et titre */}
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                  DrinkeatGreen
                </span>
                <div className="text-xs text-gray-500 -mt-0.5">
                  Suivez vos consos
                </div>
              </div>
            </Link>

            {/* Navigation desktop */}
            <div className="hidden lg:flex items-center space-x-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const isPremiumFeature = item.isPremium && hasAccess('advancedStats') === false;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {isPremiumFeature && (
                      <Crown className="w-3 h-3 text-amber-500" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Menu utilisateur */}
            <div className="flex items-center gap-3">
              {/* Bouton menu mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Menu utilisateur - caché sur mobile */}
              <div className="relative hidden lg:block" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.displayName || user?.email?.split('@')[0] || 'Utilisateur'}
                    </div>
                    <div className={`text-xs flex items-center gap-1 ${getPlanColor()}`}>
                      {getPlanIcon()}
                      {loading || !userProfile ? 'Chargement...' :
                       getCurrentPlan() === null ? 'Chargement...' :
                       getCurrentPlan() === 'free' ? 'Gratuit' : 
                       getCurrentPlan() === 'premium' ? 'Premium' : 
                       getCurrentPlan() === 'premium-plus' ? 'Premium+' : 'Gratuit'}
                    </div>
                  </div>
                </button>

                {/* Menu dropdown desktop */}
                {isUserMenuOpen && (
                  <div className="hidden md:block absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                    {/* En-tête utilisateur */}
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-gray-900 truncate">
                            {user?.displayName || user?.email?.split('@')[0] || 'Utilisateur'}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {user?.email}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Options du menu */}
                    <div className="py-2">
                      {secondaryItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsUserMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2 text-sm transition-all ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {item.label}
                          </Link>
                        );
                      })}
                      
                      <div className="border-t border-gray-200 my-2"></div>
                      
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Menu mobile - overlay et sidebar */}
      <div className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black opacity-20 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
        
        {/* Sidebar */}
        <div 
          ref={mobileMenuRef}
          className={`absolute right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* En-tête avec profil utilisateur */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    {user?.displayName || user?.email?.split('@')[0] || 'Utilisateur'}
                  </div>
                  <div className={`text-xs flex items-center gap-1 ${getPlanColor()}`}>
                    {getPlanIcon()}
                    {loading || !userProfile ? 'Chargement...' :
                     getCurrentPlan() === null ? 'Chargement...' :
                     getCurrentPlan() === 'free' ? 'Compte Gratuit' : 
                     getCurrentPlan() === 'premium' ? 'Compte Premium' : 
                     getCurrentPlan() === 'premium-plus' ? 'Compte Premium+' : 'Compte Gratuit'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation principale */}
          <div className="px-6 py-4">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Navigation
              </div>
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const isPremiumFeature = item.isPremium && hasAccess('advancedStats') === false;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="flex-1">{item.label}</span>
                    {isPremiumFeature && (
                      <Crown className="w-4 h-4 text-amber-500" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Options secondaires */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Paramètres
              </div>
              {secondaryItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Déconnexion */}
          <div className="px-6 py-4 border-t border-gray-200">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-all w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </>
  );
}