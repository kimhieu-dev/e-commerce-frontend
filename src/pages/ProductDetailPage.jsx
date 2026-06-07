import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ShoppingCart, ShieldCheck, Truck, Package } from 'lucide-react';
import Header from '../components/Home/Header';
import { getProductByIdApi } from '../services/productService';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductByIdApi(id);
        setProduct(response.data);
      } catch (err) {
        setError(err.message || "Không thể tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (val) => {
    const newQty = Math.max(1, Math.min(val, product?.inventory?.quantityInStock || 1));
    setQuantity(newQty);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
            {error || "Sản phẩm không tồn tại"}
          </div>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 flex items-center text-blue-600 hover:underline"
          >
            <ChevronLeft size={20} /> Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  const { name, basePrice, thumbnailUrl, sku, inventory, description, categoryName, weight, length, width, height } = product;
  const isOutOfStock = !inventory || inventory.quantityInStock <= 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb / Back button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ChevronLeft size={20} /> Quay lại
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="md:w-1/2 p-6 bg-gray-50">
              <div className="aspect-square bg-white rounded-lg overflow-hidden border border-gray-200 shadow-inner relative">
                <img 
                  src={thumbnailUrl || 'https://via.placeholder.com/600'} 
                  alt={name} 
                  className="w-full h-full object-contain"
                />
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-white text-gray-800 px-6 py-2 rounded-full text-lg font-bold shadow-lg">HẾT HÀNG</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="md:w-1/2 p-8">
              <div className="mb-2">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {categoryName || 'Sản phẩm'}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{name}</h1>
              <div className="flex items-center gap-4 mb-6">
                <p className="text-sm text-gray-500">SKU: <span className="text-gray-900 font-medium">{sku}</span></p>
                <div className="h-4 w-px bg-gray-300"></div>
                <p className="text-sm text-gray-500">Trạng thái: 
                  <span className={`ml-1 font-medium ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                    {isOutOfStock ? 'Hết hàng' : `Còn hàng (${inventory?.quantityInStock || 0})`}
                  </span>
                </p>
              </div>

              <div className="text-4xl font-bold text-red-600 mb-8">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(basePrice)}
              </div>

              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Số lượng</label>
                  <div className="flex items-center gap-3">
                    <div className="flex border border-gray-300 rounded-md">
                      <button 
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="px-4 py-2 hover:bg-gray-100 border-r border-gray-300 transition-colors"
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        value={quantity} 
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                        className="w-16 text-center focus:outline-none"
                      />
                      <button 
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="px-4 py-2 hover:bg-gray-100 border-l border-gray-300 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button 
                  disabled={isOutOfStock}
                  className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={20} /> MUA NGAY
                </button>
                <button 
                  disabled={isOutOfStock}
                  className="flex-1 border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  THÊM VÀO GIỎ HÀNG
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <ShieldCheck className="text-green-500" size={24} />
                  <span>Bảo hành chính hãng</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Truck className="text-blue-500" size={24} />
                  <span>Giao hàng nhanh 2h</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Package className="text-orange-500" size={24} />
                  <span>Đổi trả trong 7 ngày</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Info Tabs */}
          <div className="border-t border-gray-100">
            <div className="flex border-b border-gray-100">
              <button className="px-8 py-4 text-blue-600 border-b-2 border-blue-600 font-bold">Mô tả sản phẩm</button>
              <button className="px-8 py-4 text-gray-500 hover:text-gray-700 transition-colors">Thông số kỹ thuật</button>
            </div>
            <div className="p-8">
              <div className="prose max-w-none text-gray-700 mb-10">
                <p className="whitespace-pre-line">{description || "Thông tin đang được cập nhật..."}</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-4">Thông tin vận chuyển</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Cân nặng</p>
                    <p className="font-medium">{weight || 0} kg</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Dài</p>
                    <p className="font-medium">{length || 0} cm</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Rộng</p>
                    <p className="font-medium">{width || 0} cm</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Cao</p>
                    <p className="font-medium">{height || 0} cm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailPage;
