'use client';

import { BarChart3, User, Crown, Lock } from 'lucide-react';
import Link from 'next/link';

export default function StatisticsPaywall() {
  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="hidden md:flex w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl items-center justify-center shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl md:text-2xl font-light text-gray-800">
            Réflexion et <span className="font-semibold text-emerald-600">évolution</span>
          </h1>
        </div>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
          Statistiques détaillées et graphiques avancés pour analyser vos tendances
        </p>
      </div>

      {/* Paywall principal */}
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-8 md:p-12 border border-emerald-200 shadow-xl">
        <div className="text-center space-y-6">
          {/* Icône premium */}
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Crown className="w-10 h-10 text-white" />
          </div>

          {/* Titre */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Statistiques <span className="text-emerald-600">Premium</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Débloquez l'accès complet à vos statistiques détaillées, graphiques avancés et analyses de tendances
            </p>
          </div>

          {/* Fonctionnalités */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/70 rounded-2xl p-6 border border-emerald-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Graphiques avancés</h3>
              <p className="text-gray-600 text-sm">Courbes de tendance et histogrammes détaillés</p>
            </div>

            <div className="bg-white/70 rounded-2xl p-6 border border-emerald-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyse personnalisée</h3>
              <p className="text-gray-600 text-sm">Recommandations adaptées à vos habitudes</p>
            </div>

            <div className="bg-white/70 rounded-2xl p-6 border border-emerald-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Données sécurisées</h3>
              <p className="text-gray-600 text-sm">Chiffrement de bout en bout pour vos données</p>
            </div>
          </div>

          {/* Bouton d'upgrade */}
          <div className="pt-6">
            <Link
              href="/subscription"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Crown className="w-5 h-5" />
              Passer à Premium
            </Link>
            <p className="text-gray-500 text-sm mt-3">
              Annulation à tout moment • 3,99€/mois
            </p>
          </div>
        </div>
      </div>

      {/* Aperçu des fonctionnalités */}
      <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 border border-gray-200 shadow-lg">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            Aperçu des fonctionnalités
          </h3>
          <p className="text-gray-600">
            Découvrez ce qui vous attend avec Premium
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">Graphiques et analyses</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Courbes de tendance sur plusieurs mois
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Histogrammes par catégorie
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Comparaisons temporelles
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Analyses de corrélation
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">Fonctionnalités avancées</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Export de données en PDF
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Notifications personnalisées
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Objectifs et défis
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Support prioritaire
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
