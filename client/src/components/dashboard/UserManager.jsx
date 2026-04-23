import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { UserPlus, Trash2, Shield, Edit2, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ username: '', password: '', role: 'admin_secondaire' });

    useEffect(() => { fetchUsers(); }, []);
    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const resetForm = () => {
        setIsCreating(false);
        setEditingId(null);
        setFormData({ username: '', password: '', role: 'admin_secondaire' });
    };

    const startEdit = (user) => {
        setEditingId(user.id);
        setFormData({ 
            username: user.username, 
            password: '', // Leave empty for no change
            role: user.role 
        });
        setIsCreating(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/users/${editingId}`, formData);
                alert('تم تحديث المستخدم بنجاح');
            } else {
                await api.post('/users', formData);
                alert('تم إنشاء المستخدم بنجاح');
            }
            resetForm();
            fetchUsers();
        } catch (err) {
            const serverMsg = err.response?.data?.message || err.response?.data?.error;
            alert(`فشل: ${serverMsg || err.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
            try {
                await api.delete(`/users/${id}`);
                fetchUsers();
            } catch (err) {
                alert(err.response?.data?.message || 'Error deleting user');
            }
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black flex items-center gap-2">
                        <Shield className="text-primary-600" />
                        إدارة المستخدمين
                    </h2>
                    <p className="text-gray-400 text-xs font-bold mt-1">إدارة الطاقم الإداري والصلاحيات</p>
                </div>
                {!isCreating && (
                    <button 
                        onClick={() => setIsCreating(true)} 
                        className="bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20"
                    >
                        <UserPlus size={20} />
                        <span>إضافة أدمن جديد</span>
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
                        className="bg-[#d9f1fc] p-8 rounded-[2.5rem] mb-10 border border-gray-100 shadow-inner space-y-6 overflow-hidden"
                    >
                        <h3 className="text-lg font-black text-gray-800">
                            {editingId ? 'تعديل بيانات المستخدم' : 'إنشاء حساب مستخدم جديد'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">اسم المستخدم</label>
                                <input 
                                    type="text" 
                                    value={formData.username} 
                                    onChange={e => setFormData({...formData, username: e.target.value})} 
                                    className="w-full p-4 bg-sky-200/50 backdrop-blur-sm border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500 font-bold" 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                                    كلمة المرور {editingId && '(اتركها فارغة لعدم التغيير)'}
                                </label>
                                <input 
                                    type="password" 
                                    value={formData.password} 
                                    onChange={e => setFormData({...formData, password: e.target.value})} 
                                    className="w-full p-4 bg-sky-200/50 backdrop-blur-sm border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500 font-bold" 
                                    required={!editingId}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">الدور / الصلاحية</label>
                                <select 
                                    value={formData.role} 
                                    onChange={e => setFormData({...formData, role: e.target.value})}
                                    className="w-full p-4 bg-sky-200/50 backdrop-blur-sm border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-500 font-bold text-gray-700"
                                >
                                    <option value="admin_secondaire">أدمن ثانوي (محرر)</option>
                                    <option value="admin_principal">أدمن رئيسي (مدير)</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button type="button" onClick={resetForm} className="px-8 py-3 bg-gray-200 text-gray-600 rounded-2xl font-black hover:bg-gray-300 transition-all">إلغاء</button>
                            <button type="submit" className="px-8 py-3 bg-primary-600 text-white rounded-2xl font-black hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20">
                                {editingId ? 'تحديث البيانات' : 'حفظ المستخدم'}
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="bg-sky-200/50 backdrop-blur-sm rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-right border-collapse">
                    <thead className="bg-[#d9f1fc] border-b border-gray-100">
                        <tr>
                            <th className="p-6 font-black text-xs text-gray-400 uppercase tracking-widest">المستخدم</th>
                            <th className="p-6 font-black text-xs text-gray-400 uppercase tracking-widest">الصلاحية</th>
                            <th className="p-6 font-black text-xs text-gray-400 uppercase tracking-widest">تاريخ الانضمام</th>
                            <th className="p-6 font-black text-xs text-gray-400 uppercase tracking-widest text-center">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map(u => (
                            <tr key={u.id} className="hover:bg-[#d9f1fc]/50 transition-colors group">
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                            <Shield size={20} />
                                        </div>
                                        <span className="font-black text-gray-800">{u.username}</span>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest ${u.role === 'admin_principal' ? 'bg-primary-100 text-primary-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {u.role === 'admin_principal' ? 'مدير نظام' : 'محرر محتوى'}
                                    </span>
                                </td>
                                <td className="p-6 text-sm text-gray-400 font-black">
                                    {new Date(u.created_at).toLocaleDateString('ar-EG')}
                                </td>
                                <td className="p-6">
                                    <div className="flex justify-center gap-2">
                                        <button 
                                            onClick={() => startEdit(u)} 
                                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                                            title="تعديل"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        {u.role !== 'admin_principal' && (
                                            <button 
                                                onClick={() => handleDelete(u.id)} 
                                                className="p-2 text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
                                                title="حذف"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default UserManager;
