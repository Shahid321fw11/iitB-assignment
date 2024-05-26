require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Add a route to serve static files (photos and CVs)
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("<h1>Working Fine</h1>");
});

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
