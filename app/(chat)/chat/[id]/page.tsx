import { Chat } from '@/components/chat';
import { getChatById, getMessagesByChatId } from '@/lib/db/queries';
import { convertDBMessagesToUIMessages } from '@/lib/utils';
import { auth } from '@/app/(auth)/auth';
import { NavUser } from '@/components/nav-user';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const session = await auth();
  const chatId = params.id;

  const chat = await getChatById({ id: chatId });

  if (!chat || chat.userId !== session?.user?.id) {
    notFound();
  }

  const dbMessages = await getMessagesByChatId({ id: chatId });
  const initialMessages = convertDBMessagesToUIMessages(dbMessages);

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col h-dvh w-full">
          <header className="flex items-center justify-between py-4 px-6">
            <Link href="/">
              <Button size="icon" variant="ghost">
                <ArrowLeft />
              </Button>
            </Link>
            {session?.user && <NavUser user={session.user} />}
          </header>

          <div className="flex-1 overflow-hidden flex justify-center">
            <div className="w-full max-w-3xl">
              <Chat
                chatId={chatId}
                initialMessages={initialMessages}
                isReadonly={false}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
