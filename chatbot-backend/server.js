const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { exec } = require("child_process");

const app = express();
app.use(express.json());
app.use(require("cors")());

// ✅ In-memory SQLite database (not persistent)
const db = new sqlite3.Database(":memory:", (err) => {
    if (err) console.error("❌ Database connection error:", err.message);
    else console.log("✅ In-memory database connected.");
});

// ✅ Create tables
db.serialize(() => {
    db.run("CREATE TABLE users (user_id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT)");
    db.run(`CREATE TABLE chat_history (
        chat_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        query TEXT,
        response TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    )`);
    db.run("CREATE TABLE cache (query TEXT PRIMARY KEY, response TEXT)");
});

// ✅ Chatbot API - Uses cache first, AI if needed
app.post("/chatbot", (req, res) => {
    const { user_id, query } = req.body;

    // 🔍 Check cache first
    db.get("SELECT response FROM cache WHERE query = ?", [query], (err, row) => {
        if (row) {
            saveChatHistory(user_id, query, row.response);
            return res.json({ response: row.response });
        }

        // 🤖 If not in cache, call AI
        exec(`ollama run gemma:2b "${query}"`, (error, stdout) => {
            if (error) return res.status(500).json({ error: "AI Error" });

            // 💾 Store response in cache
            db.run("INSERT INTO cache (query, response) VALUES (?, ?)", [query, stdout]);

            // 💾 Save chat history
            saveChatHistory(user_id, query, stdout);

            res.json({ response: stdout });
        });
    });
});

function saveChatHistory(user_id, query, response) {
    db.run(
        "INSERT INTO chat_history (user_id, query, response) VALUES (?, ?, ?)",
        [user_id, query, response],
        (err) => {
            if (err) console.error("❌ Error saving chat:", err.message);
        }
    );
}

app.get("/history/:user_id", (req, res) => {
    const user_id = req.params.user_id;
    db.all("SELECT * FROM chat_history WHERE user_id = ?", [user_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
