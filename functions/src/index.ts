import { setGlobalOptions } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import Stripe from "stripe";
import * as admin from "firebase-admin";
import { defineSecret } from "firebase-functions/params";

// Définir les secrets
const stripeSecret = defineSecret("STRIPE_SECRET");
const stripeWebhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");

// Init Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Options globales
setGlobalOptions({ 
  maxInstances: 10,
  secrets: [stripeSecret, stripeWebhookSecret]
});

/**
 * ✅ Créer une session Checkout
 * Appelé depuis ton frontend → retourne une URL Stripe Checkout
 */
export const createCheckoutSession = onRequest(
  { secrets: [stripeSecret] },
  async (req, res) => {
    // Configuration CORS - TOUJOURS définir les headers CORS en premier
    res.set('Access-Control-Allow-Origin', 'https://greenme-415fa.web.app');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.set('Access-Control-Allow-Credentials', 'true');
    
    // Gérer les requêtes OPTIONS (preflight) - TOUJOURS en premier
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    try {
      const { email } = req.query;
      
      if (!email) {
        res.status(400).json({ error: "Missing email parameter" });
        return;
      }

      const stripe = new Stripe(stripeSecret.value(), {});

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: "price_1S9OvlLI33YQ9pkLcBNpgyra", // Prix GreenMe Premium
            quantity: 1,
          },
        ],
        success_url: "https://greenme-415fa.web.app/success",
        cancel_url: "https://greenme-415fa.web.app/cancel",
        customer_email: email as string, // Email du client
      });

      res.json({ id: session.id, url: session.url });
    } catch (err: any) {
      logger.error("Erreur createCheckoutSession", err);
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
      // Dans Firebase Functions v2, on utilise req.body directement
      const body = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body));
      event = Stripe.webhooks.constructEvent(
        body,
        sig as string,
        endpointSecret
      );
    } catch (err: any) {
      logger.error("⚠️ Erreur de vérification du webhook", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const uid = session.client_reference_id;

      if (uid) {
        await db.collection("users").doc(uid).set(
          {
            plan: "premium",
            subscriptionId: session.subscription,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
        logger.info(`🔥 User ${uid} est passé premium`);
      }
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
    res.set('Access-Control-Allow-Origin', 'https://greenme-415fa.web.app');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.set('Access-Control-Allow-Credentials', 'true');
    
    // Gérer les requêtes OPTIONS (preflight) - TOUJOURS en premier
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

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
    res.set('Access-Control-Allow-Origin', 'https://greenme-415fa.web.app');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.set('Access-Control-Allow-Credentials', 'true');
    
    // Gérer les requêtes OPTIONS (preflight) - TOUJOURS en premier
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

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
    res.set('Access-Control-Allow-Origin', 'https://greenme-415fa.web.app');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.set('Access-Control-Allow-Credentials', 'true');
    
    // Gérer les requêtes OPTIONS (preflight) - TOUJOURS en premier
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

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
  
