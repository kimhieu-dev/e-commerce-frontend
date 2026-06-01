import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Home/Header';
import CategoryMenu from '../components/Home/CategoryMenu';
import ProductCard from '../components/Home/ProductCard';
import { getProductsApi } from '../services/productService';
import { getCategoriesApi } from '../services/categoryService';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = useCallback(async (name = '') => {
    try {
      setLoading(true);
      // Backend hỗ trợ filter theo name
      const response = await getProductsApi({ name });
      // API trả về BaseResponse<List<ProductRes>> hoặc BaseResponse<Page<ProductRes>>
      // Dựa vào ProductServiceImpl, nó trả về List<ProductRes> được bọc trong BaseResponse.success
      const data = response.data || [];
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  }, []);

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
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchProducts(query);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // Lưu ý: Hiện tại Backend chưa hỗ trợ filter theo categoryId trong ProductFilterReq
    // Chúng ta sẽ hiển thị thông báo hoặc chỉ đơn giản là giữ state UI
    console.log("Selected category:", category);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onSearch={handleSearch} />

      <main className="container mx-auto px-4 py-6 flex-1">
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
              <span className="text-gray-500 text-sm">{products.length} sản phẩm</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào.</p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer (Optional) */}
      <footer className="bg-white border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; 2026 E-Shop Project. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
