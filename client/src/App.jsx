import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ArticleDetail from './pages/ArticleDetail';
import ContactUs from './pages/statics/ContactUs';
import CategoryPage from './pages/CategoryPage';
import StaticPage from './pages/StaticPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#f8fafc] flex flex-col">
          <Navbar />
          <main className="flex-grow pt-28 lg:pt-32">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/article/:id" element={<ArticleDetail />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/page/:slug" element={<StaticPage />} />
            </Routes>
          </main>
          <footer className="bg-white border-t py-8 text-center">
            <p className="font-bold text-gray-800">© {new Date().getFullYear()} UMT - الاتحاد المغربي للشغل</p>
            <p className="text-sm font-black text-[#0000ff] mt-2 tracking-wide uppercase">Developed by Aedev - Badreddine Ouakili</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
