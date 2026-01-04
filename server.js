const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
  host: "localhost",
  user: "kent",      
  password: "user123",       
  database: "kentranier"  
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database!");
});

// ------------ GET ALL USERS ---------------
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ------------- GET USER BY ID -------------
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0] || { error: "User not found" });
  });
});

// -------------- GET ALL PRODUCTS ----------
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// --------------- GET PRODUCT BY ID --------
app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM products WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0] || { error: "Product not found" });
  });
});

// ---------------- ADD NEW USER -------------
app.post("/users", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Missing fields" });

  db.query("INSERT INTO users (name, email) VALUES (?, ?)", [name, email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: results.insertId, name, email });
  });
});

// ----------------- ADD NEW PRODUCTS -----------
app.post("/products", (req, res) => {
  const { product_name, price } = req.body;
  if (!product_name || !price) return res.status(400).json({ error: "Missing fields" });

  db.query("INSERT INTO products (product_name, price) VALUES (?, ?)", [product_name, price], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: results.insertId, product_name, price });
  });
});

// ----------------- UPDATE USERS -------------
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  db.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User updated" });
  });
});

// ------------------- UPDATE PRODUCTS --------------
app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { product_name, price } = req.body;

  db.query("UPDATE products SET product_name = ?, price = ? WHERE id = ?", [product_name, price, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Product updated" });
  });
});

// ------------------ DELETE USER ---------------
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User deleted" });
  });
});

// ------------------ DELETE PRODUCTS --------------
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM products WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Product deleted" });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
