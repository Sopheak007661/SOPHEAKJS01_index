const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// --- YOUR MYSQL CONNECTION ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MySql@2026', // Your specific password
    database: 'project1psp', // Your specific database
    port: 3306
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL Database: project1psp');
});

// 1. GET ALL WORKERS
app.get('/workers', (req, res) => {
    db.query('SELECT * FROM workers ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// 2. ADD NEW WORKER
app.post('/workers', (req, res) => {
    const { name, dept } = req.body;
    const sql = 'INSERT INTO workers (name, dept) VALUES (?, ?)';
    db.query(sql, [name, dept], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ id: result.insertId, name, dept });
    });
});

// 3. DELETE WORKER
app.delete('/workers/:id', (req, res) => {
    const sql = 'DELETE FROM workers WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Worker deleted" });
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});