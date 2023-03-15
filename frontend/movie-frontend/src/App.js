import "./App.css";
import React, { useState, useEffect } from "react";
import Axios from "axios";

function App() {
  const [movies, setProducts] = useState([]);
  const [movieToggle, setMovieToggle] = useState(false);

  const listAllMovies = () => {
    setMovieToggle((prevState) => !prevState);
  };

  const fetchMovies = async () => {
    const { data } = await Axios.get(
      "https://j37rcp3eo2.execute-api.eu-central-1.amazonaws.com/prod/list-movies"
    );
    const movies = data;
    setProducts(movies);
    console.log(movies);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div style={{ marginLeft: "50px" }}>
      <h1> Movie Database </h1>
      <button type="button" onClick={listAllMovies}>
        List all movies
      </button>
      {movieToggle
        ? movies.map((movie) => (
            <p key={movie.name}>
              {movie.name} ({movie.year}) directed by {movie.director.firstName}{" "}
              {movie.director.lastName}
            </p>
          ))
        : null}
    </div>
  );
}

export default App;
