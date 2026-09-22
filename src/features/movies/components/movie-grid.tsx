import Image from 'next/image';

import type { Movie } from '../types/movie.types';

interface MovieGridProps {
  movies: Movie[];
}

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <div className="grid grid-cols-3 gap-2 w-full max-w-md">
      {movies.map((movie) => (
        <div
          key={movie.tmdbId}
          className="relative w-full aspect-2/3 overflow-hidden rounded-md bg-muted"
        >
          <Image
            src={movie.posterUrl}
            alt=""
            fill
            sizes="150px"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
