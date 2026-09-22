export interface Movie {
  tmdbId: number;
  posterUrl: string;
}

export interface MovieEmbeddingMatch {
  tmdb_id: number;
  similarity: number;
}

export interface TmdbMovieDetails {
  id: number;
  poster_path: string | null;
}
