import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Plus, X, Search, RefreshCw, ArrowUpDown, Info, Wallet, AlertTriangle, Percent, GripVertical, Moon, Sun, List, Check, Pencil, ChevronUp, ChevronDown, Clock, Database } from 'lucide-react';
import { SpeedInsights } from "@vercel/speed-insights/react";

/**
 * Live Multi-Currency Converter
 * * Updates:
 * - MOBILE FIX: Used 100dvh to fix top/bottom whitespace on mobile browsers.
 * - LAYOUT: Removed top padding (pt-16) so first card is at the top.
 * - UI: Flags are slightly larger (w-7 h-7 container), SVGs kept same visual size (w-6 h-6 centered).
 * - ADD MENU: Now a full-screen modal overlay (fixed inset-0) that fills the screen for better visibility.
 * - INPUT: Search input is text-base to prevent iOS auto-zoom.
 */

// Custom SVG Icons for Crypto
const BitcoinLogo = () => (
  <svg viewBox="0 0 32 32" className="w-full h-full rounded-full">
    <circle cx="16" cy="16" r="16" fill="#F7931A" />
    <path fill="#FFF" d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.409-1.597-4.24 1.134-.26 1.99-1.004 2.217-2.539zm-3.962 5.617c-.542 2.179-4.206 1.003-5.385.71l.96-3.848c1.18.293 4.957.878 4.425 3.138zm.537-5.631c-.496 1.99-3.561.98-4.553.734l.87-3.486c.996.246 4.179.704 3.683 2.752z" />
  </svg>
);

const TetherLogo = () => (
  <svg viewBox="0 0 339.43 295.27" className="w-full h-full">
    <path d="M62.15,1.45l-61.89,130a2.52,2.52,0,0,0,.54,2.94L167.95,294.56a2.55,2.55,0,0,0,3.53,0L338.63,134.4a2.52,2.52,0,0,0,.54-2.94l-61.89-130A2.5,2.5,0,0,0,275,0H64.45a2.5,2.5,0,0,0-2.3,1.45h0Z" fill="#50af95" fillRule="evenodd" />
    <path d="M191.19,144.8v0c-1.2.09-7.4,0.46-21.23,0.46-11,0-18.81-.33-21.55-0.46v0c-42.51-1.87-74.24-9.27-74.24-18.13s31.73-16.25,74.24-18.15v28.91c2.78,0.2,10.74.67,21.74,0.67,13.2,0,19.81-.55,21-0.66v-28.9c42.42,1.89,74.08,9.29,74.08,18.13s-31.65,16.24-74.08,18.12h0Zm0-39.25V79.68h59.2V40.23H89.21V79.68H148.4v25.86c-48.11,2.21-84.29,11.74-84.29,23.16s36.18,20.94,84.29,23.16v82.9h42.78V151.83c48-2.21,84.12-11.73,84.12-23.14s-36.09-20.93-84.12-23.15h0Zm0,0h0Z" fill="#fff" fillRule="evenodd" />
  </svg>
);

// Configuration for display rules
const CURRENCY_RULES = {
  default: { decimals: 2, threshold: 0.01 },
  VND: { decimals: 0, threshold: 1 },
  KRW: { decimals: 0, threshold: 1 },
  JPY: { decimals: 0, threshold: 1 },
  SAT: { decimals: 0, threshold: 1 },
  HUF: { decimals: 0, threshold: 1 },
  CLP: { decimals: 0, threshold: 1 },
  IDR: { decimals: 0, threshold: 1 },
  TWD: { decimals: 0, threshold: 1 },
  PYG: { decimals: 0, threshold: 1 },
  PHP: { decimals: 0, threshold: 1 },
  THB: { decimals: 0, threshold: 1 },
  COP: { decimals: 0, threshold: 1 },
  RUB: { decimals: 0, threshold: 1 },
  CNY: { decimals: 0, threshold: 1 },
  ARS: { decimals: 0, threshold: 1 },
  NGN: { decimals: 0, threshold: 1 },
  TRY: { decimals: 0, threshold: 1 },
  USDT: { decimals: 2, threshold: 0.01 },
  BTC: { decimals: 8, threshold: 0.00000001 },
};

