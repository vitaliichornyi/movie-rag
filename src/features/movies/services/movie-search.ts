import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';

import { createClient } from '@/shared/lib/supabase/server';
import type { ActionResponse } from '@/shared/types/action-response';

import type {
  Movie,
  MovieEmbeddingMatch,
  TmdbMovieDetails,
} from '../types/movie';
import {
  EMBEDDING_MODEL,
  MATCH_COUNT,
  MATCH_THRESHOLD,
  TMDB_API_BASE_URL,
  TMDB_POSTER_BASE_URL,
} from '../lib/movie-search-config';

async function fetchMoviePoster(tmdbId: number): Promise<Movie | null> {
  const response = await fetch(
    `${TMDB_API_BASE_URL}/movie/${tmdbId}?api_key=${process.env.TMDB_API_KEY}`,
    { next: { revalidate: 60 * 60 * 24 } },
  );

  if (!response.ok) {
    throw new Error(`TMDB movie ${tmdbId} failed: ${response.status}`);
  }

  const details: TmdbMovieDetails = await response.json();

  if (!details.poster_path) {
    return null;
  }

  return {
    tmdbId: details.id,
    posterUrl: `${TMDB_POSTER_BASE_URL}${details.poster_path}`,
  };
}

export async function searchMovies(
  query: string,
): Promise<ActionResponse<Movie[]>> {
  try {
    const { embedding } = await embed({
      model: openai.embedding(EMBEDDING_MODEL),
      value: query,
    });

    const supabase = await createClient();
    const { data: matches, error: matchError } = await supabase.rpc(
      'match_movie_embeddings',
      {
        query_embedding: embedding,
        match_count: MATCH_COUNT,
        match_threshold: MATCH_THRESHOLD,
      },
    );

    if (matchError) {
      return { data: null, error: matchError.message };
    }

    const settled = await Promise.allSettled(
      (matches as MovieEmbeddingMatch[]).map((match) =>
        fetchMoviePoster(match.tmdb_id),
      ),
    );

    const movies = settled
      .filter(
        (result): result is PromiseFulfilledResult<Movie | null> =>
          result.status === 'fulfilled',
      )
      .map((result) => result.value)
      .filter((movie): movie is Movie => movie !== null);

    const failures = settled
      .filter(
        (result): result is PromiseRejectedResult =>
          result.status === 'rejected',
      )
      .map((result) => result.reason);

    if (failures.length > 0) {
      console.warn(
        `${failures.length}/${settled.length} movie posters failed to load`,
        failures,
      );
    }

    return { data: movies, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown server error',
    };
  }
}
