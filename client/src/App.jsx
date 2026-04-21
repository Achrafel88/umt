import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ArticleDetail from './pages/ArticleDetail';
import ContactUs from './pages/statics/ContactUs';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow pt-28 lg:pt-32">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/article/:id" element={<ArticleDetail />} />
              <Route path="/contact" element={<ContactUs />} />
            </Routes>
          </main>
          <footer className="bg-white border-t py-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} UMT - الاتحاد المغربي للشغل</p>
            <p>© {new Date().getFullYear()} Developed by Aedev - Badreddine Ouakili</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