const ALL_CURRENCIES = [
  { code: 'SAT', name: 'Satoshi (Bitcoin)', symbol: 'sat', flag: 'BTC_LOGO', keywords: ['btc', 'bitcoin'] },
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'USDT', name: 'Tether', symbol: '₮', flag: 'USDT_LOGO', keywords: ['crypto', 'stablecoin'] },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
  { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$', flag: '🇹🇼' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$', flag: '🇦🇷' },
  { code: 'CLP', name: 'Chilean Peso', symbol: '$', flag: '🇨🇱' },
  { code: 'COP', name: 'Colombian Peso', symbol: '$', flag: '🇨🇴' },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', flag: '🇵🇪' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'dh', flag: '🇦🇪' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
  { code: 'PLN', name: 'Polish Złoty', symbol: 'zł', flag: '🇵🇱' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', flag: '🇭🇺' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿' },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', flag: '🇮🇱' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', flag: '🇪🇬' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬' },
];

// --- Helper to Safely Get from LocalStorage ---
const getStorage = (key, defaultVal) => {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

export default function App() {
  const [anchorCode, setAnchorCode] = useState('USD');
  const [anchorAmount, setAnchorAmount] = useState('800');

  const [forexRates, setForexRates] = useState({});
  const [userPremiums, setUserPremiums] = useState(() => getStorage('userPremiums', {}));
  const [activeCurrencies, setActiveCurrencies] = useState(() => getStorage('activeCurrencies', ['USD', 'VND', 'SAT', 'USDT']));

  const [isLive, setIsLive] = useState(true);
  const [isP2PMode, setIsP2PMode] = useState(() => getStorage('isP2PMode', false));
  const [isDarkMode, setIsDarkMode] = useState(() => getStorage('isDarkMode',
    (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ?? true
  ));
  const [fontSize, setFontSize] = useState(() => getStorage('fontSize', 24)); // Default 24px (text-2xl)

  const [isAdding, setIsAdding] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSourceInfo, setShowSourceInfo] = useState(false);

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const addDropdownRef = useRef(null);

  // --- Persistence ---
  useEffect(() => { localStorage.setItem('activeCurrencies', JSON.stringify(activeCurrencies)); }, [activeCurrencies]);
  useEffect(() => { localStorage.setItem('userPremiums', JSON.stringify(userPremiums)); }, [userPremiums]);
  useEffect(() => { localStorage.setItem('isP2PMode', JSON.stringify(isP2PMode)); }, [isP2PMode]);
  useEffect(() => { localStorage.setItem('fontSize', JSON.stringify(fontSize)); }, [fontSize]);

  // Listen for system theme changes if no user preference
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (localStorage.getItem('isDarkMode') === null) {
        setIsDarkMode(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // 1. Data Fetching
  useEffect(() => {
    const fetchForex = async () => {
      try {
        const res = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
        const data = await res.json();
        if (!data.rates['BTC']) data.rates['BTC'] = 0.0000105;
        data.rates['SAT'] = data.rates['BTC'] * 100000000;
        if (!data.rates['USDT']) data.rates['USDT'] = 1.00;
        setForexRates(prev => ({ ...prev, ...data.rates }));
        setLoading(false);
      } catch (err) { console.error(err); }
    };

    const fetchCrypto = async () => {
      try {
        const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        const data = await res.json();
        const btcPrice = parseFloat(data.price);
        if (btcPrice) {
          setForexRates(prev => ({
            ...prev,
            BTC: 1 / btcPrice,
            SAT: (1 / btcPrice) * 100000000
          }));
        }
      } catch (err) { console.error(err); }
    };

    fetchForex();
    fetchCrypto();
    const cryptoInterval = setInterval(fetchCrypto, 10000);
    return () => clearInterval(cryptoInterval);
  }, []);

  // 2. Live Simulation
  useEffect(() => {
    if (!isLive || loading) return;
    const interval = setInterval(() => {
      setForexRates(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(k => {
          if (k === 'USD' || k === 'BTC' || k === 'SAT') return;
          next[k] = next[k] * (1 + (Math.random() * 0.0004 - 0.0002));
        });
        return next;
      });
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [isLive, loading]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') setIsAdding(false); };
    const handleClickOutside = (e) => {
      if (addDropdownRef.current && !addDropdownRef.current.contains(e.target)) {
        setIsAdding(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    if (isAdding) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isAdding]);

  // --- Mobile Background Fix ---
  useEffect(() => {
    const bgColor = isDarkMode ? '#1e1e24' : '#f9fafb'; // #f9fafb is tailwind gray-50
    document.body.style.backgroundColor = bgColor;
    document.documentElement.style.backgroundColor = bgColor; // Also set html for overscroll

    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", bgColor);
    }
  }, [isDarkMode]);

  // --- Logic ---
  const getRate = (code) => forexRates[code] || 0;
  const getPremiumPercent = (code) => isP2PMode ? parseFloat(userPremiums[code] || 0) : 0;

  const calculateValue = (targetCode) => {
    if (targetCode === anchorCode) return anchorAmount;
    const numericAnchorAmount = parseFloat(String(anchorAmount).replace(/,/g, '')) || 0;
    const anchorRate = getRate(anchorCode);
    const anchorPremiumFactor = 1 + (getPremiumPercent(anchorCode) / 100);

    if (!anchorRate) return 0;
    const baseUSDValue = (numericAnchorAmount / anchorPremiumFactor) / anchorRate;
    const targetRate = getRate(targetCode);
    const targetPremiumFactor = 1 + (getPremiumPercent(targetCode) / 100);
    return baseUSDValue * targetRate * targetPremiumFactor;
  };

  const handleInputChange = (code, value) => {
    const rule = CURRENCY_RULES[code] || CURRENCY_RULES.default;
    const raw = value.replace(/,/g, '');

    if (rule.decimals === 0 && !/^\d*$/.test(raw)) return;
    if (rule.decimals > 0 && !/^\d*\.?\d*$/.test(raw)) return;

    const parts = raw.split('.');

    // Prevent multiple leading zeros (e.g. 00, 01, 05 -> 0, 1, 5)
    if (parts[0].length > 1 && parts[0].startsWith('0')) {
      parts[0] = parts[0].replace(/^0+/, '');
      if (parts[0] === '') parts[0] = '0';
    }

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    setAnchorCode(code);
    setAnchorAmount(parts.join('.'));
  };

  const handlePremiumChange = (code, val) => {
    if (!/^-?\d*\.?\d{0,2}$/.test(val)) return;
    setUserPremiums(prev => ({ ...prev, [code]: val }));
  };

  const formatDisplayValue = (val, code) => {
    const rule = CURRENCY_RULES[code] || CURRENCY_RULES.default;
    if (code === anchorCode) return val;

    let num = parseFloat(val);
    if (isNaN(num) || num === 0) return '0';
    if (rule.decimals === 0) num = Math.round(num);

    const fixed = num.toFixed(rule.decimals);
    const parts = fixed.split('.');

    // Hide decimals if they are all zero
    if (parts[1] && /^0+$/.test(parts[1])) {
      return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join('.');
  };

  const handleFocusCurrency = (code) => {
    if (isReordering) return;
    if (code === anchorCode) return;
    let val = calculateValue(code);
    const rule = CURRENCY_RULES[code] || CURRENCY_RULES.default;
    if (rule.decimals === 0) val = Math.round(val);
    else val = parseFloat(val.toFixed(rule.decimals));

    setAnchorCode(code);
    const parts = val.toFixed(rule.decimals).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setAnchorAmount(parts.join('.'));
  };

  // --- Drag and Drop ---
  const onDragStart = (e, index) => {
    if (!isReordering) { e.preventDefault(); return; }
    dragItem.current = index;
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragEnter = (e, index) => {
    if (!isReordering) return;
    dragOverItem.current = index;
    if (dragItem.current !== null && dragItem.current !== index) {
      const newItems = [...activeCurrencies];
      const draggedItemContent = newItems[dragItem.current];
      newItems.splice(dragItem.current, 1);
      newItems.splice(index, 0, draggedItemContent);
      dragItem.current = index;
      setActiveCurrencies(newItems);
    }
  };

  const onDragEnd = () => {
    dragItem.current = null;
    dragOverItem.current = null;
  };

  // --- Swipe Logic (Touch + Mouse) ---
  const touchStart = useRef(null);
  const [swipingId, setSwipingId] = useState(null);
  const [swipeOffset, setSwipeOffset] = useState(0);

  const getClientX = (e) => {
    return e.targetTouches ? e.targetTouches[0].clientX : e.clientX;
  };

  const onStart = (e, code) => {
    if (isReordering) return;
    touchStart.current = getClientX(e);
    setSwipingId(code);
    setSwipeOffset(0);
  };

  const onMove = (e) => {
    if (!touchStart.current || !swipingId) return;
    const currentX = getClientX(e);
    const diff = currentX - touchStart.current;
    // Only allow left swipe
    if (diff < 0) {
      setSwipeOffset(diff);
    }
  };

  const onEnd = () => {
    if (!swipingId) return;

    if (swipeOffset < -100) {
      // Threshold met, delete
      if (activeCurrencies.length > 1) {
        handleRemoveCurrency(swipingId);
      }
    }

    // Reset
    setSwipingId(null);
    setSwipeOffset(0);
    touchStart.current = null;
  };

  const moveItem = (index, direction) => {
    const newItems = [...activeCurrencies];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newItems.length) {
      const temp = newItems[targetIndex];
      newItems[targetIndex] = newItems[index];
      newItems[index] = temp;
      setActiveCurrencies(newItems);
    }
  };

  const handleAddCurrency = (code) => {
    if (!activeCurrencies.includes(code)) setActiveCurrencies([...activeCurrencies, code]);
    setIsAdding(false);
    setSearchTerm('');
  };

  const handleRemoveCurrency = (code) => {
    if (activeCurrencies.length > 1) {
      if (code === anchorCode) {
        const next = activeCurrencies.find(c => c !== code);
        handleFocusCurrency(next);
      }
      setActiveCurrencies(activeCurrencies.filter(c => c !== code));
    }
  };

  const getCurrencyIcon = (info) => {
    if (info.flag === 'BTC_LOGO') return <div className="w-6 h-6"><BitcoinLogo /></div>;
    if (info.flag === 'USDT_LOGO') return <div className="w-6 h-6"><TetherLogo /></div>;
    // UPDATED: text-3xl for bigger flags
    return <span className="text-[28px] leading-none select-none">{info.flag}</span>;
  };

  // Theme
  const theme = {
    bg: isDarkMode ? 'bg-[#1e1e24]' : 'bg-gray-50',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    cardBg: isDarkMode ? 'bg-[#252836]' : 'bg-white',
    cardBorder: isDarkMode ? 'border-[#2f3344]' : 'border-gray-200',
    cardHover: isDarkMode ? 'hover:bg-[#2a2d3d]' : 'hover:bg-gray-50',
    // UPDATED: Softer shadow/border for active card
    cardActiveBorder: isDarkMode ? 'border-orange-500/50 shadow-sm shadow-orange-500/20' : 'border-orange-500 shadow-sm shadow-orange-500/20',
    inputBg: isDarkMode ? 'bg-[#1a1d26]' : 'bg-gray-100',
    inputBorder: isDarkMode ? 'border-orange-500/30' : 'border-orange-200',
    subText: isDarkMode ? 'text-slate-500' : 'text-gray-400',
    modalBg: isDarkMode ? 'bg-[#1e1e24]' : 'bg-white',
    modalBorder: isDarkMode ? 'border-[#2f3344]' : 'border-gray-200',
    divider: isDarkMode ? 'border-[#2f3344]' : 'border-gray-100',
    btnDefault: isDarkMode ? 'bg-[#1a1d26] border-[#2f3344] text-slate-400' : 'bg-white border-gray-200 text-gray-500',
    btnHover: isDarkMode ? 'hover:border-slate-500' : 'hover:border-gray-400 hover:bg-gray-50',
    accentText: isDarkMode ? 'text-orange-400' : 'text-orange-600',
    accentBg: isDarkMode ? 'bg-orange-500/10' : 'bg-orange-50',
  };

  return (
    // UPDATED: min-h-[100dvh] for mobile viewport fix
    <div className={`min-h-[100dvh] ${theme.bg} ${theme.text} font-sans flex flex-col items-center justify-between p-4 transition-colors duration-300 relative overflow-hidden pt-6`}>

      {/* Orb 1 */}
      <div className={`absolute top-1/4 left-1/2 w-[300px] h-[300px] bg-orange-500/20 rounded-full blur-[80px] pointer-events-none animate-float-1`}></div>
      {/* Orb 2 */}
      <div className={`absolute top-3/4 left-1/4 w-[250px] h-[250px] bg-orange-400/15 rounded-full blur-[60px] pointer-events-none animate-float-2`}></div>
      {/* Orb 3 */}
      <div className={`absolute top-1/2 left-3/4 w-[200px] h-[200px] bg-orange-600/15 rounded-full blur-[70px] pointer-events-none animate-float-3`}></div>

      <div className="w-full max-w-md flex flex-col gap-4 relative z-10 flex-1">

        <div className="flex flex-col gap-3">
          {activeCurrencies.map((code, index) => {
            const info = ALL_CURRENCIES.find(c => c.code === code) || { code, symbol: '', flag: '🌐' };
            const isAnchor = code === anchorCode;

            const rawValue = calculateValue(code);
            const displayValue = formatDisplayValue(rawValue, code);

            return (
              <div
                key={code}
                draggable={isReordering}
                onDragStart={(e) => onDragStart(e, index)}
                onDragEnter={(e) => onDragEnter(e, index)}
                onDragEnd={onDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className={`
                  group relative rounded-2xl p-3 flex items-center justify-between transition-all duration-200 border select-none
                  ${isAnchor
                    ? `${theme.cardBg} ${theme.cardActiveBorder} z-10 scale-[1.01]`
                    : `${theme.cardBg} ${theme.cardBorder} ${isReordering ? '' : theme.cardHover}`
                  }
                  ${isReordering ? 'cursor-move' : 'cursor-default'}
                  ${isReordering ? 'overflow-visible' : 'overflow-hidden'}
                `}
                onTouchStart={(e) => onStart(e, code)}
                onTouchMove={onMove}
                onTouchEnd={onEnd}
                onMouseDown={(e) => onStart(e, code)}
                onMouseMove={onMove}
                onMouseUp={onEnd}
                onMouseLeave={onEnd}
              >
                {/* Swipe Background (Trash) */}
                <div className={`absolute inset-0 flex items-center justify-end px-6 bg-red-500 transition-opacity duration-200 ${swipingId === code && swipeOffset < 0 ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="text-white font-bold flex items-center gap-2">
                    <span>Delete</span>
                    <X size={20} />
                  </div>
                </div>

                {/* Card Content */}
                <div
                  className="flex items-center justify-between w-full relative z-10 transition-transform duration-75"
                  style={{ transform: swipingId === code ? `translateX(${swipeOffset}px)` : 'translateX(0)' }}
                >
                  <div className="flex-shrink-0 z-10 flex items-center gap-2">
                    {isReordering && (
                      <div className="flex flex-col items-center mr-1 gap-0">
                        <button onClick={(e) => { e.stopPropagation(); moveItem(index, 'up') }} disabled={index === 0} className={`p-0.5 rounded ${index === 0 ? 'opacity-20' : 'hover:bg-slate-700'} ${theme.subText}`}>
                          <ChevronUp size={16} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); moveItem(index, 'down') }} disabled={index === activeCurrencies.length - 1} className={`p-0.5 rounded ${index === activeCurrencies.length - 1 ? 'opacity-20' : 'hover:bg-slate-700'} ${theme.subText}`}>
                          <ChevronDown size={16} />
                        </button>
                      </div>
                    )}
                    <div className={`flex flex-col items-center justify-center w-10 text-center`}>
                      {/* UPDATED: w-7 h-7 for slightly bigger flag presence */}
                      <div className="w-7 h-7 flex items-center justify-center">
                        {getCurrencyIcon(info)}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 relative z-10 pl-2 flex flex-row items-center justify-end gap-2">
                    <div className={`
                    relative rounded-xl flex items-center px-3 py-2 border transition-colors flex-1 min-w-0
                    ${isAnchor ? `${theme.inputBg} ${theme.inputBorder}` : `${theme.inputBg} border-transparent`}
                    ${isReordering ? 'opacity-50 pointer-events-none' : ''}
                  `}>
                      {isAnchor ? (
                        <div className="relative w-full h-full flex items-center">
                          {/* Styled Overlay */}
                          <div
                            className={`absolute inset-0 w-full text-right font-sans tabular-nums font-bold pointer-events-none flex items-center justify-end ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                            style={{ fontSize: `${fontSize}px`, lineHeight: '1.2' }}
                            aria-hidden="true"
                          >
                            {displayValue.split('').map((char, i) =>
                              char === ',' ? <span key={i} className="opacity-40">,</span> : char
                            )}
                          </div>
                          {/* Transparent Input */}
                          <input
                            autoFocus
                            type="text"
                            disabled={isReordering}
                            inputMode={CURRENCY_RULES[code]?.decimals === 0 ? "numeric" : "decimal"}
                            value={displayValue}
                            onChange={(e) => handleInputChange(code, e.target.value)}
                            style={{ fontSize: `${fontSize}px`, lineHeight: '1.2', color: 'transparent', caretColor: isDarkMode ? 'white' : 'black' }}
                            className={`w-full bg-transparent text-right font-sans tabular-nums outline-none font-bold z-10 cursor-text min-w-0 placeholder-transparent`}
                          />
                        </div>
                      ) : (
                        <div
                          tabIndex={0}
                          onClick={(e) => { e.stopPropagation(); handleFocusCurrency(code); }}
                          onFocus={() => handleFocusCurrency(code)}
                          style={{ fontSize: `${fontSize}px`, lineHeight: '1.2' }}
                          className={`w-full bg-transparent text-right font-sans tabular-nums outline-none font-bold z-10 cursor-text min-w-0 ${isDarkMode ? 'text-white' : 'text-gray-900'} whitespace-nowrap overflow-hidden`}
                        >
                          {displayValue.split('').map((char, i) =>
                            char === ',' ? <span key={i} className="opacity-50">,</span> : char
                          )}
                        </div>
                      )}
                      <span className={`ml-2 ${theme.subText} font-bold text-xs w-8 text-right flex-shrink-0`}>
                        {info.code}
                      </span>
                    </div>

                    {isP2PMode && !isReordering && (
                      <div
                        className={`flex flex-col justify-center items-center ${theme.inputBg} ${theme.cardBorder} border rounded-lg w-14 h-full shrink-0`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          placeholder="0"
                          value={userPremiums[code] || ''}
                          onChange={(e) => handlePremiumChange(code, e.target.value)}
                          className={`bg-transparent w-full text-center text-xs font-mono font-bold outline-none p-1 ${theme.accentText}`}
                        />
                        <span className={`text-[9px] ${theme.subText} font-bold -mt-1`}>P2P%</span>
                      </div>
                    )}
                  </div>

                  {isReordering && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemoveCurrency(code); }}
                      className={`absolute -right-3 -top-3 p-1.5 rounded-full shadow-md border z-50 transition-all scale-100 opacity-100 ${isDarkMode ? 'bg-[#2f3344] border-[#3b3f54] text-slate-400 hover:text-red-400 hover:bg-[#363a4d]' : 'bg-white border-gray-200 text-gray-400 hover:text-red-500 hover:bg-gray-50'}`}
                      title="Remove"
                    >
                      <X size={14} strokeWidth={2.5} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative z-[100]" ref={addDropdownRef}>
          {/* Input Field (replaces Button) */}
          <div
            className={`w-full font-medium py-3 rounded-2xl border flex items-center gap-3 px-4 transition-colors shadow-sm
                ${isDarkMode ? 'bg-[#252836] border-[#2f3344]' : 'bg-white border-gray-200'}
                ${isAdding ? (isDarkMode ? 'border-orange-500/50' : 'border-orange-200') : ''}
              `}
          >
            <Plus size={18} className={theme.subText} />
            <input
              type="text"
              placeholder="Add a currency"
              value={searchTerm}
              onFocus={() => setIsAdding(true)}
              onClick={() => setIsAdding(true)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (!isAdding) setIsAdding(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const term = searchTerm.trim().toUpperCase();
                  const exact = ALL_CURRENCIES.find(c => c.code === term);
                  if (exact && !activeCurrencies.includes(exact.code)) {
                    handleAddCurrency(exact.code);
                  } else {
                    const searchLower = searchTerm.toLowerCase();
                    const filtered = ALL_CURRENCIES.filter(c =>
                      !activeCurrencies.includes(c.code) &&
                      (c.code.toLowerCase().includes(searchLower) || c.name.toLowerCase().includes(searchLower) || c.keywords?.some(k => k.includes(searchLower)))
                    );
                    if (filtered.length > 0) {
                      handleAddCurrency(filtered[0].code);
                    }
                  }
                }
                if (e.key === 'Escape') {
                  setIsAdding(false);
                  e.currentTarget.blur();
                }
              }}
              className={`bg-transparent outline-none w-full text-base font-medium ${isDarkMode ? 'text-white placeholder-slate-500' : 'text-gray-900 placeholder-gray-400'}`}
            />
            {searchTerm && (
              <button onClick={() => { setSearchTerm(''); setIsAdding(false); }} className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-[#2f3344] text-slate-400' : 'hover:bg-gray-100 text-gray-400'}`}>
                <X size={16} />
              </button>
            )}
          </div>

          {/* Dropdown Menu (List Only) */}
          {isAdding && (
            <div className={`absolute top-full left-0 right-0 mt-2 max-h-[50vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200 ${theme.modalBg} ${theme.modalBorder}`}>
              <div className="overflow-y-auto flex-1 p-1">
                {ALL_CURRENCIES
                  .filter(c => {
                    const searchLower = searchTerm.toLowerCase();
                    const match = c.code.toLowerCase().includes(searchLower) ||
                      c.name.toLowerCase().includes(searchLower) ||
                      c.keywords?.some(k => k.includes(searchLower));
                    return !activeCurrencies.includes(c.code) && match;
                  })
                  .map(c => (
                    <button
                      key={c.code}
                      onClick={() => { handleAddCurrency(c.code); }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-colors text-left group ${isDarkMode ? 'hover:bg-[#2f3344]' : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-6 h-6 flex justify-center items-center flex-shrink-0">
                          {getCurrencyIcon(c)}
                        </div>
                        <div className="flex items-baseline gap-2 overflow-hidden min-w-0">
                          <span className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{c.code}</span>
                          <span className={`text-xs truncate ${theme.subText}`}>{c.name}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                {ALL_CURRENCIES.every(c => activeCurrencies.includes(c.code)) && (
                  <div className={`p-4 text-center text-xs ${theme.subText}`}>
                    All available currencies added
                  </div>
                )}
                {ALL_CURRENCIES.filter(c => !activeCurrencies.includes(c.code) && (c.code.toLowerCase().includes(searchTerm.toLowerCase()) || c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.keywords?.some(k => k.includes(searchTerm.toLowerCase())))).length === 0 && !ALL_CURRENCIES.every(c => activeCurrencies.includes(c.code)) && (
                  <div className={`p-4 text-center text-xs ${theme.subText}`}>
                    No currency found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Wrapper */}
        <div className="flex flex-col gap-2 mt-auto relative z-10 pb-2">
          <div className="flex gap-2">
            <button
              onClick={() => setIsP2PMode(!isP2PMode)}
              disabled={isReordering}
              className={`
                  flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl border transition-all relative overflow-hidden
                  ${isP2PMode
                  ? `${theme.accentBg} ${isDarkMode ? 'border-orange-500/50' : 'border-orange-200'} ${theme.accentText}`
                  : `${theme.btnDefault} ${theme.btnHover}`
                }
                  ${isReordering ? 'opacity-50' : ''}
                `}
            >
              <Wallet size={16} />
              <span className="font-semibold text-xs">P2P Mode</span>
              {isP2PMode && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>}
            </button>

            <button
              onClick={() => setIsReordering(!isReordering)}
              className={`
                  flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl border transition-all
                  ${isReordering
                  ? `${isDarkMode ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' : 'bg-orange-50 border-orange-200 text-orange-600'}`
                  : `${theme.btnDefault} ${theme.btnHover}`
                }
                `}
            >
              {isReordering ? <Check size={16} /> : <Pencil size={14} />}
              <span className="font-semibold text-xs">{isReordering ? 'Done' : 'Edit'}</span>
            </button>
          </div>

          <div className="flex justify-between items-center gap-3 w-full">
            {/* Font Size Controls */}
            <div className={`flex items-center rounded-xl border ${theme.btnDefault} overflow-hidden flex-1 h-12`}>
              <button
                onClick={() => setFontSize(prev => Math.max(12, prev - 2))}
                className={`flex-1 h-full hover:bg-opacity-80 transition-colors border-r ${theme.divider} flex items-center justify-center`}
              >
                <span className="text-xs font-bold">A-</span>
              </button>
              <button
                onClick={() => setFontSize(prev => Math.min(48, prev + 2))}
                className={`flex-1 h-full hover:bg-opacity-80 transition-colors flex items-center justify-center`}
              >
                <span className="text-sm font-bold">A+</span>
              </button>
            </div>

            <button
              onClick={() => {
                const newVal = !isDarkMode;
                setIsDarkMode(newVal);
                localStorage.setItem('isDarkMode', JSON.stringify(newVal));
              }}
              className={`flex-1 h-12 rounded-xl text-xs font-medium border transition-colors flex items-center justify-center ${theme.btnDefault} ${theme.btnHover}`}
            >
              {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>

          <div
            onClick={() => setShowSourceInfo(!showSourceInfo)}
            onMouseEnter={() => setShowSourceInfo(true)}
            onMouseLeave={() => setShowSourceInfo(false)}
            className={`relative w-full rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-xs font-medium border ${theme.btnDefault} cursor-pointer select-none`}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_5px_rgba(249,115,22,0.5)]"></span>
            <span>
              Live • {currentTime.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZoneName: 'short' })} • Base: {anchorCode}
            </span>

            <div className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-3 rounded-xl shadow-xl border transition-all z-50 flex flex-col gap-2 ${isDarkMode ? 'bg-[#252836] border-[#3b3f54] text-slate-300' : 'bg-white border-gray-200 text-gray-600'} ${showSourceInfo ? 'visible opacity-100' : 'invisible opacity-0'}`}>
              <div className="flex items-center gap-2 text-[10px]">
                <Database size={12} className="text-blue-400" />
                <span>Fiat: ExchangeRate-API</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <Database size={12} className="text-orange-400" />
                <span>Crypto: Binance Public API</span>
              </div>
              <div className={`absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent ${isDarkMode ? 'border-t-[#252836]' : 'border-t-white'}`}></div>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes float-1 {
          0%, 100% { transform: translate(-50%, -50%) translate(0, 0) scale(1); opacity: 0.4; }
          33% { transform: translate(-50%, -50%) translate(20vw, 10vh) scale(1.2); opacity: 0.6; }
          66% { transform: translate(-50%, -50%) translate(-20vw, 20vh) scale(0.8); opacity: 0.3; }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(-50%, -50%) translate(-10vw, -10vh) scale(0.9); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) translate(15vw, 15vh) scale(1.1); opacity: 0.5; }
        }
        @keyframes float-3 {
          0%, 100% { transform: translate(-50%, -50%) translate(10vw, 20vh) scale(1.1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) translate(-15vw, -10vh) scale(0.8); opacity: 0.3; }
        }
        .animate-float-1 { animation: float-1 20s infinite ease-in-out; }
        .animate-float-2 { animation: float-2 25s infinite ease-in-out; }
        .animate-float-3 { animation: float-3 30s infinite ease-in-out; }
      `}</style>
    </div >
  );
}