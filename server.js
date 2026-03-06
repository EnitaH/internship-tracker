const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

db.run(`
CREATE TABLE IF NOT EXISTS internships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company TEXT,
  role TEXT,
  status TEXT,
  location TEXT,
  notes TEXT,
  date_applied TEXT
)
`);

app.get("/api/internships", (req, res) => {
  db.all("SELECT * FROM internships ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post("/api/internships", (req, res) => {
  const { company, role, status, location, notes, date_applied } = req.body;

  const sql = `
  INSERT INTO internships (company, role, status, location, notes, date_applied)
  VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [company, role, status, location, notes, date_applied], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json({
      id: this.lastID
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});