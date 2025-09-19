'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/auth/AuthForm';
import { Sprout, ArrowLeft, BarChart3, Calendar, TrendingUp, Sparkles } from 'lucide-react';
import Link from 'next/link';

// Désactiver le pré-rendu pour cette page
export const dynamic = 'force-dynamic';

export default function LoginPage() {
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-700 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Éléments décoratifs en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-green-200/30 to-emerald-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-mint/20 to-sage-green/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-light-green/10 to-emerald-200/20 rounded-full blur-2xl"></div>
      </div>

      {/* Bouton retour */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/70 hover:bg-white text-gray-700 rounded-xl transition-all shadow-lg hover:shadow-xl backdrop-blur-sm border border-gray-200 z-10"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-medium">Retour</span>
      </Link>

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
              Rejoignez votre espace de 
              <span className="font-medium text-emerald-600"> surveillance</span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Connectez-vous pour accéder à votre tableau de bord personnel et commencer 
              à surveiller vos mauvaises habitudes avec bienveillance.
            </p>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl backdrop-blur-sm border border-emerald-100">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <span className="text-lg text-gray-700 font-medium">Tableau de bord</span>
                  <p className="text-sm text-gray-600">Surveillez vos écarts en temps réel</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl backdrop-blur-sm border border-emerald-100">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <span className="text-lg text-gray-700 font-medium">Calendrier de surveillance</span>
                  <p className="text-sm text-gray-600">Visualisez vos écarts quotidiens</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl backdrop-blur-sm border border-emerald-100">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <span className="text-lg text-gray-700 font-medium">Statistiques</span>
                  <p className="text-sm text-gray-600">Analysez vos tendances et progrès</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-100">
              <p className="text-emerald-700 font-medium flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Commencez votre surveillance bienveillante
              </p>
              <p className="text-emerald-600 text-sm mt-1">
                Chaque jour est une nouvelle opportunité de <span className="font-semibold">réduire vos écarts</span>
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