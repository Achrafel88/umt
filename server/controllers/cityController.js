const pool = require('../config/db');

exports.getCities = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM cities');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createCity = async (req, res) => {
    const { name_ar } = req.body;
    try {
        const [result] = await pool.execute(
            'INSERT INTO cities (name_ar) VALUES (?)',
            [name_ar]
        );
        res.status(201).json({ id: result.insertId, name_ar });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCity = async (req, res) => {
    const { id } = req.params;
    const { name_ar } = req.body;
    try {
        await pool.execute(
            'UPDATE cities SET name_ar = ? WHERE id = ?',
            [name_ar, id]
        );
        res.json({ message: 'City updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCity = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM cities WHERE id = ?', [id]);
        res.json({ message: 'City deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
