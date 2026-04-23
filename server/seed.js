const pool = require('./config/db');
const bcrypt = require('bcrypt');

const seed = async () => {
    try {
        console.log('Seeding data...');
        
        // 1. Admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await pool.execute(
            'INSERT IGNORE INTO users (username, password, role) VALUES (?, ?, ?)',
            ['admin', hashedPassword, 'admin_principal']
        );

        // 2. Categories
        const categories = [
            ['بلاغات ومواقف', 'announcements'],
            ['أخبار وأنشطة', 'news'],
            ['ملفات', 'files'],
            ['الإعلام والتواصل', 'media'],
            ['القوانين والنصوص التنظيمية', 'laws']
        ];
        for (const [name, slug] of categories) {
            await pool.execute('INSERT IGNORE INTO categories (name_ar, slug) VALUES (?, ?)', [name, slug]);
        }

        // 3. Cities
        const cities = ['الدار البيضاء', 'الرباط', 'طنجة', 'مراكش', 'أكادير', 'فاس'];
        for (const city of cities) {
            await pool.execute('INSERT IGNORE INTO cities (name_ar) VALUES (?)', [city]);
        }

        // 4. Authors / Union Offices
        const authors = ['الأمانة الوطنية', 'المكتب التنفيذي', 'الاتحاد المحلي'];
        for (const author of authors) {
            await pool.execute('INSERT IGNORE INTO authors (name_ar) VALUES (?)', [author]);
        }

        // 5. Pages
        const pages = [
            ['عن النقابة', 'about', '<p>الاتحاد المغربي للشغل (UMT) هو أول منظمة نقابية مغربية...</p>'],
            ['الانخراط', 'membership', '<p>كيفية الانخراط في الاتحاد المغربي للشغل...</p>']
        ];
        for (const [title, slug, content] of pages) {
            await pool.execute('INSERT IGNORE INTO pages (title_ar, slug, content) VALUES (?, ?, ?)', [title, slug, content]);
        }

        // 6. Navigation
        // Clear old nav to avoid duplicates if re-running
        await pool.execute('DELETE FROM navigation');
        const navItems = [
            ['بلاغات ومواقف', 'announcements', 'category', 1],
            ['أخبار وأنشطة', 'news', 'category', 2],
            ['ملفات', 'files', 'category', 3],
            ['الانخراط', 'membership', 'page', 4],
            ['الإعلام والتواصل', 'media', 'category', 5],
            ['القوانين والنصوص التنظيمية', 'laws', 'category', 6],
            ['عن النقابة', 'about', 'page', 7]
        ];
        for (const [title, slug, type, order] of navItems) {
            await pool.execute('INSERT INTO navigation (title_ar, slug, type, `order`) VALUES (?, ?, ?, ?)', [title, slug, type, order]);
        }

        console.log('✅ Seeding complete.');
        process.exit();
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
};

seed();
