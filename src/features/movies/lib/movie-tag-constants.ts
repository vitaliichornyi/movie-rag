import type { MovieTagCategories } from '../schemas/movie-tags';

export const EMPTY_MOVIE_TAG_CATEGORIES: MovieTagCategories = {
  franchiseOrSubgenre: [],
  environmentAndSetting: [],
  psychologyAndAtmosphere: [],
  themesAndArchetypes: [],
  aiDiscovery: [],
};

export const MOVIE_TAG_LABELS: Record<keyof MovieTagCategories, string> = {
  franchiseOrSubgenre: 'Franchise or subgenre',
  environmentAndSetting: 'Environment and setting',
  psychologyAndAtmosphere: 'Psychology and atmosphere',
  themesAndArchetypes: 'Themes and archetypes',
  aiDiscovery: 'AI discovery',
};
