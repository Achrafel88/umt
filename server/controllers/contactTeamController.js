const pool = require('../config/db');

exports.getTeamMembers = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM contact_team ORDER BY created_at ASC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addTeamMember = async (req, res) => {
    const { name, role, facebook } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        const [result] = await pool.execute(
            'INSERT INTO contact_team (name, role, facebook, image_url) VALUES (?, ?, ?, ?)',
            [name, role, facebook, image_url]
        );
        res.status(201).json({ id: result.insertId, name, role, facebook, image_url });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteTeamMember = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM contact_team WHERE id = ?', [id]);
        res.json({ message: 'Member deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
