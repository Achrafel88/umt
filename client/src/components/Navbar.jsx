import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import { Menu, X, Search, User, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [navItems, setNavItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const fetchNav = async () => {
            try {
                const res = await api.get('/navigation');
                setNavItems(res.data);
            } catch (err) {
                console.error('Failed to fetch navigation', err);
            }
        };
        fetchNav();

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        return location.pathname.includes(path) && path !== '/';
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white shadow-xl h-16' : 'bg-white/90 backdrop-blur-md h-24'}`}>
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
                        <div className="flex items-center bg-gray-50/50 rounded-2xl p-1 border border-gray-100">
                            {navItems.map((item, idx) => (
                                <Link 
                                    key={item.id} 
                                    to={item.type === 'external' ? item.slug : `/${item.type}/${item.slug}`}
                                    className={`relative px-3 xl:px-4 py-2 text-[13px] xl:text-sm font-black whitespace-nowrap transition-all duration-300 rounded-xl ${
                                        isActive(item.slug) 
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' 
                                        : 'text-gray-600 hover:text-primary-600 hover:bg-white'
                                    }`}
                                >
                                    {item.title_ar}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Actions Section */}
                    <div className="flex items-center gap-2">
                        <div className="hidden sm:flex items-center bg-gray-100 rounded-xl p-1">
                            <button className="p-2 text-gray-500 hover:text-primary-600 transition-colors">
                                <Search size={18} />
                            </button>
                            <Link to="/login" className="p-2 text-gray-500 hover:text-primary-600 transition-colors">
                                <User size={18} />
                            </Link>
                        </div>
                        
                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden p-3 rounded-2xl bg-primary-50 text-primary-600 hover:bg-primary-100 transition-all"
                        >
                            {isOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Sidebar Style */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden"
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[80%] max-w-xs bg-white shadow-2xl z-[60] lg:hidden overflow-y-auto"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-8">
                                    <img src="/logo.png" alt="Logo" className="h-10" />
                                    <button onClick={() => setIsOpen(false)} className="p-2 bg-gray-100 rounded-xl">
                                        <X size={20} />
                                    </button>
                                </div>
                                
                                <div className="space-y-2">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.id}
                                            to={item.type === 'external' ? item.slug : `/${item.type}/${item.slug}`}
                                            className={`block px-4 py-4 rounded-2xl text-base font-black transition-all ${
                                                isActive(item.slug)
                                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                                            }`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.title_ar}
                                        </Link>
                                    ))}
                                </div>

                                <div className="mt-10 pt-10 border-t border-gray-100">
                                    <Link 
                                        to="/login" 
                                        className="flex items-center justify-center gap-3 w-full p-4 bg-gray-900 text-white rounded-2xl font-black shadow-xl"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <User size={20} />
                                        <span>حسابي</span>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
