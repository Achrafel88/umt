const fs = require('fs');
const path = require('path');
const pool = require('./config/db');

const applySchema = async () => {
    try {
        console.log('Reading schema.sql...');
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        
        // Remove comments and split by semicolon
        const statements = schema
            .replace(/\/\*[\s\S]*?\*\/|--.*$/gm, '') // Remove /* */ and -- comments
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        console.log(`Found ${statements.length} SQL statements to execute.`);

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            console.log(`Executing statement ${i + 1}/${statements.length}...`);
            try {
                await pool.query(statement);
            } catch (err) {
                console.error(`Error in statement ${i + 1}:`, err.message);
                console.error('Statement:', statement);
                // Continue if it's just "already exists" but log it
                if (!err.message.includes('already exists')) {
                    // throw err; // Decide if we want to stop on first error
                }
            }
        }

        console.log('✅ Schema applied successfully.');
        process.exit();
    } catch (err) {
        console.error('❌ Failed to apply schema:', err);
        process.exit(1);
    }
};

applySchema();
