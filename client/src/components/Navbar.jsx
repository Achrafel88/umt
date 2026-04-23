import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import { Menu, X, Search, User, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [navItems, setNavItems] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        fetchNav();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fetchNav = async () => {
        try {
            const res = await api.get('/navigation');
            setNavItems(res.data);
        } catch (err) {
            console.error('Failed to fetch navigation', err);
        }
    };

    const isActive = (slug, type) => {
        const path = type === 'external' ? slug : `/${type}/${slug}`;
        return location.pathname === path;
    };

    const getLinkPath = (item) => {
        if (item.type === 'external') return item.slug;
        return `/${item.type}/${item.slug}`;
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 shadow-lg h-16' : 'bg-white/50 h-24'} backdrop-blur-md border-b border-gray-100`}>
            <div className="max-w-[1400px] mx-auto h-full px-4 sm:px-6">
                <div className="flex items-center justify-between h-full gap-4">

                    {/* Logo Section */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-shrink-0"
                    >
                        <Link to="/" className="flex items-center">
                            <img 
                                src="/logo.png" 
                                alt="UMT Logo" 
                                className={`transition-all duration-500 object-contain ${scrolled ? 'h-10' : 'h-16'}`}
                            />
                        </Link>
                    </motion.div>

                    {/* Main Navigation - Desktop */}
                    <div className="hidden lg:flex items-center flex-grow justify-center overflow-hidden">
                        <div className="flex items-center gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.id}
                                    to={getLinkPath(item)}
                                    className={`relative px-4 py-2 text-sm font-black transition-all duration-300 rounded-xl ${
                                        isActive(item.slug, item.type)
                                        ? 'text-[#0000ff] bg-blue-50'
                                        : 'text-gray-600 hover:text-[#0000ff] hover:bg-gray-50'
                                    }`}
                                >
                                    {item.title_ar}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Actions Section */}
                    <div className="flex items-center gap-2">
                        <div className="hidden sm:flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                            <button className="p-2 text-gray-400 hover:text-[#0000ff] rounded-lg transition-colors">
                                <Search size={18} />
                            </button>
                            <Link to="/login" className="p-2 text-gray-400 hover:text-[#0000ff] rounded-lg transition-colors">
                                <User size={18} />
                            </Link>
                        </div>
                        
                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden p-3 rounded-2xl bg-gray-50 text-gray-600 hover:text-[#0000ff] border border-gray-100 transition-all"
                        >
                            {isOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Left Sidebar Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[10000] lg:hidden">
                        {/* Semi-transparent Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-md"
                        />
                        
                        {/* Sidebar Container */}
                        <motion.div 
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col border-r border-gray-100 h-screen"
                        >
                            {/* Sidebar Header */}
                            <div className="p-6 flex justify-between items-center border-b border-gray-50 shrink-0">
                                <img src="/logo.png" alt="Logo" className="h-10" />
                                <button 
                                    onClick={() => setIsOpen(false)} 
                                    className="p-3 bg-gray-50 text-gray-900 rounded-2xl border border-gray-100 active:scale-90 transition-transform"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            
                            {/* Navigation Links - Scrollable Area */}
                            <div className="flex-grow overflow-y-auto py-8 px-4">
                                <div className="space-y-2">
                                    {navItems.map((item, idx) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: idx * 0.04 }}
                                        >
                                            <Link
                                                to={getLinkPath(item)}
                                                className={`group flex items-center justify-between p-5 rounded-3xl transition-all ${
                                                    isActive(item.slug, item.type)
                                                    ? 'bg-[#0000ff] text-white shadow-xl shadow-blue-600/30'
                                                    : 'text-gray-800 hover:bg-gray-50'
                                                }`}
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <span className="text-lg font-black">{item.title_ar}</span>
                                                <ArrowLeft 
                                                    size={18} 
                                                    className={`transition-all duration-500 scale-x-[-1] ${
                                                        isActive(item.slug, item.type) ? 'opacity-100' : 'opacity-0 translate-x-2 group-hover:opacity-40 group-hover:translate-x-0'
                                                    }`} 
                                                />
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Sidebar Footer */}
                            <div className="p-6 border-t border-gray-50 bg-gray-50/50 shrink-0">
                                <Link 
                                    to="/login" 
                                    className="flex items-center justify-center gap-3 w-full p-5 bg-gray-900 text-white rounded-3xl font-black shadow-xl hover:bg-black transition-all"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <User size={20} />
                                    <span>حسابي الشخصي</span>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
