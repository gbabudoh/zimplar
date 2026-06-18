import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';
import { auth } from '@/auth';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

  try {
    const lesson = await db.lesson.findFirst({ where: { videoUrl: room } });
    await db.videoSession.create({
      data: {
        userId: session.user.id,
        roomName: room,
        lessonId: lesson?.id,
      },
    });
  } catch (e) {
    console.error('Failed to log video session:', e);
  }

  return NextResponse.json({ token: await at.toJwt() });
}
