import type {
  CoreAssistantMessage,
  CoreToolMessage,
  Message,
  UIMessage,
} from 'ai';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const isProductionEnvironment = process.env.NODE_ENV === 'production';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ApplicationError extends Error {
  info: string;
  status: number;
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error(
      'An error occurred while fetching the data.'
    ) as ApplicationError;

    error.info = await res.json();
    error.status = res.status;

    throw error;
  }

  return res.json();
};

export function getLocalStorage(key: string) {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
  return [];
}

export function generateUUID(): string {
  return crypto.randomUUID();
}

type ResponseMessageWithoutId = CoreToolMessage | CoreAssistantMessage;
type ResponseMessage = ResponseMessageWithoutId & { id: string };

export function getMostRecentUserMessage(
  messages: UIMessage[]
): UIMessage | undefined {
  return [...messages].filter(message => message.role === 'user').pop();
}

export function getTrailingMessageId({
  messages,
}: {
  messages: UIMessage[];
}): string | undefined {
  const lastMessage = messages[messages.length - 1];
  return lastMessage?.id;
}

export function formatDate(date: Date): string {
  if (!date) return '';

  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function convertDBMessagesToUIMessages(dbMessages: any[]): UIMessage[] {
  return dbMessages.map(dbMessage => {
    // Ensure parts is an array
    const parts = Array.isArray(dbMessage.parts) ? dbMessage.parts : [];

    // Convert parts array to content string
    const content = parts.map((part: any) => part.text || '').join(' ');

    return {
      id: dbMessage.id,
      role: dbMessage.role,
      content,
      parts,
      createdAt: dbMessage.createdAt,
    };
  });
}
