export type CategoryId = 
  | 'all'
  | 'meats'
  | 'groceries'
  | 'dairy'
  | 'detergents'
  | 'snacks';

export interface Subcategory {
  id: string;
  nameAr: string;
  nameEn: string;
  parentCategoryId: CategoryId;
}

export interface Reel {
  id: string;
  titleAr: string;
  titleEn?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  captionAr: string;
  captionEn?: string;
  authorName: string;
  authorRole: 'admin';
  likesCount: number;
  viewsCount: number;
  productId?: string; // Optional linked product for 1-click cart addition
  createdAt: string;
  duration?: string;
  soundTitle?: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export type IconType =
  // Meats & Poultry
  | 'meat' | 'chicken' | 'steak' | 'mince' | 'fish'
  // Groceries & Pantry
  | 'rice' | 'oil' | 'spices' | 'tomato_paste' | 'flour' | 'sugar' | 'chai' | 'beans'
  // Dairy & Eggs
  | 'milk' | 'cheese' | 'eggs' | 'yogurt' | 'butter' | 'cream'
  // Detergents & Home Cleaning
  | 'detergent_powder' | 'dish_soap' | 'bleach' | 'disinfectant' | 'tissues' | 'soap'
  // Snacks & Munchies
  | 'chips' | 'nuts' | 'chocolate' | 'biscuits' | 'dates' | 'popcorn'
  // Fallbacks
  | 'tomato' | 'banana';

export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  category: CategoryId;
  subcategoryId: string;
  barcode?: string; // Barcode for cashier / POS scanner (EAN-13 / Code 128)
  price: number;
  originalPrice?: number;
  unitAr: string;
  unitEn: string;
  iconType: IconType;
  imageUrl?: string;
  badgeAr?: string;
  badgeEn?: string;
  originAr: string;
  originEn: string;
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  inStock: boolean;
  stockCount: number;
  descriptionAr: string;
  descriptionEn: string;
  tags: string[];
  specs?: Record<string, string>;
}

export interface Category {
  id: CategoryId;
  nameAr: string;
  nameEn: string;
  iconName: string;
  descriptionAr: string;
  descriptionEn: string;
  itemCount: number;
  subcategories: Subcategory[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  itemNote?: string;
}

export interface DeliveryAddress {
  id: string;
  labelAr: string;
  labelEn: string;
  districtAr: string;
  districtEn: string;
  street: string;
  notes?: string;
  isDefault?: boolean;
}

export type PaymentMethodType = 'cash' | 'card' | 'apple_pay' | 'tamara';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  total: number;
  couponCode?: string;
  status: 'received' | 'preparing' | 'on_the_way' | 'delivered';
  address: DeliveryAddress;
  deliverySlotAr: string;
  deliverySlotEn: string;
  paymentMethod: PaymentMethodType;
  courierName?: string;
  courierPhone?: string;
  estimatedDeliveryTime: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actionSuggestions?: string[];
  recommendedProductIds?: string[];
}

export type UserRole = 'customer' | 'admin';

export interface UserSession {
  role: UserRole;
  name: string;
  phoneOrEmail: string;
  isLoggedIn: boolean;
}

export type Language = 'ar' | 'en';
export type CurrencyCode = 'IQD' | 'SAR' | 'USD' | 'AED' | 'EGP';

export type ComplaintCategory =
  | 'delivery_delay'      // تأخير في موعد التوصيل
  | 'item_quality'        // جودة المواد أو اللحوم
  | 'missing_items'       // نقص أو خطأ في المواد
  | 'courier_issue'       // مشكلة مع مندوب التوصيل
  | 'pricing_dispute'     // خطأ في الحساب أو الفاتورة
  | 'suggestion_other';   // مقترح أو مشكلة أخرى

export type ComplaintStatus = 'pending' | 'in_review' | 'resolved';

export interface Complaint {
  id: string;
  ticketNumber: string;
  category: ComplaintCategory;
  orderNumber?: string;
  customerName: string;
  customerPhone: string;
  addressDistrict: string;
  description: string;
  photoUrl?: string;
  status: ComplaintStatus;
  createdAt: string;
  adminResponse?: string;
}

