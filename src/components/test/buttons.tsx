// --- Icon for Button 5 ---
const CalendarIcon = ({ size = 12, strokeWidth = 2.5 }) => (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-white"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>

    <line x1="3" y1="10" x2="21" y2="10"></line>
        <line x1="3" y1="16" x2="21" y2="16"></line>
  </svg>
);


// --- Button 1: Silver Square ---
const Button1 = ({ size = 64, number = 1, onClick = () => {} }) => {
  const fontSize = size * 0.5; // Dynamic font size
  return (
    <button
    onClick={onClick}
      className="relative flex items-center justify-center rounded-sm bg-gradient-to-b from-white to-gray-200 border border-gray-400 transition-all hover:scale-105 hover:shadow-lg active:shadow-inner text-black"
      style={{ width: size, height: size }}
    >
      <span className="font-bold " style={{ fontSize: `${fontSize}px` }}>
        {number}
      </span>
    </button>
  );
};

// --- Button 2: Red Angled Shape (Inverted Button3) ---
const Button2 = ({ size = 64, number = 2, onClick = () => {} }) => {
  const height = size * 1;
  const fontSize = size * 0.5;
  return (
    <div
    onClick={onClick}
      className="relative flex items-center justify-center transition-transform hover:scale-105 select-none"
      style={{ width: size, height: height }}
    >
      <svg viewBox="0 0 56 56" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#f87171', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#dc2626', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="shadow2" x="-20%" y="-20%" width="140%" height="140%">
             <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.3"/>
          </filter>
        </defs>
        {/* This path is a vertical inversion of Button3's path */}
        <path d="M0 0 L56 0 L56 38 L38 56 L18 56 L0 38 Z" fill="url(#grad2)"  />
      </svg>
      <span className="relative font-bold text-white" style={{ fontSize: `${fontSize}px` }}>
        {number}
      </span>
    </div>
  );
};

// --- Button 3: Green Angled Shape ---
const Button3 = ({ size = 64, number = 3, onClick = () => {} }) => {
    const height = size * 1;
    const fontSize = size * 0.5;
  return (
    <div
    onClick={onClick}
      className="relative flex items-center justify-center transition-transform hover:scale-105 select-none"
      style={{ width: size, height: height }}
    >
      <svg viewBox="0 0 56 56" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="grad3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#86efac', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#22c55e', stopOpacity: 1 }} />
          </linearGradient>
           <filter id="shadow3" x="-20%" y="-20%" width="140%" height="140%">
             <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.3"/>
          </filter>
        </defs>
        <path d="M18 0 L38 0 L56 18 L56 56 L0 56 L0 18 Z" fill="url(#grad3)"  />
      </svg>
      <span className="relative font-bold text-white" style={{ fontSize: `${fontSize}px` }}>
        {number}
      </span>
    </div>
  );
};


// --- Button 4: Purple Circle ---
const Button4 = ({ size = 64, number = 4, onClick = () => {} }) => {
  const fontSize = size * 0.5;
  return (
    <button
    onClick={onClick}
      className="relative flex items-center justify-center rounded-full bg-gradient-to-b from-purple-500 to-purple-700 border  transition-all hover:scale-105 hover:shadow-lg active:shadow-inner"
      style={{ width: size, height: size }}
    >
      <span className="font-bold text-white" style={{ fontSize: `${fontSize}px` }}>
        {number}
      </span>
    </button>
  );
};

// --- Button 5: Purple Circle with Icon ---
const Button5 = ({ size = 64, number = 5, onClick = () => {} }) => {
  const fontSize = size * 0.5;
  const iconContainerSize = size * 0.375;
  const iconSize = size * 0.18;
  return (
    <button
    onClick={onClick}
      className="relative flex items-center justify-center rounded-full bg-gradient-to-b from-purple-500 to-purple-700 border  transition-all hover:scale-105 hover:shadow-lg active:shadow-inner"
      style={{ width: size, height: size }}
    >
      <span className="font-bold text-white" style={{ fontSize: `${fontSize}px` }}>
        {number}
      </span>
      <div
        className="absolute bottom-0 right-0 flex items-center justify-center bg-green-500 rounded-full"
        style={{ width: iconContainerSize, height: iconContainerSize }}
      >
        <CalendarIcon size={iconSize} />
      </div>
    </button>
  );
};

export { Button1, Button2, Button3,Button4,Button5 }