import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Trash2, Edit2, Check, X, MapPin } from 'lucide-react';

const CityManager = () => {
    const [cities, setCities] = useState([]);
    const [name, setName] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');

    useEffect(() => { fetchCities(); }, []);
    const fetchCities = async () => {
        try {
            const res = await api.get('/cities');
            setCities(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/cities', { name_ar: name });
            setName('');
            fetchCities();
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdate = async (id) => {
        try {
            await api.put(`/cities/${id}`, { name_ar: editName });
            setEditingId(null);
            fetchCities();
        } catch (err) {
            console.error(err);
        }
    };

    const startEdit = (city) => {
        setEditingId(city.id);
        setEditName(city.name_ar);
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذه المدينة؟')) {
            try {
                await api.delete(`/cities/${id}`);
                fetchCities();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-black mb-8 flex items-center gap-2">
                <MapPin className="text-primary-600" />
                إدارة المدن
            </h2>
            
            <form onSubmit={handleSubmit} className="bg-[#d9f1fc] p-6 rounded-[2rem] mb-8 flex gap-4 items-end border border-gray-100">
                <div className="flex-grow">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">اسم المدينة</label>
                    <input 
                        type="text" 
                        placeholder="مثال: الدار البيضاء" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        className="w-full p-3 bg-sky-200/50 backdrop-blur-sm border-none rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 font-bold" 
                        required 
                    />
                </div>
                <button type="submit" className="bg-primary-600 text-white p-3 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20">
                    <Plus size={24} />
                </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cities.map(c => (
                    <div key={c.id} className="flex justify-between items-center p-4 bg-sky-200/50 backdrop-blur-sm border border-gray-100 rounded-2xl hover:border-primary-200 transition-all shadow-sm">
                        {editingId === c.id ? (
                            <div className="flex gap-2 w-full">
                                <input 
                                    type="text" 
                                    value={editName} 
                                    onChange={e => setEditName(e.target.value)} 
                                    className="flex-grow p-2 border rounded-lg text-sm font-bold"
                                />
                                <button onClick={() => handleUpdate(c.id)} className="bg-green-500 text-white p-2 rounded-lg"><Check size={18} /></button>
                                <button onClick={() => setEditingId(null)} className="bg-gray-200 text-gray-600 p-2 rounded-lg"><X size={18} /></button>
                            </div>
                        ) : (
                            <>
                                <span className="font-black text-gray-700">{c.name_ar}</span>
                                <div className="flex gap-1">
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

export default CityManager;
