const express = require("express"); const { Pool } = require("pg"); const cors = require('cors');

const app = express(); const PORT = process.env.PORT || 3000;


app.use(cors({
  origin: "*"
}));

app.use(express.json());

/************* PostgreSQL connection (AWS RDS ready) */ const pool = new Pool({ host: process.env.DB_HOST, port:
  process.env.DB_PORT || 5432, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database:
  process.env.DB_NAME, max: 10, idleTimeoutMillis: 30000,  ssl: { rejectUnauthorized: false }
});

/*********** Test DB connection on startup */ async function testConnection() { try { const result = await
    pool.query("SELECT NOW()"); console.log("✅ PostgreSQL is connected:", result.rows[0]);
  } catch (err) {
    console.error("❌ PostgreSQL connection failed:", err.message); process.exit(1);
  }
}

testConnection();

/**** HEALTH CHECK (for ALB + Fargate) */ app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "backend",
    time: new Date(),
  });
});

/**************************************************************************
 * STATUS ENDPOINT
 */
app.get("/api/status", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      status: "success",
      message: "Backend + PostgreSQL are running",
      hostname: process.env.HOSTNAME || "fargate",
      db_time: result.rows[0].now,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: err.message,
    });
  }
});

/****
 * CREATE USER
 */
app.post("/api/users", async (req, res) => {
  try {
    const { name, email } = req.body;

    const result = await pool.query(
      "INSERT INTO users(name, email) VALUES($1, $2) RETURNING *",
      [name, email]
    );

    res.json({
      message: "User created",
      user: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
/****
 * GET USERS
 */
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/**
 * START SERVER
 */
app.get("/", (req, res) => {
  res.send("Backend is running");
});
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
// backend test
