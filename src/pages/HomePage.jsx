import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { LogOut, Package, Search, ChevronRight } from 'lucide-react';

// 1. Hàm biến đổi mảng phẳng thành Cây danh mục (Đã tối ưu theo đúng DTO CategoryRes)
const buildCategoryTree = (flatCategories) => {
  const tree = [];
  const lookup = {};

  // Khởi tạo lookup với children rỗng
  flatCategories.forEach(cat => {
    // Đảm bảo có fallback nếu dữ liệu lỗi
    if (cat.id) {
      lookup[cat.id] = { ...cat, children: [] };
    }
  });

  // Ghép nối Parent - Child
  flatCategories.forEach(cat => {
    if (!cat.id) return; // Bỏ qua nếu backend trả thiếu ID
    
    // Dựa vào field parentId từ CategoryRes của bạn
    if (cat.parentId && lookup[cat.parentId]) {
      lookup[cat.parentId].children.push(lookup[cat.id]);
    } else {
      tree.push(lookup[cat.id]);
    }
  });

  return tree;
};

// 2. Component Danh mục có hiệu ứng Flyout (Hover)
const CategoryItem = ({ category, activeId, onSelect }) => {
  const isActive = activeId === category.id;
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div className="relative group w-full">
      <div
        className={`flex items-center justify-between cursor-pointer py-2 px-3 mb-1 rounded-lg transition-colors ${
          isActive ? 'bg-blue-600 text-white font-medium shadow-sm' : 'text-gray-600 hover:bg-blue-50'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(category.id);
        }}
      >
        <span className="truncate">{category.name}</span>
        {hasChildren && <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />}
      </div>
      
      {/* Sub-menu hiển thị khi đưa chuột vào (Hover) */}
      {hasChildren && (
        <div className="absolute left-full top-0 ml-1 w-48 bg-white border border-gray-100 shadow-xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2">
          {category.children.map(child => (
            <CategoryItem 
              key={child.id} 
              category={child} 
              activeId={activeId} 
              onSelect={onSelect} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

const HomePage = () => {
  const [categoriesTree, setCategoriesTree] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // 3. Logic: Tự động lọc sản phẩm khi nhấn vào danh mục
  useEffect(() => {
    if (activeCategoryId === null) {
      setDisplayedProducts(allProducts);
    } else {
      // Hàm Helper: Lấy ID của danh mục đang chọn VÀ tất cả danh mục con của nó
      const getCategoryIds = (targetId, treeData) => {
        let ids = [targetId];
        
        const findNode = (nodes) => {
          for (let node of nodes) {
            if (node.id === targetId) return node;
            if (node.children) {
              const found = findNode(node.children);
              if (found) return found;
            }
          }
          return null;
        };

        const node = findNode(treeData);
        
        const extractIds = (n) => {
          if (n.children) {
            n.children.forEach(child => {
              ids.push(child.id);
              extractIds(child);
            });
          }
        };

        if (node) extractIds(node);
        return ids;
      };

      const validIds = getCategoryIds(activeCategoryId, categoriesTree);

      // Cần chắc chắn ProductDTO từ backend của bạn có trường categoryId
      const filtered = allProducts.filter(p => validIds.includes(p.categoryId));
      setDisplayedProducts(filtered);
    }
  }, [activeCategoryId, allProducts, categoriesTree]);

  const fetchData = async () => {
    try {
      // Đọc response từ BaseResponse<List<CategoryRes>> của bạn
      const catRes = await axiosInstance.get('/api/v1/categories');
      const prodRes = await axiosInstance.get('/api/v1/products');

      // catRes.data.data chính là List<CategoryRes>
      const flatCategories = catRes.data?.data || [];
      setCategoriesTree(buildCategoryTree(flatCategories));

      const prods = prodRes.data?.data?.content || prodRes.data?.data || [];
      setAllProducts(prods);
      
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
      <header className="bg-blue-800 text-white shadow-md relative z-20">
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

      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6 flex-1">
        
        {/* Sidebar Danh mục */}
        <aside className="w-full md:w-64 bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Danh mục sản phẩm</h2>
          <div className="flex flex-col relative">
            <div 
              className={`cursor-pointer py-2 px-3 mb-2 rounded-lg transition-colors ${
                activeCategoryId === null ? 'bg-blue-600 text-white font-medium shadow-sm' : 'text-gray-600 hover:bg-blue-50'
              }`}
              onClick={() => setActiveCategoryId(null)}
            >
              Tất cả sản phẩm
            </div>
            
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
            <h2 className="text-xl font-bold text-gray-800">
              {activeCategoryId === null ? "Tất cả sản phẩm" : "Sản phẩm theo danh mục"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProducts.length > 0 ? (
              displayedProducts.map(product => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-100 rounded-md mb-4 flex items-center justify-center text-gray-400">
                    [Ảnh sản phẩm]
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2 truncate" title={product.name}>{product.name}</h3>
                  <p className="text-blue-600 font-bold">{product.price?.toLocaleString()} đ</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center py-8">Chưa có sản phẩm nào thuộc danh mục này.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;