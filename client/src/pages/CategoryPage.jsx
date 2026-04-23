import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowLeft } from 'lucide-react';

const CategoryPage = () => {
    const { slug } = useParams();
    const [articles, setArticles] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [artRes, catRes] = await Promise.all([
                    api.get(`/articles?category=${slug}`),
                    api.get('/categories')
                ]);
                setArticles(artRes.data);
                const currentCat = catRes.data.find(c => c.slug === slug);
                setCategory(currentCat);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white font-bold">جاري التحميل...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-black text-white mb-4">{category?.name_ar || 'التصنيف'}</h1>
                <div className="w-20 h-1.5 bg-white mx-auto rounded-full"></div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article, idx) => (
                    <motion.div 
                        key={article.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-sky-200/50 backdrop-blur-sm rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden news-card-hover flex flex-col"
                    >
                        <div className="aspect-video overflow-hidden">
                            {article.image_url && (
                                <img src={`http://localhost:5001${article.image_url}`} alt={article.title} className="w-full h-full object-cover" />
                            )}
                        </div>
                        <div className="p-6 flex-grow flex flex-col">
                            <h3 className="text-xl font-black mb-3 leading-snug hover:text-primary-600 transition-colors line-clamp-2">
                                <Link to={`/article/${article.id}`}>{article.title}</Link>
                            </h3>
                            <p className="text-gray-500 text-sm font-medium line-clamp-3 mb-6 flex-grow">
                                {article.content}
                            </p>
                            <div className="pt-4 border-t border-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 flex justify-between">
                                <span>بواسطة: {article.validator_name || 'الإدارة'}</span>
                                <div className="flex items-center gap-1">
                                    <MapPin size={10} />
                                    <span>{article.city_name}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            {articles.length === 0 && (
                <div className="text-center py-20 text-white font-bold text-xl bg-white/10 backdrop-blur-sm rounded-[2rem]">
                    لا توجد مقالات في هذا التصنيف حالياً
                </div>
            )}
        </div>
    );
};

export default CategoryPage;
