const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MySql@2026',
    database: 'project1psp',
    port: 3306
});

db.connect(err => {
    if (err) { console.error('DB connection failed:', err.stack); return; }
    console.log('Connected to MySQL: project1psp');

    // Auto-add status column if missing
    db.query(`SHOW COLUMNS FROM workers LIKE 'status'`, (err, rows) => {
    if (err) { console.warn('Could not check columns:', err.message); return; }
    if (rows.length === 0) {
        // Column doesn't exist yet, add it
        db.query(`ALTER TABLE workers ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'Active'`, err => {
            if (err) console.warn('Could not add status column:', err.message);
            else console.log('status column added successfully.');
        });
    } else {
        console.log('status column already exists.');
    }
});
});

// 1. GET ALL
app.get('/workers', (req, res) => {
    db.query('SELECT * FROM workers ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// 2. ADD
app.post('/workers', (req, res) => {
    const { name, dept, status = 'Active' } = req.body;
    if (!name || !dept) return res.status(400).json({ error: 'name and dept required' });
    db.query('INSERT INTO workers (name, dept, status) VALUES (?, ?, ?)', [name, dept, status], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ id: result.insertId, name, dept, status });
    });
});

// 3. UPDATE FULL (name, dept, status)
app.put('/workers/:id', (req, res) => {
    const { name, dept, status } = req.body;
    if (!name || !dept) return res.status(400).json({ error: 'name and dept required' });
    db.query('UPDATE workers SET name=?, dept=?, status=? WHERE id=?',
        [name, dept, status || 'Active', req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
        res.json({ id: req.params.id, name, dept, status });
    });
});

// 4. PATCH STATUS ONLY
app.patch('/workers/:id/status', (req, res) => {
    const { status } = req.body;
    const allowed = ['Active', 'On Break', 'Off Duty'];
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    db.query('UPDATE workers SET status=? WHERE id=?', [status, req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
        res.json({ id: req.params.id, status });
    });
});

// 5. DELETE
app.delete('/workers/:id', (req, res) => {
    db.query('DELETE FROM workers WHERE id=?', [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Deleted' });
    });
});

app.listen(3000, () => console.log('Server → http://localhost:3000'));