'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/auth/AuthForm';
import { Sprout, Wine, Cigarette, Utensils, Sparkles } from 'lucide-react';

export default function Home() {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Chargement...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Éléments décoratifs en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-green-200/30 to-emerald-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-mint/20 to-sage-green/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-light-green/10 to-emerald-200/20 rounded-full blur-2xl"></div>
      </div>

      <div className="w-full max-w-6xl flex items-center justify-between relative z-10">
        {/* Section gauche - Présentation */}
        <div className="hidden lg:flex flex-1 flex-col justify-center pr-12">
          <div className="text-center lg:text-left">
            <div className="flex items-center gap-3 mb-6 justify-center lg:justify-start">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Sprout className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl text-gray-800 font-poppins tracking-tight">
                <span className="font-bold text-emerald-600 bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">Keepme</span><span className="font-light">green</span>
              </h1>
            </div>
            
            <h2 className="text-3xl font-light text-gray-700 mb-8 leading-relaxed">
              Cultivez des habitudes 
              <span className="font-medium text-emerald-600"> saines</span> au quotidien
            </h2>
            
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Un espace zen pour suivre et transformer vos habitudes dans trois domaines essentiels :
            </p>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl backdrop-blur-sm border border-emerald-100">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                  <Wine className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-lg text-gray-700 font-medium">Alcool</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl backdrop-blur-sm border border-emerald-100">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                  <Cigarette className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-lg text-gray-700 font-medium">Cigarettes</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl backdrop-blur-sm border border-emerald-100">
                <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                  <Utensils className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-lg text-gray-700 font-medium">Nutrition consciente</span>
              </div>
            </div>
            
            <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-100">
              <p className="text-emerald-700 font-medium flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Visualisez votre bien-être avec notre calendrier apaisant
              </p>
              <p className="text-emerald-600 text-sm mt-1">
                Objectif : gardez le plus de journées <span className="font-semibold">sereines</span> possible
              </p>
            </div>
          </div>
        </div>

        {/* Section droite - Formulaire d'authentification */}
        <div className="flex-1 max-w-md mx-auto lg:mx-0">
          <AuthForm 
            mode={authMode} 
            onToggleMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
          />
        </div>
      </div>
    </div>
  );
}
