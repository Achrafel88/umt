import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Trash2, Edit2, ImageIcon, ExternalLink, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdManager = () => {
    const [ads, setAds] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ 
        title: '', 
        link_url: '', 
        position: 'sidebar', 
        is_active: true,
        image: null 
    });

    useEffect(() => { fetchAds(); }, []);
    const fetchAds = async () => {
        try {
            const res = await api.get('/ads/all');
            setAds(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) data.append(key, formData[key]);
        });

        try {
            if (editingId) {
                await api.put(`/ads/${editingId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await api.post('/ads', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            resetForm();
            fetchAds();
        } catch (err) {
            console.error(err);
        }
    };

    const startEdit = (ad) => {
        setEditingId(ad.id);
        setFormData({
            title: ad.title,
            link_url: ad.link_url,
            position: ad.position,
            is_active: !!ad.is_active,
            image: null
        });
        setIsCreating(true);
    };

    const resetForm = () => {
        setIsCreating(false);
        setEditingId(null);
        setFormData({ title: '', link_url: '', position: 'sidebar', is_active: true, image: null });
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
            try {
                await api.delete(`/ads/${id}`);
                fetchAds();
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
                            <ImageIcon size={24} />
                        </div>
                        إدارة الإعلانات
                    </h2>
                    <p className="text-gray-400 text-sm font-bold mt-2 mr-14">إدارة المساحات الإعلانية في الموقع</p>
                </div>
                {!isCreating && (
                    <button 
                        onClick={() => setIsCreating(true)}
                        className="bg-[#0000ff] text-white px-8 py-4 rounded-[2rem] font-black flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-blue-600/20 group"
                    >
                        <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                        <span>إضافة إعلان جديد</span>
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isCreating && (
                    <motion.form 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        onSubmit={handleSubmit} 
                        className="bg-gray-50/50 p-10 rounded-[3.5rem] mb-12 border border-gray-100 shadow-sm space-y-8"
                    >
                        <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                            <h3 className="text-xl font-black text-gray-800">
                                {editingId ? 'تعديل الإعلان الحالي' : 'تصميم إعلان جديد'}
                            </h3>
                            <button onClick={resetForm} className="text-gray-400 hover:text-red-500 transition-colors"><X size={24} /></button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="md:col-span-2 space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">عنوان الإعلان</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full p-5 bg-white border border-gray-100 rounded-3xl shadow-sm focus:ring-4 focus:ring-[#0000ff]/10 focus:border-[#0000ff] transition-all font-bold text-gray-800"
                                    placeholder="أدخل عنواناً للإعلان..."
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">رابط الإعلان (اختياري)</label>
                                <input
                                    type="url"
                                    value={formData.link_url}
                                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                                    className="w-full p-5 bg-white border border-gray-100 rounded-3xl shadow-sm focus:ring-4 focus:ring-[#0000ff]/10 focus:border-[#0000ff] transition-all font-bold text-gray-400"
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">الموضع</label>
                                <select
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                    className="w-full p-5 bg-white border border-gray-100 rounded-3xl shadow-sm focus:ring-4 focus:ring-[#0000ff]/10 focus:border-[#0000ff] transition-all font-bold text-gray-700"
                                >
                                    <option value="header">الهيدر (الأعلى)</option>
                                    <option value="sidebar">الجانبي (Sidebar)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">صورة الإعلان {editingId && '(اختياري)'}</label>
                                <input 
                                    type="file" 
                                    onChange={handleFileChange} 
                                    className="w-full text-sm font-bold text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-[#0000ff]/5 file:text-[#0000ff] hover:file:bg-[#0000ff]/10 transition-all" 
                                    accept="image/*" 
                                    required={!editingId}
                                />
                            </div>
                            <div className="flex items-center gap-4 px-2 h-full pt-6">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input 
                                            type="checkbox" 
                                            checked={formData.is_active} 
                                            onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                            className="w-6 h-6 rounded-lg border-gray-200 text-[#0000ff] focus:ring-[#0000ff]/20 transition-all"
                                        />
                                    </div>
                                    <span className="text-sm font-black text-gray-700 group-hover:text-[#0000ff] transition-colors">تفعيل الإعلان فوراً</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-6">
                            <button type="button" onClick={resetForm} className="px-10 py-4 bg-white text-gray-500 rounded-2xl font-black border border-gray-100 hover:bg-gray-50 transition-all">إلغاء الأمر</button>
                            <button type="submit" className="px-10 py-4 bg-[#0000ff] text-white rounded-2xl font-black shadow-lg shadow-blue-600/20 hover:scale-105 transition-all">
                                {editingId ? 'تحديث الإعلان' : 'حفظ ونشر الإعلان'}
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ads.map(ad => (
                    <div key={ad.id} className="group bg-white border border-gray-100 rounded-[3rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-500 flex flex-col relative">
                        <div className="aspect-video bg-gray-50 relative overflow-hidden flex items-center justify-center p-4">
                            <img 
                                src={`http://localhost:5001${ad.image_url}`} 
                                alt={ad.title} 
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" 
                            />
                            <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                <button onClick={() => startEdit(ad)} className="bg-white/90 backdrop-blur shadow-sm p-3 rounded-xl text-blue-600 hover:bg-[#0000ff] hover:text-white transition-all"><Edit2 size={16} /></button>
                                <button onClick={() => handleDelete(ad.id)} className="bg-white/90 backdrop-blur shadow-sm p-3 rounded-xl text-red-600 hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16} /></button>
                            </div>
                            <div className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm border border-white/50 ${ad.is_active ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                                {ad.is_active ? 'نشط' : 'متوقف'}
                            </div>
                        </div>
                        <div className="p-8 flex-grow flex flex-col">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-[9px] font-black px-3 py-1 bg-blue-50 text-[#0000ff] rounded-full uppercase tracking-wider border border-blue-100">
                                    {ad.position === 'header' ? 'منطقة الهيدر' : 'المساحة الجانبية'}
                                </span>
                            </div>
                            <h3 className="font-black text-gray-800 mb-6 text-lg line-clamp-1">{ad.title}</h3>
                            {ad.link_url && (
                                <a 
                                    href={ad.link_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="mt-auto inline-flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-[#0000ff] transition-colors uppercase tracking-tight"
                                >
                                    <ExternalLink size={12} />
                                    <span className="truncate">زيارة الرابط المرفق</span>
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdManager;
