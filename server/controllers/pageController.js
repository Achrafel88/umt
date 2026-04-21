const pool = require('../config/db');

exports.getPages = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM pages ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPageBySlug = async (req, res) => {
    const { slug } = req.params;
    try {
        const [rows] = await pool.execute('SELECT * FROM pages WHERE slug = ?', [slug]);
        if (rows.length === 0) return res.status(404).json({ message: 'Page not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createPage = async (req, res) => {
    const { title_ar, slug, content } = req.body;
    try {
        const [result] = await pool.execute(
            'INSERT INTO pages (title_ar, slug, content) VALUES (?, ?, ?)',
            [title_ar, slug, content]
        );
        res.status(201).json({ id: result.insertId, title_ar, slug, content });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updatePage = async (req, res) => {
    const { id } = req.params;
    const { title_ar, slug, content } = req.body;
    try {
        await pool.execute(
            'UPDATE pages SET title_ar = ?, slug = ?, content = ? WHERE id = ?',
            [title_ar, slug, content, id]
        );
        res.json({ message: 'Page updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deletePage = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM pages WHERE id = ?', [id]);
        res.json({ message: 'Page deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
