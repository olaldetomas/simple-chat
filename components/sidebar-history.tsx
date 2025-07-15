'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

import useSWR from 'swr';
import { Loader2Icon, TrashIcon } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  useSidebar,
} from '@/components/ui/sidebar';
import type { Chat } from '@/lib/db/schema';
import { fetcher } from '@/lib/utils';

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onDelete: (chatId: string) => void;
  setOpenMobile: (open: boolean) => void;
  isDeleting: boolean;
}

function ChatItem({
  chat,
  isActive,
  onDelete,
  setOpenMobile,
  isDeleting,
}: ChatItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link
          href={`/chat/${chat.id}`}
          onClick={() => setOpenMobile(false)}
          className="w-full text-left"
        >
          <span className="truncate">{chat.title}</span>
        </Link>
      </SidebarMenuButton>

      <SidebarMenuAction
        showOnHover
        onClick={() => onDelete(chat.id)}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2Icon />
        ) : (
          <TrashIcon className="text-gray-400 hover:text-red-600" />
        )}
      </SidebarMenuAction>
    </SidebarMenuItem>
  );
}

export function SidebarHistory() {
  const { setOpenMobile } = useSidebar();
  const { chatId } = useParams();
  const router = useRouter();
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);

  const {
    data: chatHistory,
    isLoading,
    mutate,
  } = useSWR<Chat[]>('/api/history?limit=50', fetcher);

  const handleDelete = async (chatIdToDelete: string) => {
    setDeletingChatId(chatIdToDelete);

    try {
      await fetch(`/api/chat?id=${chatIdToDelete}`, {
        method: 'DELETE',
      });

      mutate(current => {
        if (current) {
          return current.filter(chat => chat.id !== chatIdToDelete);
        }
        return current;
      });

      if (chatIdToDelete === chatId) {
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    } finally {
      setDeletingChatId(null);
    }
  };

  if (isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="flex flex-col">
            {[44, 32, 28, 64, 52].map(item => (
              <div
                key={item}
                className="rounded-md h-8 flex gap-2 px-2 items-center"
              >
                <div
                  className="h-4 rounded-md flex-1 max-w-[--skeleton-width] bg-sidebar-accent-foreground/10"
                  style={
                    {
                      '--skeleton-width': `${item}%`,
                    } as React.CSSProperties
                  }
                />
              </div>
            ))}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (!chatHistory || chatHistory.length === 0) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="px-2 text-muted-foreground w-full flex flex-row justify-center items-center text-sm gap-2">
            Your conversations will appear here once you start chatting!
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {chatHistory.map(chat => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isActive={chat.id === chatId}
              onDelete={handleDelete}
              setOpenMobile={setOpenMobile}
              isDeleting={deletingChatId === chat.id}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
