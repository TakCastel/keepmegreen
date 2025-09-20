import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateUserSubscriptionAdmin, getFirebaseUidFromEmailAdmin } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Les fonctions getFirebaseUidFromEmailAdmin et updateUserSubscriptionAdmin 
// sont maintenant importées depuis firebase-admin.ts

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('Signature Stripe manquante');
      return NextResponse.json({ error: 'Signature manquante' }, { status: 400 });
    }

    if (!webhookSecret) {
      console.error('Secret webhook non configuré');
      return NextResponse.json({ error: 'Configuration webhook manquante' }, { status: 500 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Erreur de signature webhook:', err);
      return NextResponse.json({ error: 'Signature invalide' }, { status: 400 });
    }

    console.log(`🎯 Webhook reçu: ${event.type} (${event.id})`);
    
    // Gérer les différents types d'événements
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('🛒 Traitement: checkout.session.completed');
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'payment_intent.succeeded':
        console.log('💳 Traitement: payment_intent.succeeded');
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'customer.subscription.created':
        console.log('📝 Traitement: customer.subscription.created');
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.updated':
        console.log('🔄 Traitement: customer.subscription.updated');
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        console.log('🗑️ Traitement: customer.subscription.deleted');
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      case 'invoice.payment_succeeded':
        console.log('🧾 Traitement: invoice.payment_succeeded');
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        console.log('❌ Traitement: invoice.payment_failed');
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      default:
        console.log(`⚠️ Événement non géré: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Erreur webhook Stripe:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement du webhook' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('🎉 Session checkout complétée:', session.id);
  console.log('📧 Email customer:', session.customer_email);
  console.log('💰 Montant:', session.amount_total);
  console.log('📦 Plan:', session.metadata?.plan);
  
  // Si on a un email, on peut directement mettre à jour l'abonnement
  if (session.customer_email && session.metadata?.plan) {
    console.log('🎯 Mise à jour directe avec email:', session.customer_email);
    const uid = await getFirebaseUidFromEmailAdmin(session.customer_email);
    
    if (uid) {
      console.log('✅ UID trouvé:', uid);
      await updateUserSubscriptionAdmin(uid, session.metadata.plan as 'premium' | 'premium-plus');
      console.log('🎉 Abonnement activé:', session.metadata.plan);
      return;
    }
  }
  
  // Récupérer l'ID de l'abonnement depuis la session
  const subscriptionId = session.subscription as string;
  
  if (subscriptionId) {
    console.log('🔄 Abonnement récurrent détecté:', subscriptionId);
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    await handleSubscriptionCreated(subscription);
  } else if (session.payment_intent) {
    console.log('💳 Paiement unique détecté:', session.payment_intent);
    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);
    await handlePaymentIntentSucceeded(paymentIntent);
  } else {
    console.log('⚠️ Aucun subscription ou payment_intent trouvé dans la session');
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('💳 Paiement unique réussi:', paymentIntent.id);
  console.log('💰 Montant:', paymentIntent.amount);
  console.log('📦 Plan:', paymentIntent.metadata?.plan);
  
  // Récupérer les métadonnées depuis le paiement
  const plan = paymentIntent.metadata?.plan;
  
  if (plan && plan === 'premium-plus') {
    console.log('🎯 Activation Premium+ à vie');
    
    // Récupérer l'email du customer
    const customerId = paymentIntent.customer as string;
    
    if (customerId) {
      const customer = await stripe.customers.retrieve(customerId);
      
      if (customer && 'email' in customer && customer.email) {
        console.log('👤 Customer trouvé:', customer.email);
        
        const uid = await getFirebaseUidFromEmailAdmin(customer.email);
        
        if (uid) {
          console.log('🔥 UID Firebase trouvé:', uid);
          
          // Activer Premium+ à vie (pas de date de fin)
          await updateUserSubscriptionAdmin(uid, 'premium-plus');
          
          console.log('✅ Premium+ activé avec succès pour:', uid);
        } else {
          console.error('❌ UID Firebase non trouvé pour:', customer.email);
        }
      }
    }
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Abonnement créé:', subscription.id);
  
  const customerId = subscription.customer as string;
  const plan = subscription.metadata?.plan || 'premium';
  
  // Récupérer le customer pour obtenir l'email
  const customer = await stripe.customers.retrieve(customerId);
  
  if (customer && 'email' in customer && customer.email) {
    // Récupérer l'UID Firebase depuis l'email
    const uid = await getFirebaseUidFromEmailAdmin(customer.email);
    
    if (uid) {
      const subscriptionEnds = new Date(subscription.current_period_end * 1000).toISOString();
      
      await updateUserSubscriptionAdmin(
        uid,
        plan as 'premium' | 'premium-plus',
        subscriptionEnds,
        customerId,
        subscription.id
      );
    } else {
      console.error('Utilisateur Firebase non trouvé pour l\'email:', customer.email);
    }
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Abonnement mis à jour:', subscription.id);
  
  const customerId = subscription.customer as string;
  const plan = subscription.metadata?.plan || 'premium';
  
  const customer = await stripe.customers.retrieve(customerId);
  
  if (customer && 'email' in customer && customer.email) {
    const uid = await getFirebaseUidFromEmailAdmin(customer.email);
    
    if (uid) {
      const subscriptionEnds = new Date(subscription.current_period_end * 1000).toISOString();
      
      await updateUserSubscriptionAdmin(
        uid,
        plan as 'premium' | 'premium-plus',
        subscriptionEnds,
        customerId,
        subscription.id
      );
    }
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Abonnement supprimé:', subscription.id);
  
  const customerId = subscription.customer as string;
  
  const customer = await stripe.customers.retrieve(customerId);
  
  if (customer && 'email' in customer && customer.email) {
    const uid = await getFirebaseUidFromEmailAdmin(customer.email);
    
    if (uid) {
      // Rétrograder vers le plan gratuit
      await updateUserSubscriptionAdmin(uid, 'free');
    }
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Paiement réussi:', invoice.id);
  
  const subscriptionId = invoice.subscription as string;
  
  if (subscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    await handleSubscriptionUpdated(subscription);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Paiement échoué:', invoice.id);
  
  // Optionnel: envoyer un email de notification ou gérer l'échec
  // Pour l'instant, on ne fait rien de spécial
}
