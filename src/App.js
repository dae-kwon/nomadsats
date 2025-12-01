import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Plus, X, Search, RefreshCw, ArrowUpDown, Info, Wallet, AlertTriangle, Percent, GripVertical, Moon, Sun, List, Check, Pencil, ChevronUp, ChevronDown, Clock, Database } from 'lucide-react';

/**
 * Live Multi-Currency Converter
 * * Updates:
 * - LAYOUT FIX: "Add Currency" dropdown z-index increased to 100 to appear OVER the footer settings.
 * - TIMEZONE: Clock now shows explicit offset (e.g., GMT+7) for accuracy.
 * - UI: Subtle active card shadow, bottom-aligned footer.
 */

// Custom SVG Icons for Crypto
const BitcoinLogo = () => (
  <svg viewBox="0 0 32 32" className="w-full h-full rounded-full">
    <circle cx="16" cy="16" r="16" fill="#F7931A"/>
    <path fill="#FFF" d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.409-1.597-4.24 1.134-.26 1.99-1.004 2.217-2.539zm-3.962 5.617c-.542 2.179-4.206 1.003-5.385.71l.96-3.848c1.18.293 4.957.878 4.425 3.138zm.537-5.631c-.496 1.99-3.561.98-4.553.734l.87-3.486c.996.246 4.179.704 3.683 2.752z"/>
  </svg>
);

