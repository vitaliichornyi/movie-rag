'use client';

import { useState } from 'react';

import { ToggleGroup } from '@/shared/ui/toggle-group';
import { Button } from '@/shared/ui/button';

interface TagChipPanelProps {
  candidateTags: string[];
  onConfirm: (selectedTags: string[]) => void;
  onSearchNow: () => void;
}

export function TagChipPanel({
  candidateTags,
  onConfirm,
  onSearchNow,
}: TagChipPanelProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-input p-3">
      <ToggleGroup
        options={candidateTags.map((tag) => ({ value: tag, label: tag }))}
        value={selectedTags}
        onValueChange={setSelectedTags}
      />
      <div className="flex gap-2">
        <Button
          type="button"
          disabled={selectedTags.length === 0}
          onClick={() => onConfirm(selectedTags)}
        >
          Refine search
        </Button>
        <Button type="button" variant="ghost" onClick={onSearchNow}>
          Search now
        </Button>
      </div>
    </div>
  );
}
