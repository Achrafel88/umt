import React, { useState } from 'react';
import { User, Link as LinkIcon, Trash2, Plus, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactTeamManager = () => {
    const [team, setTeam] = useState([
        { id: 1, name: 'محمد علوي', role: 'مدير التواصل', facebook: '#', image: null },
        { id: 2, name: 'فاطمة الزهراء', role: 'منسقة الإعلام', facebook: '#', image: null }
    ]);

    const [newMember, setNewMember] = useState({ name: '', role: '', facebook: '', image: null });

    const addMember = () => {
        if (newMember.name && newMember.role) {
            setTeam([...team, { ...newMember, id: Date.now() }]);
            setNewMember({ name: '', role: '', facebook: '', image: null });
        }
    };

    const removeMember = (id) => {
        setTeam(team.filter(m => m.id !== id));
    };

    return (
        <div>
            <h2 className="text-2xl font-black mb-8">إدارة فريق التواصل</h2>
            
            <div className="bg-gray-50 p-6 rounded-[2rem] mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div>
                    <label className="block text-xs font-black text-gray-400 mb-2">صورة العضو</label>
                    <label className="flex items-center justify-center p-3 rounded-xl bg-white cursor-pointer border border-dashed border-gray-300">
                        <Upload size={20} className="text-gray-400" />
                        <input type="file" className="hidden" onChange={e => setNewMember({...newMember, image: URL.createObjectURL(e.target.files[0])})} />
                    </label>
                </div>
                <div>
                    <label className="block text-xs font-black text-gray-400 mb-2">الاسم الكامل</label>
                    <input className="w-full p-3 rounded-xl border-none" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} placeholder="محمد علوي" />
                </div>
                <div>
                    <label className="block text-xs font-black text-gray-400 mb-2">المسمى الوظيفي</label>
                    <input className="w-full p-3 rounded-xl border-none" value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})} placeholder="مدير التواصل" />
                </div>
                <div>
                    <label className="block text-xs font-black text-gray-400 mb-2">رابط فيسبوك</label>
                    <input className="w-full p-3 rounded-xl border-none" value={newMember.facebook} onChange={e => setNewMember({...newMember, facebook: e.target.value})} placeholder="#" />
                </div>
                <button onClick={addMember} className="bg-primary-600 text-white p-3 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-primary-700">
                    <Plus size={20} /> إضافة
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.map(member => (
                    <motion.div key={member.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center text-center group">
                        <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                            {member.image ? <img src={member.image} className="w-full h-full object-cover" /> : <User size={32} className="text-primary-600" />}
                        </div>
                        <h3 className="font-black text-lg">{member.name}</h3>
                        <p className="text-primary-600 font-bold text-sm mb-4">{member.role}</p>
                        <div className="flex items-center gap-4 w-full justify-center pt-4 border-t border-gray-50">
                            <a href={member.facebook} target="_blank" className="text-gray-400 hover:text-blue-600"><LinkIcon size={20} /></a>
                            <button onClick={() => removeMember(member.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={20} /></button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ContactTeamManager;