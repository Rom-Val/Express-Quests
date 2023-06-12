require("dotenv").config();
const express = require("express");
const { validateMovie, validateUser, hidePassword } = require("./middlewares");



const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

app.post("/api/movies", validateMovie, movieHandlers.postMovie);

app.put("/api/movies/:id", validateMovie, movieHandlers.updateMovie);

app.delete("/api/movies/:id", movieHandlers.deleteMovie);


const userHandlers = require("./userHandlers");

app.get("/api/users", userHandlers.getUsers, hidePassword);
app.get("/api/users/:id", userHandlers.getUserById, hidePassword);

//route pour modifier un user
app.put("/api/users/:id", validateUser, userHandlers.updateUser);

//route pour delete un user
app.delete("/api/users/:id", userHandlers.deleteUser);


// Password

const { hashPassword } = require("./auth.js");

app.post("/api/users", validateUser, hashPassword, userHandlers.postUser);
app.put("/api/users/:id", hashPassword, userHandlers.updateUser);



app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
