'use client';

import CalendarGrid from '@/components/calendar/CalendarGrid';
import { Calendar, User, BarChart3, Flower, Leaf } from 'lucide-react';

export default function CalendarPage() {
  return (
    <div className="space-y-10">
      {/* En-tête */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-3xl flex items-center justify-center shadow-xl">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-light text-gray-800">
            Calendrier de <span className="font-semibold text-emerald-600">sérénité</span>
          </h1>
        </div>
        <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
          Contemplez votre parcours d&apos;équilibre avec une vue apaisante de vos journées
        </p>
      </div>

      {/* Description des couleurs */}
      <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
        <h2 className="text-2xl font-light text-gray-800 mb-6 text-center">
          Palette de <span className="font-semibold text-emerald-600">bien-être</span>
        </h2>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
            <div className="w-6 h-6 bg-emerald-500 rounded-full mx-auto mb-3 shadow-md"></div>
            <div className="text-emerald-700 font-medium">Sérénité</div>
            <div className="text-emerald-600 text-sm">Équilibre parfait</div>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-2xl border border-amber-100">
            <div className="w-6 h-6 bg-amber-400 rounded-full mx-auto mb-3 shadow-md"></div>
            <div className="text-amber-700 font-medium">Éveil</div>
            <div className="text-amber-600 text-sm">1-2 prises de conscience</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-2xl border border-orange-100">
            <div className="w-6 h-6 bg-orange-400 rounded-full mx-auto mb-3 shadow-md"></div>
            <div className="text-orange-700 font-medium">Vigilance</div>
            <div className="text-orange-600 text-sm">3-5 prises de conscience</div>
          </div>
          <div className="text-center p-4 bg-rose-50 rounded-2xl border border-rose-100">
            <div className="w-6 h-6 bg-rose-400 rounded-full mx-auto mb-3 shadow-md"></div>
            <div className="text-rose-700 font-medium">Attention</div>
            <div className="text-rose-600 text-sm">6+ prises de conscience</div>
          </div>
        </div>
      </div>

      {/* Grille du calendrier */}
      <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
        <CalendarGrid />
      </div>

      {/* Conseils zen */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-3xl p-8 border border-emerald-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-light text-gray-800">
            Navigation <span className="font-semibold text-emerald-600">contemplative</span>
          </h3>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Flower className="w-5 h-5 text-emerald-500 mt-1" />
              <p className="text-gray-700">
                Cliquez sur un jour pour explorer vos <span className="text-emerald-600 font-medium">prises de conscience</span>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Leaf className="w-5 h-5 text-emerald-500 mt-1" />
              <p className="text-gray-700">
                Cherchez la <span className="text-emerald-600 font-medium">sérénité</span> dans chaque journée
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-emerald-500 mt-1" />
              <p className="text-gray-700">
                Naviguez dans le temps pour observer votre <span className="text-emerald-600 font-medium">évolution</span>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <BarChart3 className="w-5 h-5 text-emerald-500 mt-1" />
              <p className="text-gray-700">
                Les métriques vous offrent une vue d&apos;ensemble apaisante
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
