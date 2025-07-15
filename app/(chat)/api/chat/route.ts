import {
  appendClientMessage,
  appendResponseMessages,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from 'ai';
import {
  generateUUID,
  getTrailingMessageId,
  convertDBMessagesToUIMessages,
} from '@/lib/utils';
import {
  getChatById,
  getMessagesByChatId,
  saveChat,
  saveMessages,
  deleteChatById,
} from '@/lib/db/queries';
import { generateTitleFromUserMessage } from '../../actions';
import { auth } from '@/app/(auth)/auth';
import { myProvider } from '@/lib/ia/providers';
import { PostRequestBody, postRequestBodySchema } from './schema';

export async function POST(request: Request) {
  let requestBody: PostRequestBody;

  try {
    const json = await request.json();
    requestBody = postRequestBodySchema.parse(json);
  } catch (_) {
    return new Response('Bad request', { status: 400 });
  }

  try {
    const { id, message } = requestBody;

    const session = await auth();
    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const chat = await getChatById({ id });
    if (!chat) {
      const title = await generateTitleFromUserMessage({
        message,
      });
      await saveChat({
        id,
        userId: session?.user.id!,
        title,
      });
    }

    const previousMessages = await getMessagesByChatId({ id });
    const convertedMessages = convertDBMessagesToUIMessages(previousMessages);
    const messages = appendClientMessage({
      messages: convertedMessages,
      message,
    });

    await saveMessages({
      messages: [
        {
          chatId: id,
          id: message.id,
          role: 'user',
          parts: message.parts,
          createdAt: new Date(),
        },
      ],
    });

    return createDataStreamResponse({
      execute: dataStream => {
        const result = streamText({
          model: myProvider.languageModels['chat-model'],
          system:
            'You are a helpful assistant that can answer questions and help with tasks.',
          messages,
          maxSteps: 5,
          experimental_transform: smoothStream({ chunking: 'word' }),
          experimental_generateMessageId: generateUUID,
          onFinish: async ({ response }) => {
            if (session.user?.id) {
              try {
                const assistantId = getTrailingMessageId({
                  // @ts-expect-error
                  messages: response.messages.filter(
                    message => message.role === 'assistant'
                  ),
                });

                if (!assistantId) {
                  throw new Error('No assistant message found!');
                }

                const [, assistantMessage] = appendResponseMessages({
                  messages: [message],
                  responseMessages: response.messages,
                });

                await saveMessages({
                  messages: [
                    {
                      id: assistantId,
                      chatId: id,
                      role: assistantMessage.role,
                      parts: assistantMessage.parts,
                      createdAt: new Date(),
                    },
                  ],
                });
              } catch (_) {
                console.error('Failed to save chat');
              }
            }
          },
        });

        result.consumeStream();
        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      onError: error => {
        console.error(error);
        return 'Oops, an error occurred!';
      },
    });
  } catch (error) {
    return new Response('An error occurred while processing your request!', {
      status: 404,
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const url = new URL(request.url);
    const chatId = url.searchParams.get('id');

    if (!chatId) {
      return new Response('Chat ID is required', { status: 400 });
    }

    // Verify the chat exists and belongs to the user
    const chat = await getChatById({ id: chatId });
    if (!chat) {
      return new Response('Chat not found', { status: 404 });
    }

    if (chat.userId !== session.user.id) {
      return new Response('Forbidden', { status: 403 });
    }

    // Delete the chat and its messages
    await deleteChatById({ id: chatId });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to delete chat:', error);
    return new Response('Failed to delete chat', { status: 500 });
  }
}
