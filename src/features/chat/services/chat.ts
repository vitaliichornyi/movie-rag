import {
  streamText,
  tool,
  convertToModelMessages,
  stepCountIs,
  type UIMessage,
} from 'ai';
import {
  openai,
  type OpenAILanguageModelResponsesOptions,
} from '@ai-sdk/openai';

import { CHAT_MODEL, CHAT_SYSTEM_PROMPT } from '../lib/chat-config';
import { movieSearchSchema, searchMovies } from '@/features/movies';

export async function streamChatResponse(messages: UIMessage[]) {
  return streamText({
    model: openai.responses(CHAT_MODEL),
    system: CHAT_SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(2),
    providerOptions: {
      openai: {
        reasoningEffort: 'none',
      } satisfies OpenAILanguageModelResponsesOptions,
    },
    tools: {
      searchMovies: tool({
        description:
          'Search the movie catalog by theme, plot, mood, or genre and return matching posters.',
        inputSchema: movieSearchSchema,
        execute: async ({ query }) => {
          const { data, error } = await searchMovies(query);

          if (error || !data) {
            throw new Error(error ?? 'Unknown server error');
          }

          return data;
        },
      }),
    },
  });
}
