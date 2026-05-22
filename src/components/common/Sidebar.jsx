import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { LayoutGrid, CheckSquare, Play, BarChart3, Settings, ChevronDown } from 'lucide-react';
import { useApp } from '../../hooks/useApp.js';

export function Sidebar({ isOpen }) {
  const location = useLocation();
  const { projects, currentProject, setCurrentProject } = useApp();
  const [projectsExpanded, setProjectsExpanded] = useState(true);

  const navItems = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/' },
    { icon: CheckSquare, label: 'Test Cases', path: '/test-cases' },
    { icon: Play, label: 'Execution', path: '/execution' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className={`bg-gray-50 border-r border-gray-200 fixed left-0 top-16 bottom-0 overflow-y-auto transition-all duration-300 ${isOpen ? 'w-48' : 'w-20'}`}>
      {/* Navigation Items */}
      <nav className="p-4 space-y-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 font-medium whitespace-nowrap ${
                isActive
                  ? 'bg-purple-200 text-purple-900'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              {isOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 my-4"></div>

      {/* Projects Section */}
      <div className="px-4 py-4">
        <button
          onClick={() => setProjectsExpanded(!projectsExpanded)}
          className="flex items-center justify-between w-full mb-3"
        >
          {isOpen && <p className="text-sm font-bold text-gray-700">Projects</p>}
          {isOpen && (
            <ChevronDown 
              size={16} 
              className={`transition-transform duration-200 ${projectsExpanded ? 'rotate-180' : ''}`}
            />
          )}
        </button>

        {projectsExpanded && (
          <div className="space-y-2">
            {projects.map(project => (
              <button
                key={project._id || project.id}
                onClick={() => setCurrentProject(project)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap overflow-hidden text-ellipsis ${
                  currentProject?.id === project.id || currentProject?._id === project._id
                    ? 'bg-purple-200 text-purple-900'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
                title={project.name}
              >
                {isOpen ? (
                  <>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-xs opacity-70 mt-1">{project.testsCount || 0} tests</p>
                  </>
                ) : (
                  <p>{project.name.substring(0, 2).toUpperCase()}</p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
