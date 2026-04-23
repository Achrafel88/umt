import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { MapPin, Calendar, User, FileText, Video, Music, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const ArticleDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                // Assuming there's a specific endpoint or we use the query params
                const res = await api.get(`/articles`);
                const found = res.data.find(a => a.id === parseInt(id));
                setArticle(found);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
            <div className="text-[#0000ff] font-black text-2xl animate-pulse">جاري التحميل...</div>
        </div>
    );

    if (!article) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] text-gray-800">
            <h2 className="text-6xl font-black mb-4 text-[#0000ff]">404</h2>
            <p className="text-xl font-bold">عذراً، المقال غير موجود</p>
            <a href="/" className="mt-8 bg-[#0000ff] text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-blue-600/20 transition-all hover:scale-105">العودة للرئيسية</a>
        </div>
    );

    return (
        <div className="max-w-[1200px] mx-auto px-6 py-16">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[4rem] neo-shadow border border-white overflow-hidden"
            >
                {/* Full-width Hero with Gradient Overlay */}
                {article.image_url && (
                    <div className="relative aspect-[21/9] w-full overflow-hidden">
                        <img 
                            src={`http://localhost:5001${article.image_url}`} 
                            className="w-full h-full object-cover" 
                            alt={article.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                    </div>
                )}

                <div className="p-10 sm:p-16 lg:p-24 -mt-20 relative z-10 bg-white/80 backdrop-blur-xl rounded-t-[4rem]">
                    {/* Meta Section */}
                    <div className="flex flex-wrap items-center gap-6 mb-12">
                        <span className="bg-[#0000ff] text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-600/20">
                            {article.category_name}
                        </span>
                        <div className="flex items-center text-gray-400 text-[10px] font-black uppercase tracking-widest gap-6">
                            <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-[#0000ff]" />
                                <span>{article.city_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-[#0000ff]" />
                                <span>{new Date(article.created_at).toLocaleDateString('ar-MA')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User size={14} className="text-[#0000ff]" />
                                <span>المكتب النقابي: {article.author_name}</span>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-black text-gray-900 mb-12 leading-[1.1] tracking-tight">
                        {article.title}
                    </h1>

                    <div className="w-32 h-1 bg-[#0000ff] rounded-full mb-16 opacity-20"></div>

                    {/* Content with high readability */}
                    <div className="prose prose-2xl max-w-none text-gray-700 leading-relaxed font-medium mb-20 text-right whitespace-pre-line tracking-wide">
                        {article.content}
                    </div>

                    {/* Multimedia Section as Floating Cards */}
                    <div className="space-y-10 pt-16 border-t border-gray-100">
                        {article.video_url && (
                            <div className="bg-gray-50/50 p-8 sm:p-12 rounded-[3.5rem] border border-gray-100 neo-shadow">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center border border-red-100">
                                        <Video size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">تغطية مرئية</p>
                                        <h3 className="text-xl font-black text-gray-800">فيديو مرفق</h3>
                                    </div>
                                </div>
                                <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden bg-black neo-shadow ring-8 ring-white">
                                    <video 
                                        controls 
                                        className="w-full h-full"
                                        src={`http://localhost:5001${article.video_url}`}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {article.audio_url && (
                                <div className="bg-gray-50/50 p-10 rounded-[3.5rem] border border-gray-100 neo-shadow flex flex-col justify-center items-center text-center">
                                    <div className="w-16 h-16 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center border border-green-100 mb-6">
                                        <Music size={32} />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-800 mb-2">تسجيل صوتي</h3>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">استمع للتفاصيل الكاملة</p>
                                    <audio 
                                        controls 
                                        className="w-full h-12 accent-[#0000ff]"
                                        src={`http://localhost:5001${article.audio_url}`}
                                    >
                                        Your browser does not support the audio tag.
                                    </audio>
                                </div>
                            )}

                            {article.pdf_url && (
                                <div className="bg-gray-50/50 p-10 rounded-[3.5rem] border border-gray-100 neo-shadow flex flex-col justify-center items-center text-center">
                                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center border border-blue-100 mb-6">
                                        <FileText size={32} />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-800 mb-2">وثيقة PDF</h3>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">تحميل البيان أو الملف الكامل</p>
                                    <a 
                                        href={`http://localhost:5001${article.pdf_url}`} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-gray-800 font-black rounded-2xl hover:bg-[#0000ff] hover:text-white transition-all neo-shadow border border-gray-100 group"
                                    >
                                        <span>عرض الوثيقة</span>
                                        <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ArticleDetail;
