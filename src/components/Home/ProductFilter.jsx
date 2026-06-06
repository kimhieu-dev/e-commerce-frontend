import React from 'react';
import { Filter, ChevronDown, SortAsc, SortDesc } from 'lucide-react';

const ProductFilter = ({ onFilterChange, onSortChange }) => {
  const [minPrice, setMinPrice] = React.useState('');
  const [maxPrice, setMaxPrice] = React.useState('');
  const [sortType, setSortType] = React.useState('');

  const handleApplyFilter = () => {
    onFilterChange({
      minPrice: minPrice || null,
      maxPrice: maxPrice || null
    });
  };

  const handleSortChange = (type) => {
    setSortType(type);
    onSortChange(type);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Lọc theo giá */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-gray-600 font-medium">
            <Filter size={18} />
            <span>Khoảng giá:</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Từ"
              className="w-24 px-3 py-1.5 border rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Đến"
              className="w-24 px-3 py-1.5 border rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <button
              onClick={handleApplyFilter}
              className="ml-2 bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Áp dụng
            </button>
          </div>
        </div>

        {/* Sắp xếp */}
        <div className="flex items-center gap-3">
          <span className="text-gray-600 font-medium">Sắp xếp:</span>
          <div className="flex bg-gray-100 p-1 rounded-md">
            <button
              onClick={() => handleSortChange('name,asc')}
              className={`px-3 py-1.5 rounded text-sm flex items-center gap-1 transition-all ${
                sortType === 'name,asc' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              title="A-Z"
            >
              <SortAsc size={16} />
              A-Z
            </button>
            <button
              onClick={() => handleSortChange('basePrice,asc')}
              className={`px-3 py-1.5 rounded text-sm flex items-center gap-1 transition-all ${
                sortType === 'basePrice,asc' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Giá thấp - cao"
            >
              <ChevronDown size={16} className="rotate-180" />
              Giá ↑
            </button>
            <button
              onClick={() => handleSortChange('basePrice,desc')}
              className={`px-3 py-1.5 rounded text-sm flex items-center gap-1 transition-all ${
                sortType === 'basePrice,desc' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Giá cao - thấp"
            >
              <ChevronDown size={16} />
              Giá ↓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
