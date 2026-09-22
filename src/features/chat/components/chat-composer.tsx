'use client';

import { useState } from 'react';

import { TextInput } from '@/shared/ui/text-input';
import { Button } from '@/shared/ui/button';

interface ChatComposerProps {
  isLoading: boolean;
  onSend: (text: string) => void;
}

export function ChatComposer({ isLoading, onSend }: ChatComposerProps) {
  const [input, setInput] = useState('');

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!input.trim()) {
      return;
    }

    onSend(input);
    setInput('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <TextInput
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="What kind of movie are you looking for?"
        disabled={isLoading}
        autoComplete="off"
      />
      <Button type="submit" disabled={isLoading}>
        Send
      </Button>
    </form>
  );
}
