import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');
    
    if (!uid) {
      return NextResponse.json({ error: 'UID requis' }, { status: 400 });
    }

    // Pour l'instant, retournons juste l'UID pour confirmer que la route fonctionne
    return NextResponse.json({ 
      success: true, 
      message: 'Route fonctionnelle - UID reçu',
      uid: uid,
      note: 'Créez le fichier .env.local avec les clés Firebase Admin pour activer la mise à jour'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}
