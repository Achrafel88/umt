import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, ArrowLeft } from 'lucide-react';

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [ads, setAds] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);

    const [selectedCity, setSelectedCity] = useState('');
    const [cities, setCities] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = {};
                if (search) params.search = search;
                if (selectedCategory) params.category = selectedCategory;
                if (selectedCity) params.city = selectedCity;

                const artRes = await api.get('/articles', { params });
                setArticles(artRes.data);
                const adRes = await api.get('/ads');
                setAds(adRes.data);
                const catRes = await api.get('/categories');
                setCategories(catRes.data);
                const cityRes = await api.get('/cities');
                setCities(cityRes.data);
            } catch (err) {
                console.error('Failed to fetch data', err);
            }
        };
        fetchData();
    }, [search, selectedCategory, selectedCity]);

    const headerAd = ads.find(ad => ad.position === 'header');
    const featuredArticle = articles[0];
    const otherArticles = articles.slice(1);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {headerAd && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 flex justify-center"
                >
                    <a href={headerAd.link_url} target="_blank" rel="noopener noreferrer" className="block w-full max-w-4xl overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all border border-gray-100">
                        <img src={`http://localhost:5001${headerAd.image_url}`} alt={headerAd.title} className="w-full object-cover max-h-48" />
                    </a>
                </motion.div>
            )}

            {/* Modern Search & Filters */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-12 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-grow w-full">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="ابحث عن الأخبار أو المواضيع..." 
                        className="w-full pr-12 pl-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <select 
                        className="flex-grow md:w-40 p-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all text-sm font-bold text-gray-600 appearance-none text-center cursor-pointer"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">جميع التصنيفات</option>
                        {categories.map(c => <option key={c.id} value={c.slug}>{c.name_ar}</option>)}
                    </select>
                    <select 
                        className="flex-grow md:w-40 p-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all text-sm font-bold text-gray-600 appearance-none text-center cursor-pointer"
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                    >
                        <option value="">جميع المدن</option>
                        {cities.map(c => <option key={c.id} value={c.name_ar}>{c.name_ar}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-12">
                    {/* Featured Article */}
                    {featuredArticle && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group relative overflow-hidden rounded-[2.5rem] bg-white shadow-xl news-card-hover"
                        >
                            <div className="aspect-[21/9] overflow-hidden">
                                {featuredArticle.image_url ? (
                                    <img 
                                        src={`http://localhost:5001${featuredArticle.image_url}`} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        alt=""
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700" />
                                )}
                            </div>
                            <div className="p-8 sm:p-10">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="bg-primary-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                                    {featuredArticle.category_name}
                                </span>
                                <div className="flex items-center text-gray-400 text-[10px] font-black uppercase tracking-widest gap-2">
                                    <MapPin size={12} />
                                    <span>{featuredArticle.city_name}</span>
                                    <span className="mx-1">•</span>
                                    <span>بواسطة: {featuredArticle.validator_name || 'الإدارة'}</span>
                                </div>
                            </div>

                                <Link to={`/article/${featuredArticle.id}`}>
                                    <h2 className="text-3xl sm:text-4xl font-black mb-6 leading-tight hover:text-primary-600 transition-colors">
                                        {featuredArticle.title}
                                    </h2>
                                </Link>
                                <p className="text-gray-500 leading-relaxed text-lg line-clamp-3 font-medium mb-8">
                                    {featuredArticle.content}
                                </p>
                                <Link to={`/article/${featuredArticle.id}`} className="inline-flex items-center gap-2 text-primary-600 font-black text-sm hover:gap-4 transition-all group/btn">
                                    <span>اقرأ المزيد</span>
                                    <ArrowLeft size={18} className="transition-transform group-hover/btn:-translate-x-1" />
                                </Link>
                            </div>
                        </motion.div>
                    )}

                    {/* Secondary Articles Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {otherArticles.map((article, idx) => (
                            <motion.div 
                                key={article.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden news-card-hover flex flex-col"
                            >
                                <div className="aspect-video overflow-hidden">
                                    {article.image_url && (
                                        <img src={`http://localhost:5001${article.image_url}`} alt={article.title} className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div className="p-6 flex-grow flex flex-col">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest bg-primary-50 px-2 py-1 rounded-md">
                                            {article.category_name}
                                        </span>
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                                            <MapPin size={10} />
                                            <span>{article.city_name}</span>
                                        </div>
                                    </div>
                                    <Link to={`/article/${article.id}`}>
                                        <h3 className="text-xl font-black mb-3 leading-snug hover:text-primary-600 transition-colors line-clamp-2">
                                            {article.title}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-500 text-sm font-medium line-clamp-3 mb-6 flex-grow">
                                        {article.content}
                                    </p>
                                    <div className="pt-4 border-t border-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 flex justify-between">
                                        <span>بواسطة: {article.validator_name || 'الإدارة'}</span>
                                        <span>{article.city_name}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                        <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                            <span className="w-2 h-8 bg-primary-600 rounded-full inline-block"></span>
                            مساحة إعلانية
                        </h3>
                        <div className="space-y-6">
                            {ads.filter(ad => ad.position === 'sidebar').map(ad => (
                                <motion.div 
                                    key={ad.id}
                                    whileHover={{ scale: 1.02 }}
                                    className="overflow-hidden rounded-2xl shadow-sm"
                                >
                                    <a href={ad.link_url} target="_blank" rel="noopener noreferrer">
                                        <img src={`http://localhost:5001${ad.image_url}`} alt={ad.title} className="w-full" />
                                    </a>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-[2rem] text-white">
                        <h3 className="text-2xl font-black mb-4">انضم إلينا</h3>
                        <p className="text-gray-400 text-sm mb-6 font-medium">كن أول من يتوصل بآخر البلاغات والأخبار النقابية والعمالية.</p>
                        <button className="w-full bg-primary-600 hover:bg-primary-700 py-4 rounded-2xl font-black transition-all shadow-lg shadow-primary-600/20">
                            تسجيل حساب جديد
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
