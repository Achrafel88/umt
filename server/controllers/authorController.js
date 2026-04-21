const pool = require('../config/db');

exports.getAuthors = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM authors');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createAuthor = async (req, res) => {
    const { name_ar } = req.body;
    try {
        const [result] = await pool.execute(
            'INSERT INTO authors (name_ar) VALUES (?)',
            [name_ar]
        );
        res.status(201).json({ id: result.insertId, name_ar });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateAuthor = async (req, res) => {
    const { id } = req.params;
    const { name_ar } = req.body;
    try {
        await pool.execute(
            'UPDATE authors SET name_ar = ? WHERE id = ?',
            [name_ar, id]
        );
        res.json({ message: 'Author updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteAuthor = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM authors WHERE id = ?', [id]);
        res.json({ message: 'Author deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
