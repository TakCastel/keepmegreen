'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { 
  Settings, 
  Crown, 
  LogOut, 
  X, 
  User,
  MoreHorizontal 
} from 'lucide-react';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { subscription } = useSubscription();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    router.push('/');
  };

  const secondaryItems = [
    { href: '/settings', label: 'Paramètres', icon: Settings },
    { href: '/subscription', label: 'Abonnement', icon: Crown },
  ];

  const showSubscriptionLink = subscription?.plan !== 'premium-plus';

  return (
    <>
      {/* Bouton pour ouvrir le menu */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs text-gray-600 hover:bg-white hover:text-emerald-700 transition-all"
      >
        <MoreHorizontal className="w-5 h-5" />
        <span className="font-medium">Plus</span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-20 z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu mobile */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="p-6">
          {/* En-tête */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {user?.displayName || user?.email?.split('@')[0] || 'Utilisateur'}
                </h3>
                <p className="text-sm text-gray-600">
                  {subscription?.plan === 'free' ? 'Version gratuite' : 
                   subscription?.plan === 'premium' ? 'Premium' : 'Premium+'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Menu items */}
          <div className="space-y-2">
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
            
            <div className="border-t border-gray-200 my-3"></div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-all w-full text-left rounded-xl"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
