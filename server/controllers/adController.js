const pool = require('../config/db');

exports.getAds = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM advertisements WHERE is_active = TRUE');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllAds = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM advertisements');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createAd = async (req, res) => {
    const { title, link_url, position } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        const [result] = await pool.execute(
            'INSERT INTO advertisements (title, image_url, link_url, position) VALUES (?, ?, ?, ?)',
            [title, image_url, link_url, position]
        );
        res.status(201).json({ id: result.insertId, title, image_url, link_url, position });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateAd = async (req, res) => {
    const { id } = req.params;
    const { title, link_url, position, is_active } = req.body;
    let query = 'UPDATE advertisements SET title = ?, link_url = ?, position = ?, is_active = ?';
    const params = [title, link_url, position, is_active];

    if (req.file) {
        query += ', image_url = ?';
        params.push(`/uploads/${req.file.filename}`);
    }

    query += ' WHERE id = ?';
    params.push(id);

    try {
        await pool.execute(query, params);
        res.json({ message: 'Advertisement updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteAd = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM advertisements WHERE id = ?', [id]);
        res.json({ message: 'Advertisement deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
