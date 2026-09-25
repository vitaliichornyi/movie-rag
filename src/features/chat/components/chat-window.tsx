'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { UIMessage } from 'ai';

import {
  MovieGrid,
  TagChipPanel,
  type Movie,
  type QueryClarificationResult,
} from '@/features/movies';
import { ChatComposer } from './chat-composer';

import { cn } from 'cn';

const SEARCH_NOW_MESSAGE = 'Search now with what we have so far.';

function buildTagSelectionMessage(selectedTags: string[]): string {
  return `Selected tags: ${selectedTags.join(', ')}.`;
}

function hasVisibleContent(message: UIMessage): boolean {
  return message.parts.some(
    (part) =>
      (part.type === 'text' && part.text.length > 0) ||
      part.type === 'tool-searchMovies',
  );
}

function getPendingClarificationTags(messages: UIMessage[]): string[] | null {
  const lastMessage = messages[messages.length - 1];

  if (!lastMessage || lastMessage.role !== 'assistant') {
    return null;
  }

  for (const part of lastMessage.parts) {
    if (
      part.type === 'tool-assessMovieQuery' &&
      part.state === 'output-available'
    ) {
      const result = part.output as QueryClarificationResult;

      if (result.needsClarification) {
        return [...new Set(Object.values(result.tags).flat())];
      }
    }
  }

  return null;
}

export function ChatWindow() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  const isPending = status === 'submitted' || status === 'streaming';

  const pendingClarificationTags = getPendingClarificationTags(messages);
  const lastMessage = messages[messages.length - 1];

  const showThinkingIndicator =
    isPending &&
    !pendingClarificationTags &&
    !(lastMessage?.role === 'assistant' && hasVisibleContent(lastMessage));

  return (
    <div className="flex flex-col gap-4 h-full w-full py-4">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-2 w-full max-w-2xl mx-auto px-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex flex-col gap-2',
                message.role === 'user' ? 'items-end' : 'items-start',
              )}
            >
              {message.parts.map((part, index) => {
                if (part.type === 'text') {
                  return (
                    <p
                      key={index}
                      className={cn(
                        'max-w-md px-3 py-2 rounded-lg text-sm',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground',
                      )}
                    >
                      {part.text}
                    </p>
                  );
                }

                if (part.type === 'tool-searchMovies') {
                  if (part.state === 'output-available') {
                    return (
                      <MovieGrid key={index} movies={part.output as Movie[]} />
                    );
                  }

                  if (part.state === 'output-error') {
                    console.error(part.errorText);
                    return (
                      <p key={index} className="text-sm text-destructive">
                        Something went wrong. Please try again.
                      </p>
                    );
                  }

                  return (
                    <div
                      key={index}
                      className="grid grid-cols-3 gap-2 w-full max-w-md animate-pulse"
                    >
                      {Array.from({ length: 6 }).map((_, tileIndex) => (
                        <div
                          key={tileIndex}
                          className="w-full aspect-2/3 rounded-md bg-muted"
                        />
                      ))}
                    </div>
                  );
                }

                return null;
              })}
            </div>
          ))}
          {showThinkingIndicator && (
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground">
                Thinking
                <span className="flex gap-0.5">
                  <span className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
                  <span className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
                  <span className="h-1 w-1 animate-bounce rounded-full bg-current" />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto px-4">
        {pendingClarificationTags && pendingClarificationTags.length > 0 && (
          <TagChipPanel
            key={pendingClarificationTags.join('|')}
            candidateTags={pendingClarificationTags}
            onConfirm={(selectedTags) =>
              sendMessage({ text: buildTagSelectionMessage(selectedTags) })
            }
            onSearchNow={() => sendMessage({ text: SEARCH_NOW_MESSAGE })}
          />
        )}

        <ChatComposer
          onSend={(text) => sendMessage({ text })}
          isLoading={isPending}
        />
      </div>
    </div>
  );
}
