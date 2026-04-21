import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Newspaper, Users, Eye, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardHome = () => {
    const [stats, setStats] = useState({
        totalArticles: 0,
        pendingArticles: 0,
        publishedArticles: 0,
        totalUsers: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [articles, users] = await Promise.all([
                    api.get('/articles?status=all'), // Need to ensure API supports status=all
                    api.get('/users')
                ]);
                
                const published = articles.data.filter(a => a.status === 'published').length;
                const pending = articles.data.filter(a => a.status === 'pending').length;

                setStats({
                    totalArticles: articles.data.length,
                    publishedArticles: published,
                    pendingArticles: pending,
                    totalUsers: users.data.length
                });
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { title: 'إجمالي المقالات', value: stats.totalArticles, icon: <Newspaper size={24} />, color: 'bg-blue-500' },
        { title: 'مقالات منشورة', value: stats.publishedArticles, icon: <CheckCircle size={24} />, color: 'bg-green-500' },
        { title: 'في انتظار التفعيل', value: stats.pendingArticles, icon: <Clock size={24} />, color: 'bg-yellow-500' },
        { title: 'إجمالي المستخدمين', value: stats.totalUsers, icon: <Users size={24} />, color: 'bg-purple-500' },
    ];

    return (
        <div>
            <h2 className="text-2xl font-black mb-8">نظرة عامة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className={`w-12 h-12 ${card.color} text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg opacity-80`}>
                            {card.icon}
                        </div>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">{card.title}</p>
                        <h3 className="text-3xl font-black">{card.value}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="mt-12 bg-primary-50 p-8 rounded-[2.5rem] border border-primary-100">
                <h3 className="text-xl font-black text-primary-900 mb-2">مرحباً بك في لوحة تحكم UMT</h3>
                <p className="text-primary-700 font-medium">يمكنك من هنا إدارة كافة محتويات المنصة، من الأخبار والأنشطة النقابية إلى الإعلانات والقوائم البريدية.</p>
            </div>
        </div>
    );
};

export default DashboardHome;
