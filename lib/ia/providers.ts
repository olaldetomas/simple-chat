import { openai } from '@ai-sdk/openai';

export const myProvider = {
  languageModels: {
    'chat-model': openai('gpt-4o'),
    'title-model': openai('gpt-4o-mini'),
  },
};
