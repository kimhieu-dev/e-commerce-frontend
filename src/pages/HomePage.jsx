import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { LogOut, Package, Search, ChevronRight } from 'lucide-react';

// Hàm chuyển đổi mảng phẳng từ API thành Cấu trúc cây (Tree)
const buildCategoryTree = (flatCategories) => {
  const tree = [];
  const lookup = {};

  // Bước 1: Khởi tạo lookup table và thêm mảng children rỗng
  flatCategories.forEach(cat => {
    lookup[cat.id] = { ...cat, children: [] };
  });

  // Bước 2: Ghép nối cha - con
  flatCategories.forEach(cat => {
    // Tùy thuộc vào JSON API của Backend trả về parentId hay parent.id
    const parentId = cat.parentId || (cat.parent && cat.parent.id);
    
    if (parentId && lookup[parentId]) {
      lookup[parentId].children.push(lookup[cat.id]);
    } else {
      tree.push(lookup[cat.id]);
    }
  });

  return tree;
};

// Component đệ quy để render danh mục lồng nhau
const CategoryItem = ({ category, activeId, onSelect, level = 0 }) => {
  const isActive = activeId === category.id;
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div className="w-full">
      <div
        // Thêm padding left dựa trên level để thụt lề cho danh mục con
        className={`flex items-center justify-between cursor-pointer py-2 px-3 mb-1 rounded-lg transition-colors ${
          isActive ? 'bg-blue-600 text-white font-medium' : 'text-gray-600 hover:bg-blue-50'
        }`}
        style={{ paddingLeft: `${(level * 1.5) + 0.75}rem` }}
        onClick={() => onSelect(category.id)} // Đã SỬA LỖI CLICK TẤT CẢ Ở ĐÂY
      >
        <span>{category.name}</span>
        {hasChildren && (
          <ChevronRight size={16} className={`transition-transform ${isActive ? 'rotate-90' : ''}`} />
        )}
      </div>
      
      {/* Đệ quy: Nếu có danh mục con, tự gọi lại chính nó */}
      {hasChildren && (
        <div className="border-l-2 border-gray-100 ml-4">
          {category.children.map(child => (
            <CategoryItem 
              key={child.id} 
              category={child} 
              activeId={activeId} 
              onSelect={onSelect}
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

const HomePage = () => {
  const [categoriesTree, setCategoriesTree] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Giả định endpoint API của Backend
      const catRes = await axiosInstance.get('/api/v1/categories');
      const prodRes = await axiosInstance.get('/api/v1/products');

      // Lấy dữ liệu mảng phẳng từ BaseResponse của Spring Boot
      const flatCategories = catRes.data.data || catRes.data;
      
      // Chuyển đổi thành cây và lưu vào state
      const nestedCategories = buildCategoryTree(flatCategories);
      setCategoriesTree(nestedCategories);

      setProducts(prodRes.data.data?.content || prodRes.data.data || []);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authHeader');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-blue-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Package size={28} />
            <h1 className="text-2xl font-bold tracking-wider">LogisticsPro</h1>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 hover:text-blue-200 transition-colors"
          >
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6 flex-1">
        
        {/* Sidebar Danh mục */}
        <aside className="w-full md:w-64 bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Danh mục sản phẩm</h2>
          <div className="flex flex-col">
            <div 
              className={`cursor-pointer py-2 px-3 mb-2 rounded-lg transition-colors ${
                activeCategoryId === null ? 'bg-blue-600 text-white font-medium' : 'text-gray-600 hover:bg-blue-50'
              }`}
              onClick={() => setActiveCategoryId(null)}
            >
              Tất cả sản phẩm
            </div>
            
            {/* Render cây danh mục */}
            {categoriesTree.map(category => (
              <CategoryItem 
                key={category.id} 
                category={category} 
                activeId={activeCategoryId} 
                onSelect={setActiveCategoryId} 
              />
            ))}
          </div>
        </aside>

        {/* Khung chứa Sản phẩm */}
        <main className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Danh sách sản phẩm</h2>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Tìm kiếm..." 
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length > 0 ? (
              products.map(product => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-100 rounded-md mb-4 flex items-center justify-center text-gray-400">
                    [Ảnh sản phẩm]
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2 truncate">{product.name}</h3>
                  <p className="text-blue-600 font-bold">{product.price?.toLocaleString()} đ</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center py-8">Chưa có sản phẩm nào.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;