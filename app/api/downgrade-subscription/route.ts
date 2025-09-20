import { NextRequest, NextResponse } from 'next/server';
import { updateUserSubscriptionAdmin, getFirebaseUidFromEmailAdmin } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ 
        error: 'Email requis' 
      }, { status: 400 });
    }

    // Récupérer l'UID Firebase depuis l'email
    const uid = await getFirebaseUidFromEmailAdmin(email);
    
    if (!uid) {
      return NextResponse.json({ 
        error: 'Utilisateur non trouvé avec cet email' 
      }, { status: 404 });
    }

    // Rétrograder vers le plan gratuit
    await updateUserSubscriptionAdmin(uid, 'free');
    
    console.log(`✅ Utilisateur rétrogradé vers gratuit: ${uid} (${email})`);

    return NextResponse.json({ 
      success: true, 
      message: 'Abonnement rétrogradé avec succès vers le plan Gratuit',
      uid: uid,
      email: email,
      newPlan: 'free'
    });

  } catch (error: any) {
    console.error('Erreur lors de la rétrogradation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la rétrogradation de l\'abonnement' },
      { status: 500 }
    );
  }
}
