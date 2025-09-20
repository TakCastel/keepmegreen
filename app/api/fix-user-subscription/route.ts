import { NextRequest, NextResponse } from 'next/server';
import { updateUserSubscriptionAdmin, getFirebaseUidFromEmailAdmin } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, plan, subscriptionEnds } = await request.json();
    
    if (!email || !plan) {
      return NextResponse.json({ 
        error: 'Email et plan requis' 
      }, { status: 400 });
    }

    // Vérifier que le plan est valide
    if (!['free', 'premium', 'premium-plus'].includes(plan)) {
      return NextResponse.json({ 
        error: 'Plan invalide. Utilisez: free, premium, ou premium-plus' 
      }, { status: 400 });
    }

    // Récupérer l'UID Firebase depuis l'email
    const uid = await getFirebaseUidFromEmailAdmin(email);
    
    if (!uid) {
      return NextResponse.json({ 
        error: 'Utilisateur non trouvé avec cet email' 
      }, { status: 404 });
    }

    // Mettre à jour l'abonnement
    await updateUserSubscriptionAdmin(
      uid, 
      plan as 'free' | 'premium' | 'premium-plus',
      subscriptionEnds
    );

    return NextResponse.json({ 
      success: true, 
      message: `Abonnement mis à jour: ${email} -> ${plan}`,
      uid: uid,
      plan: plan,
      subscriptionEnds: subscriptionEnds
    });

  } catch (error) {
    console.error('Erreur lors de la correction de l\'abonnement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la correction de l\'abonnement' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ 
        error: 'Paramètre email requis' 
      }, { status: 400 });
    }

    // Récupérer l'UID Firebase depuis l'email
    const uid = await getFirebaseUidFromEmailAdmin(email);
    
    if (!uid) {
      return NextResponse.json({ 
        error: 'Utilisateur non trouvé avec cet email' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      uid: uid,
      email: email
    });

  } catch (error) {
    console.error('Erreur lors de la recherche de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recherche de l\'utilisateur' },
      { status: 500 }
    );
  }
}
