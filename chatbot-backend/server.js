const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const db = new sqlite3.Database("chatbot.db", (err) => {
    if (err) console.error("Database connection error:", err.message);
    else console.log("Database connected.");
});

// Create tables
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (user_id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE)");
    db.run(`CREATE TABLE IF NOT EXISTS chat_history (
        chat_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        query TEXT,
        response TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    )`);
    db.run("CREATE TABLE IF NOT EXISTS cache (query TEXT PRIMARY KEY, response TEXT)");
});

// Predefined cache responses (related to a website)
const predefinedResponses = {
    "What is this website about?": "This website provides information about AI-powered chatbots.",
    "How can I use the chatbot?": "You can type your question, and the chatbot will respond instantly!",
    "What services do you offer?": "We offer AI chatbot solutions, API integration, and customer support automation.",
};

// Fill cache with predefined responses
for (const [query, response] of Object.entries(predefinedResponses)) {
    db.run("INSERT OR IGNORE INTO cache (query, response) VALUES (?, ?)", [query, response]);
}

// User sign-in
app.post("/signin", (req, res) => {
    const { username } = req.body;
    db.run("INSERT OR IGNORE INTO users (username) VALUES (?)", [username], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ user_id: this.lastID, message: "Signed in successfully!" });
    });
});

// Chatbot API (uses cache responses only)
app.post("/chatbot", (req, res) => {
    const { user_id, query } = req.body;

    db.get("SELECT response FROM cache WHERE query = ?", [query], (err, row) => {
        if (row) {
            saveChatHistory(user_id, query, row.response);
            return res.json({ response: row.response });
        }
        res.json({ response: "I am not sure how to answer that. Try asking something else!" });
    });
});

function saveChatHistory(user_id, query, response) {
    db.run("INSERT INTO chat_history (user_id, query, response) VALUES (?, ?, ?)", [user_id, query, response]);
}

// Fetch chat history
app.get("/history/:user_id", (req, res) => {
    db.all("SELECT * FROM chat_history WHERE user_id = ?", [req.params.user_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Basic recommendation system
app.get("/recommendations/:user_id", (req, res) => {
    db.get("SELECT query FROM chat_history WHERE user_id = ? ORDER BY timestamp DESC LIMIT 1", [req.params.user_id], (err, row) => {
        if (!row) return res.json({ recommendation: "Ask about our chatbot services!" });
        const lastQuery = row.query.toLowerCase();

        let recommendation = "Explore more about AI chatbots!";
        if (lastQuery.includes("chatbot")) recommendation = "Try asking about chatbot development!";
        else if (lastQuery.includes("services")) recommendation = "Want to know about our pricing?";

        res.json({ recommendation });
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));