import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Search, ShoppingCart, Bell, LogOut, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Phân trang theo chuẩn Spring Boot (bắt đầu từ 0)
  const [page, setPage] = useState(0); 
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // 1. Gọi API lấy danh sách danh mục (Category) từ Backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/categories');
        // Khớp với cấu trúc BaseResponse: response.data.data
        if (response.data && response.data.data) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh mục sản phẩm:', error);
      }
    };
    fetchCategories();
  }, []);

  // 2. Gọi API lấy danh sách sản phẩm (có phân trang và lọc theo danh mục)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/api/v1/products?page=${page}&size=8`;
        if (selectedCategory) {
          url += `&categoryId=${selectedCategory}`;
        }

        const response = await axiosInstance.get(url);
        
        // Khớp với cấu trúc phân trang Spring Data JPA nằm trong response.data.data
        if (response.data && response.data.data) {
          const pageData = response.data.data;
          setProducts(pageData.content || []);
          setTotalPages(pageData.totalPages || 1);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách sản phẩm:', error);
        if (error.response?.status === 401) {
          handleLogout(); // Nếu mất quyền auth hoặc hết hạn, trả về trang đăng nhập
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, selectedCategory]);

  const handleLogout = () => {
    localStorage.removeItem('authHeader');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* THANH HEADER PHÍA TRÊN */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-800 font-bold text-2xl cursor-pointer" onClick={() => { setSelectedCategory(null); setPage(0); }}>
            <LayoutGrid size={24} /> 
            <span>LogisticsPro</span>
          </div>
          
          {/* THANH TÌM KIẾM */}
          <div className="flex-1 max-w-2xl mx-8 relative">
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm vận chuyển..." 
              className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>

          {/* ICONS THÔNG BÁO & GIỎ HÀNG */}
          <div className="flex items-center gap-6 text-gray-600">
            <button className="hover:text-blue-600 relative transition-colors">
              <ShoppingCart size={22} />
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                0
              </span>
            </button>
            <button className="hover:text-blue-600 transition-colors">
              <Bell size={22} />
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 hover:text-red-600 font-medium text-sm transition-colors"
            >
              <LogOut size={18} /> 
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      {/* KHU VỰC HIỂN THỊ CHÍNH */}
      <main className="flex-1 max-w-7xl mx-auto w-full flex gap-6 p-6">
        
        {/* SIDEBAR TRÁI - DANH MỤC SẢN PHẨM */}
        <aside className="w-64 shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24 border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100 uppercase text-xs tracking-wider">
              Danh mục sản phẩm
            </h3>
            <ul className="space-y-1">
              <li>
                <button 
                  onClick={() => { setSelectedCategory(null); setPage(0); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    !selectedCategory 
                      ? 'bg-blue-50 text-blue-700 font-semibold' 
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  Tất cả sản phẩm
                </button>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <button 
                    onClick={() => { setSelectedCategory(category.id); setPage(0); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedCategory === category.id 
                        ? 'bg-blue-50 text-blue-700 font-semibold' 
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* LƯỚI SẢN PHẨM & PHÂN TRANG */}
        <section className="flex-1 flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center min-h-[300px]">
              <div className="w-9 h-9 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-xl p-12 text-gray-400 border border-gray-100 min-h-[300px]">
              <LayoutGrid size={48} className="mb-2 stroke-1" />
              <p className="text-sm">Không có sản phẩm nào thuộc danh mục này.</p>
            </div>
          ) : (
            <>
              {/* GRID DANH SÁCH SẢN PHẨM */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {products.map((product) => (
                  <div 
                    key={product.id} 
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group border border-gray-100 flex flex-col"
                  >
                    <div className="h-44 bg-gray-50 overflow-hidden relative">
                      <img 
                        src={product.imageUrl || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=60"} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=60";
                        }}
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <h4 className="font-medium text-gray-800 line-clamp-2 text-sm mb-2 group-hover:text-blue-700 transition-colors">
                        {product.name}
                      </h4>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                        <span className="font-bold text-base text-red-600">
                          {product.price?.toLocaleString('vi-VN')} ₫
                        </span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          Kho: {product.quantity || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ĐIỀU HƯỚNG PHÂN TRANG */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-auto py-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <button 
                    disabled={page === 0}
                    onClick={() => setPage(p => p - 1)}
                    className="p-2 rounded-lg border bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-sm text-gray-600 font-medium px-4">
                    Trang {page + 1} / {totalPages}
                  </span>
                  <button 
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(p => p + 1)}
                    className="p-2 rounded-lg border bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </section>

      </main>
    </div>
  );
};

// DÒNG KHẮC PHỤC LỖI TRẮNG MÀN HÌNH CỦA BẠN:
export default HomePage;