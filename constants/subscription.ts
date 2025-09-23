export type Plan = 'free' | 'premium' | 'premium-plus';

export const FEATURE_MATRIX = {
  free: {
    calendarMonthsAccess: 1,
    calendarYearsAccess: 1,
    historyDaysAccess: 7,
    advancedStats: false,
    detailedBreakdown: false,
    timeComparison: false,
    exportEnabled: false,
    exportFormats: [] as string[],
    customThemes: false,
    customCategories: false,
    smartNotifications: false,
    challenges: false,
    badges: false,
    widgets: false,
    premiumResources: false,
    offlineMode: false,
    advancedSearch: false,
  },
  premium: {
    calendarMonthsAccess: 12,
    calendarYearsAccess: 3,
    historyDaysAccess: 365,
    advancedStats: true,
    detailedBreakdown: true,
    timeComparison: true,
    exportEnabled: true,
    exportFormats: ['csv','pdf'],
    customThemes: true,
    customCategories: true,
    smartNotifications: true,
    challenges: false,
    badges: false,
    widgets: false,
    premiumResources: false,
    offlineMode: false,
    advancedSearch: true,
  },
  'premium-plus': {
    calendarMonthsAccess: -1,
    calendarYearsAccess: -1,
    historyDaysAccess: -1,
    advancedStats: true,
    detailedBreakdown: true,
    timeComparison: true,
    exportEnabled: true,
    exportFormats: ['csv','pdf','image'],
    customThemes: true,
    customCategories: true,
    smartNotifications: true,
    challenges: true,
    badges: true,
    widgets: true,
    premiumResources: true,
    offlineMode: true,
    advancedSearch: true,
  },
} as const;

export type FeatureKey = keyof typeof FEATURE_MATRIX.free;

export function getLimitsFor(plan: Plan) {
  return FEATURE_MATRIX[plan] ?? FEATURE_MATRIX.free;
}

export function hasFeature(plan: Plan, feature: FeatureKey) {
  return Boolean(getLimitsFor(plan)[feature]);
}


