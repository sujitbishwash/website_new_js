import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  MessageCircle, 
  BookOpen, 
  FileText, 
  Clock, 
  Book, 
  FileCheck, 
  FileQuestion,
  Star,
  Award,
  Gift
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/history', icon: Clock, label: 'History' },
    { path: '/books', icon: Book, label: 'Books' },
    { path: '/test-series', icon: FileCheck, label: 'Test Series' },
    { path: '/previous-year-papers', icon: FileQuestion, label: 'Previous Year Papers' },
    { path: '/attempted-tests', icon: FileText, label: 'Attempted Tests' },
    { path: '/premium', icon: Star, label: 'Premium' },
    { path: '/exams', icon: Award, label: 'Exams' },
    { path: '/refer-and-earn', icon: Gift, label: 'Refer and Earn' },
  ];

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">AI Padhai</h1>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-600 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="10" r="3"></circle>
              <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>
            </svg>
          </div>
          <div>
            <p className="font-medium">Free Plan</p>
            <p className="text-sm text-gray-400">learner@aipadhai.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
