import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Trash2, Edit2, FileText, X, Check, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PageManager = () => {
    const [pages, setPages] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPage, setCurrentPage] = useState({ title_ar: '', slug: '', content: '' });

    useEffect(() => { fetchPages(); }, []);
    const fetchPages = async () => {
        try {
            const res = await api.get('/pages');
            setPages(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentPage({ title_ar: '', slug: '', content: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentPage.id) {
                await api.put(`/pages/${currentPage.id}`, currentPage);
            } else {
                await api.post('/pages', currentPage);
            }
            resetForm();
            fetchPages();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذه الصفحة؟')) {
            try {
                await api.delete(`/pages/${id}`);
                fetchPages();
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
                        <FileText className="text-primary-600" />
                        إدارة الصفحات الثابتة
                    </h2>
                    <p className="text-gray-400 text-xs font-bold mt-1">إنشاء وتعديل محتوى الصفحات التعريفية</p>
                </div>
                {!isEditing && (
                    <button 
                        onClick={() => { setIsEditing(true); setCurrentPage({ title_ar: '', slug: '', content: '' }); }}
                        className="bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20"
                    >
                        <Plus size={20} />
                        <span>إنشاء صفحة جديدة</span>
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isEditing && (
                    <motion.form 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        onSubmit={handleSubmit} 
                        className="bg-gray-50 p-8 rounded-[2.5rem] mb-10 border border-gray-100 shadow-inner space-y-6"
                    >
                        <h3 className="text-lg font-black text-gray-800">
                            {currentPage.id ? 'تعديل الصفحة' : 'إنشاء صفحة جديدة'}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-1">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">عنوان الصفحة</label>
                                <input
                                    type="text"
                                    value={currentPage.title_ar}
                                    onChange={(e) => setCurrentPage({ ...currentPage, title_ar: e.target.value })}
                                    className="w-full p-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500 font-bold"
                                    placeholder="مثال: من نحن، اتصل بنا..."
                                    required
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">الرابط (Slug)</label>
                                <input
                                    type="text"
                                    value={currentPage.slug}
                                    onChange={(e) => setCurrentPage({ ...currentPage, slug: e.target.value })}
                                    className="w-full p-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500 font-bold"
                                    placeholder="about-us"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">محتوى الصفحة</label>
                                <textarea
                                    value={currentPage.content}
                                    onChange={(e) => setCurrentPage({ ...currentPage, content: e.target.value })}
                                    className="w-full p-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500 font-medium min-h-[300px]"
                                    placeholder="اكتب محتوى الصفحة هنا..."
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                            <button type="button" onClick={resetForm} className="px-8 py-3 bg-gray-200 text-gray-600 rounded-2xl font-black hover:bg-gray-300 transition-all">إلغاء</button>
                            <button type="submit" className="px-8 py-3 bg-primary-600 text-white rounded-2xl font-black hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20">
                                {currentPage.id ? 'تحديث الصفحة' : 'نشر الصفحة'}
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 gap-4">
                {pages.map(p => (
                    <div key={p.id} className="group flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[2rem] hover:border-primary-200 hover:shadow-md transition-all">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                <Globe size={24} />
                            </div>
                            <div>
                                <h3 className="font-black text-gray-800">{p.title_ar}</h3>
                                <p className="text-xs text-gray-400 font-bold mt-1">/{p.slug}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => { setIsEditing(true); setCurrentPage(p); }}
                                className="p-3 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                                title="تعديل"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button 
                                onClick={() => handleDelete(p.id)} 
                                className="p-3 text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
                                title="حذف"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PageManager;
