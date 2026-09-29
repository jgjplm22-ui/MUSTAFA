import React from 'react';
import { IconType } from '../types/market';

interface Props {
  iconType: IconType;
  imageUrl?: string;
  className?: string;
  alt?: string;
}

export const ProductIllustration: React.FC<Props> = ({ 
  iconType, 
  imageUrl, 
  className = 'w-24 h-24',
  alt = 'Product'
}) => {
  const [hasError, setHasError] = React.useState(false);

  // If a custom image URL or uploaded data URL is provided and has not errored, render it!
  if (imageUrl && !hasError) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        className={`${className} object-contain rounded-xl`}
        onError={() => setHasError(true)}
        loading="lazy"
      />
    );
  }

  switch (iconType) {
    // MEATS & POULTRY
    case 'meat':
    case 'steak':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 56C18 42 28 28 44 24C60 20 78 28 82 44C86 60 76 74 60 78C44 82 26 70 22 56Z" fill="#DC2626" stroke="#991B1B" strokeWidth="2.5" />
          <path d="M36 48C34 38 42 30 52 32C62 34 68 44 64 54C60 64 48 66 40 62" stroke="#FCA5A5" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="50" cy="48" rx="8" ry="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          <ellipse cx="50" cy="48" rx="4" ry="3" fill="#F8FAFC" />
          <circle cx="30" cy="40" r="3" fill="#EF4444" />
        </svg>
      );
    case 'chicken':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="45" cy="45" rx="22" ry="18" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
          <path d="M58 52L78 72C80 74 80 78 76 80C72 82 68 80 66 76L52 60" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
          <circle cx="78" cy="74" r="5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <circle cx="73" cy="79" r="4.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <path d="M32 40C38 34 48 34 54 40" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'mince':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="62" rx="34" ry="14" fill="#0F172A" />
          <path d="M22 60C22 45 32 30 50 28C68 30 78 45 78 60H22Z" fill="#B91C1C" stroke="#7F1D1D" strokeWidth="2" />
          <circle cx="36" cy="48" r="2.5" fill="#FECACA" />
          <circle cx="48" cy="42" r="2.5" fill="#FECACA" />
          <circle cx="62" cy="46" r="2.5" fill="#FECACA" />
          <circle cx="44" cy="54" r="2.5" fill="#FECACA" />
          <circle cx="56" cy="53" r="2.5" fill="#FECACA" />
          <circle cx="34" cy="56" r="2" fill="#FECACA" />
          <circle cx="65" cy="55" r="2" fill="#FECACA" />
        </svg>
      );
    case 'fish':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 50C26 36 50 32 72 50C50 68 26 64 18 50Z" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
          <path d="M72 50L88 38V62L72 50Z" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
          <circle cx="30" cy="47" r="3" fill="#FFFFFF" />
          <circle cx="29" cy="47" r="1.5" fill="#0F172A" />
          <path d="M42 42C46 46 46 54 42 58" stroke="#7DD3FC" strokeWidth="2" strokeLinecap="round" />
          <path d="M52 42C56 46 56 54 52 58" stroke="#7DD3FC" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    // GROCERIES & PANTRY
    case 'rice':
    case 'flour':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M26 34C26 28 32 24 50 24C68 24 74 28 74 34V76C74 82 66 84 50 84C34 84 26 82 26 76V34Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
          <path d="M30 30L50 24L70 30" stroke="#B45309" strokeWidth="2" />
          <rect x="36" y="44" width="28" height="24" rx="4" fill="#F59E0B" />
          <circle cx="50" cy="56" r="8" fill="#FFFBEB" />
          <path d="M50 50V62M44 56H56" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'oil':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="36" y="32" width="28" height="52" rx="6" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
          <rect x="44" y="18" width="12" height="14" fill="#F59E0B" />
          <rect x="42" y="14" width="16" height="5" rx="2.5" fill="#DC2626" />
          <ellipse cx="50" cy="56" rx="8" ry="12" fill="#FEF08A" />
          <circle cx="50" cy="54" r="3" fill="#F59E0B" />
        </svg>
      );
    case 'spices':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 74C24 64 35 56 50 56C65 56 76 64 76 74H24Z" fill="#D97706" />
          <path d="M34 56C34 46 41 40 50 40C59 40 66 46 66 56H34Z" fill="#DC2626" />
          <ellipse cx="50" cy="76" rx="30" ry="10" fill="#78350F" />
          <circle cx="50" cy="38" r="4" fill="#FBBF24" />
        </svg>
      );
    case 'tomato_paste':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="26" width="40" height="54" rx="6" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
          <ellipse cx="50" cy="26" rx="20" ry="6" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
          <rect x="30" y="42" width="40" height="22" fill="#FFFFFF" />
          <circle cx="50" cy="53" r="6" fill="#EF4444" />
          <path d="M50 48V46M48 47L52 47" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'sugar':
    case 'beans':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="28" y="26" width="44" height="56" rx="8" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2.5" />
          <path d="M28 46H72" stroke="#3B82F6" strokeWidth="4" />
          <circle cx="50" cy="62" r="8" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
        </svg>
      );
    case 'chai':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M36 26H64L58 48C56 56 60 62 62 76H38C40 62 44 56 42 48L36 26Z" fill="#991B1B" fillOpacity="0.9" stroke="#F59E0B" strokeWidth="2" />
          <ellipse cx="50" cy="78" rx="24" ry="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
          <path d="M48 18C48 14 52 14 52 10" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    // DAIRY & EGGS
    case 'milk':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="34" y="34" width="32" height="48" rx="6" fill="#F8FAFC" stroke="#0284C7" strokeWidth="2" />
          <path d="M34 34L42 20H58L66 34" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
          <rect x="44" y="14" width="12" height="7" rx="2" fill="#0284C7" />
          <rect x="34" y="48" width="32" height="16" fill="#0284C7" />
          <circle cx="50" cy="56" r="5" fill="#FFFFFF" />
        </svg>
      );
    case 'cheese':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 66L78 66L82 46L46 32L22 66Z" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
          <path d="M46 32V66" stroke="#D97706" strokeWidth="1.5" />
          <circle cx="34" cy="52" r="3.5" fill="#FEF3C7" stroke="#D97706" strokeWidth="1" />
          <circle cx="62" cy="54" r="4.5" fill="#FEF3C7" stroke="#D97706" strokeWidth="1" />
          <circle cx="50" cy="44" r="2.5" fill="#FEF3C7" stroke="#D97706" strokeWidth="1" />
        </svg>
      );
    case 'eggs':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="38" cy="55" rx="14" ry="19" transform="rotate(-15 38 55)" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
          <ellipse cx="62" cy="55" rx="14" ry="19" transform="rotate(15 62 55)" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
          <ellipse cx="50" cy="46" rx="13" ry="18" fill="#FFFBEB" stroke="#D97706" strokeWidth="2" />
          <circle cx="50" cy="48" r="4" fill="#F59E0B" fillOpacity="0.4" />
        </svg>
      );
    case 'yogurt':
    case 'cream':
    case 'butter':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 42L36 78H64L70 42H30Z" fill="#F0FDF4" stroke="#16A34A" strokeWidth="2" />
          <ellipse cx="50" cy="42" rx="22" ry="7" fill="#DCFCE7" stroke="#16A34A" strokeWidth="2" />
          <rect x="38" y="52" width="24" height="14" rx="3" fill="#16A34A" />
          <circle cx="50" cy="59" r="4" fill="#FFFFFF" />
        </svg>
      );

    // DETERGENTS & CLEANERS
    case 'detergent_powder':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M26 26L36 14H64L74 26V82H26V26Z" fill="#2563EB" stroke="#1D4ED8" strokeWidth="2.5" />
          <path d="M36 40C44 32 56 32 64 40C72 48 64 64 50 64C36 64 28 48 36 40Z" fill="#F59E0B" />
          <circle cx="50" cy="52" r="8" fill="#FFFFFF" />
          <path d="M50 46V58M44 52H56" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="70" cy="30" r="3" fill="#93C5FD" />
        </svg>
      );
    case 'dish_soap':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M38 34C38 30 62 30 62 34V76C62 82 56 84 50 84C44 84 38 82 38 76V34Z" fill="#10B981" stroke="#059669" strokeWidth="2" />
          <rect x="46" y="18" width="8" height="12" fill="#047857" />
          <path d="M42 18H58V14H42V18Z" fill="#F59E0B" />
          <rect x="42" y="46" width="16" height="22" rx="3" fill="#FFFFFF" />
          <circle cx="50" cy="57" r="5" fill="#34D399" />
          <circle cx="68" cy="28" r="3" fill="#A7F3D0" />
          <circle cx="72" cy="38" r="4.5" fill="#A7F3D0" />
        </svg>
      );
    case 'bleach':
    case 'disinfectant':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M36 34L44 22H56L64 34V82H36V34Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
          <path d="M64 42C74 46 74 62 64 66" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" fill="none" />
          <rect x="46" y="14" width="8" height="8" rx="2" fill="#DC2626" />
          <rect x="36" y="46" width="28" height="20" fill="#0284C7" />
          <path d="M42 56L50 48L58 56" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'tissues':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="22" y="44" width="56" height="34" rx="6" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2" />
          <ellipse cx="50" cy="44" rx="16" ry="5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
          <path d="M44 44C44 26 56 26 56 44" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        </svg>
      );
    case 'soap':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="24" y="36" width="52" height="34" rx="10" fill="#047857" stroke="#065F46" strokeWidth="2" />
          <rect x="28" y="40" width="44" height="26" rx="6" fill="#059669" />
          <ellipse cx="50" cy="53" rx="12" ry="7" fill="#10B981" />
          <circle cx="30" cy="28" r="4" fill="#A7F3D0" />
          <circle cx="70" cy="26" r="3" fill="#A7F3D0" />
        </svg>
      );

    // SNACKS & MUNCHIES
    case 'chips':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 18L22 82H78L70 18H30Z" fill="#DC2626" stroke="#991B1B" strokeWidth="2.5" />
          <path d="M22 82L30 78L38 82L46 78L54 82L62 78L70 82L78 78" stroke="#991B1B" strokeWidth="2" />
          <ellipse cx="50" cy="48" rx="16" ry="12" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
          <text x="50" y="52" textAnchor="middle" fill="#78350F" fontSize="9" fontWeight="bold">CHIPS</text>
        </svg>
      );
    case 'nuts':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="44" cy="52" rx="14" ry="18" transform="rotate(-20 44 52)" fill="#92400E" />
          <ellipse cx="58" cy="48" rx="13" ry="17" transform="rotate(25 58 48)" fill="#B45309" />
          <ellipse cx="50" cy="62" rx="12" ry="15" fill="#78350F" />
          <path d="M48 38C50 46 50 56 46 64" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'chocolate':
    case 'biscuits':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="26" y="24" width="48" height="56" rx="4" fill="#451A03" stroke="#291102" strokeWidth="2" />
          <rect x="32" y="30" width="16" height="14" rx="2" fill="#78350F" />
          <rect x="52" y="30" width="16" height="14" rx="2" fill="#78350F" />
          <rect x="32" y="48" width="16" height="14" rx="2" fill="#78350F" />
          <rect x="52" y="48" width="16" height="14" rx="2" fill="#78350F" />
        </svg>
      );
    case 'dates':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="44" cy="54" rx="18" ry="24" transform="rotate(-25 44 54)" fill="#451A03" />
          <ellipse cx="58" cy="46" rx="16" ry="22" transform="rotate(30 58 46)" fill="#78350F" />
          <path d="M48 38C50 44 50 56 46 64" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'popcorn':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 42L36 82H64L70 42H30Z" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
          <line x1="42" y1="42" x2="44" y2="82" stroke="#FFFFFF" strokeWidth="3" />
          <line x1="58" y1="42" x2="56" y2="82" stroke="#FFFFFF" strokeWidth="3" />
          <circle cx="38" cy="36" r="8" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5" />
          <circle cx="50" cy="30" r="9" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5" />
          <circle cx="62" cy="36" r="8" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="34" fill="#059669" fillOpacity="0.15" stroke="#059669" strokeWidth="2" />
          <circle cx="50" cy="50" r="14" fill="#059669" />
        </svg>
      );
  }
};
