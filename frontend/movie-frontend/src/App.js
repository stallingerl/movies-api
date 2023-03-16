import "./App.css";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import Form from "./Form";

function App() {
  const [movies, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [foundUsers, setFoundUsers] = useState(movies);

  const filter = (e) => {
    const keyword = e.target.value;

    if (keyword !== "") {
      const results = movies.filter((movie) => {
        return movie.name.toLowerCase().startsWith(keyword.toLowerCase());
        // Use the toLowerCase() method to make it case-insensitive
      });
      setFoundUsers(results);
    } else {
      setFoundUsers(movies);
      // If the text field is empty, show all users
    }

    setName(keyword);
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
    <div className="container">
      <h1>Movie Database</h1>
      <h4>Add an additional movie</h4>
      <div className="py-6">
        <Form />
      </div>
      <p></p>
      <input
        type="search"
        value={name}
        onChange={filter}
        className="input"
        placeholder="Search movie by title"
      />

      <div className="user-list">
        {foundUsers && foundUsers.length > 0
          ? foundUsers.map((movie) => (
              <li key={movie.name} className="user">
                <span className="movie-name">{movie.name} </span>
                <span className="movie-year">({movie.year}) </span>
                <span className="movie-director">
                  {" "}
                  directed by {movie.director.firstName}{" "}
                  {movie.director.lastName}
                  <p>{movie.synopsis}</p>
                </span>
              </li>
            ))
          : movies.map((movie) => (
              <li key={movie.name} className="user">
                <span className="movie-name">{movie.name} </span>
                <span className="movie-year">({movie.year})</span>
                <span className="movie-director">
                  {" "}
                  by {movie.director.firstName} {movie.director.lastName}
                </span>
              </li>
            ))}
      </div>
    </div>
  );
}

export default App;
