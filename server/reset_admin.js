const pool = require('./config/db');
const bcrypt = require('bcrypt');

const resetAdmin = async () => {
    try {
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Delete existing admin to be sure
        await pool.execute('DELETE FROM users WHERE username = ?', ['admin']);
        
        // Insert new admin
        await pool.execute(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            ['admin', hashedPassword, 'admin_principal']
        );
        
        console.log('✅ Admin password reset to: admin123');
        process.exit();
    } catch (err) {
        console.error('❌ Error resetting admin:', err.message);
        process.exit(1);
    }
};

resetAdmin();
