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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black flex items-center gap-2">
                        <ImageIcon className="text-primary-600" />
                        إدارة الإعلانات
                    </h2>
                    <p className="text-gray-400 text-xs font-bold mt-1">إدارة المساحات الإعلانية في الموقع</p>
                </div>
                {!isCreating && (
                    <button 
                        onClick={() => setIsCreating(true)}
                        className="bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20"
                    >
                        <Plus size={20} />
                        <span>إضافة إعلان جديد</span>
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isCreating && (
                    <motion.form 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmit} 
                        className="bg-gray-50 p-8 rounded-[2.5rem] mb-10 border border-gray-100 shadow-inner space-y-6 overflow-hidden"
                    >
                        <h3 className="text-lg font-black text-gray-800 mb-2">
                            {editingId ? 'تعديل الإعلان' : 'إضافة إعلان جديد'}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">عنوان الإعلان</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full p-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500 font-bold"
                                    placeholder="أدخل عنواناً للإعلان..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">رابط الإعلان</label>
                                <input
                                    type="url"
                                    value={formData.link_url}
                                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                                    className="w-full p-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500 font-bold"
                                    placeholder="https://..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">الموضع</label>
                                <select
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                    className="w-full p-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500 font-bold text-gray-700"
                                >
                                    <option value="header">الهيدر (الأعلى)</option>
                                    <option value="sidebar">الجانبي (Sidebar)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">صورة الإعلان {editingId && '(اختياري)'}</label>
                                <input 
                                    type="file" 
                                    onChange={handleFileChange} 
                                    className="w-full text-sm font-bold text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" 
                                    accept="image/*" 
                                    required={!editingId}
                                />
                            </div>
                            <div className="flex items-center gap-3 px-1">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.is_active} 
                                        onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                        className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm font-bold text-gray-700">تفعيل الإعلان</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button type="button" onClick={resetForm} className="px-8 py-3 bg-gray-200 text-gray-600 rounded-2xl font-black hover:bg-gray-300 transition-all">إلغاء</button>
                            <button type="submit" className="px-8 py-3 bg-primary-600 text-white rounded-2xl font-black hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20">
                                {editingId ? 'تحديث الإعلان' : 'حفظ الإعلان'}
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ads.map(ad => (
                    <div key={ad.id} className="group bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm hover:border-primary-200 hover:shadow-md transition-all flex flex-col">
                        <div className="aspect-video bg-gray-50 relative overflow-hidden flex items-center justify-center">
                            <img 
                                src={`http://localhost:5001${ad.image_url}`} 
                                alt={ad.title} 
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                            />
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button onClick={() => startEdit(ad)} className="bg-white/90 backdrop-blur p-2 rounded-xl text-blue-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 size={16} /></button>
                                <button onClick={() => handleDelete(ad.id)} className="bg-white/90 backdrop-blur p-2 rounded-xl text-primary-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                            </div>
                            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${ad.is_active ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                                {ad.is_active ? 'نشط' : 'متوقف'}
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-black px-2 py-0.5 bg-primary-50 text-primary-600 rounded-md uppercase tracking-wider">
                                    {ad.position === 'header' ? 'الهيدر' : 'الجانبي'}
                                </span>
                            </div>
                            <h3 className="font-black text-gray-800 mb-3">{ad.title}</h3>
                            <a 
                                href={ad.link_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary-600 transition-colors"
                            >
                                <ExternalLink size={14} />
                                <span className="truncate max-w-[200px]">{ad.link_url}</span>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdManager;
