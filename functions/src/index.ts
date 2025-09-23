import { setGlobalOptions } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import Stripe from "stripe";
import * as admin from "firebase-admin";
import { defineSecret } from "firebase-functions/params";

// Définir les secrets
const stripeSecret = defineSecret("STRIPE_SECRET");
const stripeWebhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");
const priceId = defineSecret("PRICE_ID");
const successUrl = defineSecret("SUCCESS_URL");
const cancelUrl = defineSecret("CANCEL_URL");
const allowedOriginsSecret = defineSecret("ALLOWED_ORIGINS");

// Init Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Options globales
setGlobalOptions({ 
  maxInstances: 10,
  secrets: [stripeSecret, stripeWebhookSecret, priceId, successUrl, cancelUrl, allowedOriginsSecret]
});

// Fonction utilitaire pour configurer CORS
const setupCORS = (req: any, res: any) => {
  const originsFromSecret = allowedOriginsSecret.value();
  const allowedOrigins = originsFromSecret
    ? originsFromSecret.split(',').map((s) => s.trim())
    : [
        'https://greenme-415fa.web.app',
        'https://greenme-415fa.firebaseapp.com',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
      ];

  const origin = req.headers.origin;
  logger.info(`CORS Debug - Origin: ${origin}, Method: ${req.method}`);

  if (origin && allowedOrigins.includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
  }

  res.set('Vary', 'Origin');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.set('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return true;
  }

  return false;
};

/**
 * ✅ Créer une session Checkout
 * Appelé depuis ton frontend → retourne une URL Stripe Checkout
 */
export const createCheckoutSession = onRequest(
  { secrets: [stripeSecret, priceId, successUrl, cancelUrl] },
  async (req, res) => {
    // Configuration CORS - TOUJOURS définir les headers CORS en premier
    if (setupCORS(req, res)) return;

    try {
      // Vérifier l'ID token Firebase (Authorization: Bearer <idToken>)
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ')
        ? authHeader.substring('Bearer '.length)
        : null;
      if (!token) {
        res.status(401).json({ error: 'Missing Authorization Bearer token' });
        return;
      }

      const decoded = await admin.auth().verifyIdToken(token);
      const uid = decoded.uid;

      const { plan } = req.query;
      if (!plan || (plan !== 'premium' && plan !== 'premium-plus')) {
        res.status(400).json({ error: 'Missing or invalid plan parameter' });
        return;
      }

      const stripe = new Stripe(stripeSecret.value(), {});
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId.value(),
            quantity: 1,
          },
        ],
        success_url: successUrl.value(),
        cancel_url: cancelUrl.value(),
        client_reference_id: uid,
        metadata: { uid, plan: String(plan) },
        customer_email: decoded.email || undefined,
      });

      res.json({ id: session.id, url: session.url });
    } catch (err: any) {
      logger.error("Erreur createCheckoutSession", err);
      // S'assurer que CORS est configuré même en cas d'erreur
      setupCORS(req, res);
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * ✅ Webhook Stripe
 * Stripe appelle cette route après un paiement
 * On met à jour Firestore : users/{uid}.plan = "premium"
 */
export const stripeWebhook = onRequest(
  { secrets: [stripeWebhookSecret] },
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = stripeWebhookSecret.value();

    if (!endpointSecret) {
      logger.error("⚠️ STRIPE_WEBHOOK_SECRET non configuré");
      res.status(500).send("Webhook secret not configured");
      return;
    }

    let event: Stripe.Event;

    try {
      const rawBody = (req as any).rawBody || (Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body)));
      event = Stripe.webhooks.constructEvent(
        rawBody,
        sig as string,
        endpointSecret
      );
    } catch (err: any) {
      logger.error("⚠️ Erreur de vérification du webhook", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const uid = session.client_reference_id;
        if (uid) {
          await db.collection('users').doc(uid).set(
            {
              plan: 'premium',
              stripeSubscriptionId: session.subscription,
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
          logger.info(`🔥 User ${uid} est passé premium`);
        }
        break;
      }
      case 'invoice.paid': {
        // Paiement récurrent OK → rien de spécial si déjà premium
        break;
      }
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const uid = (sub.metadata && (sub.metadata as any).uid) || undefined;
        if (uid) {
          await db.collection('users').doc(uid).set(
            {
              plan: 'premium',
              stripeSubscriptionId: sub.id,
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const uid = (sub.metadata && (sub.metadata as any).uid) || undefined;
        if (uid) {
          await db.collection('users').doc(uid).set(
            {
              plan: 'free',
              stripeSubscriptionId: admin.firestore.FieldValue.delete(),
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
          logger.info(`🔻 User ${uid} rétrogradé suite à annulation`);
        }
        break;
      }
      default:
        break;
    }

    res.json({ received: true });
  }
);

/**
 * ✅ Annuler un abonnement
 */
export const cancelSubscription = onRequest(
  { secrets: [stripeSecret] },
  async (req, res) => {
    // Configuration CORS - TOUJOURS définir les headers CORS en premier
    if (setupCORS(req, res)) return;

    try {
      const { subscriptionId } = req.body;
      
      if (!subscriptionId) {
        res.status(400).json({ error: "Missing subscription ID" });
        return;
      }

      const stripe = new Stripe(stripeSecret.value(), {});
      const subscription = await stripe.subscriptions.cancel(subscriptionId);
      
      res.json({ success: true, subscription });
    } catch (err: any) {
      logger.error("Erreur cancelSubscription", err);
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * ✅ Vérifier un paiement
 */
export const verifyPayment = onRequest(
  { secrets: [stripeSecret] },
  async (req, res) => {
    // Configuration CORS - TOUJOURS définir les headers CORS en premier
    if (setupCORS(req, res)) return;

    try {
      const { sessionId } = req.body;
      
      if (!sessionId) {
        res.status(400).json({ error: "Missing session ID" });
        return;
      }

      const stripe = new Stripe(stripeSecret.value(), {});
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      res.json({ success: true, session });
    } catch (err: any) {
      logger.error("Erreur verifyPayment", err);
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * ✅ Rétrograder un abonnement
 */
export const downgradeSubscription = onRequest(
  { secrets: [stripeSecret] },
  async (req, res) => {
    // Configuration CORS - TOUJOURS définir les headers CORS en premier
    if (setupCORS(req, res)) return;

    try {
      const { email } = req.body;
      
      if (!email) {
        res.status(400).json({ error: "Missing email" });
        return;
      }

      // Logique de rétrogradation
      // TODO: Implémenter la logique de rétrogradation
      
      res.json({ success: true, message: "Abonnement rétrogradé avec succès" });
    } catch (err: any) {
      logger.error("Erreur downgradeSubscription", err);
      res.status(500).json({ error: err.message });
    }
  }
);
  
