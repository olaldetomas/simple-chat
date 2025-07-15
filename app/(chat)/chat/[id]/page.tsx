import { Chat } from '@/components/chat';
import { getChatById, getMessagesByChatId } from '@/lib/db/queries';
import { convertDBMessagesToUIMessages } from '@/lib/utils';
import { auth } from '@/app/(auth)/auth';
import { NavUser } from '@/components/nav-user';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { notFound, redirect } from 'next/navigation';

interface ChatPageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: ChatPageProps) {
  const session = await auth();
  const chatId = params.id;

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect('/login');
  }

  try {
    // Get the chat by ID
    const chat = await getChatById({ id: chatId });
    
    // If chat doesn't exist, return 404
    if (!chat) {
      notFound();
    }

    // Check if the chat belongs to the current user
    if (chat.userId !== session.user.id) {
      notFound();
    }

    // Get messages for this chat
    const dbMessages = await getMessagesByChatId({ id: chatId });
    const initialMessages = convertDBMessagesToUIMessages(dbMessages);

    return (
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-col h-dvh w-full">
            <header className="flex items-center justify-between py-4 px-6">
              <SidebarToggle />
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
  } catch (error) {
    console.error('Error loading chat:', error);
    notFound();
  }
}
