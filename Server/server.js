const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Notes App Database",
  password: "Talgadasi1",
  port: 5433,
});

const app = express();
const port = 4000;

app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors());

// GET endpoint to fetch all users
app.get("/api", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    const users = result.rows;
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// POST endpoint for user login
app.post("/login", async (req, res) => {
  const { Email, Password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [Email, Password]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log("Login successful:", user.email);
      res.status(200).send("Login successful");
    } else {
      console.log("Login failed");
      res.status(401).send("Login failed");
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).send("Authentication failed");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server");
  await pool.end(); // Close the database connection pool
  process.exit(0);
});
