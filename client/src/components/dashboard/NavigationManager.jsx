import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Trash2, Edit2, ArrowUp, ArrowDown, Share2, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NavigationManager = () => {
    const [items, setItems] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState({ title_ar: '', slug: '', type: 'category', linked_id: '', order: 0 });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await api.get('/navigation');
            setItems(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentItem({ title_ar: '', slug: '', type: 'category', linked_id: '', order: items.length });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentItem.id) {
                await api.put(`/navigation/${currentItem.id}`, currentItem);
            } else {
                await api.post('/navigation', currentItem);
            }
            resetForm();
            fetchItems();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
            try {
                await api.delete(`/navigation/${id}`);
                fetchItems();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleReorder = async (id, direction) => {
        const index = items.findIndex(item => item.id === id);
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === items.length - 1) return;

        const newItems = [...items];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];

        const reordered = newItems.map((item, idx) => ({ id: item.id, order: idx + 1 }));
        try {
            await api.post('/navigation/reorder', { items: reordered });
            fetchItems();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black flex items-center gap-2">
                        <Share2 className="text-primary-600" />
                        إدارة القائمة الرئيسية
                    </h2>
                    <p className="text-gray-400 text-xs font-bold mt-1">ترتيب وتنظيم روابط الملاحة</p>
                </div>
                {!isEditing && (
                    <button 
                        onClick={() => { setIsEditing(true); setCurrentItem({ title_ar: '', slug: '', type: 'category', linked_id: '', order: items.length + 1 }); }}
                        className="bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20"
                    >
                        <Plus size={20} />
                        <span>إضافة رابط جديد</span>
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isEditing && (
                    <motion.form 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmit} 
                        className="bg-gray-50 p-8 rounded-[2.5rem] mb-10 border border-gray-100 shadow-inner space-y-6 overflow-hidden"
                    >
                        <h3 className="text-lg font-black text-gray-800">
                            {currentItem.id ? 'تعديل رابط القائمة' : 'إضافة رابط جديد للقائمة'}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">اسم الرابط (بالعربية)</label>
                                <input
                                    type="text"
                                    value={currentItem.title_ar}
                                    onChange={(e) => setCurrentItem({ ...currentItem, title_ar: e.target.value })}
                                    className="w-full p-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500 font-bold"
                                    placeholder="مثال: الرئيسية، أخبارنا..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">الرابط / Slug</label>
                                <input
                                    type="text"
                                    value={currentItem.slug}
                                    onChange={(e) => setCurrentItem({ ...currentItem, slug: e.target.value })}
                                    className="w-full p-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500 font-bold"
                                    placeholder="/"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">النوع</label>
                                <select
                                    value={currentItem.type}
                                    onChange={(e) => setCurrentItem({ ...currentItem, type: e.target.value })}
                                    className="w-full p-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500 font-bold text-gray-700"
                                >
                                    <option value="category">تصنيف أخبار</option>
                                    <option value="page">صفحة تعريفية</option>
                                    <option value="external">رابط خارجي</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">ID المرتبط (اختياري)</label>
                                <input
                                    type="number"
                                    value={currentItem.linked_id || ''}
                                    onChange={(e) => setCurrentItem({ ...currentItem, linked_id: e.target.value })}
                                    className="w-full p-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500 font-bold"
                                    placeholder="ID للتصنيف أو الصفحة"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button type="button" onClick={resetForm} className="px-8 py-3 bg-gray-200 text-gray-600 rounded-2xl font-black hover:bg-gray-300 transition-all">إلغاء</button>
                            <button type="submit" className="px-8 py-3 bg-primary-600 text-white rounded-2xl font-black hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20">
                                {currentItem.id ? 'تحديث الرابط' : 'حفظ الرابط'}
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                <div className="divide-y divide-gray-50">
                    {items.map((item, index) => (
                        <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between p-6 hover:bg-gray-50/50 transition-all group gap-4">
                            <div className="flex items-center gap-6 w-full sm:w-auto">
                                <div className="text-gray-200 font-black text-2xl group-hover:text-primary-100 transition-colors">
                                    {String(index + 1).padStart(2, '0')}
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-800 flex items-center gap-2">
                                        {item.title_ar}
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${
                                            item.type === 'category' ? 'bg-primary-50 text-primary-600' :
                                            item.type === 'page' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {item.type}
                                        </span>
                                    </h3>
                                    <p className="text-xs text-gray-400 font-bold mt-1">{item.slug}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                <div className="flex bg-gray-100 p-1 rounded-xl mr-2">
                                    <button 
                                        onClick={() => handleReorder(item.id, 'up')} 
                                        disabled={index === 0}
                                        className="p-2 text-gray-400 hover:text-primary-600 disabled:opacity-30 transition-colors"
                                    >
                                        <ArrowUp size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleReorder(item.id, 'down')} 
                                        disabled={index === items.length - 1}
                                        className="p-2 text-gray-400 hover:text-primary-600 disabled:opacity-30 transition-colors"
                                    >
                                        <ArrowDown size={18} />
                                    </button>
                                </div>
                                <button 
                                    onClick={() => { setIsEditing(true); setCurrentItem(item); }}
                                    className="p-3 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                                    title="تعديل"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(item.id)} 
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
        </div>
    );
};

export default NavigationManager;
