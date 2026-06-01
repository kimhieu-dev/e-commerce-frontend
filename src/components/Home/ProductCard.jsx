import React from 'react';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { name, basePrice, thumbnailUrl, sku, inventory } = product;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 flex flex-col h-full">
      {/* Product Image */}
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        <img
          src={thumbnailUrl || 'https://via.placeholder.com/300'}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {inventory?.quantityInStock <= 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium">Hết hàng</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-800 line-clamp-2 h-12 mb-2" title={name}>
          {name}
        </h3>
        <p className="text-sm text-gray-500 mb-2">SKU: {sku}</p>
        <div className="mt-auto">
          <div className="text-xl font-bold text-red-600 mb-3">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(basePrice)}
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              disabled={inventory?.quantityInStock <= 0}
              className="flex items-center justify-center gap-1 border border-blue-600 text-blue-600 py-2 rounded-md hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <ShoppingCart size={16} />
              Thêm
            </button>
            <button
              disabled={inventory?.quantityInStock <= 0}
              className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