const TetherLogo = () => (
  // Official Tether Logo SVG
  <svg viewBox="0 0 32 32" className="w-full h-full rounded-full">
    <g fill="none" fillRule="evenodd">
      <circle cx="16" cy="16" r="16" fill="#26A17B"/>
      <path fill="#FFF" d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118 0 1.044 3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.116 0-1.043-3.301-1.914-7.694-2.117"/>
    </g>
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
  const [isDarkMode, setIsDarkMode] = useState(() => getStorage('isDarkMode', true));
  
  const [isAdding, setIsAdding] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const addDropdownRef = useRef(null);

  // --- Persistence ---
  useEffect(() => { localStorage.setItem('activeCurrencies', JSON.stringify(activeCurrencies)); }, [activeCurrencies]);
  useEffect(() => { localStorage.setItem('userPremiums', JSON.stringify(userPremiums)); }, [userPremiums]);
  useEffect(() => { localStorage.setItem('isP2PMode', JSON.stringify(isP2PMode)); }, [isP2PMode]);
  useEffect(() => { localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode)); }, [isDarkMode]);

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
    function handleClickOutside(event) {
      if (addDropdownRef.current && !addDropdownRef.current.contains(event.target)) {
        setIsAdding(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: rule.decimals,
      maximumFractionDigits: rule.decimals,
    }).format(num);
  };

  const handleFocusCurrency = (code) => {
    if (isReordering) return;
    if (code === anchorCode) return;
    let val = calculateValue(code);
    const rule = CURRENCY_RULES[code] || CURRENCY_RULES.default;
    if (rule.decimals === 0) val = Math.round(val);
    else val = parseFloat(val.toFixed(rule.decimals));
    setAnchorCode(code);
    setAnchorAmount(new Intl.NumberFormat('en-US', {
        maximumFractionDigits: rule.decimals, useGrouping: true 
    }).format(val));
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
    if (info.flag === 'BTC_LOGO') return <BitcoinLogo />;
    if (info.flag === 'USDT_LOGO') return <TetherLogo />;
    return <span className="text-2xl leading-none select-none">{info.flag}</span>;
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
    <div className={`min-h-screen ${theme.bg} ${theme.text} font-sans flex flex-col items-center justify-between p-2 sm:p-4 transition-colors duration-300 relative overflow-hidden pt-16`}>
      
      <div className={`absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-orange-500/20 rounded-full blur-[80px] pointer-events-none animate-pulse-slow ${isDarkMode ? 'opacity-60' : 'opacity-40'}`}></div>

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
                `}
              >
                <div className="flex-shrink-0 z-10 flex items-center gap-2">
                   {isReordering && (
                     <div className="flex flex-col items-center mr-1 gap-1">
                        <button onClick={(e) => {e.stopPropagation(); moveItem(index, 'up')}} disabled={index === 0} className={`p-0.5 rounded ${index === 0 ? 'opacity-20' : 'hover:bg-slate-700'} ${theme.subText}`}>
                           <ChevronUp size={20} />
                        </button>
                        <button onClick={(e) => {e.stopPropagation(); moveItem(index, 'down')}} disabled={index === activeCurrencies.length - 1} className={`p-0.5 rounded ${index === activeCurrencies.length - 1 ? 'opacity-20' : 'hover:bg-slate-700'} ${theme.subText}`}>
                           <ChevronDown size={20} />
                        </button>
                     </div>
                   )}
                   <div className={`flex flex-col items-center justify-center w-10 text-center`}>
                        <div className="w-6 h-6 flex items-center justify-center">
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
                    <input
                      type="text"
                      disabled={isReordering}
                      inputMode={CURRENCY_RULES[code]?.decimals === 0 ? "numeric" : "decimal"}
                      value={displayValue}
                      onClick={(e) => {
                         e.stopPropagation();
                         if (code !== anchorCode) {
                            handleFocusCurrency(code);
                         }
                      }}
                      onFocus={() => {
                         if (code !== anchorCode) {
                            handleFocusCurrency(code);
                         }
                      }}
                      onChange={(e) => handleInputChange(code, e.target.value)}
                      className={`w-full bg-transparent text-right font-mono text-xl sm:text-2xl outline-none font-bold z-10 cursor-text min-w-0 ${isDarkMode ? 'text-white placeholder-slate-600' : 'text-gray-900 placeholder-gray-300'}`}
                    />
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
                    className={`absolute -right-2 -top-2 p-1.5 rounded-full shadow-md border z-50 transition-all scale-100 opacity-100 ${isDarkMode ? 'bg-[#2f3344] border-[#3b3f54] text-slate-400 hover:text-red-400 hover:bg-[#363a4d]' : 'bg-white border-gray-200 text-gray-400 hover:text-red-500 hover:bg-gray-50'}`}
                    title="Remove"
                  >
                    <X size={14} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Button & Dropdown */}
        {/* UPDATED: Z-Index 100 ensures this layer floats above the footer controls */}
        <div className="relative z-[100]" ref={addDropdownRef}>
          <button 
            disabled={isReordering}
            onClick={() => setIsAdding(!isAdding)}
            className={`w-full font-medium py-3 rounded-2xl border flex items-center justify-between px-6 transition-colors shadow-sm 
              ${isDarkMode ? 'bg-[#252836] hover:bg-[#2f3344] text-slate-300 border-[#2f3344]' : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200'}
              ${isReordering ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <span>Add a currency</span>
            <Plus size={18} className={theme.subText} />
          </button>

          {isAdding && (
            <div className={`absolute left-0 right-0 top-full mt-2 ${theme.modalBg} border ${theme.modalBorder} rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[260px] animate-in fade-in zoom-in-95 duration-150`}>
              <div className={`p-2 border-b ${theme.divider} flex items-center gap-2 sticky top-0 ${theme.modalBg} z-10`}>
                <Search className={theme.subText} size={16} />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Search (e.g. BTC, Euro)" 
                  className={`bg-transparent outline-none w-full text-sm ${isDarkMode ? 'text-white placeholder-slate-500' : 'text-gray-900 placeholder-gray-400'}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const searchLower = searchTerm.toLowerCase();
                      const filtered = ALL_CURRENCIES.filter(c => 
                          !activeCurrencies.includes(c.code) && 
                          (c.code.toLowerCase().includes(searchLower) || c.name.toLowerCase().includes(searchLower) || c.keywords?.some(k => k.includes(searchLower)))
                      );
                      if (filtered.length > 0) {
                        handleAddCurrency(filtered[0].code);
                      }
                    }
                  }}
                />
                <button onClick={() => setIsAdding(false)} className={`p-1.5 rounded-full ${isDarkMode ? 'bg-[#2f3344] text-slate-300 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-900'}`}>
                  <X size={14} />
                </button>
              </div>
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
                    onClick={() => handleAddCurrency(c.code)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors text-left group ${isDarkMode ? 'hover:bg-[#2f3344]' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 flex justify-center">
                          {c.flag === 'BTC_LOGO' ? <BitcoinLogo /> : 
                           c.flag === 'USDT_LOGO' ? <TetherLogo /> : 
                           <span className="text-xl leading-none">{c.flag}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                          <span className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{c.code}</span>
                          <span className={`text-xs ${theme.subText} truncate`}>- {c.name}</span>
                      </div>
                    </div>
                    <Plus size={14} className={isDarkMode ? 'text-slate-500 group-hover:text-orange-500' : 'text-gray-400 group-hover:text-orange-500'} />
                  </button>
                ))}
                {ALL_CURRENCIES.every(c => activeCurrencies.includes(c.code)) && (
                  <div className={`p-4 text-center text-xs ${theme.subText}`}>
                    <p>All currencies added</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Wrapper */}
        <div className="flex flex-col gap-2 mt-2 relative z-10">
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
                      ? `${isDarkMode ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'}` 
                      : `${theme.btnDefault} ${theme.btnHover}`
                  }
                `}
              >
                {isReordering ? <Check size={16} /> : <Pencil size={14} />}
                <span className="font-semibold text-xs">{isReordering ? 'Done' : 'Edit'}</span>
              </button>
            </div>

            {/* Status Bar with Accurate Timezone Offset */}
            <div className={`group relative w-full rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-xs font-medium border ${theme.btnDefault} cursor-default select-none`}>
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span>
               <span>
                 {/* UPDATED: Using timeZoneName: 'shortOffset' for specific GMT+7 style output */}
                 Live • {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'shortOffset' })} • Base: {anchorCode}
               </span>

               <div className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-3 rounded-xl shadow-xl border invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all z-50 flex flex-col gap-2 ${isDarkMode ? 'bg-[#252836] border-[#3b3f54] text-slate-300' : 'bg-white border-gray-200 text-gray-600'}`}>
                  <div className="flex items-center gap-2 text-[10px]">
                     <Database size={12} className="text-blue-400"/>
                     <span>Fiat: ExchangeRate-API</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                     <Database size={12} className="text-orange-400"/>
                     <span>Crypto: Binance Public API</span>
                  </div>
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent ${isDarkMode ? 'border-t-[#252836]' : 'border-t-white'}`}></div>
               </div>
            </div>

            <div className="flex justify-end">
               <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg text-xs font-medium border transition-colors ${theme.btnDefault} ${theme.btnHover}`}
              >
                {isDarkMode ? <Moon size={14} /> : <Sun size={14} />}
              </button>
            </div>
        </div>

      </div>
      
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}