import { Product } from '../types/market';

/**
 * Normalizes Arabic and English text for lenient, typo-tolerant search matching
 */
export const normalizeSearchText = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '') // remove Arabic diacritics / tashkeel & tatweel
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/[^\w\s\u0600-\u06FF]/g, ' ') // remove special punctuation
    .replace(/\s+/g, ' ')
    .trim();
};

// Iraqi and Arabic colloquial synonyms & grocery aliases mapping
const SYNONYM_GROUPS: string[][] = [
  ['تمن', 'رز', 'ارز', 'عنبر', 'rice', 'anbar'],
  ['لحم', 'لحوم', 'كباب', 'ستيك', 'هبرة', 'غنم', 'عجل', 'بقر', 'شواء', 'meat', 'beef', 'lamb', 'steak', 'kebab'],
  ['دجاج', 'فروج', 'دواجن', 'chicken', 'poultry'],
  ['سمك', 'مسكوف', 'fish'],
  ['قيمر', 'قيمر عرب', 'قشطة', 'كريمة', 'جاموس', 'qaimar', 'cream'],
  ['حليب', 'لبن', 'زبادي', 'رايب', 'milk', 'yogurt'],
  ['جبن', 'جبنة', 'موزاريلا', 'شيدر', 'بلغاري', 'cheese'],
  ['بيض', 'بيض مائدة', 'مزارع', 'eggs', 'egg'],
  ['زيت', 'سمن', 'دهن', 'طبخ', 'قلي', 'oil', 'ghee', 'cooking oil'],
  ['طماطم', 'طماطة', 'معجون', 'صلصة', 'tomato', 'paste'],
  ['شاي', 'مهيل', 'هيل', 'سيلاني', 'tea', 'cardamom'],
  ['سكر', 'شكر', 'sugar'],
  ['طحين', 'دقيق', 'صفر', 'flour'],
  ['مسحوق', 'تايد', 'اريال', 'صابون', 'غسيل', 'detergent', 'powder'],
  ['زاهي', 'سائل جلي', 'سائل غسيل صحون', 'صحون', 'fairy', 'dish soap', 'soap'],
  ['قاصر', 'كلور', 'فلاش', 'معقم', 'مطهر', 'كلوركس', 'bleach', 'cleaner'],
  ['كلينكس', 'مناديل', 'فاين', 'ورق', 'tissues', 'napkins'],
  ['شبس', 'شيبس', 'بطاطا', 'ليز', 'مقرمشات', 'chips', 'crisps'],
  ['كرزات', 'مكسرات', 'حب', 'فستق', 'كازو', 'لوز', 'nuts'],
  ['تمر', 'تمور', 'خستاوي', 'برحي', 'زهدي', 'dates'],
  ['نستلة', 'شوكولاته', 'كاكاو', 'بسكويت', 'ويفر', 'chocolate', 'biscuits', 'wafers'],
];

/**
 * Expands a single search term to its related synonyms
 */
const getExpandedTerms = (term: string): string[] => {
  const normTerm = normalizeSearchText(term);
  if (!normTerm) return [];

  // Remove leading 'ال' if present (e.g. 'اللحم' -> 'لحم')
  const strippedAl = normTerm.startsWith('ال') && normTerm.length > 3 ? normTerm.slice(2) : null;

  const results = new Set<string>([normTerm]);
  if (strippedAl) results.add(strippedAl);

  // Check synonym groups
  for (const group of SYNONYM_GROUPS) {
    const normalizedGroup = group.map((s) => normalizeSearchText(s));
    const matchesGroup = normalizedGroup.some(
      (item) => item === normTerm || (strippedAl && item === strippedAl) || normTerm.includes(item) || item.includes(normTerm)
    );

    if (matchesGroup) {
      normalizedGroup.forEach((item) => results.add(item));
    }
  }

  return Array.from(results);
};

/**
 * Matches a product against a search query
 */
export const matchesProductSearch = (product: Product, query: string): boolean => {
  const cleanQuery = query.trim();
  if (!cleanQuery) return true;

  const rawTerms = cleanQuery.split(/\s+/).filter(Boolean);
  if (rawTerms.length === 0) return true;

  // Direct exact match for Cashier barcode scanners (e.g. 628100123001)
  if (product.barcode) {
    const rawDigitsOnly = cleanQuery.replace(/\D/g, '');
    const productBarcodeDigits = product.barcode.replace(/\D/g, '');
    if (rawDigitsOnly && productBarcodeDigits.includes(rawDigitsOnly)) {
      return true;
    }
  }

  // Searchable text corpus from product fields
  const corpus = [
    product.nameAr,
    product.nameEn,
    product.barcode || '',
    product.descriptionAr,
    product.descriptionEn,
    product.originAr,
    product.originEn,
    product.unitAr,
    product.unitEn,
    product.category,
    product.subcategoryId || '',
    product.badgeAr || '',
    product.badgeEn || '',
    ...(product.tags || []),
  ].join(' ');

  const normalizedCorpus = normalizeSearchText(corpus);

  // Every token in the user's query must match at least one of its expanded synonyms
  return rawTerms.every((rawTerm) => {
    const expandedSynonyms = getExpandedTerms(rawTerm);
    return expandedSynonyms.some((synonym) => {
      // Substring match on the normalized corpus
      if (normalizedCorpus.includes(synonym)) return true;

      // Also check with leading 'ال'
      const withAl = 'ال' + synonym;
      if (normalizedCorpus.includes(withAl)) return true;

      return false;
    });
  });
};
