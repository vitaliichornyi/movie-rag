import { z } from 'zod';

export const movieTagCategoriesSchema = z.object({
  franchiseOrSubgenre: z.array(z.string()),
  environmentAndSetting: z.array(z.string()),
  psychologyAndAtmosphere: z.array(z.string()),
  themesAndArchetypes: z.array(z.string()),
  aiDiscovery: z.array(z.string()),
});

export type MovieTagCategories = z.infer<typeof movieTagCategoriesSchema>;
