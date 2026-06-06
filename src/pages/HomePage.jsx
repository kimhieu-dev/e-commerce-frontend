import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Home/Header';
import CategoryMenu from '../components/Home/CategoryMenu';
import ProductCard from '../components/Home/ProductCard';
import ProductFilter from '../components/Home/ProductFilter';
import { getProductsApi } from '../services/productService';
import { getCategoriesApi } from '../services/categoryService';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State cho phân trang và lọc
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    minPrice: null,
    maxPrice: null
  });
  const [sort, setSort] = useState('name,asc');

  const PAGE_SIZE = 12;

  const fetchProducts = useCallback(async (isLoadMore = false, currentFilters = filters, currentSort = sort, currentSearch = searchQuery) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setPage(0);
      }

      const currentPage = isLoadMore ? page + 1 : 0;
      
      const params = {
        name: currentSearch,
        minPrice: currentFilters.minPrice,
        maxPrice: currentFilters.maxPrice,
        page: currentPage,
        size: PAGE_SIZE,
        sort: currentSort
      };

      const response = await getProductsApi(params);
      const newData = response.data || [];
      
      if (isLoadMore) {
        setProducts(prev => [...prev, ...newData]);
        setPage(currentPage);
      } else {
        setProducts(newData);
      }

      // Kiểm tra nếu số lượng trả về ít hơn size thì hết dữ liệu
      setHasMore(newData.length === PAGE_SIZE);
      setError(null);
    } catch (err) {
      setError(err.message || "Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [page, filters, sort, searchQuery]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await getCategoriesApi();
      setCategories(response.data || []);
    } catch (err) {
      console.error("Lỗi khi tải danh mục:", err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchProducts(false); // Initial load
  }, [fetchCategories]); // Chỉ chạy 1 lần khi mount

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchProducts(false, filters, sort, query);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchProducts(false, newFilters, sort, searchQuery);
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    fetchProducts(false, filters, newSort, searchQuery);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // Lưu ý: Hiện tại Backend chưa hỗ trợ filter theo categoryId trong ProductFilterReq
    console.log("Selected category:", category);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchProducts(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onSearch={handleSearch} />

      <main className="container mx-auto px-4 py-6 flex-1">
        <ProductFilter 
          onFilterChange={handleFilterChange} 
          onSortChange={handleSortChange} 
        />

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar: Categories */}
          <aside className="w-full md:w-1/4 lg:w-1/5">
            <CategoryMenu 
              categories={categories} 
              onSelect={handleCategorySelect}
              selectedId={selectedCategory?.id}
            />
          </aside>

          {/* Main Content: Products */}
          <section className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedCategory ? `Danh mục: ${selectedCategory.name}` : (searchQuery ? `Kết quả tìm kiếm cho "${searchQuery}"` : "Tất cả sản phẩm")}
              </h2>
              <span className="text-gray-500 text-sm">{products.length} sản phẩm hiện có</span>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
                {error}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Phân trang: Xem thêm */}
                {hasMore && (
                  <div className="mt-12 flex justify-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="px-8 py-3 bg-white border border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loadingMore ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                          Đang tải...
                        </>
                      ) : (
                        'Xem thêm sản phẩm'
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào phù hợp.</p>
                <button 
                  onClick={() => {
                    setFilters({ minPrice: null, maxPrice: null });
                    setSearchQuery('');
                    fetchProducts(false, { minPrice: null, maxPrice: null }, sort, '');
                  }}
                  className="mt-4 text-blue-600 font-medium hover:underline"
                >
                  Xóa bộ lọc và thử lại
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="bg-white border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; 2026 E-Shop Project. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
