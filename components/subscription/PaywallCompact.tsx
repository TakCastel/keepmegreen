'use client';

import { Crown, ArrowRight } from 'lucide-react';

interface PaywallCompactProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onUpgrade: () => void;
}

export default function PaywallCompact({
  title,
  description,
  icon: Icon,
  onUpgrade
}: PaywallCompactProps) {
  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 border border-gray-200 shadow-xl max-w-md mx-auto">
      {/* En-tête compact */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {title}
        </h2>
        <p className="text-gray-600 text-sm">
          {description}
        </p>
      </div>

      {/* Message d'encouragement compact */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 mb-6 border border-emerald-100">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
            <Crown className="w-3 h-3 text-white" />
          </div>
          <h3 className="text-base font-semibold text-emerald-800">
            Débloquez cette fonctionnalité
          </h3>
        </div>
        <p className="text-emerald-700 text-sm">
          Passez à Premium pour accéder à toutes vos données passées.
        </p>
      </div>

      {/* Bouton d'upgrade compact */}
      <div className="text-center">
        <button
          onClick={onUpgrade}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Crown className="w-4 h-4" />
          Passer à Premium
          <ArrowRight className="w-4 h-4" />
        </button>
        
        <p className="text-gray-500 text-xs mt-2">
          Annulation à tout moment
        </p>
      </div>
    </div>
  );
}
