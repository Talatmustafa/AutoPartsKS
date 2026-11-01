
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/db");

const router = express.Router();

// REGJISTRIMI
router.post("/register", async (req, res) => {
    try {
        const { full_name, email, password } = req.body;

        if (!full_name || !email || !password) {
            return res.status(400).json({
                message: "Plotëso të gjitha fushat!"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Fjalëkalimi duhet të ketë së paku 8 karaktere!"
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        const existingUser = db.prepare(
            "SELECT id FROM users WHERE email = ?"
        ).get(cleanEmail);

        if (existingUser) {
            return res.status(409).json({
                message: "Ky email është regjistruar më parë!"
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const result = db.prepare(`
            INSERT INTO users (full_name, email, password_hash)
            VALUES (?, ?, ?)
        `).run(full_name.trim(), cleanEmail, passwordHash);

        res.status(201).json({
            message: "Llogaria u krijua me sukses!",
            userId: result.lastInsertRowid
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Gabim gjatë regjistrimit!"
        });
    }
});

// HYRJA NË LLOGARI
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Shkruaj email dhe fjalëkalimin!"
            });
        }

        const user = db.prepare(
            "SELECT * FROM users WHERE email = ?"
        ).get(email.trim().toLowerCase());

        if (!user) {
            return res.status(401).json({
                message: "Email ose fjalëkalim i pasaktë!"
            });
        }

        const validPassword = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!validPassword) {
            return res.status(401).json({
                message: "Email ose fjalëkalim i pasaktë!"
            });
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Hyrja u krye me sukses!",
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Gabim gjatë hyrjes!"
        });
    }
});

module.exports = router;
