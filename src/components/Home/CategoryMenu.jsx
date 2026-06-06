import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

const CategoryItem = ({ category, level = 0, onSelect, selectedId }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const hasChildren = category.children && category.children.length > 0;
  const isSelected = selectedId === category.id;

  return (
    <div className="w-full">
      <div 
        className={`flex items-center justify-between py-2 px-3 cursor-pointer hover:bg-blue-50 transition-colors rounded-md ${isSelected ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
        style={{ paddingLeft: `${(level + 1) * 12}px` }}
        onClick={() => {
          onSelect(category);
          if (hasChildren) setIsOpen(!isOpen);
        }}
      >
        <span className="truncate">{category.name}</span>
        {hasChildren && (
          <span className="text-gray-400">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}
      </div>
      
      {hasChildren && isOpen && (
        <div className="mt-1">
          {category.children.map(child => (
            <CategoryItem 
              key={child.id} 
              category={child} 
              level={level + 1} 
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CategoryMenu = ({ categories, onSelect, selectedId }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2 h-fit">
      <h2 className="text-lg font-bold p-3 border-b mb-2">Danh mục</h2>
      <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
        <div 
          className={`py-2 px-3 cursor-pointer hover:bg-blue-50 transition-colors rounded-md ${!selectedId ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
          onClick={() => onSelect(null)}
        >
          Tất cả sản phẩm
        </div>
        {categories && categories.length > 0 ? (
          categories.map(root => (
            <CategoryItem 
              key={root.id || root.slug} 
              category={root} 
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))
        ) : (
          <div className="py-4 px-3 text-gray-400 text-sm italic text-center">
            Không tìm thấy danh mục
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryMenu;
