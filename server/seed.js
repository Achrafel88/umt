const pool = require('./config/db');
const bcrypt = require('bcrypt');

const seed = async () => {
    try {
        console.log('Seeding...');
        
        // Admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await pool.execute(
            'INSERT IGNORE INTO users (username, password, role) VALUES (?, ?, ?)',
            ['admin', hashedPassword, 'admin_principal']
        );

        // Categories
        await pool.execute('INSERT IGNORE INTO categories (name_ar, slug) VALUES (?, ?)', ['أخبار وطنية', 'national-news']);
        await pool.execute('INSERT IGNORE INTO categories (name_ar, slug) VALUES (?, ?)', ['بلاغات', 'announcements']);

        // Cities
        await pool.execute('INSERT IGNORE INTO cities (name_ar) VALUES (?)', ['الدار البيضاء']);
        await pool.execute('INSERT IGNORE INTO cities (name_ar) VALUES (?)', ['الرباط']);

        // Authors
        await pool.execute('INSERT IGNORE INTO authors (name_ar) VALUES (?)', ['محمد بن علي']);

        // Navigation
        await pool.execute('INSERT IGNORE INTO navigation (title_ar, slug, type, `order`) VALUES (?, ?, ?, ?)', ['الرئيسية', '/', 'external', 1]);
        await pool.execute('INSERT IGNORE INTO navigation (title_ar, slug, type, `order`) VALUES (?, ?, ?, ?)', ['أخبار', 'national-news', 'category', 2]);

        console.log('Seeding complete.');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
