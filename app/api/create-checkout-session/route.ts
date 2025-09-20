import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const plan = searchParams.get('plan') as 'premium' | 'premium-plus';
    const email = searchParams.get('email'); // Récupérer l'email depuis l'URL
    
    if (!plan || !['premium', 'premium-plus'].includes(plan)) {
      return NextResponse.json({ error: 'Plan invalide' }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    // Prix selon le plan (en centimes)
    const prices = {
      premium: 199, // 1,99€
      'premium-plus': 1999, // 19,99€
    };

    const price = prices[plan];

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email, // Ajouter l'email du customer
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `DrinkeatGreen ${plan === 'premium' ? 'Premium' : 'Premium+'}`,
              description: plan === 'premium' 
                ? 'Accès aux statistiques avancées, historique complet et calendrier complet'
                : 'Toutes les fonctionnalités Premium + défis, widgets mobile et mode hors-ligne',
            },
            unit_amount: price,
            ...(plan === 'premium' ? {
              recurring: {
                interval: 'month',
              },
            } : {}),
          },
          quantity: 1,
        },
      ],
      mode: plan === 'premium' ? 'subscription' : 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription?canceled=true`,
      metadata: {
        plan: plan,
        email: email,
      },
      ...(plan === 'premium-plus' ? {
        payment_intent_data: {
          metadata: {
            plan: plan,
            email: email,
          },
        },
      } : {}),
    });

    // Rediriger vers Stripe Checkout
    return NextResponse.redirect(session.url!);
  } catch (error) {
    console.error('Erreur lors de la création de la session Stripe:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { plan, email } = await request.json();
    
    if (!plan || !['premium', 'premium-plus'].includes(plan)) {
      return NextResponse.json({ error: 'Plan invalide' }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    // Prix selon le plan (en centimes)
    const prices = {
      premium: 199, // 1,99€
      'premium-plus': 1999, // 19,99€
    };

    const price = prices[plan];

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `DrinkeatGreen ${plan === 'premium' ? 'Premium' : 'Premium+'}`,
              description: plan === 'premium' 
                ? 'Accès aux statistiques avancées, historique complet et calendrier complet'
                : 'Toutes les fonctionnalités Premium + défis, widgets mobile et mode hors-ligne',
            },
            unit_amount: price,
            ...(plan === 'premium' ? {
              recurring: {
                interval: 'month',
              },
            } : {}),
          },
          quantity: 1,
        },
      ],
      mode: plan === 'premium' ? 'subscription' : 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription?canceled=true`,
      metadata: {
        plan: plan,
        email: email,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Erreur lors de la création de la session Stripe:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    );
  }
}
