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
    console.error("Database connection error:",err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

db.run(`
CREATE TABLE IF NOT EXISTS internships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL CHECK (
    status IN ('Applied', 'Interview', 'Offer', 'Rejected')
  ),
  location TEXT,
  notes TEXT,
  date_applied TEXT
)
`);
// GET all internships with optional filter/search
app.get("/api/internships", (req, res) => {
  const { status, search } = req.query;

  let query = "SELECT * FROM internships WHERE 1=1";
  const params = [];

  if (status && status !== "All") {
    query += " AND status = ?";
    params.push(status);
  }

  if (search) {
    query += " AND (company LIKE ? OR role LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  query += " ORDER BY id DESC";

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
});
// POST a new internship
app.post("/api/internships", (req, res) => {
  const { company, role, status, location, notes, date_applied } = req.body;

  if (!company || !role || !status) {
    return res.status(400).json({
      error: "Company, role, and status are required."
    });
  }

  const sql = `
  INSERT INTO internships (company, role, status, location, notes, date_applied)
  VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [company, role, status, location, notes, date_applied],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        id: this.lastID,
        company,
        role,
        status,
        location,
        notes,
        date_applied
      });
    }
  );
});

// PUT update an internship
app.put("/api/internships/:id", (req, res) => {
  const { id } = req.params;
  const { company, role, status, location, notes, date_applied } = req.body;

  if (!company || !role || !status) {
    return res.status(400).json({
      error: "Company, role, and status are required."
    });
  }

  const sql = `
    UPDATE internships
    SET company = ?, role = ?, status = ?, location = ?, notes = ?, date_applied = ?
    WHERE id = ?
  `;

 db.run(
    sql,
    [company, role, status, location, notes, date_applied, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Internship not found." });
      }

      res.json({ message: "Internship updated successfully." });
    }
  );
});

// DELETE an internship
app.delete("/api/internships/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM internships WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Internship not found." });
    }

    res.json({ message: "Internship deleted successfully." });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});