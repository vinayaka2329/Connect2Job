import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark'); // ← always start dark

  useEffect(() => {
    // Force dark, ignore localStorage and system preference
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.style.background = '#0a0a1a';
    document.body.style.background = '#0a0a1a';
    localStorage.setItem('theme', 'dark');
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.background = theme === 'dark' ? '#0a0a1a' : '#f8f4ff';
    document.body.style.background = theme === 'dark' ? '#0a0a1a' : '#f8f4ff';
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark', isLight: theme === 'light' }}>
      {children}
    </ThemeContext.Provider>
  );
};