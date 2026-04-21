import React from 'react';
import { User, Link as LinkIcon } from 'lucide-react';

const ContactUs = () => {
    // These are the members you added in the dashboard
    const team = [
        { id: 1, name: 'محمد علوي', role: 'مدير التواصل', facebook: '#' },
        { id: 2, name: 'فاطمة الزهراء', role: 'منسقة الإعلام', facebook: '#' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-20 px-4">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-5xl font-black mb-16 text-center text-gray-900">فريق التواصل</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {team.map((member) => (
                        <div key={member.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-all">
                            <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-6 overflow-hidden border-4 border-white shadow-inner">
                                <User size={40} className="text-primary-600" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-800 mb-2">{member.name}</h3>
                            <p className="text-primary-600 font-bold text-sm mb-6 uppercase tracking-wider">{member.role}</p>
                            <a 
                                href={member.facebook} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors"
                            >
                                <LinkIcon size={16} />
                                <span>رابط التواصل</span>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
