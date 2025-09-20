import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateUserSubscriptionAdmin } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId } = await request.json();
    
    if (!subscriptionId) {
      return NextResponse.json({ 
        error: 'ID d\'abonnement requis' 
      }, { status: 400 });
    }

    // Annuler l'abonnement dans Stripe
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    
    console.log(`✅ Abonnement annulé dans Stripe: ${subscriptionId}`);
    console.log(`📅 Fin de période: ${new Date(subscription.current_period_end * 1000).toISOString()}`);

    // Récupérer l'email du customer pour trouver l'utilisateur Firebase
    const customer = await stripe.customers.retrieve(subscription.customer as string);
    
    if (customer && 'email' in customer && customer.email) {
      // Mettre à jour le profil utilisateur pour indiquer que l'abonnement se termine
      // On ne passe pas directement à 'free' car l'utilisateur a encore accès jusqu'à la fin de la période
      const subscriptionEnds = new Date(subscription.current_period_end * 1000).toISOString();
      
      // Trouver l'UID Firebase depuis l'email
      const { getFirebaseUidFromEmailAdmin } = await import('@/lib/firebase-admin');
      const uid = await getFirebaseUidFromEmailAdmin(customer.email);
      
      if (uid) {
        // Mettre à jour avec la date de fin pour que l'utilisateur perde l'accès à la fin de la période
        await updateUserSubscriptionAdmin(
          uid, 
          'premium', // Garder premium jusqu'à la fin de la période
          subscriptionEnds,
          customer.id,
          subscription.id
        );
        
        console.log(`✅ Profil utilisateur mis à jour: ${uid} - accès jusqu'au ${subscriptionEnds}`);
      } else {
        console.error('❌ UID Firebase non trouvé pour:', customer.email);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Abonnement annulé avec succès',
      subscriptionId: subscription.id,
      currentPeriodEnd: subscription.current_period_end,
      customerEmail: customer && 'email' in customer ? customer.email : null
    });

  } catch (error: any) {
    console.error('Erreur lors de l\'annulation de l\'abonnement:', error);
    
    // Gérer les erreurs spécifiques Stripe
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json({ 
        error: 'Abonnement non trouvé ou déjà annulé' 
      }, { status: 404 });
    }
    
    return NextResponse.json(
      { error: 'Erreur lors de l\'annulation de l\'abonnement' },
      { status: 500 }
    );
  }
}
