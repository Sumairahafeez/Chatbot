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
    db.run("CREATE TABLE IF NOT EXISTS users (user_id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)");
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
    "What is this website about": "This website provides information about AI-powered chatbots.",
    "How can I use the chatbot": "You can type your question, and the chatbot will respond instantly!",
    "What services do you offer": "We offer AI chatbot solutions, API integration, and customer support automation.",
};

// Fill cache with predefined responses
for (const [query, response] of Object.entries(predefinedResponses)) {
    db.run("INSERT OR IGNORE INTO cache (query, response) VALUES (?, ?)", [query, response]);
}

app.post("/signin", (req, res) => {
    console.log("Received sign-in request:", req.body);
    if (!req.body.username || !req.body.password) { 
        return res.status(400).json({ error: "Username and password are required!" });
    }
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(401).json({ error: "Invalid credentials!" });
        else console.log("User found:", row);
        res.json({ user_id: row.user_id, message: "Sign-in successful!" });
    });
});

// Chatbot API (uses cache responses only)
app.post("/chatbot", (req, res) => {
    console.log("Received chat request:", req.body);
    const { user_id,query } = req.body;

    db.get("SELECT response FROM cache WHERE query = ?", [query], (err, row) => {
        if (row) {
            saveChatHistory(user_id, query, row.response);
            console.log("Cache hit:", row.response);
            return res.json({ response: row.response });
        }
        console.log("Cache miss for query:", query);
        res.json({ response: "I am not sure how to answer that. Try asking something else!" });
    });
});

function saveChatHistory(user_id, query, response) {
    db.run("INSERT INTO chat_history (user_id, query, response) VALUES (?, ?, ?)", [user_id, query, response]);
    console.log("Chat history saved:", { user_id, query, response });
}

// Fetch chat history
app.get("/history/:user_id", (req, res) => {
    console.log("Fetching chat history for user:", req.params.user_id);
    db.all("SELECT * FROM chat_history WHERE user_id = ?", [req.params.user_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
        console.log("Chat history fetched:", rows);
    });
});

// Basic recommendation system
app.get("/recommendations/:user_id", (req, res) => {
    console.log("Fetching recommendations for user:", req.params.user_id);
    db.get("SELECT query FROM chat_history WHERE user_id = ? ORDER BY timestamp DESC LIMIT 1", [req.params.user_id], (err, row) => {
        if (!row) return res.json({ recommendation: "Ask about our chatbot services!" });
        const lastQuery = row.query.toLowerCase();

        let recommendation = "Explore more about AI chatbots!";
        if (lastQuery.includes("chatbot")) recommendation = "Try asking about chatbot development!";
        else if (lastQuery.includes("services")) recommendation = "Want to know about our pricing?";

        res.json({ recommendation });
    });
});
app.post("/signup", (req, res) => {
    console.log("Received signup request:", req.body);
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ error: "Username and password are required!" });
    }
    const { username, password } = req.body;

    console.log("Inserting into database:", { username, password });

    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], function (err) {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ user_id: this.lastID, message: "User created successfully!" });
    });
});
app.delete("/history/:user_id/:chat_id", (req, res) => {
    console.log("Deleting chat history item:", req.params.chat_id," of ",req.params.user_id);
    if (!req.params.chat_id || !req.params.user_id) {
        return res.status(400).json({ error: "Chat ID and User ID are required!" });
    }
    db.run("DELETE FROM chat_history WHERE chat_id = ? AND user_id = ?", [req.params.chat_id, req.params.user_id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Chat history item not found!" });
        res.json({ message: "Chat history item deleted successfully!" });
        console.log("Deleted chat history item:", req.params.chat_id);
    });
});
app.delete("/cache", (req, res) => {
    console.log("Clearing cache");
    db.run("DELETE FROM cache", function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Cache cleared successfully!" });
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));