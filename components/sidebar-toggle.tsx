'use client';

import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { Sidebar } from 'lucide-react';

export function SidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      onClick={toggleSidebar}
      variant="ghost"
      size="icon"
      className="size-8"
    >
      <Sidebar />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}
