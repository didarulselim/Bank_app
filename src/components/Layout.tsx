import React from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Users, BarChart3, PiggyBank, LogOut, Home } from 'lucide-react';

const Layout: React.FC = () => {
  const { currentUser, logoutUser } = useApp();
  const location = useLocation();

  if (!currentUser && location.pathname !== '/login' && location.pathname !== '/register') {
    return <Navigate to="/login" />;
  }

  const handleLogout = () => {
    logoutUser();
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/transactions', label: 'Transactions', icon: <BarChart3 size={20} /> },
    { path: '/members', label: 'Members', icon: <Users size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {currentUser && (
        <header className="bg-indigo-600 text-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/\" className="flex items-center space-x-2">
              <PiggyBank size={28} />
              <span className="text-xl font-bold">Covid-19 Bank</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline">Welcome, {currentUser.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-indigo-700 hover:bg-indigo-800 px-3 py-1 rounded-md transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
          <nav className="bg-indigo-700">
            <div className="container mx-auto px-4">
              <ul className="flex space-x-1">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-1 px-4 py-2 transition-colors ${
                        location.pathname === item.path
                          ? 'bg-indigo-800 text-white'
                          : 'text-indigo-100 hover:bg-indigo-800'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </header>
      )}
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Covid-19 Bank. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;