import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const ArticleDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await api.get(`/articles`);
                const art = res.data.find(a => a.id === parseInt(id));
                setArticle(art);
            } catch (err) {
                console.error(err);
            }
        };
        fetchArticle();
    }, [id]);

    if (!article) return <div className="text-center py-20">جاري التحميل...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 bg-white shadow-sm mt-8 rounded-lg">
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            <div className="flex items-center text-sm text-gray-500 mb-6 space-x-reverse space-x-4">
                <span className="bg-primary-600 text-white px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest">{article.category_name}</span>
                <span className="font-bold">المصادقة: <span className="text-gray-900">{article.validator_name || 'الإدارة المركزية'}</span></span>
                <span className="font-bold">المدينة: <span className="text-gray-900">{article.city_name}</span></span>
            </div>
            
            {article.image_url && (
                <img src={`http://localhost:5001${article.image_url}`} alt={article.title} className="w-full h-auto rounded-lg mb-8" />
            )}

            <div className="prose pprimary-lg max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap">
                {article.content}
            </div>

            {(article.video_url || article.pdf_url || article.audio_url) && (
                <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-xl font-bold mb-4">الملحقات</h3>
                    {article.video_url && <video src={`http://localhost:5001${article.video_url}`} controls className="w-full mb-4" />}
                    {article.audio_url && <audio src={`http://localhost:5001${article.audio_url}`} controls className="w-full mb-4" />}
                    {article.pdf_url && <a href={`http://localhost:5001${article.pdf_url}`} target="_blank" rel="noreferrer" className="text-primary-700 font-bold underline">تحميل ملف PDF</a>}
                </div>
            )}
        </div>
    );
};

export default ArticleDetail;
