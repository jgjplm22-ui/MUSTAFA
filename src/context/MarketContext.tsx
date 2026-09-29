import React, { createContext, useContext, useEffect, useState } from 'react';
import { COUPONS, INITIAL_ADDRESSES, INITIAL_PRODUCTS, INITIAL_REELS, INITIAL_COMPLAINTS } from '../data/marketData';
import { 
  CartItem, 
  CategoryId, 
  ChatMessage, 
  CurrencyCode, 
  DeliveryAddress, 
  Language, 
  Order, 
  PaymentMethodType, 
  Product, 
  Review,
  UserSession,
  Reel,
  Complaint,
  ComplaintCategory,
  ComplaintStatus
} from '../types/market';
import { sanitizeInput, isSafeUrl, isValidPrice } from '../utils/security';

interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
}

interface MarketContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;

  // Auth / User Gateway
  currentUser: UserSession | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginCustomer: (name: string, phone: string) => void;
  loginAdmin: (pinOrCode: string) => boolean;
  logout: () => void;
  isAdmin: boolean;
  adminLockoutRemaining: number;
  adminFailedAttempts: number;

  // Admin Dashboard & Product Management
  isAdminPanelOpen: boolean;
  setIsAdminPanelOpen: (open: boolean) => void;
  addProduct: (productData: Omit<Product, 'id' | 'rating' | 'reviewsCount' | 'reviews'>) => Product;
  updateProductPrice: (productId: string, newPrice: number, newOriginalPrice?: number) => void;
  updateProductName: (productId: string, nameAr: string, nameEn?: string) => void;
  updateProductImage: (productId: string, imageUrl: string) => void;
  updateProduct: (productId: string, partial: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  toggleStock: (productId: string) => void;
  
  // Products & Categories
  products: Product[];
  selectedCategory: CategoryId;
  setSelectedCategory: (cat: CategoryId) => void;
  selectedSubcategory: string | null;
  setSelectedSubcategory: (sub: string | null) => void;
  
  // Search & Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchFilters: SearchFilters;
  setSearchFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  resetSearchAndFilters: () => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, note?: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotalCount: number;
  subtotal: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  appliedCoupon: string | null;
  couponError: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  couponDiscount: number;
  tax: number;
  grandTotal: number;

  // Favorites
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  // Reviews System
  addReview: (productId: string, newReview: { userName: string; rating: number; comment: string }) => void;

  // Addresses
  addresses: DeliveryAddress[];
  selectedAddress: DeliveryAddress;
  setSelectedAddress: (addr: DeliveryAddress) => void;
  addAddress: (addr: Omit<DeliveryAddress, 'id'>) => void;

  // Modals & Navigation
  quickViewProduct: Product | null;
  setQuickViewProduct: (prod: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAddressModalOpen: boolean;
  setIsAddressModalOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isOrdersModalOpen: boolean;
  setIsOrdersModalOpen: (open: boolean) => void;
  activeTrackingOrder: Order | null;
  setActiveTrackingOrder: (ord: Order | null) => void;

  // Orders
  orders: Order[];
  placeOrder: (details: {
    address: DeliveryAddress;
    slotAr: string;
    slotEn: string;
    paymentMethod: PaymentMethodType;
    notes?: string;
  }) => Order;
  reorder: (order: Order) => void;
  formatPrice: (amountInIQD: number) => string;

  // AI Support Chatbot with Memory
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  isChatLoading: boolean;
  sendChatMessage: (content: string) => Promise<void>;
  clearChatHistory: () => void;

  // Reels (Short Video Clips) Feature
  reels: Reel[];
  addReel: (reelData: Omit<Reel, 'id' | 'likesCount' | 'viewsCount' | 'createdAt'>) => Reel;
  deleteReel: (reelId: string) => void;
  likeReel: (reelId: string) => void;
  activeReel: Reel | null;
  setActiveReel: (reel: Reel | null) => void;
  isCreateReelOpen: boolean;
  setIsCreateReelOpen: (open: boolean) => void;

  // Complaints Department (قسم الشكاوى والمقترحات)
  complaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'ticketNumber' | 'status' | 'createdAt'>) => Complaint;
  updateComplaintStatus: (id: string, status: ComplaintStatus, response?: string) => void;
  isComplaintsModalOpen: boolean;
  setIsComplaintsModalOpen: (open: boolean) => void;
  selectedOrderForComplaint: string | null;
  setSelectedOrderForComplaint: (orderNum: string | null) => void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

// Prices are natively in IQD (Iraqi Dinars)
const FREE_DELIVERY_THRESHOLD = 25000; // 25,000 IQD
const STANDARD_DELIVERY_FEE = 3000;    // 3,000 IQD

const CURRENCY_RATES: Record<CurrencyCode, { rate: number; symbolAr: string; symbolEn: string; decimals: number }> = {
  IQD: { rate: 1, symbolAr: 'د.ع', symbolEn: 'IQD', decimals: 0 },
  SAR: { rate: 1 / 350, symbolAr: 'ر.س', symbolEn: 'SAR', decimals: 2 },
  USD: { rate: 1 / 1310, symbolAr: '$', symbolEn: '$', decimals: 2 },
  AED: { rate: 1 / 356, symbolAr: 'د.إ', symbolEn: 'AED', decimals: 2 },
  EGP: { rate: 1 / 27, symbolAr: 'ج.م', symbolEn: 'EGP', decimals: 1 },
};

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    role: 'assistant',
    content: 'مرحباً بك في «أسواق الشورجة»! 🏪✨\nأقسامنا المخصصة: (لحوم، مواد غذائية، ألبان، منظفات، وسناكات ومسليات).\nأنا مرشدك الذكي، أساعدك في العثور على أفضل المنتجات، تعديل الطلبات، ومتابعة التوصيل. كيف أخدمك اليوم؟',
    timestamp: 'الآن',
    actionSuggestions: [
      'لحوم غنم وعجل طازجة اليوم 🥩',
      'تمن عنبر المشخاب الأصلي 🌾',
      'قيمر عرب عراقي وحليب 🥛',
      'عروض المنظفات ومساحيق الغسيل ✨',
    ],
    recommendedProductIds: ['meat-01', 'groc-01', 'dairy-01'],
  },
];

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('shorja_lang') as Language) || 'ar';
  });

  const [currency, setCurrency] = useState<CurrencyCode>(() => {
    return (localStorage.getItem('shorja_curr') as CurrencyCode) || 'IQD';
  });

  // User Auth Gateway Session
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('shorja_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => {
    // If no user session is saved, open gateway on initial load
    const saved = localStorage.getItem('shorja_user_session');
    return !saved;
  });

  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Products with persistent changes (additions, price updates, stock updates)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('shorja_products_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Category and Subcategory selection
  const [selectedCategory, setSelectedCategoryState] = useState<CategoryId>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const setSelectedCategory = (cat: CategoryId) => {
    setSelectedCategoryState(cat);
    setSelectedSubcategory(null);
  };

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});

  const resetSearchAndFilters = () => {
    setSearchQuery('');
    setSearchFilters({});
    setSelectedSubcategory(null);
  };

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('shorja_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Coupons
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('shorja_favs');
      return saved ? JSON.parse(saved) : ['meat-01', 'groc-01', 'dairy-01'];
    } catch {
      return [];
    }
  });

  // Addresses (Default: بغداد - الدورة - المهدية الأولى)
  const [addresses, setAddresses] = useState<DeliveryAddress[]>(() => {
    try {
      const saved = localStorage.getItem('shorja_addresses_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_ADDRESSES;
    } catch {
      return INITIAL_ADDRESSES;
    }
  });
  const [selectedAddress, setSelectedAddress] = useState<DeliveryAddress>(() => {
    const dora = addresses.find((a) => a.districtAr.includes('الدورة'));
    return dora || addresses[0] || INITIAL_ADDRESSES[0];
  });

  // Modals & Drawers
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);

  // Complaints Department (قسم الشكاوى والمقترحات)
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const saved = localStorage.getItem('shorja_complaints');
      if (saved) return JSON.parse(saved);
      return INITIAL_COMPLAINTS;
    } catch {
      return INITIAL_COMPLAINTS;
    }
  });
  const [isComplaintsModalOpen, setIsComplaintsModalOpen] = useState(false);
  const [selectedOrderForComplaint, setSelectedOrderForComplaint] = useState<string | null>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('shorja_orders');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'ord-8941',
          orderNumber: '#SQ-8941',
          createdAt: 'أمس، 4:30 م',
          items: [
            { product: INITIAL_PRODUCTS[0], quantity: 1 }, // Lamb
            { product: INITIAL_PRODUCTS[4], quantity: 1 }, // Rice
          ],
          subtotal: 36500,
          deliveryFee: 0,
          discount: 0,
          tax: 0,
          total: 36500,
          status: 'delivered',
          address: INITIAL_ADDRESSES[0],
          deliverySlotAr: 'فوري (خلال 35 دقيقة)',
          deliverySlotEn: 'Express (within 35 mins)',
          paymentMethod: 'cash',
          courierName: 'حيدر الزيدي',
          courierPhone: '+964 770 123 4567',
          estimatedDeliveryTime: 'تم التوصيل بنجاح',
        },
      ];
    } catch {
      return [];
    }
  });

  // AI Chatbot State with Memory
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('shorja_chat_history');
      return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
    } catch {
      return INITIAL_CHAT_MESSAGES;
    }
  });

  // Reels (Short Video Clips) Feature
  const [reels, setReels] = useState<Reel[]>(() => {
    try {
      const saved = localStorage.getItem('shorja_reels_v2');
      if (saved) {
        const parsed: Reel[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Sanitize any deprecated external URLs to reliable local clips
          return parsed.map((r, idx) => {
            if (!r.videoUrl || r.videoUrl.includes('mixkit.co')) {
              const fallbackUrls = ['/videos/reel-meat.mp4', '/videos/reel-rice.mp4', '/videos/reel-dairy.mp4', '/videos/reel-chips.mp4'];
              return { ...r, videoUrl: fallbackUrls[idx % fallbackUrls.length] };
            }
            return r;
          });
        }
      }
      return INITIAL_REELS;
    } catch {
      return INITIAL_REELS;
    }
  });

  const [activeReel, setActiveReel] = useState<Reel | null>(null);
  const [isCreateReelOpen, setIsCreateReelOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('shorja_reels_v2', JSON.stringify(reels));
    } catch (e) {
      console.warn('Could not persist reels to localStorage', e);
    }
  }, [reels]);

  const addReel = (reelData: Omit<Reel, 'id' | 'likesCount' | 'viewsCount' | 'createdAt'>): Reel => {
    const newReel: Reel = {
      ...reelData,
      id: `reel-${Date.now()}`,
      likesCount: 1,
      viewsCount: 1,
      createdAt: 'الآن',
    };
    setReels((prev) => [newReel, ...prev]);
    return newReel;
  };

  const deleteReel = (reelId: string) => {
    setReels((prev) => prev.filter((r) => r.id !== reelId));
    if (activeReel?.id === reelId) {
      setActiveReel(null);
    }
  };

  const likeReel = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => (r.id === reelId ? { ...r, likesCount: r.likesCount + 1 } : r))
    );
    if (activeReel?.id === reelId) {
      setActiveReel((prev) => (prev ? { ...prev, likesCount: prev.likesCount + 1 } : null));
    }
  };

  // Language management
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('shorja_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const handleSetCurrency = (c: CurrencyCode) => {
    setCurrency(c);
    localStorage.setItem('shorja_curr', c);
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('shorja_products_v3', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('shorja_user_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('shorja_user_session');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('shorja_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('shorja_favs', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('shorja_addresses_v3', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('shorja_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('shorja_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('shorja_chat_history', JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Brute Force Defense for Admin PIN
  const [adminFailedAttempts, setAdminFailedAttempts] = useState<number>(() => {
    try {
      return Number(sessionStorage.getItem('shorja_admin_attempts') || '0');
    } catch {
      return 0;
    }
  });

  const [adminLockoutUntil, setAdminLockoutUntil] = useState<number>(() => {
    try {
      return Number(sessionStorage.getItem('shorja_admin_lockout') || '0');
    } catch {
      return 0;
    }
  });

  const [adminLockoutRemaining, setAdminLockoutRemaining] = useState<number>(0);

  useEffect(() => {
    const updateLockoutTimer = () => {
      const remainingMs = adminLockoutUntil - Date.now();
      if (remainingMs > 0) {
        setAdminLockoutRemaining(Math.ceil(remainingMs / 1000));
      } else {
        setAdminLockoutRemaining(0);
      }
    };

    updateLockoutTimer();
    const timer = setInterval(updateLockoutTimer, 1000);
    return () => clearInterval(timer);
  }, [adminLockoutUntil]);

  // Auth Operations with Anti-XSS Sanitization
  const loginCustomer = (name: string, phone: string) => {
    const safeName = sanitizeInput(name, 60) || (language === 'ar' ? 'زبون أسواق الشورجة' : 'Valued Customer');
    const safePhone = sanitizeInput(phone, 20) || '07700000000';

    const session: UserSession = {
      role: 'customer',
      name: safeName,
      phoneOrEmail: safePhone,
      isLoggedIn: true,
    };
    setCurrentUser(session);
    setIsAuthModalOpen(false);
  };

  const loginAdmin = (pinOrCode: string): boolean => {
    // If account is currently locked out from brute force attempts, reject
    if (adminLockoutUntil > Date.now()) {
      return false;
    }

    const trimmed = pinOrCode.trim();
    if (trimmed === '1528') {
      // Reset attempts upon success
      setAdminFailedAttempts(0);
      setAdminLockoutUntil(0);
      sessionStorage.removeItem('shorja_admin_attempts');
      sessionStorage.removeItem('shorja_admin_lockout');

      const session: UserSession = {
        role: 'admin',
        name: language === 'ar' ? 'مدير المتجر (إدارة الأسعار والمنتجات)' : 'Store Admin',
        phoneOrEmail: 'admin@shorja-markets.com',
        isLoggedIn: true,
      };
      setCurrentUser(session);
      setIsAuthModalOpen(false);
      setIsAdminPanelOpen(true);
      return true;
    }

    // On failed attempt, record attempt and enforce exponential lockout
    const nextAttempts = adminFailedAttempts + 1;
    setAdminFailedAttempts(nextAttempts);
    sessionStorage.setItem('shorja_admin_attempts', String(nextAttempts));

    if (nextAttempts >= 5) {
      const lockoutDurationMs = 180 * 1000; // 3 minutes lockout
      const lockUntil = Date.now() + lockoutDurationMs;
      setAdminLockoutUntil(lockUntil);
      sessionStorage.setItem('shorja_admin_lockout', String(lockUntil));
    }

    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdminPanelOpen(false);
    setIsAuthModalOpen(true);
  };

  const isAdmin = currentUser?.role === 'admin';

  // Product Management (Admin features with anti-injection sanitization)
  const addProduct = (productData: Omit<Product, 'id' | 'rating' | 'reviewsCount' | 'reviews'>): Product => {
    const newId = `${productData.category}-${Date.now().toString(36)}`;
    
    // Strict Sanitization
    const safeProductData = {
      ...productData,
      nameAr: sanitizeInput(productData.nameAr, 100),
      nameEn: sanitizeInput(productData.nameEn, 100),
      barcode: sanitizeInput(productData.barcode || '', 32),
      unitAr: sanitizeInput(productData.unitAr, 30),
      unitEn: sanitizeInput(productData.unitEn, 30),
      originAr: sanitizeInput(productData.originAr, 50),
      originEn: sanitizeInput(productData.originEn, 50),
      descriptionAr: sanitizeInput(productData.descriptionAr, 500),
      descriptionEn: sanitizeInput(productData.descriptionEn, 500),
      badgeAr: productData.badgeAr ? sanitizeInput(productData.badgeAr, 30) : undefined,
      badgeEn: productData.badgeEn ? sanitizeInput(productData.badgeEn, 30) : undefined,
      imageUrl: productData.imageUrl && isSafeUrl(productData.imageUrl) ? productData.imageUrl : undefined,
      price: isValidPrice(productData.price) ? productData.price : 1000,
      originalPrice: productData.originalPrice && isValidPrice(productData.originalPrice) ? productData.originalPrice : undefined,
    };

    const newProduct: Product = {
      ...safeProductData,
      id: newId,
      rating: 5.0,
      reviewsCount: 1,
      reviews: [
        {
          id: `rev-${Date.now()}`,
          userName: language === 'ar' ? 'إدارة أسواق الشورجة' : 'Shorja Quality Inspection',
          rating: 5,
          comment: language === 'ar' ? 'منتج مضمون الجودة ومفحوص وصالح للاستهلاك 100%.' : 'Quality tested and guaranteed.',
          date: language === 'ar' ? 'جديد اليوم' : 'New Today',
          verifiedPurchase: true,
          helpfulCount: 2,
        },
      ],
    };

    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProductPrice = (productId: string, newPrice: number, newOriginalPrice?: number) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        return {
          ...prod,
          price: newPrice,
          originalPrice: newOriginalPrice !== undefined ? newOriginalPrice : prod.originalPrice,
        };
      })
    );

    // Also update in active cart if present
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id !== productId) return item;
        return {
          ...item,
          product: {
            ...item.product,
            price: newPrice,
            originalPrice: newOriginalPrice !== undefined ? newOriginalPrice : item.product.originalPrice,
          },
        };
      })
    );

    // Update quickViewProduct if currently viewed
    if (quickViewProduct?.id === productId) {
      setQuickViewProduct((prev) =>
        prev ? { ...prev, price: newPrice, originalPrice: newOriginalPrice ?? prev.originalPrice } : null
      );
    }
  };

  const updateProduct = (productId: string, partial: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...partial } : p))
    );

    // Keep active cart items updated with modified product data
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, product: { ...item.product, ...partial } }
          : item
      )
    );

    // Update quickViewProduct if currently open
    if (quickViewProduct?.id === productId) {
      setQuickViewProduct((prev) => (prev ? { ...prev, ...partial } : null));
    }
  };

  const updateProductName = (productId: string, nameAr: string, nameEn?: string) => {
    const trimmedAr = nameAr.trim();
    if (!trimmedAr) return;
    const trimmedEn = nameEn && nameEn.trim() ? nameEn.trim() : trimmedAr;

    updateProduct(productId, {
      nameAr: trimmedAr,
      nameEn: trimmedEn,
    });
  };

  const updateProductImage = (productId: string, imageUrl: string) => {
    updateProduct(productId, {
      imageUrl: imageUrl.trim(),
    });
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    if (quickViewProduct?.id === productId) {
      setQuickViewProduct(null);
    }
  };

  const toggleStock = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        return { ...p, inStock: !p.inStock };
      })
    );
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, note = '') => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, itemNote: note || item.itemNote }
            : item
        );
      }
      return [...prev, { product, quantity, itemNote: note }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;

  // Coupon calculations
  let couponDiscount = 0;
  if (appliedCoupon && COUPONS[appliedCoupon]) {
    const c = COUPONS[appliedCoupon];
    if (subtotal >= c.minSpend) {
      couponDiscount = Math.min((subtotal * c.discountPercent) / 100, c.maxDiscount);
    }
  }

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (!COUPONS[trimmed]) {
      setCouponError(language === 'ar' ? 'كوبون غير صالح' : 'Invalid coupon code');
      return false;
    }
    const c = COUPONS[trimmed];
    if (subtotal < c.minSpend) {
      setCouponError(
        language === 'ar'
          ? `الحد الأدنى لتفعيل هذا الكوبون هو ${formatPrice(c.minSpend)}`
          : `Minimum spend for this coupon is ${formatPrice(c.minSpend)}`
      );
      return false;
    }
    setAppliedCoupon(trimmed);
    setCouponError(null);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const taxableAmount = Math.max(0, subtotal - couponDiscount);
  const tax = 0; // Iraqi local grocery market standard (no added sales VAT)
  const grandTotal = Math.max(0, taxableAmount + deliveryFee);

  // Favorites
  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  // Add Review
  const addReview = (productId: string, newReviewData: { userName: string; rating: number; comment: string }) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        const newRev: Review = {
          id: `rev-${Date.now()}`,
          userName: newReviewData.userName.trim() || (language === 'ar' ? 'زبون أسواق الشورجة' : 'Verified Customer'),
          rating: newReviewData.rating,
          comment: newReviewData.comment,
          date: language === 'ar' ? 'الآن' : 'Just now',
          verifiedPurchase: true,
          helpfulCount: 1,
        };
        const updatedReviews = [newRev, ...prod.reviews];
        const newAvg = (
          updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length
        ).toFixed(1);

        const updatedProd = {
          ...prod,
          reviews: updatedReviews,
          reviewsCount: updatedReviews.length,
          rating: parseFloat(newAvg),
        };

        if (quickViewProduct?.id === productId) {
          setQuickViewProduct(updatedProd);
        }

        return updatedProd;
      })
    );
  };

  // Address
  const addAddress = (addr: Omit<DeliveryAddress, 'id'>) => {
    const newAddr: DeliveryAddress = {
      ...addr,
      id: `addr-${Date.now()}`,
    };
    setAddresses((prev) => [newAddr, ...prev]);
    setSelectedAddress(newAddr);
  };

  // Place Order
  const placeOrder = (details: {
    address: DeliveryAddress;
    slotAr: string;
    slotEn: string;
    paymentMethod: PaymentMethodType;
    notes?: string;
  }): Order => {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `#SQ-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toLocaleTimeString(language === 'ar' ? 'ar-IQ' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      items: [...cart],
      subtotal,
      deliveryFee,
      discount: couponDiscount,
      tax,
      total: grandTotal,
      couponCode: appliedCoupon || undefined,
      status: 'received',
      address: details.address,
      deliverySlotAr: details.slotAr,
      deliverySlotEn: details.slotEn,
      paymentMethod: details.paymentMethod,
      courierName: 'حيدر الزيدي (مندوب الشورجة)',
      courierPhone: '+964 780 987 6543',
      estimatedDeliveryTime: language === 'ar' ? 'خلال 25-35 دقيقة' : 'Within 25-35 minutes',
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setActiveTrackingOrder(newOrder);
    return newOrder;
  };

  const reorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart(item.product, item.quantity);
    });
    setIsCartOpen(true);
  };

  const formatPrice = (amountInIQD: number) => {
    const curr = CURRENCY_RATES[currency] || CURRENCY_RATES.IQD;
    const converted = amountInIQD * curr.rate;
    const formatted = curr.decimals === 0 
      ? Math.round(converted).toLocaleString() 
      : converted.toFixed(curr.decimals);
    
    return language === 'ar'
      ? `${formatted} ${curr.symbolAr}`
      : `${curr.symbolEn} ${formatted}`;
  };

  // Send Chat Message
  const sendChatMessage = async (userText: string) => {
    if (!userText.trim() || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: userText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error('Chat API returned an error');
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.reply || 'أهلاً بك، تم استلام طلبك.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProductIds: data.recommendedProductIds || [],
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat API error:', err);
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: 'أهلاً بك في أسواق الشورجة! 🌹\nالأقسام المتوفرة لدينا: (اللحوم، الغذائية والمؤونة، الألبان، المنظفات، والسناكات).\nهل تبحث عن أسعار خاصة أو تريد إضافة صنف لسلتك؟',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProductIds: ['meat-01', 'groc-01'],
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const clearChatHistory = () => {
    setChatMessages(INITIAL_CHAT_MESSAGES);
    localStorage.removeItem('shorja_chat_history');
  };

  // Complaints operations
  const addComplaint = (
    complaintData: Omit<Complaint, 'id' | 'ticketNumber' | 'status' | 'createdAt'>
  ): Complaint => {
    const randomTicket = 'SHR-C' + Math.floor(1000 + Math.random() * 9000);
    const newComplaint: Complaint = {
      ...complaintData,
      id: `comp-${Date.now()}`,
      ticketNumber: randomTicket,
      status: 'pending',
      createdAt: language === 'ar' ? 'الآن (مباشر)' : 'Just now',
    };
    setComplaints((prev) => [newComplaint, ...prev]);
    return newComplaint;
  };

  const updateComplaintStatus = (id: string, status: ComplaintStatus, response?: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status,
              adminResponse: response !== undefined ? response : c.adminResponse,
            }
          : c
      )
    );
  };

  return (
    <MarketContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency: handleSetCurrency,

        // Auth
        currentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginCustomer,
        loginAdmin,
        logout,
        isAdmin,
        adminLockoutRemaining,
        adminFailedAttempts,

        // Admin & Products Management
        isAdminPanelOpen,
        setIsAdminPanelOpen,
        addProduct,
        updateProductPrice,
        updateProductName,
        updateProductImage,
        updateProduct,
        deleteProduct,
        toggleStock,

        // Products
        products,
        selectedCategory,
        setSelectedCategory,
        selectedSubcategory,
        setSelectedSubcategory,
        searchQuery,
        setSearchQuery,
        searchFilters,
        setSearchFilters,
        resetSearchAndFilters,

        // Cart
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotalCount,
        subtotal,
        deliveryFee,
        freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
        appliedCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
        couponDiscount,
        tax,
        grandTotal,

        // Favorites & Reviews
        favorites,
        toggleFavorite,
        isFavorite,
        addReview,

        // Addresses
        addresses,
        selectedAddress,
        setSelectedAddress,
        addAddress,

        // Modals
        quickViewProduct,
        setQuickViewProduct,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAddressModalOpen,
        setIsAddressModalOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isOrdersModalOpen,
        setIsOrdersModalOpen,
        activeTrackingOrder,
        setActiveTrackingOrder,

        // Orders & Pricing
        orders,
        placeOrder,
        reorder,
        formatPrice,

        // AI Chat
        isChatOpen,
        setIsChatOpen,
        chatMessages,
        isChatLoading,
        sendChatMessage,
        clearChatHistory,

        // Reels (Short Video Clips)
        reels,
        addReel,
        deleteReel,
        likeReel,
        activeReel,
        setActiveReel,
        isCreateReelOpen,
        setIsCreateReelOpen,

        // Complaints Department
        complaints,
        addComplaint,
        updateComplaintStatus,
        isComplaintsModalOpen,
        setIsComplaintsModalOpen,
        selectedOrderForComplaint,
        setSelectedOrderForComplaint,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};
