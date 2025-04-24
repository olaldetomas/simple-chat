import type { CoreAssistantMessage, CoreToolMessage, UIMessage } from 'ai';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
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

export function formatRelativeTime(date: Date): string {
  if (!date) return '';

  const now = new Date();
  const inputDate = new Date(date);
  const diff = now.getTime() - inputDate.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  // Check if the date is today
  const isToday = now.toDateString() === inputDate.toDateString();

  // Check if the date is from this year
  const isThisYear = now.getFullYear() === inputDate.getFullYear();

  if (isToday) {
    if (seconds < 60) {
      return `${seconds} sec ago`;
    } else if (minutes < 60) {
      return `${minutes} min ago`;
    } else {
      return `${hours} hr ago`;
    }
  } else if (isThisYear) {
    // If within this year but not today, display day and month
    return inputDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    });
  } else {
    // If not this year, display day, month and 2-digit year
    return inputDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: '2-digit',
    });
  }
}
