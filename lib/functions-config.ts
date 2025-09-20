// Configuration des URLs des Firebase Functions
export const FUNCTIONS_CONFIG = {
  // URLs des fonctions Firebase (Cloud Functions v2)
  createCheckoutSession: 'https://createcheckoutsession-utblwfn7oa-uc.a.run.app',
  cancelSubscription: 'https://us-central1-greenme-415fa.cloudfunctions.net/cancelSubscription',
  verifyPayment: 'https://us-central1-greenme-415fa.cloudfunctions.net/verifyPayment',
  downgradeSubscription: 'https://us-central1-greenme-415fa.cloudfunctions.net/downgradeSubscription',
  stripeWebhook: 'https://stripewebhook-utblwfn7oa-uc.a.run.app',
} as const;

// Fonction utilitaire pour créer l'URL complète avec les paramètres
export const createFunctionUrl = (functionName: keyof typeof FUNCTIONS_CONFIG, params?: Record<string, string>) => {
  const baseUrl = FUNCTIONS_CONFIG[functionName];
  
  if (!params) return baseUrl;
  
  const searchParams = new URLSearchParams(params);
  return `${baseUrl}?${searchParams.toString()}`;
};
