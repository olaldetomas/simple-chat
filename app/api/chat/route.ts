import {
  UIMessage,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from 'ai';
import { generateUUID, getMostRecentUserMessage } from '@/lib/utils';
import { openai } from '@ai-sdk/openai';

export async function POST(request: Request) {
  try {
    const {
      messages,
    }: {
      messages: Array<UIMessage>;
    } = await request.json();

    const userMessage = getMostRecentUserMessage(messages);
    if (!userMessage) {
      return new Response('No user message found', { status: 400 });
    }

    return createDataStreamResponse({
      execute: dataStream => {
        const result = streamText({
          model: openai('gpt-4o-mini'),
          system:
            'You are a helpful assistant that can answer questions and help with tasks.',
          messages,
          maxSteps: 5,
          experimental_transform: smoothStream({ chunking: 'word' }),
          experimental_generateMessageId: generateUUID,
        });

        result.consumeStream();

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      onError: () => {
        return 'Oops, an error occurred!';
      },
    });
  } catch (error) {
    return new Response('An error occurred while processing your request!', {
      status: 404,
    });
  }
}
