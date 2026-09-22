import { z } from 'zod';

export const movieSearchSchema = z.object({
  query: z
    .string()
    .describe(
      'A natural-language description of the kind of movie to find (theme, plot, mood, genre).',
    ),
});

export type MovieSearchInput = z.infer<typeof movieSearchSchema>;
