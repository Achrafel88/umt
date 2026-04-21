import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Check, Search, Filter, Eye, Clock, Edit2, Trash2, X, Newspaper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ArticleManager = () => {
    const { user } = useContext(AuthContext);
    const [articles, setArticles] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [cities, setCities] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [filterStatus, setFilterStatus] = useState('pending'); // pending, published, all

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category_id: '',
        city_id: '',
        author_id: '',
        image: null,
        video: null,
        pdf: null,
        audio: null
    });

    useEffect(() => {
        fetchArticles();
        fetchMetadata();
    }, [filterStatus]);

    const fetchArticles = async () => {
        try {
            const res = await api.get(`/articles?status=${filterStatus}`);
            setArticles(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMetadata = async () => {
        try {
            const catRes = await api.get('/categories');
            setCategories(catRes.data);
            const cityRes = await api.get('/cities');
            setCities(cityRes.data);
            const authRes = await api.get('/authors');
            setAuthors(authRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    };

    const resetForm = () => {
        setIsCreating(false);
        setEditingId(null);
        setFormData({ title: '', content: '', category_id: '', city_id: '', author_id: '', image: null, video: null, pdf: null, audio: null });
    };

    const startEdit = (article) => {
        setEditingId(article.id);
        setFormData({
            title: article.title,
            content: article.content,
            category_id: article.category_id,
            city_id: article.city_id,
            author_id: article.author_id,
            image: null,
            video: null,
            pdf: null,
            audio: null
        });
        setIsCreating(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key]) data.append(key, formData[key]);
        });

        try {
            if (editingId) {
                await api.put(`/articles/${editingId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/articles', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            resetForm();
            fetchArticles();
        } catch (err) {
            console.error(err);
        }
    };

    const handleValidate = async (id) => {
        try {
            await api.put(`/articles/validate/${id}`);
            fetchArticles();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المقال؟')) {
            try {
                await api.delete(`/articles/${id}`);
                fetchArticles();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black flex items-center gap-2">
                        <Filter className="text-primary-600" />
                        إدارة المقالات
                    </h2>
                    <p className="text-gray-400 text-xs font-bold mt-1">عرض وتدقيق المحتوى الإخباري</p>
                </div>
                {!isCreating && (
                    <button 
                        onClick={() => setIsCreating(true)}
                        className="bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20"
                    >
                        <Plus size={20} />
                        <span>إضافة مقال جديد</span>
                    </button>
                )}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-2xl mb-8 w-full max-w-md">
                <button 
                    onClick={() => setFilterStatus('pending')}
                    className={`flex-grow flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-black transition-all ${filterStatus === 'pending' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Clock size={16} />
                    في انتظار التفعيل
                </button>
                <button 
                    onClick={() => setFilterStatus('published')}
                    className={`flex-grow flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-black transition-all ${filterStatus === 'published' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Check size={16} />
                    المنشورة
                </button>
                <button 
                    onClick={() => setFilterStatus('all')}
                    className={`flex-grow flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-black transition-all ${filterStatus === 'all' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Filter size={16} />
                    الكل
                </button>
            </div>

            <AnimatePresence>
                {isCreating && (
                    <motion.form 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        onSubmit={handleSubmit} 
                        className="bg-gray-50 p-8 rounded-[2.5rem] mb-10 grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-100 shadow-inner"
                    >
                        <h3 className="md:col-span-2 text-lg font-black text-gray-800">
                            {editingId ? 'تعديل المقال' : 'إضافة مقال جديد'}
                        </h3>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">عنوان المقال</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full p-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500 font-bold"
                                placeholder="أدخل العنوان هنا..."
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">المحتوى</label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="w-full p-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500 font-medium h-48"
                                placeholder="اكتب نص المقال بالتفصيل..."
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">التصنيف</label>
                            <select
                                value={formData.category_id}
                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                className="w-full p-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500 font-bold text-gray-700"
                                required
                            >
                                <option value="">اختر التصنيف</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">المدينة</label>
                            <select
                                value={formData.city_id}
                                onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                                className="w-full p-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500 font-bold text-gray-700"
                                required
                            >
                                <option value="">اختر المدينة</option>
                                {cities.map(c => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">الكاتب</label>
                            <select
                                value={formData.author_id}
                                onChange={(e) => setFormData({ ...formData, author_id: e.target.value })}
                                className="w-full p-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500 font-bold text-gray-700"
                                required
                            >
                                <option value="">اختر الكاتب</option>
                                {authors.map(a => <option key={a.id} value={a.id}>{a.name_ar}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">الصورة {editingId && '(اختياري)'}</label>
                            <input type="file" name="image" onChange={handleFileChange} className="w-full text-sm font-bold text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" accept="image/*" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">فيديو (اختياري)</label>
                            <input type="file" name="video" onChange={handleFileChange} className="w-full text-sm font-bold text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" accept="video/*" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">ملف PDF (اختياري)</label>
                            <input type="file" name="pdf" onChange={handleFileChange} className="w-full text-sm font-bold text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" accept=".pdf" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">صوت (اختياري)</label>
                            <input type="file" name="audio" onChange={handleFileChange} className="w-full text-sm font-bold text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" accept="audio/*" />
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                            <button type="button" onClick={resetForm} className="px-8 py-3 bg-gray-200 text-gray-600 rounded-2xl font-black hover:bg-gray-300 transition-all">إلغاء</button>
                            <button type="submit" className="px-8 py-3 bg-primary-600 text-white rounded-2xl font-black hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20">
                                {editingId ? 'تحديث المقال' : 'حفظ وإرسال للمراجعة'}
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="space-y-4">
                {articles.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold">لا توجد مقالات في هذا القسم حالياً</p>
                    </div>
                ) : (
                    articles.map(article => (
                        <div key={article.id} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white border border-gray-100 rounded-3xl hover:border-primary-200 hover:shadow-md transition-all gap-4">
                            <div className="flex items-center gap-5 w-full">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 shadow-inner flex-shrink-0">
                                    {article.image_url ? (
                                        <img src={`http://localhost:5001${article.image_url}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300"><Newspaper size={24} /></div>
                                    )}
                                </div>
                                <div className="min-w-0 flex-grow">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-black px-2 py-0.5 bg-primary-50 text-primary-600 rounded-md uppercase tracking-wider whitespace-nowrap">{article.category_name}</span>
                                        <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">{article.city_name}</span>
                                    </div>
                                    <h3 className="font-black text-gray-800 line-clamp-1">{article.title}</h3>
                                    <p className="text-xs text-gray-400 font-medium mt-1 truncate">الكاتب: {article.author_name} • {new Date(article.created_at).toLocaleDateString('ar-EG')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                <button onClick={() => startEdit(article)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"><Edit2 size={18} /></button>
                                <button onClick={() => handleDelete(article.id)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"><Trash2 size={18} /></button>
                                
                                {user.role === 'admin_principal' && article.status === 'pending' && (
                                    <button 
                                        onClick={() => handleValidate(article.id)}
                                        className="flex items-center gap-2 bg-green-500 text-white px-5 py-2 rounded-xl text-sm font-black hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 whitespace-nowrap"
                                    >
                                        <Check size={16} />
                                        <span>تفعيل</span>
                                    </button>
                                )}
                                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${article.status === 'published' ? 'bg-primary-50 text-primary-600' : 'bg-yellow-50 text-yellow-600'}`}>
                                    {article.status === 'published' ? 'منشور' : 'معلق'}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ArticleManager;
