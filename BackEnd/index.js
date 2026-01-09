import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
const PORT = 5000;
const JWT_SECRET = "secretkey";

app.use(cors());
app.use(express.json());

/* ------------------ MYSQL POOL ------------------ */
const pool = mysql.createPool({
  host: "3.110.238.118",
  user: "zenkara",              // ✅ your MySQL username
  password: "Zenkara@123", // your MySQL password
  database: "SampleProject",
  port: 3306,                // ✅ this is the port
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/* ------------------ DB TEST ------------------ */
app.get("/api/db-test", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error" });
  }
});

/* =================================================
   USER AUTH
================================================= */

/* ---- User Signup ---- */
app.post("/api/users/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashed]
    );

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ message: "Signup failed" });
  }
});

/* ---- User Login ---- */
app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email=?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: rows[0].id, role: "USER" },
      JWT_SECRET
    );

    // ✅ FIXED res.json
    res.json({
      token,
      role: "USER",
      user: {
        id: rows[0].id,
        name: rows[0].name,
        email: rows[0].email
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});


/* =================================================
   ADMIN AUTH
================================================= */

/* ---- Admin Login ---- */
app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM admins WHERE email=?",
      [email]
    );

    if (rows.length === 0)
      return res.status(400).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: rows[0].id, role: "ADMIN" },
      JWT_SECRET
    );

    res.json({ token, role: "ADMIN" });
  } catch (err) {
    res.status(500).json({ message: "Admin login failed" });
  }
});

/* =================================================
   AUTH MIDDLEWARE
================================================= */
const verifyToken = (roles) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (!roles.includes(decoded.role))
        return res.status(403).json({ message: "Access denied" });

      req.user = decoded;
      next();
    } catch {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};

/* =================================================
   PRODUCTS CRUD
================================================= */

/* ---- Get All Products (User + Admin) ---- */
app.get("/api/products", verifyToken(["USER", "ADMIN"]), async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM products");
  res.json(rows);
});

/* ---- Add Product (Admin) ---- */
app.post("/api/products", verifyToken(["ADMIN"]), async (req, res) => {
  const { name, quantity, mrp, photo_url } = req.body;

  await pool.query(
    "INSERT INTO products (name, quantity, mrp, photo_url) VALUES (?, ?, ?, ?)",
    [name, quantity, mrp, photo_url]
  );

  res.status(201).json({ message: "Product added" });
});

/* ---- Update Product (Admin) ---- */
app.put("/api/products/:id", verifyToken(["ADMIN"]), async (req, res) => {
  const { id } = req.params;
  const { name, quantity, mrp, photo_url } = req.body;

  await pool.query(
    "UPDATE products SET name=?, quantity=?, mrp=?, photo_url=? WHERE id=?",
    [name, quantity, mrp, photo_url, id]
  );

  res.json({ message: "Product updated" });
});

/* ---- Delete Product (Admin) ---- */
app.delete("/api/products/:id", verifyToken(["ADMIN"]), async (req, res) => {
  await pool.query("DELETE FROM products WHERE id=?", [req.params.id]);
  res.json({ message: "Product deleted" });
});

/* ------------------ SERVER ------------------ */
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});