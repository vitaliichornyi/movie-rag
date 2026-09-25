import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import {
  CLARIFICATION_MODEL,
  QUERY_CLARIFICATION_SYSTEM_PROMPT,
} from '../lib/query-clarification-config';

import {
  queryClarificationResultSchema,
  type QueryClarificationInput,
  type QueryClarificationResult,
} from '../schemas/query-clarification';

import { MOVIE_TAG_LABELS } from '../lib/movie-tag-constants';
import type { MovieTagCategories } from '../schemas/movie-tags';

import type { ActionResponse } from '@/shared/types/action-response';

function formatTagCategories(
  label: string,
  tags?: Partial<MovieTagCategories>,
): string | null {
  if (!tags) {
    return null;
  }

  const categoryKeys = Object.keys(
    MOVIE_TAG_LABELS,
  ) as (keyof MovieTagCategories)[];

  const lines = categoryKeys
    .map((key) => {
      const values = tags[key];

      return values && values.length > 0
        ? `${MOVIE_TAG_LABELS[key]}: ${values.join(', ')}`
        : null;
    })
    .filter((line): line is string => line !== null);

  return lines.length > 0 ? `${label}:\n${lines.join('\n')}` : null;
}

export async function assessQuerySpecificity(
  input: QueryClarificationInput,
): Promise<ActionResponse<QueryClarificationResult>> {
  try {
    const prompt = [
      `User's movie request: "${input.query}"`,
      formatTagCategories('Tags already selected', input.selectedTags),
      formatTagCategories(
        'Tags already shown (avoid repeating)',
        input.shownTags,
      ),
    ]
      .filter((section): section is string => section !== null)
      .join('\n\n');

    const { object } = await generateObject({
      model: openai.responses(CLARIFICATION_MODEL),
      schema: queryClarificationResultSchema,
      system: QUERY_CLARIFICATION_SYSTEM_PROMPT,
      prompt,
    });

    return { data: object, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown server error',
    };
  }
}
