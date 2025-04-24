'use client';

import { Chat } from '@/components/chat';
import { ThemeToggle } from '@/components/theme-toggle';
import { generateUUID } from '@/lib/utils';

export default function Page() {
  const chatId = generateUUID();

  return (
    <div className="flex flex-col h-dvh w-full">
      <header className="flex items-center justify-between py-4 px-6">
        <ThemeToggle />
      </header>

      <div className="flex-1 overflow-hidden flex justify-center">
        <div className="w-full max-w-3xl">
          <Chat id={chatId} initialMessages={[]} isReadonly={false} />
        </div>
      </div>
    </div>
  );
}
