import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editSlug, setEditSlug] = useState('');

    useEffect(() => { fetchCats(); }, []);
    const fetchCats = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/categories', { name_ar: name, slug });
            setName(''); setSlug('');
            fetchCats();
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdate = async (id) => {
        try {
            await api.put(`/categories/${id}`, { name_ar: editName, slug: editSlug });
            setEditingId(null);
            fetchCats();
        } catch (err) {
            console.error(err);
        }
    };

    const startEdit = (cat) => {
        setEditingId(cat.id);
        setEditName(cat.name_ar);
        setEditSlug(cat.slug);
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا التصنيف؟')) {
            try {
                await api.delete(`/categories/${id}`);
                fetchCats();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-black mb-8">إدارة التصنيفات</h2>
            
            <form onSubmit={handleSubmit} className="bg-[#d9f1fc] p-6 rounded-[2rem] mb-8 flex flex-wrap gap-4 items-end border border-gray-100">
                <div className="flex-grow min-w-[200px]">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">اسم التصنيف</label>
                    <input 
                        type="text" 
                        placeholder="مثال: أخبار وطنية" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        className="w-full p-3 bg-sky-200/50 backdrop-blur-sm border-none rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 font-bold" 
                        required 
                    />
                </div>
                <div className="flex-grow min-w-[200px]">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">الرابط (Slug)</label>
                    <input 
                        type="text" 
                        placeholder="national-news" 
                        value={slug} 
                        onChange={e => setSlug(e.target.value)} 
                        className="w-full p-3 bg-sky-200/50 backdrop-blur-sm border-none rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 font-bold" 
                        required 
                    />
                </div>
                <button type="submit" className="bg-primary-600 text-white p-3 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20">
                    <Plus size={24} />
                </button>
            </form>

            <div className="space-y-3">
                {categories.map(c => (
                    <div key={c.id} className="flex flex-col sm:flex-row justify-between items-center p-4 bg-sky-200/50 backdrop-blur-sm border border-gray-100 rounded-2xl hover:border-primary-200 transition-all shadow-sm gap-4">
                        {editingId === c.id ? (
                            <>
                                <div className="flex flex-grow gap-2 w-full">
                                    <input 
                                        type="text" 
                                        value={editName} 
                                        onChange={e => setEditName(e.target.value)} 
                                        className="flex-grow p-2 border rounded-lg text-sm font-bold"
                                    />
                                    <input 
                                        type="text" 
                                        value={editSlug} 
                                        onChange={e => setEditSlug(e.target.value)} 
                                        className="flex-grow p-2 border rounded-lg text-sm"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleUpdate(c.id)} className="bg-green-500 text-white p-2 rounded-lg"><Check size={18} /></button>
                                    <button onClick={() => setEditingId(null)} className="bg-gray-200 text-gray-600 p-2 rounded-lg"><X size={18} /></button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex flex-col">
                                    <span className="font-black text-gray-800">{c.name_ar}</span>
                                    <span className="text-xs text-gray-400 font-bold">{c.slug}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => startEdit(c)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Edit2 size={18} /></button>
                                    <button onClick={() => handleDelete(c.id)} className="text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryManager;
