import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Lock, User as UserIcon } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-[80svh] flex items-center justify-center px-4 bg-[#d9f1fc]">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-sky-200/50 backdrop-blur-sm p-10 rounded-[2.5rem] shadow-xl w-full max-w-md border border-gray-100"
            >
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-600/20">
                        <LogIn size={32} />
                    </div>
                </div>
                
                <h2 className="text-3xl font-black text-center text-gray-900 mb-2">تسجيل الدخول</h2>
                <p className="text-center text-gray-400 text-sm font-bold mb-8">مرحباً بك في لوحة تحكم UMT بريس</p>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-primary-50 text-primary-700 p-4 rounded-2xl mb-6 text-sm font-bold border border-primary-100 text-center"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">اسم المستخدم</label>
                        <div className="relative">
                            <UserIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pr-12 pl-4 py-4 bg-[#d9f1fc] border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold transition-all"
                                placeholder="أدخل اسم المستخدم"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">كلمة المرور</label>
                        <div className="relative">
                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pr-12 pl-4 py-4 bg-[#d9f1fc] border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-bold transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary-600 text-white py-4 rounded-2xl font-black hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 mt-4"
                    >
                        دخول
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
