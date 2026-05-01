import React, { useEffect, useState } from 'react';

const App = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('tabi-theme') || 'ink-night';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('tabi-theme', theme);
  }, [theme]);

  const onToggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'ink-night' ? 'candlelight' : 'ink-night'));
  };

  return (
    <div className='app-shell' style={{ paddingTop: '50px' }}>
      <CapsuleHeader theme={theme} onToggleTheme={onToggleTheme} />
      {/* Keep existing Background/Chapters/CouponPalace structure and music toggle button */}
      <Background />
      <Chapters />
      <CouponPalace />
      <button className='ui-pill'>Music Toggle</button>
    </div>
  );
};

export default App;