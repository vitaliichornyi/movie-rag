import {
  openai,
  type OpenAILanguageModelResponsesOptions,
} from '@ai-sdk/openai';

import { CHAT_MODEL, CHAT_SYSTEM_PROMPT } from '../lib/chat-config';

import {
  streamText,
  convertToModelMessages,
  stepCountIs,
  tool,
  type UIMessage,
} from 'ai';

import {
  queryClarificationInputSchema,
  assessQuerySpecificity,
  EMPTY_MOVIE_TAG_CATEGORIES,
  movieSearchInputSchema,
  searchMovies,
} from '@/features/movies';

export async function streamChatResponse(messages: UIMessage[]) {
  return streamText({
    model: openai.responses(CHAT_MODEL),
    system: CHAT_SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(3),
    providerOptions: {
      openai: {
        reasoningEffort: 'none',
        parallelToolCalls: false,
      } satisfies OpenAILanguageModelResponsesOptions,
    },
    tools: {
      assessMovieQuery: tool({
        description:
          'Judge whether a movie request is specific enough to search, or propose disambiguating tags if not. Always call this before searchMovies.',
        inputSchema: queryClarificationInputSchema,
        execute: async (input) => {
          const { data, error } = await assessQuerySpecificity(input);

          if (error || !data) {
            return {
              needsClarification: false,
              tags: EMPTY_MOVIE_TAG_CATEGORIES,
            };
          }

          return data;
        },
      }),
      searchMovies: tool({
        description:
          'Search the movie catalog by theme, plot, mood, or genre and return matching posters.',
        inputSchema: movieSearchInputSchema,
        execute: async ({ query, tags }) => {
          const { data, error } = await searchMovies({ query, tags });

          if (error || !data) {
            throw new Error(error ?? 'Unknown server error');
          }

          return data;
        },
      }),
    },
  });
}
