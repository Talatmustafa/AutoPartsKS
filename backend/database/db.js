
const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(
    path.join(__dirname, "autoparts.db")
);

db.pragma("foreign_keys = ON");

// Tabela e klientëve
db.exec(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

// Tabela e produkteve
db.exec(`
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    stock INTEGER DEFAULT 0,
    image_url TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

// Tabela e porosive
db.exec(`
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
`);

// Produktet brenda porosive
db.exec(`
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
`);

// Shtimi i mënyrës së pagesës në porosi
const orderColumns = db.prepare(
    "PRAGMA table_info(orders)"
).all();

if (!orderColumns.some(column => column.name === "payment_method")) {
    db.exec(`
        ALTER TABLE orders
        ADD COLUMN payment_method TEXT DEFAULT 'cash_on_delivery'
    `);
}

console.log("AutoParts KS Database is ready!");

module.exports = db;
