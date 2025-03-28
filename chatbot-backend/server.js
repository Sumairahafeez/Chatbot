const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { exec } = require("child_process");

const app = express();
app.use(express.json());
app.use(require("cors")());

const db = new sqlite3.Database(":memory:"); // In-memory SQLite

// Create tables
db.serialize(() => {
    // Cache Table (Stores AI responses)
    db.run("CREATE TABLE cache (query TEXT PRIMARY KEY, response TEXT)");

    // Users Table (Stores customer info)
    db.run(`
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL
        )
    `);

    // Products Table (Stores product details)
    db.run(`
        CREATE TABLE products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            stock INTEGER NOT NULL
        )
    `);

    // Orders Table (Stores customer orders)
    db.run(`
        CREATE TABLE orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            status TEXT DEFAULT 'pending',
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        )
    `);

    // Chats Table (Optional: Stores user chatbot messages)
    db.run(`
        CREATE TABLE chats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            message TEXT NOT NULL,
            response TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);
});

// API endpoint for chatbot
app.post("/chatbot", (req, res) => {
    const { query, user_id } = req.body;

    // Check cache first
    db.get("SELECT response FROM cache WHERE query = ?", [query], (err, row) => {
        if (row) return res.json({ response: row.response });

        // If not in cache, call DeepSeek AI
        exec(`ollama run deepseek "${query}"`, (error, stdout) => {
            if (error) return res.status(500).json({ error: "AI Error" });

            db.run("INSERT INTO cache (query, response) VALUES (?, ?)", [query, stdout]);

            // Store chat history (optional)
            db.run("INSERT INTO chats (user_id, message, response) VALUES (?, ?, ?)", [user_id, query, stdout]);

            res.json({ response: stdout });
        });
    });
});

// API endpoint to get product list
app.get("/products", (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// API endpoint to place an order
app.post("/order", (req, res) => {
    const { user_id, product_id, quantity } = req.body;

    // Check stock
    db.get("SELECT stock FROM products WHERE id = ?", [product_id], (err, product) => {
        if (!product || product.stock < quantity) return res.status(400).json({ error: "Not enough stock" });

        // Place order
        db.run("INSERT INTO orders (user_id, product_id, quantity) VALUES (?, ?, ?)", [user_id, product_id, quantity]);

        // Update stock
        db.run("UPDATE products SET stock = stock - ? WHERE id = ?", [quantity, product_id]);

        res.json({ message: "Order placed successfully!" });
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));
