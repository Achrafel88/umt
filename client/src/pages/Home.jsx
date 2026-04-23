import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, ArrowLeft, Newspaper } from 'lucide-react';

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
        <div className="max-w-[1440px] mx-auto px-6 py-12">
            <div className="space-y-12">
                {/* Header Advertisement */}
                {headerAd && headerAd.is_active && (
                    <motion.div 
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full"
                    >
                        <a 
                            href={headerAd.link_url || '#'} 
                            target={headerAd.link_url ? "_blank" : "_self"}
                            rel="noopener noreferrer" 
                            className="block w-full overflow-hidden rounded-[3.5rem] shadow-[0_15px_50px_-15px_rgba(0,0,0,0.06)] border border-gray-100 bg-gray-50 hover:shadow-xl transition-all duration-700"
                            onClick={(e) => { if(!headerAd.link_url) e.preventDefault(); }}
                        >
                            <img 
                                src={`http://localhost:5001${headerAd.image_url}`} 
                                alt={headerAd.title} 
                                className="w-full object-contain max-h-[300px] bg-white" 
                            />
                        </a>
                    </motion.div>
                )}

                {/* Unique Floating Search & Filters */}
                <div className="relative z-10">
                    <div className="neo-blur neo-shadow p-2 rounded-[2.5rem] flex flex-col md:flex-row gap-2 items-center border border-white/50">
                        <div className="relative flex-grow w-full">
                            <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-[#0000ff]/40" size={20} />
                            <input 
                                type="text" 
                                placeholder="ابحث عن البلاغات، الأخبار، أو الملفات..." 
                                className="w-full pr-14 pl-6 py-4 bg-transparent border-none focus:ring-0 text-gray-800 font-bold placeholder:text-gray-400"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto p-1">
                            <select 
                                className="flex-grow md:w-48 p-4 bg-white border border-gray-200 rounded-[1.5rem] focus:ring-4 focus:ring-[#0000ff]/10 focus:border-[#0000ff] transition-all text-sm font-black text-gray-600 appearance-none text-center cursor-pointer hover:bg-gray-50 hover:border-gray-300"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">جميع التصنيفات</option>
                                {categories.map(c => <option key={c.id} value={c.slug}>{c.name_ar}</option>)}
                            </select>
                            <select 
                                className="flex-grow md:w-48 p-4 bg-white border border-gray-200 rounded-[1.5rem] focus:ring-4 focus:ring-[#0000ff]/10 focus:border-[#0000ff] transition-all text-sm font-black text-gray-600 appearance-none text-center cursor-pointer hover:bg-gray-50 hover:border-gray-300"
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                            >
                                <option value="">جميع المدن</option>
                                {cities.map(c => <option key={c.id} value={c.name_ar}>{c.name_ar}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
                    <div className="lg:col-span-8 space-y-16">
                        {/* Featured Article */}
                        {featuredArticle && (
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group relative"
                            >
                                <div className="relative aspect-[16/8] overflow-hidden rounded-[3.5rem] neo-shadow border border-[#0000ff]/10">
                                    {featuredArticle.image_url ? (
                                        <img 
                                            src={`http://localhost:5001${featuredArticle.image_url}`} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                            alt={featuredArticle.title}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-[#0000ff] to-blue-800" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 sm:p-12">
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="bg-[#0000ff] text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                                                {featuredArticle.category_name}
                                            </span>
                                            <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">{featuredArticle.city_name}</span>
                                        </div>
                                        <Link to={`/article/${featuredArticle.id}`}>
                                            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 leading-[1.15] hover:text-blue-200 transition-colors">
                                                {featuredArticle.title}
                                            </h2>
                                        </Link>
                                        <div className="flex items-center justify-between border-t border-white/10 pt-6">
                                            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                                                المكتب النقابي: {featuredArticle.author_name}
                                            </p>
                                            <Link to={`/article/${featuredArticle.id}`} className="bg-white text-black p-4 rounded-full hover:bg-[#0000ff] hover:text-white transition-all">
                                                <ArrowLeft size={20} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Secondary Articles Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                            {otherArticles.map((article, idx) => (
                                <motion.div 
                                    key={article.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group relative"
                                >
                                    <Link to={`/article/${article.id}`} className="block h-full">
                                        <div className="bg-white p-6 rounded-[3.5rem] border border-[#0000ff]/20 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.06)] hover:shadow-[0_30px_60px_-12px_rgba(0,0,255,0.1)] transition-all duration-500 h-full flex flex-col group">
                                            <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] mb-6 border border-gray-100 bg-gray-50 flex items-center justify-center p-4 shadow-inner">
                                                {article.image_url ? (
                                                    <img 
                                                        src={`http://localhost:5001${article.image_url}`} 
                                                        alt={article.title} 
                                                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" 
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-200"><Newspaper size={48} /></div>
                                                )}
                                                <div className="absolute top-4 right-4">
                                                    <span className="bg-[#0000ff] text-white px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20">
                                                        {article.category_name}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="px-3 flex-grow flex flex-col">
                                                <h3 className="text-xl font-black mb-4 leading-tight text-gray-800 group-hover:text-[#0000ff] transition-colors line-clamp-2">
                                                    {article.title}
                                                </h3>
                                                <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">المكتب النقابي</span>
                                                        <span className="text-[11px] font-bold text-gray-700">{article.author_name}</span>
                                                    </div>
                                                    <span className="text-[10px] font-black text-[#0000ff] bg-blue-50 px-4 py-1.5 rounded-full border border-[#0000ff]/10">{article.city_name}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar as Floating Cards */}
                    <div className="lg:col-span-4 space-y-10">
                        <div className="bg-white/50 backdrop-blur-xl p-8 rounded-[3rem] border border-white neo-shadow sticky top-32">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1 h-6 bg-[#0000ff] rounded-full"></div>
                                <h3 className="text-xl font-black text-gray-900">إعلان</h3>
                            </div>
                            <div className="space-y-8">
                                {ads.filter(ad => ad.position === 'sidebar' && ad.is_active).map(ad => (
                                    <motion.div 
                                        key={ad.id}
                                        whileHover={{ scale: 1.03 }}
                                        className="overflow-hidden rounded-[2rem] neo-shadow border border-white"
                                    >
                                        <a href={ad.link_url || '#'} target={ad.link_url ? "_blank" : "_self"} rel="noopener noreferrer">
                                            <img src={`http://localhost:5001${ad.image_url}`} alt={ad.title} className="w-full object-contain bg-gray-50" />
                                        </a>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
