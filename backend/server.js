
const express = require("express");
const orderRoutes = require("./routes/orders");
const cors = require("cors");
require("dotenv").config();

const db = require("./database/db");

const app = express();



app.use(cors());
app.use(express.json());
app.use("/api/orders", orderRoutes);

// Lidhja me regjistrimin dhe hyrjen
app.use("/api/auth", require("./routes/auth"));

// Lidhja me produktet
app.use("/api/products", require("./routes/products"));
console.log("PRODUCTS ROUTER U LIDH!");

// Kontrolli i serverit
app.get("/", (req, res) => {
    res.send("AutoParts KS Backend is running!");
});

// Kontrolli i databazes
app.get("/api/database", (req, res) => {
    const tables = db.prepare(
        "SELECT name FROM sqlite_master WHERE type = 'table'"
    ).all();

    res.json({
        message: "Database connected!",
        tables
    });
});

// Nisja e serverit
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
