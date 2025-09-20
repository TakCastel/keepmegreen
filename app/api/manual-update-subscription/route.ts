import { NextRequest, NextResponse } from 'next/server';
import { updateUserSubscription, getUserProfile, createOrUpdateUserProfile } from '@/lib/firestore';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { uid, plan } = await request.json();
    
    if (!uid || !plan || !['free', 'premium', 'premium-plus'].includes(plan)) {
      return NextResponse.json({ 
        error: 'UID et plan requis (free, premium, premium-plus)' 
      }, { status: 400 });
    }

    // Mettre à jour l'abonnement
    await updateUserSubscription(uid, plan as 'free' | 'premium' | 'premium-plus');
    
    return NextResponse.json({ 
      success: true, 
      message: `Abonnement mis à jour vers ${plan}` 
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour manuelle:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'abonnement' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');
  const plan = searchParams.get('plan');
  
  if (!uid || !plan || !['free', 'premium', 'premium-plus'].includes(plan)) {
    return NextResponse.json({ 
      error: 'Paramètres requis: ?uid=USER_ID&plan=premium|premium-plus' 
    }, { status: 400 });
  }

  try {
    console.log(`🔧 Tentative de mise à jour: ${uid} -> ${plan}`);
    
    // Vérifier si l'utilisateur existe
    const userProfile = await getUserProfile(uid);
    console.log('👤 Profil utilisateur trouvé:', userProfile ? 'Oui' : 'Non');
    
    if (!userProfile) {
      return NextResponse.json({ 
        error: `Utilisateur ${uid} non trouvé dans Firestore`,
        suggestion: 'Assurez-vous que l\'utilisateur s\'est connecté au moins une fois'
      }, { status: 404 });
    }

    // Mettre à jour l'abonnement
    await updateUserSubscription(uid, plan as 'free' | 'premium' | 'premium-plus');
    
    console.log(`✅ Abonnement mis à jour avec succès: ${uid} -> ${plan}`);
    
    return NextResponse.json({ 
      success: true, 
      message: `Abonnement mis à jour vers ${plan}`,
      uid: uid,
      previousPlan: userProfile.plan,
      newPlan: plan,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour manuelle:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la mise à jour de l\'abonnement',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        uid: uid,
        plan: plan
      },
      { status: 500 }
    );
  }
}
