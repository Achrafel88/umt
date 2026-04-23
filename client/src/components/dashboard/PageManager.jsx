import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                <div>
                    <h2 className="text-3xl font-black flex items-center gap-3 text-gray-900">
                        <div className="w-12 h-12 bg-blue-50 text-[#0000ff] rounded-2xl flex items-center justify-center shadow-sm">
                            <FileText size={24} />
                        </div>
                        إدارة الصفحات الثابتة
                    </h2>
                    <p className="text-gray-400 text-sm font-bold mt-2 mr-14">إنشاء وتعديل محتوى الصفحات التعريفية</p>
                </div>
                {!isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="bg-[#0000ff] text-white px-8 py-4 rounded-[2rem] font-black flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-blue-600/20 group"
                    >
                        <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                        <span>إضافة صفحة جديدة</span>
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
                        className="bg-gray-50/50 p-10 rounded-[3.5rem] mb-12 border border-gray-100 shadow-sm space-y-8"
                    >
                        <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                            <h3 className="text-xl font-black text-gray-800">
                                {currentPage.id ? 'تعديل الصفحة الحالية' : 'تصميم صفحة جديدة'}
                            </h3>
                            <button onClick={resetForm} className="text-gray-400 hover:text-red-500 transition-colors"><X size={24} /></button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">عنوان الصفحة</label>
                                <input
                                    type="text"
                                    value={currentPage.title_ar}
                                    onChange={(e) => setCurrentPage({ ...currentPage, title_ar: e.target.value })}
                                    className="w-full p-5 bg-white border border-gray-100 rounded-3xl shadow-sm focus:ring-4 focus:ring-[#0000ff]/10 focus:border-[#0000ff] transition-all font-bold text-gray-800"
                                    placeholder="مثال: عن النقابة، الانخراط..."
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">الرابط (Slug)</label>
                                <input
                                    type="text"
                                    value={currentPage.slug}
                                    onChange={(e) => setCurrentPage({ ...currentPage, slug: e.target.value })}
                                    className="w-full p-5 bg-white border border-gray-100 rounded-3xl shadow-sm focus:ring-4 focus:ring-[#0000ff]/10 focus:border-[#0000ff] transition-all font-bold text-gray-400"
                                    placeholder="about"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">محتوى الصفحة</label>
                                <textarea
                                    value={currentPage.content}
                                    onChange={(e) => setCurrentPage({ ...currentPage, content: e.target.value })}
                                    className="w-full p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm focus:ring-4 focus:ring-[#0000ff]/10 focus:border-[#0000ff] transition-all font-medium text-gray-700 min-h-[350px] leading-relaxed"
                                    placeholder="اكتب محتوى الصفحة هنا باستخدام التفاصيل اللازمة..."
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-6">
                            <button type="button" onClick={resetForm} className="px-10 py-4 bg-white text-gray-500 rounded-2xl font-black border border-gray-100 hover:bg-gray-50 transition-all">إلغاء الأمر</button>
                            <button type="submit" className="px-10 py-4 bg-[#0000ff] text-white rounded-2xl font-black shadow-lg shadow-blue-600/20 hover:scale-105 transition-all">
                                {currentPage.id ? 'تحديث البيانات' : 'حفظ ونشر الصفحة'}
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pages.map((p) => (
                    <div key={p.id} className="group bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-500 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#0000ff]/5 rounded-bl-full -mr-8 -mt-8 group-hover:w-32 group-hover:h-32 transition-all duration-700"></div>
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center group-hover:bg-[#0000ff] group-hover:text-white transition-all duration-500">
                                    <Globe size={20} />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setIsEditing(true); setCurrentPage(p); }} className="p-3 bg-gray-50 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"><Edit2 size={18} /></button>
                                    <button onClick={() => handleDelete(p.id)} className="p-3 bg-gray-50 text-red-500 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={18} /></button>
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-gray-800 mb-2">{p.title_ar}</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">/{p.slug}</p>
                            <div className="pt-6 border-t border-gray-50 flex items-center justify-between text-gray-400">
                                <span className="text-[10px] font-bold">المحتوى: {p.content.length} حرف</span>
                                <Link to={`/page/${p.slug}`} target="_blank" className="text-[10px] font-black text-[#0000ff] hover:underline uppercase tracking-tighter">معاينة الصفحة</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PageManager;
