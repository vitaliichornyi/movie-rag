import {
  createUIMessageStreamResponse,
  toUIMessageStream,
  type UIMessage,
} from 'ai';
import { NextResponse } from 'next/server';

import { getUser } from '@/shared/lib/get-user';
import { streamChatResponse } from '@/features/chat/services/chat';

export const maxDuration = 30;

export async function POST(request: Request) {
  const { data: user, error } = await getUser();

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { messages }: { messages: UIMessage[] } = await request.json();

  const result = await streamChatResponse(messages);

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
