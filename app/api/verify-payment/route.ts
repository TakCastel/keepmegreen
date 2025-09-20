import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID requis' }, { status: 400 });
    }

    // Vérifier la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session) {
      return NextResponse.json({ error: 'Session non trouvée' }, { status: 404 });
    }

    // Vérifier si le paiement a réussi
    if (session.payment_status === 'paid') {
      return NextResponse.json({
        success: true,
        plan: session.metadata?.plan || 'premium',
        paymentStatus: session.payment_status,
        amount: session.amount_total
      });
    }

    return NextResponse.json({
      success: false,
      paymentStatus: session.payment_status
    });
  } catch (error) {
    console.error('Erreur vérification paiement:', error);
    return NextResponse.json({ error: 'Erreur vérification' }, { status: 500 });
  }
}
