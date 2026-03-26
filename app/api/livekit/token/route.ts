import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';

export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get('room');
  const username = req.nextUrl.searchParams.get('username');

  if (!room) {
    return NextResponse.json({ error: 'Missing "room" query parameter' }, { status: 400 });
  } else if (!username) {
    return NextResponse.json({ error: 'Missing "username" query parameter' }, { status: 400 });
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.LIVEKIT_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const at = new AccessToken(apiKey, apiSecret, {
    identity: username,
    name: username,
    metadata: req.nextUrl.searchParams.get('email') || undefined,
  });

  const isModerator = req.nextUrl.searchParams.get('isModerator') === 'true';
  const mode = req.nextUrl.searchParams.get('mode') || 'interactive';

  // For broadcast mode, only moderators can publish
  const canPublish = mode === 'interactive' || isModerator;

  at.addGrant({
    room,
    roomJoin: true,
    canPublish: canPublish,
    canSubscribe: true,
    roomAdmin: isModerator,
  });



  return NextResponse.json({ token: await at.toJwt() });
}
