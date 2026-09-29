# Movie RAG

Semantic movie search, not keyword search. A user types something like "movies about street gangs" — the query gets embedded and compared against a database of movie vector embeddings, instead of being matched against exact text.

Embedding and adding movies to the database currently lives in a separate project — it'll be merged into this one over time. This repo is responsible for the search itself and the chat on top of an existing embeddings database.

## The idea

There's a table of movie vector embeddings (`embedding + tmdb_id`). The user's query is run through the same embedding model, then compared by cosine similarity — this gives back a list of `tmdb_id`s. Data for display (poster, description, rating) is never read from our own database — it's always fetched fresh from the TMDb API at display time. The embeddings database is purely an internal search index, not a source of truth for display.

The project is intentionally small in terms of features (chat, login/register) — the focus wasn't on the number of screens but on the search algorithm itself:

- **Iteration 1** — embedded the raw movie text (title, overview, director, cast, genres, countries) and the raw user query.
- **Iteration 2** — noticed that TMDb's overview is often short and low on information, which made search results too vague. Added an intermediate step: AI generates tags from a movie's data when it's added to the database, and AI also generates tags from the user's query at search time — so what actually gets compared is two structurally comparable sets of tags, instead of two pieces of free text with nothing in common.
- **Now** — the query side has an interactive clarification step: if the AI decides a query isn't specific enough, the user is shown a panel of suggested tags to pick from before the query gets embedded.

## Status

Early stage. The tag-based approach gave noticeably better results than embedding raw text, but it's not reliable enough yet. Work in progress:

- moving the movie-ingestion/embedding pipeline into this project;
- chunking movie text so a movie's embedding length doesn't dilute the comparison against a short user query;
- better-designed tag categories — both for tag generation when a movie is added, and for stripping noise out of the query ("I want to watch", etc.);
- a methodology for measuring search result quality.

## Stack

- Next.js (App Router), React, TypeScript
- Supabase (database, auth)
- OpenAI — embedding model and tag generation / chat with AI
- Tailwind CSS, shadcn/ui
- Zod, React Hook Form

## Project structure

Feature-first: `app/` is routing only, `features/` holds all business logic by domain, `shared/` holds reusable components, types, and helpers like `getUser`.

Features:

- **auth** — sign in via Google and Magic Link. No password and no password reset by design — to stay focused on the core search functionality.
- **chat** — the chat composer and the service that talks to OpenAI (prompts, calling the search skills).
- **movies** — movie search via embeddings and tag generation (both for movies when added to the database, and for user queries at search time).

## How this was built

Built with Claude Code, following my own `CLAUDE.md` — a file with my personal project-structure rules (feature-first, layer separation, naming, etc.) that I reuse across projects. Process: the **grilling** skill to talk through an architectural decision (an interview — what's the task, how do I see the system) → code generation guided by `CLAUDE.md` → review of the result.
