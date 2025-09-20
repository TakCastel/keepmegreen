import { NextRequest, NextResponse } from 'next/server';
import { updateUserSubscription } from '@/lib/firestore';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { uid, plan } = await request.json();
    
    if (!uid || !plan) {
      return NextResponse.json({ 
        error: 'Paramètres requis: uid, plan' 
      }, { status: 400 });
    }

    console.log(`🧪 Simulation webhook: ${uid} -> ${plan}`);
    
    // Simuler la mise à jour d'abonnement
    await updateUserSubscription(uid, plan as 'free' | 'premium' | 'premium-plus');
    
    console.log(`✅ Simulation réussie: ${uid} -> ${plan}`);
    
    return NextResponse.json({ 
      success: true, 
      message: `Abonnement ${uid} mis à jour vers ${plan}`,
      simulated: true
    });
  } catch (error) {
    console.error('❌ Erreur simulation:', error);
    return NextResponse.json({ error: 'Erreur simulation' }, { status: 500 });
  }
}
