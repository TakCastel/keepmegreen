import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { verifyIdToken } from 'firebase-admin/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        error: 'Token d\'authentification requis' 
      }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decodedToken = await verifyIdToken(token);
      
      return NextResponse.json({
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
      });
    } catch (error) {
      return NextResponse.json({ 
        error: 'Token invalide' 
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des informations utilisateur' },
      { status: 500 }
    );
  }
}
