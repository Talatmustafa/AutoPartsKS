
const express = require("express");
const db = require("../database/db");

const router = express.Router();
console.log("PRODUCTS.JS U NGARKUA!");

// Shfaq të gjitha produktet
router.get("/", (req, res) => {
    try {
        const { category, search, sort } = req.query;

        let sql = `
            SELECT * FROM products
            WHERE stock >= 0
        `;

        const params = [];

        if (category) {
            sql += " AND category = ?";
            params.push(category);
        }

        if (search) {
            sql += " AND (name LIKE ? OR description LIKE ?)";
            params.push(`%${search}%`, `%${search}%`);
        }

        if (sort === "low") {
            sql += " ORDER BY price ASC";
        } else if (sort === "high") {
            sql += " ORDER BY price DESC";
        } else {
            sql += " ORDER BY id DESC";
        }

        const products = db.prepare(sql).all(...params);

        res.json(products);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Nuk mund të shfaqen produktet."
        });
    }
});

// Shfaq një produkt sipas ID-së
router.get("/:id", (req, res) => {
    const product = db.prepare(
        "SELECT * FROM products WHERE id = ?"
    ).get(req.params.id);

    if (!product) {
        return res.status(404).json({
            message: "Produkti nuk u gjet."
        });
    }

    res.json(product);
});

module.exports = router;
