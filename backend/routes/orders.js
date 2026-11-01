
const express = require("express");
const db = require("../database/db");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// KRIJIMI I POROSISE
router.post("/", verifyToken, (req, res) => {
    try {
      const { items, payment_method } = req.body;

if (payment_method !== "cash_on_delivery") {
    return res.status(400).json({
        message: "Kjo mënyrë pagese nuk është ende aktive!"
    });
}

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Shporta është e zbrazët!"
            });
        }

        const createOrder = db.transaction(() => {
            let total = 0;
            const orderProducts = [];

            for (const item of items) {
                const productId = Number(item.product_id);
                const quantity = Number(item.quantity);

                if (
                    !Number.isInteger(productId) ||
                    !Number.isInteger(quantity) ||
                    productId <= 0 ||
                    quantity <= 0
                ) {
                    throw new Error("Të dhënat e produktit nuk janë të sakta!");
                }

                const product = db.prepare(
                    "SELECT id, name, price, stock FROM products WHERE id = ?"
                ).get(productId);

                if (!product) {
                    throw new Error("Një produkt nuk u gjet!");
                }

                if (product.stock < quantity) {
                    throw new Error(
                        `Stoku nuk mjafton për produktin: ${product.name}`
                    );
                }

                total += product.price * quantity;

                orderProducts.push({
                    product,
                    quantity
                });
            }

            const orderResult = db.prepare(`
    INSERT INTO orders (user_id, total, payment_method)
    VALUES (?, ?, ?)
`).run(
    req.user.id,
    total,
    payment_method
);

            const orderId = orderResult.lastInsertRowid;

            const insertItem = db.prepare(`
                INSERT INTO order_items
                (order_id, product_id, quantity, unit_price)
                VALUES (?, ?, ?, ?)
            `);

            const updateStock = db.prepare(`
                UPDATE products
                SET stock = stock - ?
                WHERE id = ?
            `);

            for (const item of orderProducts) {
                insertItem.run(
                    orderId,
                    item.product.id,
                    item.quantity,
                    item.product.price
                );

                updateStock.run(
                    item.quantity,
                    item.product.id
                );
            }

            return { orderId, total };
        });

        const result = createOrder();

        res.status(201).json({
            message: "Porosia u regjistrua me sukses!",
            orderId: result.orderId,
            total: result.total
        });

    } catch (error) {
        console.error(error);

        res.status(400).json({
            message: error.message || "Gabim gjatë porosisë!"
        });
    }
});

// HISTORIKU I POROSIVE
router.get("/my", verifyToken, (req, res) => {
    try {
        const orders = db.prepare(`
            SELECT id, total, status, payment_method, created_at
            FROM orders
            WHERE user_id = ?
            ORDER BY id DESC
        `).all(req.user.id);

        const getItems = db.prepare(`
            SELECT
                order_items.quantity,
                order_items.unit_price,
                products.name,
                products.image_url
            FROM order_items
            JOIN products
                ON products.id = order_items.product_id
            WHERE order_items.order_id = ?
        `);

        const result = orders.map(order => ({
            ...order,
            items: getItems.all(order.id)
        }));

        res.json(result);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Gabim gjatë marrjes së historikut!"
        });
    }
});

module.exports = router;
