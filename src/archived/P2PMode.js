import React from 'react';

// This file serves as an archive for the P2P Mode functionality that was removed from the main App.
// It contains the logic and UI components that were used for P2P premiums.

/*
  // --- State ---
  const [userPremiums, setUserPremiums] = useState(() => getStorage('userPremiums', {}));
  const [isP2PMode, setIsP2PMode] = useState(() => getStorage('isP2PMode', false));

  // --- Persistence ---
  useEffect(() => { localStorage.setItem('userPremiums', JSON.stringify(userPremiums)); }, [userPremiums]);
  useEffect(() => { localStorage.setItem('isP2PMode', JSON.stringify(isP2PMode)); }, [isP2PMode]);

  // --- Logic ---
  const getPremiumPercent = (code) => isP2PMode ? parseFloat(userPremiums[code] || 0) : 0;

  // In calculateValue:
  // const anchorPremiumFactor = 1 + (getPremiumPercent(anchorCode) / 100);
  // const targetPremiumFactor = 1 + (getPremiumPercent(targetCode) / 100);
  // const baseUSDValue = (numericAnchorAmount / anchorPremiumFactor) / anchorRate;
  // return baseUSDValue * targetRate * targetPremiumFactor;

  const handlePremiumChange = (code, val) => {
    if (!/^-?\d*\.?\d{0,2}$/.test(val)) return;
    setUserPremiums(prev => ({ ...prev, [code]: val }));
  };

  // --- UI: P2P Input Field (inside the currency card) ---
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

  // --- UI: P2P Toggle Button (in the footer) ---
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
*/

export default function P2PModeArchive() {
    return (
        <div>
            <h1>P2P Mode Archived</h1>
            <p>Refer to the source code of this file to see the archived logic.</p>
        </div>
    );
}
