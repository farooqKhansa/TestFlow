import { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useApp.js';
import { Menu, Bell, Moon, Sun } from 'lucide-react';

export function Navbar({ toggleSidebar }) {
  const { currentUser } = useApp();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDark(darkMode);
  }, []);

  const handleDarkModeToggle = () => {
    const html = document.documentElement;
    const newDarkMode = !isDark;
    
    if (newDarkMode) {
      html.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
    
    setIsDark(newDarkMode);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 h-16">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Toggle Sidebar"
          >
            <Menu size={20} className="text-gray-900" />
          </button>
          <h1 className="text-2xl font-bold text-purple-600">TestFlow</h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} className="text-gray-900" />
          </button>

          <button 
            onClick={handleDarkModeToggle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title={isDark ? "Light Mode" : "Dark Mode"}
          >
            {isDark ? (
              <Sun size={20} className="text-yellow-500" />
            ) : (
              <Moon size={20} className="text-gray-900" />
            )}
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <span className="text-3xl">{currentUser?.avatar || '👤'}</span>
            <div>
              <p className="text-sm font-medium text-gray-900">{currentUser?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{currentUser?.role || 'QA'}</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
