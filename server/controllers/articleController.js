const pool = require('../config/db');

exports.getArticles = async (req, res) => {
    const { category, city, status, search } = req.query;
    let query = `
        SELECT a.*, c.name_ar as category_name, ci.name_ar as city_name, au.name_ar as author_name, u.username as validator_name
        FROM articles a
        LEFT JOIN categories c ON a.category_id = c.id
        LEFT JOIN cities ci ON a.city_id = ci.id
        LEFT JOIN authors au ON a.author_id = au.id
        LEFT JOIN users u ON a.validator_id = u.id
        WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'all') {
        query += ' AND a.status = ?';
        params.push(status);
    } else if (!status) {
        query += ' AND a.status = "published"';
    }

    if (category) {
        // Handle both ID (from dashboard) and Slug (from public site)
        if (!isNaN(category) && category.trim() !== '') {
            query += ' AND a.category_id = ?';
        } else {
            query += ' AND c.slug = ?';
        }
        params.push(category);
    }
    if (city) {
        // Handle both ID (from dashboard) and Name (from public site)
        if (!isNaN(city) && city.trim() !== '') {
            query += ' AND a.city_id = ?';
        } else {
            query += ' AND ci.name_ar = ?';
        }
        params.push(city);
    }
    if (search) {
        query += ' AND (a.title LIKE ? OR a.content LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY a.created_at DESC';

    try {
        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createArticle = async (req, res) => {
    const { title, content, category_id, city_id, author_id } = req.body;
    const real_author_id = req.user.id;
    const files = req.files || {};
    const image_url = files.image ? `/uploads/${files.image[0].filename}` : null;
    const video_url = files.video ? `/uploads/${files.video[0].filename}` : null;
    const pdf_url = files.pdf ? `/uploads/${files.pdf[0].filename}` : null;
    const audio_url = files.audio ? `/uploads/${files.audio[0].filename}` : null;

    try {
        const [result] = await pool.execute(
            'INSERT INTO articles (title, content, category_id, city_id, author_id, real_author_id, image_url, video_url, pdf_url, audio_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [title, content, category_id, city_id, author_id, real_author_id, image_url, video_url, pdf_url, audio_url, 'pending']
        );
        res.status(201).json({ id: result.insertId, message: 'Article created and pending validation' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateArticle = async (req, res) => {
    const { id } = req.params;
    const { title, content, category_id, city_id, author_id } = req.body;
    const files = req.files || {};

    try {
        let query = 'UPDATE articles SET title = ?, content = ?, category_id = ?, city_id = ?, author_id = ?';
        let params = [title, content, category_id, city_id, author_id];

        if (files.image) { query += ', image_url = ?'; params.push(`/uploads/${files.image[0].filename}`); }
        if (files.video) { query += ', video_url = ?'; params.push(`/uploads/${files.video[0].filename}`); }
        if (files.pdf) { query += ', pdf_url = ?'; params.push(`/uploads/${files.pdf[0].filename}`); }
        if (files.audio) { query += ', audio_url = ?'; params.push(`/uploads/${files.audio[0].filename}`); }

        query += ' WHERE id = ?';
        params.push(id);

        await pool.execute(query, params);
        res.json({ message: 'Article updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteArticle = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM articles WHERE id = ?', [id]);
        res.json({ message: 'Article deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.validateArticle = async (req, res) => {
    const { id } = req.params;
    const validator_id = req.user.id;
    try {
        await pool.execute('UPDATE articles SET status = "published", validator_id = ? WHERE id = ?', [validator_id, id]);
        res.json({ message: 'Article validated and published' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM categories');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCities = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM cities');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAuthors = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM authors');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
