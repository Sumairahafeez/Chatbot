const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();
const natural = require('natural');
app.use(express.json());
app.use(cors());
const stemmer = natural.PorterStemmer;
const getRootWord = (query) => {
    return stemmer.stem(query.toLowerCase());
};
const db = new sqlite3.Database("chatbot.db", (err) => {
    if (err) console.error("Database connection error:", err.message);
    else console.log("Database connected.");
});

// Create tables
db.serialize(() => {
    // db.run("DROP TABLE IF EXISTS cache")
    db.run("CREATE TABLE IF NOT EXISTS users (user_id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)");
    db.run(`CREATE TABLE IF NOT EXISTS chat_history (
        chat_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        query TEXT,
        response TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    )`);
    db.run("CREATE TABLE IF NOT EXISTS cache (query TEXT PRIMARY KEY, response TEXT, stemmed_query TEXT)");
});

const predefinedResponses = {
    "What is this website about": "This website provides information about AI-powered chatbots.",
    "How can I use the chatbot": "You can type your question, and the chatbot will respond instantly!",
    "What services do you offer": "We offer AI chatbot solutions, API integration, and customer support automation.",
    "What is artificial intelligence": "Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think and learn like humans.",
    "Can I integrate the chatbot into my website": "Yes, we offer integration services to easily embed our chatbot into your website or app.",
    "What is NLP": "Natural Language Processing (NLP) is a field of AI that focuses on the interaction between computers and humans through natural language.",
    "How does the chatbot work": "Our chatbot uses AI and NLP techniques to understand and respond to your queries in real-time.",
    "Is the chatbot customizable": "Yes, the chatbot can be customized to meet your specific business needs, including personalized responses and integration with your services.",
    "What are the benefits of using a chatbot": "Chatbots can enhance customer support, improve engagement, reduce operational costs, and provide 24/7 availability.",
    "How secure is the chatbot": "Our chatbot is designed with security in mind, and we follow best practices to ensure the privacy and safety of your data.",
    "Can the chatbot handle multiple languages": "Yes, our chatbot supports multiple languages and can be trained to understand different language patterns.",
    "Do you provide analytics for chatbot interactions": "Yes, we offer detailed analytics on chatbot performance, including user interactions, response times, and common queries.",
    "What industries do you serve": "We provide chatbot solutions for various industries, including e-commerce, healthcare, finance, education, and customer service.",
    "How can I contact support": "You can contact our support team by sending an email to support@chatbot.com or through the contact form on our website.",
    "Is there a trial version of the chatbot": "Yes, we offer a free trial of our chatbot service. Feel free to try it out and see how it works for your business.",
    "How do I get started with the chatbot": "To get started, simply sign up on our platform, and our team will guide you through the setup process."
};


// Fill cache with predefined responses
for (const [query, response] of Object.entries(predefinedResponses)) {
    let stem = getRootWord(query);
    console.log("Inserting into cache:", { query, response, stem });
    db.run("INSERT OR REPLACE INTO cache (query, response, stemmed_query) VALUES (?, ?, ?)", 
        [query, response, stem], (err) => {
            if (err) {
                console.error("Error inserting into cache:", err);
            } else {
                console.log('Inserting into cache:', { query, response, stem });
            }
    });
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

// Predefined response route (uses cache responses only)
app.post("/chatbot", (req, res) => {
    console.log("Received chat request:", req.body);
    const { user_id, query } = req.body;

    // Stem the incoming user query
    const rootQuery = getRootWord(query);

    // Check if the stemmed query exists in the database
    db.get("SELECT response FROM cache WHERE stemmed_query = ?", [rootQuery], (err, row) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ response: 'Internal server error' });
        }

        if (row) {
            // Save chat history in the database (optional, based on your requirements)
            saveChatHistory(user_id, query, row.response);

            console.log("Cache hit:", row.response);
            return res.json({ response: row.response });
        } else {
            console.log("Cache miss for query:", query);
            return res.json({ response: "I am not sure how to answer that. Try asking something else!" });
        }
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

// Advanced recommendation system
app.get("/recommendations/:user_id", (req, res) => {
    console.log("Fetching recommendations for user:", req.params.user_id);

    // Fetch the user's last 5 queries (or more if needed)
    db.all("SELECT query FROM chat_history WHERE user_id = ? ORDER BY timestamp DESC LIMIT 5", [req.params.user_id], (err, rows) => {
        if (err) {
            console.error("Error fetching query history:", err);
            return res.status(500).json({ error: "Failed to fetch recommendations" });
        }

        // If no history, return a default recommendation
        if (rows.length === 0) {
            return res.json({ recommendation: "Ask about our chatbot services!" });
        }

        // Analyze the query history
        let queryHistory = rows.map(row => row.query.toLowerCase());
        let recommendation = "Explore more about AI chatbots!";
        
        // Define keywords for categorization
        const categories = {
            chatbot: ["chatbot", "development", "bot", "AI chatbot"],
            services: ["services", "pricing", "features", "plan"],
            technology: ["technology", "AI", "machine learning", "artificial intelligence"],
            support: ["support", "help", "assistance", "customer service"]
        };

        // Check if any of the previous queries match a category and provide recommendations
        for (let category in categories) {
            const categoryKeywords = categories[category];
            for (let keyword of categoryKeywords) {
                if (queryHistory.some(query => query.includes(keyword))) {
                    if (category === "chatbot") {
                        recommendation = "Try asking about chatbot development!";
                    } else if (category === "services") {
                        recommendation = "Want to know about our pricing?";
                    } else if (category === "technology") {
                        recommendation = "Explore more about machine learning and AI!";
                    } else if (category === "support") {
                        recommendation = "Need assistance? Ask about customer support!";
                    }
                    break;
                }
            }
            if (recommendation !== "Explore more about AI chatbots!") break; // Stop if a match is found
        }

        // Return the recommendation
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