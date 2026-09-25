import { z } from 'zod';

import { movieTagCategoriesSchema } from './movie-tags';

export const movieSearchInputSchema = z.object({
  query: z
    .string()
    .describe(
      'A natural-language description of the kind of movie to find (theme, plot, mood, genre).',
    ),
  tags: movieTagCategoriesSchema
    .partial()
    .optional()
    .describe(
      'Disambiguating tags the user explicitly selected during a clarification round, bucketed by category. Omit entirely if none were selected.',
    ),
});

export type MovieSearchInput = z.infer<typeof movieSearchInputSchema>;
