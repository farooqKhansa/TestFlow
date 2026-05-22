import { useState } from 'react';
import { Navbar } from '../common/Navbar.jsx';
import { Sidebar } from '../common/Sidebar.jsx';

export function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Navbar */}
      <Navbar toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} />

        {/* Content */}
        <main 
          style={{
            marginLeft: sidebarOpen ? '12rem' : '5rem',
            width: `calc(100% - ${sidebarOpen ? '12rem' : '5rem'})`
          }}
          className="flex-1 overflow-y-auto transition-all duration-300 bg-gray-50"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
