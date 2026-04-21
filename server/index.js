const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./config/db'); // Import database pool to test connection
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const navigationRoutes = require('./routes/navigationRoutes');
const articleRoutes = require('./routes/articleRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cityRoutes = require('./routes/cityRoutes');
const authorRoutes = require('./routes/authorRoutes');
const pageRoutes = require('./routes/pageRoutes');
const adRoutes = require('./routes/adRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/navigation', navigationRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5001;

// Function to check DB connection
const checkConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
        
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        process.exit(1); // Exit with error code
    }
};

checkConnection();

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('🔥 Server Error:', err.stack);
    res.status(500).json({ message: 'خطأ غير متوقع في السيرفر: ' + err.message });
});
