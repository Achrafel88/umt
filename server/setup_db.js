const fs = require('fs');
const path = require('path');
const pool = require('./config/db');

const applySchema = async () => {
    try {
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        const statements = schema.split(';').filter(s => s.trim().length > 0);
        
        for (let statement of statements) {
            console.log('Executing:', statement.trim().substring(0, 50) + '...');
            await pool.query(statement);
        }
        
        console.log('Schema applied successfully.');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

applySchema();
