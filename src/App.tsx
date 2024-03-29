import { useEffect, useState } from "react";

import { api } from "./services/api";

import "./styles/global.scss";

import "./styles/sidebar.scss";
import "./styles/content.scss";

import { Header } from "./components/Header";
import { Content } from "./components/Content";
import { SideBar } from "./components/SideBar";

interface GenreResponseProps {
  id: number;
  name: "action" | "comedy" | "documentary" | "drama" | "horror" | "family";
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

export function App() {
  const [selectedGenreId, setSelectedGenreId] = useState(1);

  const [genres, setGenres] = useState<GenreResponseProps[]>([]);

  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>(
    {} as GenreResponseProps
  );

  useEffect(() => {
    api.get<GenreResponseProps[]>("genres").then((response) => {
      setGenres(response.data);
    });
  }, []);

  useEffect(() => {
    api
      .get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`)
      .then((response) => {
        setMovies(response.data);
      });

    api
      .get<GenreResponseProps>(`genres/${selectedGenreId}`)
      .then((response) => {
        setSelectedGenre(response.data);
      });
  }, [selectedGenreId]);

  function handleClickButton(id: number) {
    setSelectedGenreId(id);
  }

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <nav className="sidebar">
        <span>
          Watch<p>Me</p>
        </span>
        {genres.map((genre) => (
          <SideBar
            iconName={genre.name}
            title={genre.title}
            onClick={() => handleClickButton(genre.id)}
          />
        ))}
      </nav>
      <div className="container">
        <Header title={selectedGenre.title} />
        <main>
          <div className="movies-list">
            {movies.map((movie) => (
              <Content
                poster={movie.Poster}
                runtime={movie.Runtime}
                title={movie.Title}
                rating={String(movie.Ratings.unshift())}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
