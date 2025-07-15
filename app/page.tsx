import { Chat } from '@/components/chat';
import { generateUUID } from '@/lib/utils';
import { NavUser } from '@/components/nav-user';
import { auth } from './(auth)/auth';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default async function Page() {
  const session = await auth();
  const chatId = generateUUID();

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
              <Chat chatId={chatId} initialMessages={[]} isReadonly={false} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
