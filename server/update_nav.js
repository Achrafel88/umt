const pool = require('./config/db');

const updateNav = async () => {
    try {
        console.log('Updating Navigation...');
        
        // Clear existing nav
        await pool.execute('DELETE FROM navigation');
        
        const navItems = [
            { title: 'الرئيسية', slug: '/', type: 'external' },
            { title: 'عن النقابة', slug: 'about', type: 'page' },
            { title: 'بلاغات ومواقف', slug: 'announcements', type: 'category' },
            { title: 'أخبار وأنشطة', slug: 'news-activities', type: 'category' },
            { title: 'ملفات', slug: 'files', type: 'category' },
            { title: 'القوانين والنصوص التنظيمية', slug: 'laws', type: 'page' },
            { title: 'الانخراط', slug: 'membership', type: 'page' },
            { title: 'الإعلام والتواصل', slug: 'media', type: 'category' },
            { title: 'آراء', slug: 'opinions', type: 'category' },
            { title: 'تواصل معنا', slug: 'contact', type: 'page' }
        ];

        for (let i = 0; i < navItems.length; i++) {
            const item = navItems[i];
            await pool.execute(
                'INSERT INTO navigation (title_ar, slug, type, `order`) VALUES (?, ?, ?, ?)',
                [item.title, item.slug, item.type, i + 1]
            );
        }

        console.log('✅ Navigation updated successfully');
        process.exit();
    } catch (err) {
        console.error('❌ Error updating nav:', err.message);
        process.exit(1);
    }
};

updateNav();
