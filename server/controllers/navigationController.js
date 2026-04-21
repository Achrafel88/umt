const pool = require('../config/db');

exports.getNavigation = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM navigation ORDER BY `order` ASC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createNavigationItem = async (req, res) => {
    const { title_ar, slug, type, linked_id, order } = req.body;
    try {
        const [result] = await pool.execute(
            'INSERT INTO navigation (title_ar, slug, type, linked_id, `order`) VALUES (?, ?, ?, ?, ?)',
            [title_ar, slug, type, linked_id || null, order || 0]
        );
        res.status(201).json({ id: result.insertId, title_ar, slug, type, linked_id, order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateNavigationItem = async (req, res) => {
    const { id } = req.params;
    const { title_ar, slug, type, linked_id, order } = req.body;
    try {
        await pool.execute(
            'UPDATE navigation SET title_ar = ?, slug = ?, type = ?, linked_id = ?, `order` = ? WHERE id = ?',
            [title_ar, slug, type, linked_id, order, id]
        );
        res.json({ message: 'Navigation item updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteNavigationItem = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM navigation WHERE id = ?', [id]);
        res.json({ message: 'Navigation item deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.reorderNavigation = async (req, res) => {
    const { items } = req.body; // Array of {id, order}
    try {
        for (const item of items) {
            await pool.execute('UPDATE navigation SET `order` = ? WHERE id = ?', [item.order, item.id]);
        }
        res.json({ message: 'Navigation reordered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
