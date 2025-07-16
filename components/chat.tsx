'use client';

import { toast } from 'sonner';
import { Messages } from '@/components/messages';
import { MultimodalInput } from '@/components/multimodal-input';
import { UIMessage } from 'ai';
import { generateUUID } from '@/lib/utils';
import { useChat } from '@ai-sdk/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ChatProps {
  chatId: string;
  initialMessages: Array<UIMessage>;
  isReadonly: boolean;
}

export function Chat({ chatId, initialMessages, isReadonly }: ChatProps) {
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);
  
  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    status,
    stop,
    reload,
  } = useChat({
    id: chatId,
    initialMessages,
    experimental_throttle: 0,
    sendExtraMessageFields: true,
    experimental_prepareRequestBody: body => ({
      id: chatId,
      message: body.messages.at(-1),
    }),
    generateId: generateUUID,
    onFinish() {
      // Redirect to /chat/[id] when user sends their first message
      if (initialMessages.length === 0 && !hasRedirected) {
        setHasRedirected(true);
        router.push(`/chat/${chatId}`);
      }
    },
    onError: error => {
      console.error(error);
      toast.error('An error occurred, please try again!');
    },
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <Messages
          chatId={chatId}
          status={status}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
        />
      </div>

      <div className="pb-4 px-4 mt-auto">
        {!isReadonly && (
          <MultimodalInput
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            status={status}
            stop={stop}
            setMessages={setMessages}
          />
        )}
      </div>
    </div>
  );
}
