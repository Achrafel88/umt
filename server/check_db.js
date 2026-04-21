const pool = require('./config/db');

const checkSchema = async () => {
    try {
        const [rows] = await pool.query('DESCRIBE users');
        console.log('Users table schema:');
        console.table(rows);
        process.exit();
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

checkSchema();
