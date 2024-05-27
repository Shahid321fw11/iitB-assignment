require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

const app = express();
const port = process.env.PORT || 8080;

// middlewares
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// database connection
connection();

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Add a route to serve static files (photos and CVs)

app.get("/", (req, res) => {
  res.send("<h1>Working Fine</h1>");
});

app.listen(port, console.log(`Listening on port ${port}...`));
