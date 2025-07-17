const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 8000;

app.use(express.json()); 

app.get("/", (req, res) => {
  res.send("API is working");
});

// Get All Movies

app.get("/api/movies", (req, res) => {
  fs.readFile("./MOCK_DATA.json", "utf-8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error reading file" });

    const movies = JSON.parse(data);
    res.json(movies);
  });
});

// Get Movie by ID
app.get("/api/movies/:id", (req, res) =>
{
    const id = Number(req.params.id);

    fs.readFile("./MOCK_DATA.json", "utf-8", (err, data)=>{
        if (err) return res.status(500).json({ error: "Error reading file" });
        const movies = JSON.parse(data);
        const movie = movies.find(m => m.id === id);

        if(!movie)
        {
           return res.status(404).json({ error: "Movie not found" });
        }
        res.json(movie);
    })
})

// POST /api/movies — Add a New Movie
app.post("/api/movies", (req, res) => {
  const newMovie = req.body;

  fs.readFile("./MOCK_DATA.json", "utf-8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error reading file" });

    const movies = JSON.parse(data);
    newMovie.id = movies.length + 1;
    movies.push(newMovie);

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(movies, null, 2), err => {
      if (err) return res.status(500).json({ error: "Error writing file" });

      res.status(201).json({ status: "success", newMovie });
    });
  });
});

// PATCH /api/movies/:id — Update a Movie

app.patch("/api/movies/:id", (req, res) => {
  const id = Number(req.params.id);
  const updateData = req.body;

fs.readFile("./MOCK_DATA.json", "utf-8", (err, data)=>{
  if (err) return res.status(500).json({ error: "Error reading file" });

    const movies = JSON.parse(data);
    const movieIndex = movies.findIndex(m => m.id === id);
    if(movieIndex === -1) return res.status(404).json({error: "movie not found"});
    movies[movieIndex] = { ...movies[movieIndex], ...updateData};

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(movies, null, 2), err => {
      if (err) return res.status(500).json({ error: "error writing file"});

      res.json({ status: "success", updateMovie: movies[movieIndex]});
    })
    
})
})

// DELETE /api/movies/:id — Delete a Movie

app.delete("/api/movies/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  fs.readFile("./MOCK_DATA.json", "utf-8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error reading file" });

    let movies = JSON.parse(data);
    const movieExists = movies.some(m => m.id === id);

    if (!movieExists) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const filteredMovies = movies.filter(m => m.id !== id);

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(filteredMovies, null, 2), err => {
      if (err) return res.status(500).json({ error: "Error writing file" });

      res.json({ status: "deleted", id });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
