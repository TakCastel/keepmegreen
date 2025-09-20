'use client';

import LandingHeader from '@/components/landing/LandingHeader';
import BackToTop from '@/components/ui/BackToTop';
import { Sprout, Wine, Cigarette, Utensils, Leaf, Calendar, BarChart3, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Composant pour les cartes avec effet 3D statique
function FloatingCard3D({ children, className, ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) {
  return (
    <div
      className={`${className}`}
      style={{ 
        transform: 'perspective(1000px) rotateX(5deg) rotateY(-5deg)',
        transformStyle: 'preserve-3d'
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export default function Home() {

    return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50">
      <LandingHeader />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-16 md:py-24 lg:py-0">
        {/* Background géométrique */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(34,197,94,0.08),transparent_50%)]"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Contenu principal */}
            <div className="space-y-6 md:space-y-8 text-center lg:text-left">
              <div className="space-y-4 md:space-y-6">
                <div className="inline-flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 bg-emerald-100/80 backdrop-blur-sm rounded-full border border-emerald-200/50">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-emerald-700 font-medium text-xs md:text-sm">Application en développement</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Suivez vos
                  <span className="block text-emerald-600">consommations</span>
                </h1>
                
                <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed px-4 lg:px-0">
                  Une approche simple pour observer vos consommations d&apos;alcool, 
                  cigarettes et nutrition. Visualisez vos patterns avec un calendrier clair.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 px-4 lg:px-0">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl font-medium text-sm md:text-base"
                >
                  Commencer gratuitement
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-white/80 hover:bg-white text-gray-700 rounded-xl shadow-lg font-medium border border-gray-200 text-sm md:text-base transition-all hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Voir la démo
                </Link>
              </div>

              {/* Stats rapides */}
              <div className="flex items-center justify-center lg:justify-start gap-4 md:gap-6 lg:gap-8 pt-6 md:pt-8 border-t border-gray-200/50 px-4 lg:px-0">
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-emerald-600">3</div>
                  <div className="text-xs md:text-sm text-gray-600">Domaines observés</div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-emerald-600">100%</div>
                  <div className="text-xs md:text-sm text-gray-600">Confidentialité</div>
                </div>
        <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-emerald-600">Simple</div>
                  <div className="text-xs md:text-sm text-gray-600">Approche neutre</div>
                </div>
              </div>
            </div>

            {/* Visualisation */}
            <div className="relative mt-8 lg:mt-0">
              {/* Calendrier compact */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl border border-white/50">
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800">Calendrier d&apos;observation</h3>
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4 text-emerald-600" />
        </div>
      </div>
                  
                  <div className="grid grid-cols-7 gap-1 md:gap-2">
                    {Array.from({ length: 21 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-xs font-medium leading-none ${
                          i % 7 === 0 || i % 7 === 6
                            ? 'bg-gray-100 text-gray-400'
                            : i % 4 === 0
                            ? 'bg-red-100 text-red-600'
                            : i % 3 === 0
                            ? 'bg-orange-100 text-orange-600'
                            : 'bg-emerald-100 text-emerald-600'
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <div className="flex items-center gap-1 md:gap-2">
                      <div className="w-2 h-2 md:w-3 md:h-3 bg-emerald-100 rounded"></div>
                      <span className="text-gray-600">Jours calmes</span>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2">
                      <div className="w-2 h-2 md:w-3 md:h-3 bg-orange-100 rounded"></div>
                      <span className="text-gray-600">Modéré</span>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2">
                      <div className="w-2 h-2 md:w-3 md:h-3 bg-red-100 rounded"></div>
                      <span className="text-gray-600">Intense</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Éléments flottants - cachés sur mobile */}
              <div className="hidden md:block absolute -top-4 -right-4 w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg p-2 lg:p-3">
                <Sprout className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <div className="hidden md:block absolute -bottom-4 -left-4 w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg p-2 lg:p-2.5">
                <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transition circulaire épurée */}
      <div className="relative h-16 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 64" preserveAspectRatio="none">
          <path 
            d="M0,64 Q600,0 1200,64" 
            fill="rgba(255,255,255,0.5)" 
            className="backdrop-blur-sm"
          />
        </svg>
      </div>

      {/* Section Fonctionnalités */}
      <section id="features" className="py-12 md:py-16 lg:py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-800 mb-3 md:mb-4">
            Trois domaines à <span className="font-semibold text-emerald-600">observer</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4 mb-8 md:mb-12">
            Observez vos consommations de manière régulière dans les domaines qui vous intéressent
          </p>
          
          {/* Illustration avec cartes flottantes */}
          <div className="relative mb-8 md:mb-12">
            {/* Image - cachée sur mobile */}
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <img 
                  src="/illustration-1.png" 
                  alt="Personne utilisant l'application DrinkeatGreen" 
                  className="w-full max-w-md h-auto drop-shadow-xl rounded-2xl"
                />
              </div>
            </div>
            
            {/* Cartes flottantes autour de l'image - desktop */}
            <div className="hidden md:block">
              {/* Carte Alcool - au milieu à gauche */}
              <FloatingCard3D className="absolute top-1/2 left-0 w-80 h-48 bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 transform -translate-x-6 -translate-y-1/2">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Alcool</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Suivez vos verres et boissons pour comprendre vos habitudes de consommation.
                </p>
              </FloatingCard3D>

              {/* Carte Cigarettes - en haut à droite */}
              <FloatingCard3D className="absolute top-8 right-0 w-80 h-48 bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 transform translate-x-6 translate-y-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Cigarettes</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Comptez vos cigarettes quotidiennes pour visualiser vos rythmes de consommation.
                </p>
              </FloatingCard3D>

              {/* Carte Nutrition - en bas au centre */}
              <FloatingCard3D className="absolute bottom-0 left-1/2 w-80 h-48 bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 transform -translate-x-1/2 translate-x-40 translate-y-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Nutrition</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Notez vos repas et collations pour suivre vos habitudes alimentaires.
                </p>
              </FloatingCard3D>
            </div>

            {/* Cartes empilées - mobile uniquement */}
            <div className="md:hidden space-y-4">
              {/* Alcool */}
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Wine className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">Alcool</h3>
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  Suivez vos verres et boissons pour comprendre vos habitudes de consommation. 
                  Chaque verre enregistré vous aide à mieux vous connaître.
                </p>
              </div>

              {/* Cigarettes */}
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Cigarette className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">Cigarettes</h3>
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  Comptez vos cigarettes quotidiennes pour visualiser vos rythmes de consommation. 
                  Chaque cigarette notée vous donne une vision claire de vos habitudes.
                </p>
              </div>
              
              {/* Nutrition */}
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Utensils className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">Nutrition</h3>
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  Notez vos repas et collations pour suivre vos habitudes alimentaires. 
                  Chaque repas enregistré vous aide à comprendre vos choix nutritionnels.
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Parcours Initiatique */}
      <section id="how-it-works" className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
        {/* Background du parcours */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 via-green-50/30 to-emerald-50/50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(16,185,129,0.05),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(34,197,94,0.05),transparent_70%)]"></div>
        </div>
        

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 md:mb-16 lg:mb-20">
            <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-4 md:mb-6">
              Comment <span className="font-semibold text-emerald-600">ça fonctionne</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Trois étapes simples pour observer et comprendre vos consommations
            </p>
          </div>

          {/* Fil d'Ariane visuel */}
          <div className="relative">
            {/* Ligne fixe au milieu - cachée sur mobile */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-200 via-emerald-300 to-emerald-400 transform -translate-x-1/2 rounded-full"></div>
            
            {/* Étapes du parcours */}
            <div className="space-y-16 md:space-y-24 lg:space-y-32">
              
              {/* Étape 1 - Enregistrer */}
              <div className="relative flex flex-col md:flex-row items-center">
                {/* Contenu principal - mobile en haut, desktop à droite */}
                <div className="w-full md:w-1/2 md:pr-12 text-center md:text-right mb-8 md:mb-0">
                  <div className="inline-block">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                      <span className="text-xl md:text-2xl font-bold text-white">1</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3 md:mb-4">Enregistrez</h3>
                    <p className="text-base md:text-lg text-gray-600 leading-relaxed px-4 md:px-0">
                      Cliquez sur le bouton correspondant chaque fois que vous consommez quelque chose. 
                      C'est la base de l'observation : être présent à ses choix.
                    </p>
                    <div className="mt-4 md:mt-6 inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-emerald-100 rounded-full">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-emerald-700 font-medium text-xs md:text-sm">Présence</span>
                    </div>
                  </div>
                </div>
                
                {/* Point central - caché sur mobile */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-emerald-500 rounded-full shadow-lg z-10"></div>
                
                {/* Exemple - mobile en bas, desktop à gauche */}
                <div className="w-full md:w-1/2 md:pl-12">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-emerald-100">
                    <div className="flex items-center gap-3 mb-3 md:mb-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                        <Wine className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                      </div>
                      <span className="font-medium text-gray-800 text-sm md:text-base">Exemple : Alcool</span>
                    </div>
                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                      Marie commence à enregistrer chaque verre d'alcool qu'elle boit. 
                      Au début, c'est difficile de cliquer à chaque fois, mais elle s'y habitue.
                    </p>
                  </div>
                </div>
              </div>

              {/* Étape 2 - Surveiller */}
              <div className="relative flex flex-col md:flex-row items-center">
                {/* Exemple - mobile en bas, desktop à gauche */}
                <div className="w-full md:w-1/2 md:pr-12 mb-8 md:mb-0 order-2 md:order-1">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-emerald-100">
                    <div className="flex items-center gap-3 mb-3 md:mb-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                        <Cigarette className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
                      </div>
                      <span className="font-medium text-gray-800 text-sm md:text-base">Exemple : Cigarettes</span>
                    </div>
                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                      Après quelques semaines, Marie voit son calendrier se remplir de rouge. 
                      Elle réalise qu'elle fume beaucoup plus qu'elle ne le pensait.
                    </p>
                  </div>
                </div>
                
                {/* Point central - caché sur mobile */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-emerald-500 rounded-full shadow-lg z-10"></div>
                
                {/* Contenu principal - mobile en haut, desktop à droite */}
                <div className="w-full md:w-1/2 md:pl-12 text-center md:text-left order-1 md:order-2">
                  <div className="inline-block">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                      <span className="text-xl md:text-2xl font-bold text-white">2</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3 md:mb-4">Observez</h3>
                    <p className="text-base md:text-lg text-gray-600 leading-relaxed px-4 md:px-0">
                      Votre calendrier se colore selon vos consommations. Vert pour les jours calmes, 
                      rouge pour les jours intenses. C'est votre tableau de bord.
                    </p>
                    <div className="mt-4 md:mt-6 inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-emerald-100 rounded-full">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-emerald-700 font-medium text-xs md:text-sm">Suivi visuel</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Étape 3 - Réduire */}
              <div className="relative flex flex-col md:flex-row items-center">
                {/* Contenu principal - mobile en haut, desktop à droite */}
                <div className="w-full md:w-1/2 md:pr-12 text-center md:text-right mb-8 md:mb-0">
                  <div className="inline-block">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                      <span className="text-xl md:text-2xl font-bold text-white">3</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3 md:mb-4">Comprenez</h3>
                    <p className="text-base md:text-lg text-gray-600 leading-relaxed px-4 md:px-0">
                      Avec le temps, vous observez naturellement vos patterns. 
                      Le suivi vous aide à prendre conscience de vos choix.
                    </p>
                    <div className="mt-4 md:mt-6 inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-emerald-100 rounded-full">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-emerald-700 font-medium text-xs md:text-sm">Progrès</span>
                    </div>
                  </div>
                </div>
                
                {/* Point central - caché sur mobile */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-emerald-500 rounded-full shadow-lg z-10"></div>
                
                {/* Exemple - mobile en bas, desktop à gauche */}
                <div className="w-full md:w-1/2 md:pl-12">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-emerald-100">
                    <div className="flex items-center gap-3 mb-3 md:mb-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <Utensils className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-800 text-sm md:text-base">Exemple : Nutrition</span>
                    </div>
                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                      Maintenant, Marie fait plus attention à ce qu'elle mange. 
                      Elle évite naturellement les aliments peu nutritifs pour avoir moins de rouge sur son calendrier.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Message final */}
          <div className="text-center mt-12 md:mt-16 lg:mt-20">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-emerald-100 mx-4 md:mx-0">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Leaf className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 md:mb-4">C'est parti !</h3>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto px-4 md:px-0">
                Commencez dès aujourd'hui. Le suivi régulier vous aidera à prendre conscience 
                de vos habitudes et à progresser à votre rythme.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Avis */}
      <section id="testimonials" className="py-12 md:py-16 lg:py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-800 mb-3 md:mb-4">
              Ce qu'ils en <span className="font-semibold text-emerald-600">pensent</span>
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Des retours authentiques de personnes qui testent l'app cette semaine
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Avis 1 */}
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
              <div className="flex items-center mb-3 md:mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-sm md:text-base text-gray-700 mb-4 md:mb-6 leading-relaxed">
                "J'ai demandé à un ami développeur de faire cette app pour m'aider avec mon alcool. 
                Cette semaine j'ai enfin pu voir combien je buvais vraiment. C'est révélateur mais c'est nécessaire."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mr-3 md:mr-4">
                  <span className="text-white font-semibold text-sm md:text-base">M</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm md:text-base">Marie</h4>
                  <p className="text-xs md:text-sm text-gray-600">Teste l'app depuis cette semaine</p>
                </div>
              </div>
            </div>
            
            {/* Avis 2 */}
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
              <div className="flex items-center mb-3 md:mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-sm md:text-base text-gray-700 mb-4 md:mb-6 leading-relaxed">
                "J'ai testé l'app cette semaine pour mes cigarettes. Le calendrier rouge/vert c'est révélateur 
                mais ça marche ! J'ai fumé 3 fois moins que d'habitude."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mr-3 md:mr-4">
                  <span className="text-white font-semibold text-sm md:text-base">P</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm md:text-base">Pierre</h4>
                  <p className="text-xs md:text-sm text-gray-600">Teste l'app depuis cette semaine</p>
                </div>
              </div>
            </div>

            {/* Avis 3 */}
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
              <div className="flex items-center mb-3 md:mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-sm md:text-base text-gray-700 mb-4 md:mb-6 leading-relaxed">
                "J'ai essayé cette semaine pour ma nutrition. C'est dur de cliquer sur le bouton 
                à chaque fois que je mange quelque chose de peu nutritif, mais ça m'aide vraiment à être consciente."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center mr-3 md:mr-4">
                  <span className="text-white font-semibold text-sm md:text-base">S</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm md:text-base">Sophie</h4>
                  <p className="text-xs md:text-sm text-gray-600">Teste l'app depuis cette semaine</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 shadow-2xl">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-white mb-4 md:mb-6">
              Prêt à observer vos <span className="font-semibold">consommations</span> ?
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-emerald-100 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              Rejoignez les nombreuses personnes qui observent leurs patterns de manière assidue
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-white text-emerald-600 rounded-xl md:rounded-2xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm md:text-base lg:text-lg font-medium"
            >
              Commencer gratuitement
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sprout className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="text-xl md:text-2xl text-white font-poppins tracking-tight">
                <span className="font-bold text-emerald-400">Keepme</span><span className="font-light">green</span>
              </span>
            </div>
            <p className="text-sm md:text-base text-gray-400 mb-6 md:mb-8 px-4">
              Observez et comprenez vos consommations au quotidien
            </p>
            
            {/* Liens légaux */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-6">
              <Link
                href="/mentions-legales"
                className="text-gray-400 hover:text-emerald-400 transition-colors text-sm md:text-base"
              >
                Mentions légales
              </Link>
              <Link
                href="/politique-confidentialite"
                className="text-gray-400 hover:text-emerald-400 transition-colors text-sm md:text-base"
              >
                Politique de confidentialité
              </Link>
              <Link
                href="/cgu"
                className="text-gray-400 hover:text-emerald-400 transition-colors text-sm md:text-base"
              >
                CGU
              </Link>
            </div>
            
            <p className="text-xs md:text-sm text-gray-500">
              © 2024 DrinkeatGreen. Tous droits réservés.
            </p>
        </div>
      </div>
      </footer>

      {/* Bouton Back to Top */}
      <BackToTop />
    </div>
  );
}
