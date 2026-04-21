const pool = require('../config/db');
const bcrypt = require('bcrypt');

exports.getUsers = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT id, username, role, created_at FROM users ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        
        console.log('Attempting to create user:', { username, role });

        if (!username || !password) {
            return res.status(400).json({ message: 'اسم المستخدم وكلمة المرور مطلوبان' });
        }

        // Check if user exists
        const [existing] = await pool.execute('SELECT id FROM users WHERE username = ?', [username]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'اسم المستخدم موجود مسبقاً' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const finalRole = role || 'admin_secondaire';
        
        await pool.execute(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, finalRole]
        );
        
        console.log('User created successfully:', username);
        res.status(201).json({ message: 'تم إنشاء المستخدم بنجاح' });
    } catch (err) {
        console.error('Error in createUser:', err);
        res.status(500).json({ message: 'فشل في إنشاء المستخدم: ' + err.message });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, password, role } = req.body;
    try {
        let query = 'UPDATE users SET username = ?, role = ?';
        let params = [username, role];

        if (password && password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += ', password = ?';
            params.push(hashedPassword);
        }

        query += ' WHERE id = ?';
        params.push(id);

        await pool.execute(query, params);
        res.json({ message: 'تم تحديث المستخدم بنجاح' });
    } catch (err) {
        res.status(500).json({ message: 'فشل التحديث: ' + err.message });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const [user] = await pool.execute('SELECT role FROM users WHERE id = ?', [id]);
        if (user.length === 0) return res.status(404).json({ message: 'المستخدم غير موجود' });
        if (user[0].role === 'admin_principal') return res.status(403).json({ message: 'لا يمكن حذف الأدمن الرئيسي' });

        await pool.execute('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'تم حذف المستخدم بنجاح' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
