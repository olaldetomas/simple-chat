import { auth } from '@/app/(auth)/auth';
import type { NextRequest } from 'next/server';
import { getChatsByUserId } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chats = await getChatsByUserId({
      id: session.user.id,
    });

    return Response.json(chats);
  } catch (error) {
    console.error('Failed to fetch chat history:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
