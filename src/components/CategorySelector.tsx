import React from 'react';
import { 
  LayoutGrid, 
  Beef, 
  PackageOpen, 
  Milk, 
  Sparkles, 
  Cookie, 
  Check
} from 'lucide-react';
import { CATEGORIES } from '../data/marketData';
import { useMarket } from '../context/MarketContext';
import { CategoryId } from '../types/market';

export const CategorySelector: React.FC = () => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    selectedSubcategory, 
    setSelectedSubcategory, 
    products,
    language,
    setSearchQuery,
  } = useMarket();

  const isAr = language === 'ar';

  const renderIcon = (name: string, active: boolean) => {
    const iconClass = `w-4 h-4 shrink-0 transition-colors ${
      active ? 'text-amber-400' : 'text-stone-500 group-hover:text-stone-800'
    }`;
    switch (name) {
      case 'Beef':
        return <Beef className={iconClass} />;
      case 'PackageOpen':
        return <PackageOpen className={iconClass} />;
      case 'Milk':
        return <Milk className={iconClass} />;
      case 'Sparkles':
        return <Sparkles className={iconClass} />;
      case 'Cookie':
        return <Cookie className={iconClass} />;
      case 'LayoutGrid':
      default:
        return <LayoutGrid className={iconClass} />;
    }
  };

  const activeCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory);
  const currentSubcategories = activeCategoryObj?.subcategories || [];

  return (
    <div className="mb-6 space-y-3">
      {/* Level 1: Main Categories Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none scroll-smooth">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const count = cat.id === 'all' 
            ? products.length 
            : products.filter((p) => p.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id as CategoryId);
                setSearchQuery('');
              }}
              className={`group flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all border ${
                isActive
                  ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                  : 'bg-white text-stone-700 hover:text-stone-900 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
              }`}
            >
              {renderIcon(cat.iconName, isActive)}
              <span>{isAr ? cat.nameAr : cat.nameEn}</span>
              <span
                className={`text-[11px] tabular-nums px-2 py-0.5 rounded-lg ${
                  isActive
                    ? 'bg-stone-800 text-amber-300'
                    : 'bg-stone-100 text-stone-500 group-hover:bg-stone-200'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Level 2: Subcategories Nested Filter Ribbon */}
      {currentSubcategories.length > 0 && (
        <div className="p-2.5 bg-stone-100/90 rounded-2xl border border-stone-200 flex items-center gap-2 overflow-x-auto scrollbar-none animate-in fade-in duration-150">
          <span className="text-[11px] font-bold text-stone-500 whitespace-nowrap ps-2 pe-1">
            {isAr ? 'الأقسام الفرعية:' : 'Subcategories:'}
          </span>

          {/* All in Category button */}
          <button
            onClick={() => setSelectedSubcategory(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedSubcategory === null
                ? 'bg-stone-900 text-amber-300 border-stone-900 shadow-2xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border-stone-200 hover:bg-stone-50'
            }`}
          >
            {isAr ? 'عرض الكل' : 'All'}
          </button>

          {/* Subcategory buttons */}
          {currentSubcategories.map((sub) => {
            const isSubActive = selectedSubcategory === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubcategory(sub.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                  isSubActive
                    ? 'bg-stone-900 text-amber-300 border-stone-900 shadow-2xs'
                    : 'bg-white text-stone-600 hover:text-stone-900 border-stone-200 hover:bg-stone-50'
                }`}
              >
                {isSubActive && <Check className="w-3 h-3 text-amber-400" />}
                <span>{isAr ? sub.nameAr : sub.nameEn}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
