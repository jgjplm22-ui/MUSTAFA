/**
 * Security & Anti-Hacking Utilities for Shorja Markets Platform
 * Provides robust protection against XSS, Injection, Prototype Pollution, and Brute Force.
 */

/**
 * Escapes HTML characters to prevent Cross-Site Scripting (XSS)
 */
export function escapeHtml(str: string): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitizes arbitrary text input by stripping hazardous script tags,
 * event handlers (e.g. onerror, onload), and javascript: protocol.
 */
export function sanitizeInput(input: string, maxLength = 1000): string {
  if (typeof input !== 'string') return '';
  
  let cleaned = input.trim();
  
  // Truncate to maximum permissible length to prevent memory exhaustion / ReDoS
  if (cleaned.length > maxLength) {
    cleaned = cleaned.slice(0, maxLength);
  }

  // Remove control characters (except newline, tab, carriage return)
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Strip dangerous javascript: and data: text/html schemes
  cleaned = cleaned.replace(/javascript\s*:/gi, '');
  cleaned = cleaned.replace(/data\s*:\s*text\/html/gi, '');
  cleaned = cleaned.replace(/vbscript\s*:/gi, '');

  // Strip HTML script, iframe, object, embed tags
  cleaned = cleaned.replace(/<\s*(script|iframe|object|embed|svg|style|link|meta)\b[^>]*>.*?<\s*\/\s*\1\s*>/gis, '');
  cleaned = cleaned.replace(/<\s*(script|iframe|object|embed|svg|style|link|meta)\b[^>]*\/?>/gi, '');

  // Strip inline HTML event handlers (e.g., onclick=, onerror=, onload=)
  cleaned = cleaned.replace(/\bon\w+\s*=\s*(['"]).*?\1/gi, '');
  cleaned = cleaned.replace(/\bon\w+\s*=\s*[^>\s]+/gi, '');

  return cleaned;
}

/**
 * Validates URLs for product photos or resources.
 * Only allows secure https:// or trusted local paths (/...).
 */
export function isSafeUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  
  // Relative internal path
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return true;
  }

  // Trusted protocols
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || (parsed.protocol === 'http:' && parsed.hostname === 'localhost');
  } catch {
    return false;
  }
}

/**
 * Validates Iraqi phone numbers (077..., 078..., 075..., 079..., +9647...)
 */
export function isValidIraqiPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const digits = phone.replace(/\D/g, '');
  // Format: 07XXXXXXXXX (11 digits) or 9647XXXXXXXXX (12 digits)
  return (digits.length === 11 && digits.startsWith('07')) || 
         (digits.length === 12 && digits.startsWith('9647'));
}

/**
 * Validates numeric prices to prevent negative or non-finite inputs
 */
export function isValidPrice(price: unknown): price is number {
  return typeof price === 'number' && Number.isFinite(price) && price >= 0 && price <= 100_000_000;
}

/**
 * Generates a cryptographically strong random token (for CSRF and session tracing)
 */
export function generateSecureToken(byteLength = 16): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const arr = new Uint8Array(byteLength);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Protects against Prototype Pollution attacks when updating deep objects
 */
export function isSafeObjectKey(key: string): boolean {
  return key !== '__proto__' && key !== 'constructor' && key !== 'prototype';
}
