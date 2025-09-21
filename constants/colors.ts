// Couleurs globales pour les catégories d'activités positives
export const CATEGORY_COLORS = {
  sport: {
    primary: 'from-emerald-50 to-green-100',
    primaryHover: 'hover:from-emerald-100 hover:to-green-200',
    text: 'text-gray-800',
    iconBg: 'bg-emerald-200/60',
    iconColor: 'text-gray-800',
    // Pour les charts et autres éléments
    chart: '#10b981', // emerald-500
    chartLight: '#d1fae5', // emerald-100
    chartDark: '#059669', // emerald-600
    // Pour les textes dans les paramètres
    textDark: 'text-emerald-800',
    textMedium: 'text-emerald-700',
    textLight: 'text-emerald-600',
  },
  social: {
    primary: 'from-blue-50 to-sky-100',
    primaryHover: 'hover:from-blue-100 hover:to-sky-200',
    text: 'text-gray-800',
    iconBg: 'bg-blue-200/60',
    iconColor: 'text-gray-800',
    // Pour les charts et autres éléments
    chart: '#3b82f6', // blue-500
    chartLight: '#dbeafe', // blue-100
    chartDark: '#2563eb', // blue-600
    // Pour les textes dans les paramètres
    textDark: 'text-blue-800',
    textMedium: 'text-blue-700',
    textLight: 'text-blue-600',
  },
  nutrition: {
    primary: 'from-orange-50 to-amber-100',
    primaryHover: 'hover:from-orange-100 hover:to-amber-200',
    text: 'text-gray-800',
    iconBg: 'bg-orange-200/60',
    iconColor: 'text-gray-800',
    // Pour les charts et autres éléments
    chart: '#f97316', // orange-500
    chartLight: '#fed7aa', // orange-100
    chartDark: '#ea580c', // orange-600
    // Pour les textes dans les paramètres
    textDark: 'text-orange-800',
    textMedium: 'text-orange-700',
    textLight: 'text-orange-600',
  },
  alcohol: {
    primary: 'from-pink-50 to-rose-100',
    primaryHover: 'hover:from-pink-100 hover:to-rose-200',
    text: 'text-gray-800',
    iconBg: 'bg-pink-200/60',
    iconColor: 'text-gray-800',
    // Pour les charts et autres éléments
    chart: '#ec4899', // pink-500
    chartLight: '#fce7f3', // pink-100
    chartDark: '#db2777', // pink-600
    // Pour les textes dans les paramètres
    textDark: 'text-pink-800',
    textMedium: 'text-pink-700',
    textLight: 'text-pink-600',
  },
  cigarettes: {
    primary: 'from-slate-50 to-gray-100',
    primaryHover: 'hover:from-slate-100 hover:to-gray-200',
    text: 'text-gray-800',
    iconBg: 'bg-slate-200/60',
    iconColor: 'text-gray-800',
    // Pour les charts et autres éléments
    chart: '#64748b', // slate-500
    chartLight: '#f1f5f9', // slate-100
    chartDark: '#475569', // slate-600
    // Pour les textes dans les paramètres
    textDark: 'text-slate-800',
    textMedium: 'text-slate-700',
    textLight: 'text-slate-600',
  },
  junkfood: {
    primary: 'from-amber-50 to-yellow-100',
    primaryHover: 'hover:from-amber-100 hover:to-yellow-200',
    text: 'text-gray-800',
    iconBg: 'bg-amber-200/60',
    iconColor: 'text-gray-800',
    // Pour les charts et autres éléments
    chart: '#f59e0b', // amber-500
    chartLight: '#fef3c7', // amber-100
    chartDark: '#d97706', // amber-600
    // Pour les textes dans les paramètres
    textDark: 'text-amber-800',
    textMedium: 'text-amber-700',
    textLight: 'text-amber-600',
  },
} as const;

// Types pour TypeScript
export type CategoryType = keyof typeof CATEGORY_COLORS;

// Fonction utilitaire pour obtenir les couleurs d'une catégorie
export const getCategoryColors = (category: CategoryType) => CATEGORY_COLORS[category];
