import { AppSidebar } from '@/components/app-sidebar';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col h-dvh w-full">
          <header className="flex items-center justify-between py-4 px-6">
            <SidebarToggle />
          </header>

          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Chat Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The chat you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button asChild>
                <Link href="/">
                  Start New Chat
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
