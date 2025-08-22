import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Menu, 
  X, 
  Home, 
  Building2, 
  TrendingUp, 
  Users, 
  Package, 
  FileText, 
  Settings,
  LogOut,
  User
} from 'lucide-react';
import './Layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/sheds', label: "Shed's", icon: Building2 },
    { path: '/production', label: 'Production', icon: TrendingUp },
    { path: '/mortality', label: 'Mortality', icon: TrendingUp },
    { path: '/customers', label: "Customer's", icon: Users },
    { path: '/gudam', label: 'Gudam', icon: Package },
    { path: '/ebills', label: 'E-Bills', icon: FileText },
    { path: '/employees', label: 'Employees', icon: Users },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="layout">
      {/* Top Navigation Bar */}
      <header className="top-nav">
        <div className="nav-left">
          <button
            className="menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
        
        <div className="nav-center">
          <h1 className="nav-title">Hen's Form</h1>
        </div>
        
        <div className="nav-right">
          <div className="user-menu">
            <span className="username">{user?.username}</span>
            <button
              className="logout-button"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} 
           onClick={() => setSidebarOpen(false)} />
      
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Hen's Form</h2>
          <button
            className="close-button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <div className="user-info">
          <div className="user-avatar">
            <User size={24} />
          </div>
          <div className="user-details">
            <span className="user-name">{user?.username}</span>
            <span className="user-role">Farm Manager</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <button
                    className={`nav-item ${isActiveRoute(item.path) ? 'active' : ''}`}
                    onClick={() => {
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button
            className="settings-button"
            onClick={() => {
              navigate('/settings');
              setSidebarOpen(false);
            }}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
