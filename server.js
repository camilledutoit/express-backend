import express from "express";
import bodyParser from "body-parser";
import { initDB } from "./db.js";

const app = express();
app.use(bodyParser.json());

// Initialize the database
const db = initDB();

app.get("/", (req, res) => {
    res.json({ message: "Welcome to API Service" });
});

app.get("/users", (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ users: rows });
        }
    });
});

app.get("/users/:id", (req, res) => {
    const { id } = req.params;
    db.all("SELECT * FROM users WHERE id = ?", [id], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (rows.length === 0) {
            res.json({ user: {} });
        } else {
            res.json({ user: rows[0] });
        }
    });
});

app.get("/health", (req, res) => {
    res.status(200).json("Healthy!");
});

app.post("/users", (req, res) => {
    const {
        user: { username, password },
    } = req.body;
    const insertStmt = "INSERT INTO users(username, password) VALUES (?, ?)";
    db.run(insertStmt, [username, password], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({
                id: this.lastID,
                username,
                password,
            });
        }
    });
});

// Export the app for testing
export default app;

// Start the server only if not in test mode
if (process.env.NODE_ENV !== "test") {
    app.listen(4000, () => console.log("Simple server running on http://localhost:4000"));
}
