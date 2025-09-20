import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/firestore';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');
  
  if (!uid) {
    return NextResponse.json({ 
      error: 'Paramètre requis: ?uid=USER_ID' 
    }, { status: 400 });
  }

  try {
    console.log(`🔍 Vérification de l'utilisateur: ${uid}`);
    
    const userProfile = await getUserProfile(uid);
    
    if (!userProfile) {
      return NextResponse.json({ 
        error: `Utilisateur ${uid} non trouvé dans Firestore`,
        exists: false
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      exists: true,
      userProfile: {
        uid: userProfile.uid,
        email: userProfile.email,
        plan: userProfile.plan,
        subscriptionEnds: userProfile.subscriptionEnds,
        stripeCustomerId: userProfile.stripeCustomerId,
        stripeSubscriptionId: userProfile.stripeSubscriptionId,
        createdAt: userProfile.createdAt,
        updatedAt: userProfile.updatedAt
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la vérification de l\'utilisateur',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
