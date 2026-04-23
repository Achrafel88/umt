import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NavigationManager from '../components/dashboard/NavigationManager';
import ArticleManager from '../components/dashboard/ArticleManager';
import CityManager from '../components/dashboard/CityManager';
import AuthorManager from '../components/dashboard/AuthorManager';
import PageManager from '../components/dashboard/PageManager';
import AdManager from '../components/dashboard/AdManager';
import UserManager from '../components/dashboard/UserManager';
import DashboardHome from '../components/dashboard/DashboardHome';
import { LayoutDashboard, Newspaper, Settings, MapPin, FileText, Share2, Users, Image as ImageIcon, LogOut, UserCircle } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Move hooks to the top, but ensure they don't depend on user until it's checked
    const [activeTab, setActiveTab] = useState(user?.role === 'admin_principal' ? 'home' : 'articles');

    React.useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) return null;

    const isAdminPrincipal = user.role === 'admin_principal';

    // Tabs for Admin Principal
    const adminTabs = [
        { id: 'home', name: 'الرئيسية', icon: <LayoutDashboard size={18} /> },
        { id: 'articles', name: 'المقالات', icon: <Newspaper size={18} /> },
        { id: 'navigation', name: 'إدارة القائمة الرئيسية', icon: <Share2 size={18} /> },
        { id: 'cities', name: 'المدن', icon: <MapPin size={18} /> },
        { id: 'authors', name: 'المكاتب النقابية', icon: <UserCircle size={18} /> },
        { id: 'pages', name: 'الصفحات', icon: <FileText size={18} /> },
        { id: 'ads', name: 'الإعلانات', icon: <ImageIcon size={18} /> },
        { id: 'users', name: 'المستخدمين', icon: <Users size={18} /> },
    ];

    // Tabs for Admin Secondaire (only articles/files)
    const secondaryTabs = [
        { id: 'articles', name: 'إضافة مقال', icon: <Newspaper size={18} /> },
    ];

    const tabs = isAdminPrincipal ? adminTabs : secondaryTabs;

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header Card */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-600/20">
                            <LayoutDashboard size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-gray-900">لوحة التحكم</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-gray-400 font-bold text-sm">أهلاً بك،</span>
                                <span className="text-primary-600 font-black text-sm">{user.username}</span>
                                <span className="mx-2 w-1 h-1 bg-gray-200 rounded-full"></span>
                                <span className="text-[10px] font-black px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md uppercase tracking-wider">
                                    {isAdminPrincipal ? 'أدمن رئيسي' : 'أدمن ثانوي'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => { logout(); navigate('/'); }}
                        className="group flex items-center gap-2 bg-gray-50 hover:bg-primary-50 text-gray-500 hover:text-primary-600 px-6 py-3 rounded-2xl font-bold transition-all border border-gray-100"
                    >
                        <span>تسجيل الخروج</span>
                        <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden sticky top-32">
                            <div className="p-4 space-y-2">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-sm transition-all duration-300 ${
                                            activeTab === tab.id 
                                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20 translate-x-1' 
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-primary-600'
                                        }`}
                                    >
                                        <span className={activeTab === tab.id ? 'text-white' : 'text-gray-400'}>
                                            {tab.icon}
                                        </span>
                                        {tab.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-9">
                        <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 min-h-[600px]">
                            {activeTab === 'home' && <DashboardHome />}
                            {activeTab === 'articles' && <ArticleManager />}
                            {activeTab === 'navigation' && <NavigationManager />}
                            {activeTab === 'cities' && <CityManager />}
                            {activeTab === 'authors' && <AuthorManager />}
                            {activeTab === 'pages' && <PageManager />}
                            {activeTab === 'ads' && <AdManager />}
                            {activeTab === 'users' && <UserManager />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
