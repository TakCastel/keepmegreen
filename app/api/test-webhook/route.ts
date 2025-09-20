import { NextRequest, NextResponse } from 'next/server';
import { updateUserSubscription } from '@/lib/firestore';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { uid, plan, testMode = false } = await request.json();
    
    if (!uid || !plan || !['free', 'premium', 'premium-plus'].includes(plan)) {
      return NextResponse.json({ 
        error: 'Paramètres requis: uid, plan (free|premium|premium-plus)' 
      }, { status: 400 });
    }

    // Simuler un événement de paiement réussi
    console.log(`🧪 Test webhook: Mise à jour ${uid} vers ${plan}`);
    
    if (testMode) {
      return NextResponse.json({ 
        success: true, 
        message: `Test: Abonnement ${uid} mis à jour vers ${plan}`,
        testMode: true
      });
    }

    // Mise à jour réelle
    await updateUserSubscription(uid, plan as 'free' | 'premium' | 'premium-plus');
    
    console.log(`✅ Abonnement mis à jour: ${uid} -> ${plan}`);
    
    return NextResponse.json({ 
      success: true, 
      message: `Abonnement ${uid} mis à jour vers ${plan}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors du test webhook:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'abonnement', details: error },
      { status: 500 }
    );
  }
}
