'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

import { MovieGrid } from '@/features/movies/components/movie-grid';
import type { Movie } from '@/features/movies/types/movie';
import { ChatComposer } from './chat-composer';

import { cn } from 'cn';

export function ChatWindow() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  const isPending = status === 'submitted' || status === 'streaming';

  return (
    <div className="flex flex-col gap-4 h-full w-full max-w-2xl mx-auto p-4">
      <div className="flex flex-col flex-1 gap-4 overflow-y-auto">
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
      </div>

      <ChatComposer
        onSend={(text) => sendMessage({ text })}
        isLoading={isPending}
      />
    </div>
  );
}
