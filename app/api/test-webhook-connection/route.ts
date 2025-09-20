import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    success: true, 
    message: 'Webhook endpoint accessible',
    timestamp: new Date().toISOString(),
    url: request.url
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');
    
    console.log('🧪 Test webhook reçu:');
    console.log('- Signature:', signature ? 'Présente' : 'Manquante');
    console.log('- Body length:', body.length);
    console.log('- Headers:', Object.fromEntries(request.headers.entries()));
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test webhook reçu avec succès',
      hasSignature: !!signature,
      bodyLength: body.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erreur test webhook:', error);
    return NextResponse.json({ error: 'Erreur test webhook' }, { status: 500 });
  }
}
