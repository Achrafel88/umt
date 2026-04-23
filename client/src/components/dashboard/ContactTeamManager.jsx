import React, { useState, useEffect } from 'react';
import { User, Link as LinkIcon, Trash2, Plus, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const ContactTeamManager = () => {
    const [team, setTeam] = useState([]);
    const [newMember, setNewMember] = useState({ name: '', role: '', facebook: '', image: null });
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            const res = await api.get('/contact-team');
            setTeam(res.data);
        } catch (err) {
            console.error('Error fetching team:', err);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setNewMember({ ...newMember, image: file });
        setImagePreview(URL.createObjectURL(file));
    };

    const addMember = async () => {
        if (newMember.name && newMember.role) {
            try {
                const formData = new FormData();
                formData.append('name', newMember.name);
                formData.append('role', newMember.role);
                formData.append('facebook', newMember.facebook);
                if (newMember.image) {
                    formData.append('image', newMember.image);
                }

                await api.post('/contact-team', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                setNewMember({ name: '', role: '', facebook: '', image: null });
                setImagePreview(null);
                fetchTeam();
            } catch (err) {
                alert('فشل إضافة العضو: ' + (err.response?.data?.error || err.message));
            }
        }
    };

    const removeMember = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا العضو؟')) {
            try {
                await api.delete(`/contact-team/${id}`);
                fetchTeam();
            } catch (err) {
                alert('فشل الحذف');
            }
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-black mb-8">إدارة فريق التواصل</h2>
            
            <div className="bg-[#d9f1fc] p-6 rounded-[2rem] mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div>
                    <label className="block text-xs font-black text-gray-400 mb-2">صورة العضو</label>
                    <label className="flex items-center justify-center p-3 rounded-xl bg-sky-200/50 backdrop-blur-sm cursor-pointer border border-dashed border-gray-300">
                        {imagePreview ? <img src={imagePreview} className="w-10 h-10 object-cover rounded-full" /> : <Upload size={20} className="text-gray-400" />}
                        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </label>
                </div>
                <div>
                    <label className="block text-xs font-black text-gray-400 mb-2">الاسم الكامل</label>
                    <input className="w-full p-3 rounded-xl border-none font-bold" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} placeholder="محمد علوي" />
                </div>
                <div>
                    <label className="block text-xs font-black text-gray-400 mb-2">المسمى الوظيفي</label>
                    <input className="w-full p-3 rounded-xl border-none font-bold" value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})} placeholder="مدير التواصل" />
                </div>
                <div>
                    <label className="block text-xs font-black text-gray-400 mb-2">رابط فيسبوك</label>
                    <input className="w-full p-3 rounded-xl border-none font-bold" value={newMember.facebook} onChange={e => setNewMember({...newMember, facebook: e.target.value})} placeholder="#" />
                </div>
                <button onClick={addMember} className="bg-red-700 text-white p-3 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-red-800 transition-all">
                    <Plus size={20} /> إضافة
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.map(member => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={member.id} 
                        className="bg-sky-200/50 backdrop-blur-sm p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center text-center group"
                    >
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 overflow-hidden border-2 border-primary-100">
                            {member.image_url ? (
                                <img src={`http://localhost:5001${member.image_url}`} className="w-full h-full object-cover" alt={member.name} />
                            ) : (
                                <User size={32} className="text-gray-300" />
                            )}
                        </div>
                        <h3 className="font-black text-lg text-gray-800">{member.name}</h3>
                        <p className="text-red-700 font-bold text-sm mb-4">{member.role}</p>
                        <div className="flex items-center gap-4 w-full justify-center pt-4 border-t border-gray-50">
                            <a href={member.facebook} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors"><LinkIcon size={20} /></a>
                            <button onClick={() => removeMember(member.id)} className="text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={20} /></button>
                        </div>
                    </motion.div>
                ))}
            </div>
            {team.length === 0 && (
                <div className="text-center py-10 text-gray-400 font-bold">لا يوجد أعضاء في الفريق حالياً</div>
            )}
        </div>
    );
};

export default ContactTeamManager;
