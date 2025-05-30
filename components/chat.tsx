'use client';

import { toast } from 'sonner';
import { Messages } from '@/components/messages';
import { MultimodalInput } from '@/components/multimodal-input';
import { UIMessage } from 'ai';
import { generateUUID } from '@/lib/utils';
import { useChat } from '@ai-sdk/react';

interface ChatProps {
  id: string;
  initialMessages: Array<UIMessage>;
  isReadonly: boolean;
}

export function Chat({ id, initialMessages, isReadonly }: ChatProps) {
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
    id,
    initialMessages,
    experimental_throttle: 0,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    onError: () => {
      toast.error('An error occurred, please try again!');
    },
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <Messages
          chatId={id}
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
