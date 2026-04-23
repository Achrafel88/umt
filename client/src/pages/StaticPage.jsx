import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';

const StaticPage = () => {
    const { slug } = useParams();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchPage = async () => {
            setLoading(true);
            setError(false);
            try {
                // Fetch specific page by slug
                const res = await api.get(`/pages/${slug}`);
                setPage(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching page:', err);
                setError(true);
                setLoading(false);
            }
        };
        fetchPage();
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#fbfcfd]">
            <div className="text-[#0000ff] font-black text-2xl animate-pulse tracking-widest">جاري التحميل...</div>
        </div>
    );
    
    if (error || !page) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#fbfcfd] text-gray-800 p-4">
            <h2 className="text-8xl font-black mb-4 text-[#0000ff] opacity-10">404</h2>
            <p className="text-2xl font-bold mb-8">عذراً، الصفحة غير موجودة</p>
            <a href="/" className="bg-[#0000ff] text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-blue-600/20 transition-all hover:scale-105">العودة للرئيسية</a>
        </div>
    );

    return (
        <div className="max-w-[1200px] mx-auto px-6 py-20">
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[4rem] neo-shadow border border-white overflow-hidden"
            >
                {/* Clean Header Section */}
                <div className="bg-gray-50/50 p-12 sm:p-20 text-center border-b border-gray-100">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="text-[#0000ff] font-black text-[10px] uppercase tracking-[0.4em] mb-6 block">الصفحة التعريفية</span>
                        <h1 className="text-4xl sm:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">{page.title_ar}</h1>
                    </motion.div>
                </div>

                {/* Content Section with Refined Typography */}
                <div className="p-10 sm:p-20 lg:p-24 bg-white">
                    <div 
                        className="prose prose-2xl max-w-none text-gray-700 leading-[1.8] font-medium text-right whitespace-pre-line tracking-wide"
                    >
                        {page.content}
                    </div>
                </div>

                {/* Footer Decor */}
                <div className="p-12 bg-gray-50/30 flex justify-center">
                    <div className="w-24 h-1 bg-[#0000ff] opacity-10 rounded-full"></div>
                </div>
            </motion.div>
        </div>
    );
};

export default StaticPage;
