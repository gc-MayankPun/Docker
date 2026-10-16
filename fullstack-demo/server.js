
const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

app.get("/", async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS visits (
        id SERIAL PRIMARY KEY,
        visited_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await pool.query("INSERT INTO visits DEFAULT VALUES");

    const result = await pool.query(
      "SELECT COUNT(*) AS total FROM visits"
    );

    res.json({
      message: "Node.js is connected to PostgreSQL!",
      totalVisits: Number(result.rows[0].total)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database query failed" });
  }
});

async function start() {
  await pool.query("SELECT 1");

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

start().catch(error => {
  console.error("Failed to start application:", error);
  process.exit(1);
});
