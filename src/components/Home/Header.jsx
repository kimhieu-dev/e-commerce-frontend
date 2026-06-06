import React, { useState } from 'react';
import { Search, ShoppingCart, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logoutApi } from '../../services/authService';
import LogoutConfirmModal from './LogoutConfirmModal';

const Header = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleLogout = async () => {
    try {
      const authHeader = localStorage.getItem('authHeader');
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        await logoutApi(token);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API đăng xuất:', error);
    } finally {
      localStorage.removeItem('authHeader');
      navigate('/login');
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600 shrink-0">
          E-Shop
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500">
            <Search size={20} />
          </button>
        </form>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 shrink-0">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
            <ShoppingCart size={24} />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">0</span>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <User size={24} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-2 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-full transition-colors"
            title="Đăng xuất"
          >
            <LogOut size={24} />
          </button>
        </div>
      </div>

      <LogoutConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleLogout} 
      />
    </header>
  );
};

export default Header;
