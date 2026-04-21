const pool = require('../config/db');

exports.getCategories = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM categories');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createCategory = async (req, res) => {
    const { name_ar, slug } = req.body;
    try {
        const [result] = await pool.execute(
            'INSERT INTO categories (name_ar, slug) VALUES (?, ?)',
            [name_ar, slug]
        );
        res.status(201).json({ id: result.insertId, name_ar, slug });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name_ar, slug } = req.body;
    try {
        await pool.execute(
            'UPDATE categories SET name_ar = ?, slug = ? WHERE id = ?',
            [name_ar, slug, id]
        );
        res.json({ message: 'Category updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM categories WHERE id = ?', [id]);
        res.json({ message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
