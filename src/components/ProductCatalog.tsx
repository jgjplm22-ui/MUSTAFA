import React, { useMemo, useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  ArrowUpDown, 
  Star, 
  Check, 
  RefreshCw,
  ShoppingBag,
  PlusCircle
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '../data/marketData';
import { matchesProductSearch } from '../utils/searchHelper';

export const ProductCatalog: React.FC = () => {
  const {
    products,
    selectedCategory,
    selectedSubcategory,
    searchQuery,
    setSearchQuery,
    searchFilters,
    setSearchFilters,
    resetSearchAndFilters,
    language,
    isAdmin,
    setIsAdminPanelOpen,
  } = useMarket();

  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'reviews'>('featured');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [searchScope, setSearchScope] = useState<'all' | 'category'>('all');

  const isAr = language === 'ar';

  // Popular search keywords shortcuts reflecting the 5 categories:
  // لحوم، غذائية، ألبان، منظفات، سناكات
  const popularKeywords = isAr
    ? ['لحم غنم', 'دجاج مبرد', 'تمن عنبر', 'قيمر عرب', 'مسحوق غسيل', 'سائل جلي', 'شبس مقرمش', 'مكسرات مشكلة']
    : ['Fresh Lamb', 'Chilled Chicken', 'Anbar Rice', 'Qaimar Cream', 'Laundry Powder', 'Dish Soap', 'Chips', 'Mixed Nuts'];

  const allStoreMatchesCount = useMemo(() => {
    if (!searchQuery.trim()) return products.length;
    return products.filter((p) => matchesProductSearch(p, searchQuery)).length;
  }, [products, searchQuery]);

  const currentCategoryMatchesCount = useMemo(() => {
    if (!searchQuery.trim()) return 0;
    return products.filter((p) => p.category === selectedCategory && matchesProductSearch(p, searchQuery)).length;
  }, [products, searchQuery, selectedCategory]);

  // Deep Search & Multi-criteria Filtering
  const filteredProducts = useMemo(() => {
    const hasSearch = Boolean(searchQuery.trim());

    return products.filter((prod) => {
      // Category filter (if not searching OR if searching strictly within current category)
      if (!hasSearch || (selectedCategory !== 'all' && searchScope === 'category')) {
        if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
          return false;
        }
        if (selectedSubcategory && prod.subcategoryId !== selectedSubcategory) {
          return false;
        }
      }

      // Robust Arabic & English normalized search with synonym expansion
      if (hasSearch) {
        if (!matchesProductSearch(prod, searchQuery)) {
          return false;
        }
      }

      // Additional Filters
      if (searchFilters.minRating && prod.rating < searchFilters.minRating) {
        return false;
      }

      if (searchFilters.inStockOnly && !prod.inStock) {
        return false;
      }

      if (searchFilters.minPrice !== undefined && prod.price < searchFilters.minPrice) {
        return false;
      }

      if (searchFilters.maxPrice !== undefined && prod.price > searchFilters.maxPrice) {
        return false;
      }

      return true;
    });
  }, [products, selectedCategory, selectedSubcategory, searchQuery, searchFilters, searchScope]);

  // Sorting
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price-low':
        return list.sort((a, b) => a.price - b.price);
      case 'price-high':
        return list.sort((a, b) => b.price - a.price);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'reviews':
        return list.sort((a, b) => b.reviewsCount - a.reviewsCount);
      case 'featured':
      default:
        return list;
    }
  }, [filteredProducts, sortBy]);

  const currentCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory);
  const activeFiltersCount = 
    (searchFilters.minRating ? 1 : 0) + 
    (searchFilters.inStockOnly ? 1 : 0) + 
    (searchFilters.minPrice !== undefined || searchFilters.maxPrice !== undefined ? 1 : 0) +
    (selectedSubcategory ? 1 : 0);

  return (
    <section id="catalog-section" className="mb-14">
      {/* Search Header & Input Box */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-4 sm:p-5 shadow-2xs mb-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-stone-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isAr
                  ? 'ابحث بالاسم، الوصف، أو الكلمات (لحم، دجاج، تمن عنبر، قيمر، مسحوق، شبس)...'
                  : 'Search by item name, description, or keyword (meat, chicken, rice, qaimar)...'
              }
              className="w-full text-xs sm:text-sm ps-11 pe-10 py-3 bg-stone-50 hover:bg-stone-50/80 focus:bg-white border border-stone-200 focus:border-stone-800 rounded-2xl focus:outline-none transition-all placeholder:text-stone-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                title={isAr ? 'مسح البحث' : 'Clear search'}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Controls: Filter Button & Sort Selector & Admin Add */}
          <div className="flex items-center gap-2 flex-wrap">
            {isAdmin && (
              <button
                onClick={() => setIsAdminPanelOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-2xs transition-all active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isAr ? 'إضافة منتج وتعديل الأسعار' : 'Add Product / Edit Price'}</span>
              </button>
            )}

            <button
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className={`flex items-center gap-2 px-3.5 py-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all ${
                activeFiltersCount > 0 || showFilterDrawer
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{isAr ? 'فلاتر' : 'Filters'}</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 bg-amber-500 text-stone-950 text-[11px] rounded-full flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs sm:text-sm py-3 ps-3 pe-8 bg-white border border-stone-200 rounded-2xl font-bold text-stone-700 focus:border-stone-800 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="featured">{isAr ? 'الأكثر طلباً' : 'Featured'}</option>
                <option value="rating">{isAr ? 'الأعلى تقييماً (★)' : 'Top Rated'}</option>
                <option value="reviews">{isAr ? 'الأكثر مراجعات' : 'Most Reviewed'}</option>
                <option value="price-low">{isAr ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
                <option value="price-high">{isAr ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 absolute end-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Popular Search Keywords Chips */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
          <span className="text-[11px] font-semibold text-stone-400 whitespace-nowrap">
            {isAr ? 'أصناف شائعة:' : 'Trending:'}
          </span>
          {popularKeywords.map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="text-[11px] px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl whitespace-nowrap transition-colors font-medium"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Scope Pill (If searching while inside a specific department) */}
        {searchQuery.trim() && selectedCategory !== 'all' && (
          <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center justify-between flex-wrap gap-2 animate-in fade-in">
            <span className="text-xs font-bold text-stone-600 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-amber-600" />
              <span>{isAr ? 'نطاق البحث:' : 'Search Scope:'}</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSearchScope('all')}
                className={`px-3 py-1 rounded-xl font-bold transition-all text-xs flex items-center gap-1 ${
                  searchScope === 'all'
                    ? 'bg-stone-900 text-amber-300 shadow-2xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <span>{isAr ? 'كل أقسام المتجر' : 'All Store'}</span>
                <span className="text-[10px] bg-stone-800 text-stone-200 px-1.5 py-0.2 rounded-md">
                  {allStoreMatchesCount}
                </span>
              </button>
              <button
                onClick={() => setSearchScope('category')}
                className={`px-3 py-1 rounded-xl font-bold transition-all text-xs flex items-center gap-1 ${
                  searchScope === 'category'
                    ? 'bg-stone-900 text-amber-300 shadow-2xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <span>{isAr ? currentCategoryObj?.nameAr : currentCategoryObj?.nameEn}</span>
                <span className="text-[10px] bg-stone-800 text-stone-200 px-1.5 py-0.2 rounded-md">
                  {currentCategoryMatchesCount}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Filter Drawer / Panel */}
        {showFilterDrawer && (
          <div className="mt-4 pt-4 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in duration-150">
            {/* Rating Filter */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">
                {isAr ? 'الحد الأدنى للتقييم' : 'Minimum Rating'}
              </label>
              <div className="flex items-center gap-1.5">
                {[undefined, 4.5, 4.0, 3.0].map((rate) => {
                  const isSelected = searchFilters.minRating === rate;
                  return (
                    <button
                      key={rate || 'all'}
                      onClick={() =>
                        setSearchFilters((prev) => ({
                          ...prev,
                          minRating: isSelected ? undefined : rate,
                        }))
                      }
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-2xs font-bold'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {rate ? (
                        <>
                          <Star className="w-3 h-3 fill-current" />
                          <span>{rate}+</span>
                        </>
                      ) : (
                        <span>{isAr ? 'الكل' : 'All'}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* In-Stock Filter */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">
                {isAr ? 'حالة التوفر' : 'Availability'}
              </label>
              <button
                onClick={() =>
                  setSearchFilters((prev) => ({
                    ...prev,
                    inStockOnly: !prev.inStockOnly,
                  }))
                }
                className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
                  searchFilters.inStockOnly
                    ? 'bg-stone-900 text-amber-300 border-stone-900'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <span>{isAr ? 'المتوفر في المخزن فقط' : 'In-Stock Only'}</span>
                {searchFilters.inStockOnly && <Check className="w-4 h-4 text-amber-400" />}
              </button>
            </div>

            {/* Reset Action */}
            <div className="flex items-end">
              <button
                onClick={resetSearchAndFilters}
                className="w-full py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isAr ? 'إعادة ضبط الفلاتر' : 'Reset All Filters'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 px-1">
        <div>
          <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
            <span>
              {searchQuery.trim()
                ? searchScope === 'all'
                  ? isAr ? 'نتائج البحث في كل المتجر' : 'Search Results across Store'
                  : isAr ? `نتائج البحث في ${currentCategoryObj?.nameAr}` : `Search in ${currentCategoryObj?.nameEn}`
                : isAr ? currentCategoryObj?.nameAr : currentCategoryObj?.nameEn}
            </span>
            <span className="text-xs font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-lg">
              {sortedProducts.length} {isAr ? 'صنف متوفر' : 'items'}
            </span>
          </h2>
          {currentCategoryObj?.descriptionAr && !searchQuery.trim() && (
            <p className="text-xs text-stone-500 mt-0.5">
              {isAr ? currentCategoryObj.descriptionAr : currentCategoryObj.descriptionEn}
            </p>
          )}
        </div>

        {/* Clear query badge if search is active */}
        {searchQuery && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-stone-500">
              {isAr ? 'نتائج البحث عن:' : 'Results for:'}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-amber-100 text-stone-900 text-xs px-3 py-1.5 rounded-xl border border-amber-300 font-bold shadow-2xs">
              <span>"{searchQuery}"</span>
              <button 
                onClick={() => setSearchQuery('')} 
                className="hover:text-rose-600 p-0.5 rounded-full hover:bg-amber-200 transition-colors"
                title={isAr ? 'مسح البحث' : 'Clear search'}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-dashed border-stone-300 p-8 sm:p-12 text-center my-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center mb-4 border border-amber-200 shadow-2xs">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-base sm:text-lg font-black text-stone-900 mb-1">
            {searchQuery
              ? isAr ? `لم نجد أصناف تطابق بحثك عن "${searchQuery}"` : `No items matching "${searchQuery}"`
              : isAr ? 'لم نجد منتجات تطابق خيارات التصفية' : 'No matching items found'}
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto mb-5 leading-relaxed">
            {isAr
              ? 'جرّب البحث بكلمة مرادفة (مثل: لحم، تمن، قيمر، زاهي، شاي، مسحوق)، أو اختر أحد الأصناف الشائعة التالية:'
              : 'Try searching for an alternative term or choose from popular groceries below:'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-6 max-w-lg mx-auto">
            {popularKeywords.map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="text-xs px-3 py-1.5 bg-stone-100 hover:bg-amber-100 text-stone-800 hover:text-amber-950 font-bold rounded-xl transition-all border border-stone-200/60"
              >
                {tag}
              </button>
            ))}
          </div>

          <button
            onClick={resetSearchAndFilters}
            className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-amber-400 text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm"
          >
            {isAr ? 'عرض جميع منتجات أسواق الشورجة' : 'View All Shorja Goods'}
          </button>
        </div>
      )}
    </section>
  );
};
