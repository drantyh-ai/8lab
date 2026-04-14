const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.json());

// Підключення до твоєї бази SQLite
const db = new sqlite3.Database('./mobilka.db', (err) => {
    if (err) console.error('Помилка підключення:', err.message);
    else console.log('Підключено до бази даних SQLite!');
});

// GET - отримати всіх абонентів (замість курсів)
app.get('/subscribers', (req, res) => {
    db.all('SELECT * FROM subscribers', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// POST - додати нового абонента (замість студента)
app.post('/subscribers', (req, res) => {
    const { first_name, last_name, phone_number } = req.body;
    db.run('INSERT INTO subscribers (first_name, last_name, phone_number) VALUES (?, ?, ?)',
        [first_name, last_name, phone_number], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Абонента додано', id: this.lastID });
        });
});

// PUT - оновити абонента
app.put('/subscribers/:id', (req, res) => {
    const { first_name, last_name } = req.body;
    const { id } = req.params;
    db.run('UPDATE subscribers SET first_name=?, last_name=? WHERE subscriber_id=?',
        [first_name, last_name, id], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Дані абонента оновлено' });
        });
});

// DELETE - видалити абонента
app.delete('/subscribers/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM subscribers WHERE subscriber_id=?', id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Абонента видалено' });
    });
});

// Запуск сервера
app.listen(3000, () => console.log('Сервер запущено на порту 3000'));