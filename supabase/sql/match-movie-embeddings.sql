-- Cosine-similarity search over movie_embeddings for the chat RAG tool
-- (features/movies/services/movie-search-service.ts calls this via supabase.rpc()).
--
-- SECURITY DEFINER: movie_embeddings holds no per-user data (it's a global
-- catalog), so the function intentionally bypasses RLS instead of depending
-- on whatever policies (if any) exist on the table. Only `authenticated`
-- can execute it — chat is behind auth, anon has no reason to call this.
--
-- match_threshold is a starting point (permissive, favors recall over
-- precision for a first pass) — tune freely once real query traffic shows
-- how tight it should be.
create or replace function match_movie_embeddings (
  query_embedding vector(1536),
  match_count int default 6,
  match_threshold float default 0.3
)
returns table (
  tmdb_id bigint,
  similarity float
)
language sql
stable
security definer
set search_path = public
as $$
  select
    movie_embeddings.tmdb_id,
    1 - (movie_embeddings.embedding <=> query_embedding) as similarity
  from movie_embeddings
  where 1 - (movie_embeddings.embedding <=> query_embedding) > match_threshold
  order by movie_embeddings.embedding <=> query_embedding
  limit match_count;
$$;

revoke execute on function match_movie_embeddings(vector, int, float) from public;
grant execute on function match_movie_embeddings(vector, int, float) to authenticated;
