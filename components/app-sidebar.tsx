'use client';

import { SidebarHistory } from '@/components/sidebar-history';
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="pt-4">
        <SidebarHistory />
      </SidebarContent>
    </Sidebar>
  );
}
