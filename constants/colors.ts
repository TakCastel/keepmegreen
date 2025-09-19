// Couleurs globales pour les catégories de consommation
export const CATEGORY_COLORS = {
  alcohol: {
    primary: 'from-pink-50 to-rose-100',
    primaryHover: 'hover:from-pink-100 hover:to-rose-200',
    text: 'text-gray-800',
    iconBg: 'bg-pink-200/60',
    iconColor: 'text-gray-800',
    // Pour les charts et autres éléments
    chart: '#f472b6', // pink-400
    chartLight: '#fce7f3', // pink-100
    chartDark: '#ec4899', // pink-500
    // Pour les textes dans les paramètres
    textDark: 'text-pink-800',
    textMedium: 'text-pink-700',
    textLight: 'text-pink-600',
  },
  cigarettes: {
    primary: 'from-violet-50 to-purple-100',
    primaryHover: 'hover:from-violet-100 hover:to-purple-200',
    text: 'text-gray-800',
    iconBg: 'bg-violet-200/60',
    iconColor: 'text-gray-800',
    // Pour les charts et autres éléments
    chart: '#a78bfa', // violet-400
    chartLight: '#ede9fe', // violet-100
    chartDark: '#8b5cf6', // violet-500
    // Pour les textes dans les paramètres
    textDark: 'text-violet-800',
    textMedium: 'text-violet-700',
    textLight: 'text-violet-600',
  },
  junkfood: {
    primary: 'from-blue-50 to-sky-100',
    primaryHover: 'hover:from-blue-100 hover:to-sky-200',
    text: 'text-gray-800',
    iconBg: 'bg-blue-200/60',
    iconColor: 'text-gray-800',
    // Pour les charts et autres éléments
    chart: '#60a5fa', // blue-400
    chartLight: '#dbeafe', // blue-100
    chartDark: '#3b82f6', // blue-500
    // Pour les textes dans les paramètres
    textDark: 'text-blue-800',
    textMedium: 'text-blue-700',
    textLight: 'text-blue-600',
  },
} as const;

// Types pour TypeScript
export type CategoryType = keyof typeof CATEGORY_COLORS;

// Fonction utilitaire pour obtenir les couleurs d'une catégorie
export const getCategoryColors = (category: CategoryType) => CATEGORY_COLORS[category];
