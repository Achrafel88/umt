import React, { useState, useEffect } from 'react';
import { User, Link as LinkIcon, Mail, Phone, MapPin } from 'lucide-react';
import api from '../../services/api';
import { motion } from 'framer-motion';

const ContactUs = () => {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await api.get('/contact-team');
                setTeam(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching team:', err);
                setLoading(false);
            }
        };
        fetchTeam();
    }, []);

    return (
        <div className="min-h-screen bg-[#d9f1fc] py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-20">
                    <h1 className="text-5xl font-black mb-6 text-gray-900">تواصل معنا</h1>
                    <div className="w-24 h-2 bg-primary-600 mx-auto rounded-full"></div>
                    <p className="mt-6 text-gray-500 font-bold text-lg">نحن هنا للإجابة على تساؤلاتكم ودعمكم</p>
                </header>
                
                <section className="mb-24">
                    <h2 className="text-3xl font-black mb-12 text-center flex items-center justify-center gap-3">
                        <span className="w-10 h-1 bg-primary-600 rounded-full"></span>
                        فريق التواصل
                        <span className="w-10 h-1 bg-primary-600 rounded-full"></span>
                    </h2>
                    
                    {loading ? (
                        <div className="text-center font-bold text-gray-400 animate-pulse">جاري تحميل أعضاء الفريق...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {team.map((member) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={member.id} 
                                    className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-all group"
                                >
                                    <div className="w-24 h-24 bg-[#d9f1fc] rounded-full flex items-center justify-center mb-6 overflow-hidden border-4 border-white shadow-inner group-hover:scale-105 transition-transform">
                                        {member.image_url ? (
                                            <img src={`http://localhost:5001${member.image_url}`} className="w-full h-full object-cover" alt={member.name} />
                                        ) : (
                                            <User size={40} className="text-gray-300" />
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-800 mb-2">{member.name}</h3>
                                    <p className="text-primary-600 font-bold text-sm mb-6 uppercase tracking-wider">{member.role}</p>
                                    <a 
                                        href={member.facebook} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-600 transition-colors"
                                    >
                                        <LinkIcon size={16} />
                                        <span>رابط التواصل</span>
                                    </a>
                                </motion.div>
                            ))}
                        </div>
                    )}
                    {!loading && team.length === 0 && (
                        <div className="text-center py-10 text-gray-400 font-bold">لا يوجد أعضاء في الفريق حالياً</div>
                    )}
                </section>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-primary-600 p-10 rounded-[2.5rem] text-white flex flex-col items-center text-center shadow-lg shadow-primary-600/20">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                            <MapPin size={28} />
                        </div>
                        <h4 className="text-xl font-black mb-2">المقر المركزي</h4>
                        <p className="font-bold opacity-90">الدار البيضاء، المغرب</p>
                    </div>
                    <div className="bg-gray-900 p-10 rounded-[2.5rem] text-white flex flex-col items-center text-center shadow-lg">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                            <Mail size={28} />
                        </div>
                        <h4 className="text-xl font-black mb-2">البريد الإلكتروني</h4>
                        <p className="font-bold opacity-90">contact@umt.ma</p>
                    </div>
                    <div className="bg-white p-10 rounded-[2.5rem] text-gray-900 border border-gray-100 flex flex-col items-center text-center shadow-sm">
                        <div className="w-14 h-14 bg-[#d9f1fc] rounded-2xl flex items-center justify-center mb-6">
                            <Phone size={28} className="text-primary-600" />
                        </div>
                        <h4 className="text-xl font-black mb-2">الهاتف</h4>
                        <p className="font-bold text-gray-500">05 22 XX XX XX</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
