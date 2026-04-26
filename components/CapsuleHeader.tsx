import React, { useEffect, useState } from 'react';
import './CapsuleHeader.css';

const CapsuleHeader = () => {
    const [theme, setTheme] = useState('Ink Night');

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            setTheme(storedTheme);
            document.documentElement.dataset.theme = storedTheme;
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'Ink Night' ? 'Candlelight' : 'Ink Night';
        setTheme(newTheme);
        document.documentElement.dataset.theme = newTheme;
        localStorage.setItem('theme', newTheme);
    };

    return (
        <header className="capsule-header">
            <h1 className="site-title">My Site</h1>
            <button onClick={toggleTheme} aria-label={`Toggle theme to ${theme === 'Ink Night' ? 'Candlelight' : 'Ink Night'}`} className="theme-toggle">
                {theme}
            </button>
        </header>
    );
};

export default CapsuleHeader;
