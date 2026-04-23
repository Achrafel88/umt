const pool = require('./config/db');

const updateNavAndCats = async () => {
    try {
        console.log('Updating Categories and Navigation...');

        // 1. Clear existing categories and navigation
        await pool.query('SET FOREIGN_KEY_CHECKS = 0');
        await pool.query('DELETE FROM navigation');
        await pool.query('DELETE FROM categories');
        await pool.query('DELETE FROM pages');
        await pool.query('DELETE FROM articles'); // Clear articles as well to avoid broken links
        await pool.query('SET FOREIGN_KEY_CHECKS = 1');

        // 2. Insert Categories
        const categories = [
            ['بلاغات ومواقف', 'announcements'],
            ['أخبار وأنشطة', 'news'],
            ['ملفات', 'files'],
            ['الانخراط', 'membership'],
            ['الإعلام والتواصل', 'media'],
            ['القوانين والنصوص التنظيمية', 'laws']
        ];

        for (const [name, slug] of categories) {
            await pool.execute('INSERT INTO categories (name_ar, slug) VALUES (?, ?)', [name, slug]);
        }

        // 3. Insert Pages
        const pages = [
            ['عن النقابة', 'about', 'محتوى صفحة عن النقابة'],
            ['تواصل معنا', 'contact', 'محتوى صفحة تواصل معنا']
        ];

        for (const [title, slug, content] of pages) {
            await pool.execute('INSERT INTO pages (title_ar, slug, content) VALUES (?, ?, ?)', [title, slug, content]);
        }

        // Get IDs
        const [catRows] = await pool.query('SELECT id, name_ar, slug FROM categories');
        const [pageRows] = await pool.query('SELECT id, title_ar, slug FROM pages');

        const getCatId = (slug) => catRows.find(c => c.slug === slug)?.id;
        const getPageId = (slug) => pageRows.find(p => p.slug === slug)?.id;

        // 4. Insert Navigation
        const navItems = [
            ['الرئيسية', '/', 'external', null, 1],
            ['بلاغات ومواقف', 'announcements', 'category', getCatId('announcements'), 2],
            ['أخبار وأنشطة', 'news', 'category', getCatId('news'), 3],
            ['ملفات', 'files', 'category', getCatId('files'), 4],
            ['الانخراط', 'membership', 'category', getCatId('membership'), 5],
            ['الإعلام والتواصل', 'media', 'category', getCatId('media'), 6],
            ['القوانين والنصوص التنظيمية', 'laws', 'category', getCatId('laws'), 7],
            ['عن النقابة', 'contact', 'page', getPageId('about'), 8],
            ['تواصل معنا', 'contact-us', 'page', getPageId('contact'), 9]
        ];

        for (const [title, slug, type, linked_id, order] of navItems) {
            await pool.execute(
                'INSERT INTO navigation (title_ar, slug, type, linked_id, `order`) VALUES (?, ?, ?, ?, ?)',
                [title, slug, type, linked_id, order]
            );
        }

        console.log('Update complete!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateNavAndCats();
