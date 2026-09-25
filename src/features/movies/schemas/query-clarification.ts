import { z } from 'zod';

import { movieTagCategoriesSchema } from './movie-tags';

export const queryClarificationInputSchema = z.object({
  query: z.string().describe('The current natural-language movie request.'),
  selectedTags: movieTagCategoriesSchema
    .partial()
    .optional()
    .describe(
      'Tags the user already picked across earlier clarification rounds this conversation, bucketed by category.',
    ),
  shownTags: movieTagCategoriesSchema
    .partial()
    .optional()
    .describe(
      'Tags already proposed in earlier rounds (picked or not), so new suggestions avoid repeats.',
    ),
});

export type QueryClarificationInput = z.infer<
  typeof queryClarificationInputSchema
>;

export const queryClarificationResultSchema = z.object({
  needsClarification: z.boolean(),
  tags: movieTagCategoriesSchema,
});

export type QueryClarificationResult = z.infer<
  typeof queryClarificationResultSchema
>;
