import { createContext, ReactNode, SetStateAction, useEffect, useState } from "react";
import { api } from "../services/api";

export const MoviesContext = createContext({} as MoviesContextData);

interface Genre {
  id: number;
  name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
  title: string;
}

interface MovieProps {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

interface MoviesContextData {
  selectedGenreId: number;
  genres: Genre[];
  movies: MovieProps[];
  selectedGenre: Genre;
  handleClickButton: (id: number) => void;
  setMovies: (value: SetStateAction<MovieProps[]>) => void;
  setSelectedGenre: (value: SetStateAction<Genre>) => void;
}

interface MoviesProviderProps {
  children: ReactNode;
}

export function MoviesProvider({
  children,
}: MoviesProviderProps) {
  const [selectedGenreId, setSelectedGenreId] = useState(1);
  const [genres, setGenres] = useState<Genre[]>([]);

  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre>({} as Genre);

  useEffect(() => {
    api.get<Genre[]>('genres').then(response => {
      setGenres(response.data);
    });
  }, []);

  useEffect(() => {
    api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`).then(response => {
      setMovies(response.data);
    });

    api.get<Genre>(`genres/${selectedGenreId}`).then(response => {
      setSelectedGenre(response.data);
    })
  }, [selectedGenreId]);

  function handleClickButton(id: number) {
    setSelectedGenreId(id);
  };

  return (
    <MoviesContext.Provider value={{
      selectedGenreId,
      genres,
      movies,
      selectedGenre,
      handleClickButton,
      setMovies,
      setSelectedGenre
    }}>
      { children }
    </MoviesContext.Provider>
  );
};
