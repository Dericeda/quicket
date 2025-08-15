import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../contexts/AuthContext';
import GlobalLanguageSwitcher from './GlobalLanguageSwitcher';
import NotificationBadge from './NotificationBadge';
import '../../styles/Navbar.css';

const Navbar = ({ onOpenSidebar }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    closeDropdown();
    logout();
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle-btn" onClick={onOpenSidebar}>
          <span className="material-icons">menu</span>
        </button>
        
        {/* Логотип с SVG иконкой билета */}
        <Link to="/" className="logo-container">
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="ticket-logo"
          >
            <path d="M18 2C19.1 2 20 2.9 20 4V6.5C18.9 6.5 18 7.4 18 8.5S18.9 10.5 20 10.5V13C20 14.1 19.1 15 18 15H6C4.9 15 4 14.1 4 13V10.5C5.1 10.5 6 9.6 6 8.5S5.1 6.5 4 6.5V4C4 2.9 4.9 2 6 2H18ZM12 4L8 8H10.5V12H13.5V8H16L12 4Z"/>
          </svg>
          <span className="logo-text">QUICKET</span>
        </Link>
      </div>
      
      {/* Убираем средний блок с навигацией */}
      
      <div className="navbar-right">
        <GlobalLanguageSwitcher />
        
        {user ? (
          <>
            {/* Компонент уведомлений */}
            <NotificationBadge />
            
            <div className="user-dropdown">
              <div className="avatar-container" onClick={toggleDropdown}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="user-avatar" />
                ) : (
                  <div className="avatar-placeholder">
                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>
              
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <h3>{user.username}</h3>
                    <p>{user.email}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/profile" className="dropdown-item" onClick={closeDropdown}>
                    <span className="material-icons">person</span>
                    {t('navigation.profile')}
                  </Link>
                  <Link to="/notifications" className="dropdown-item" onClick={closeDropdown}>
                    <span className="material-icons">notifications</span>
                    {t('navigation.notifications')}
                  </Link>
                  <Link to="/bookings" className="dropdown-item" onClick={closeDropdown}>
                    <span className="material-icons">confirmation_number</span>
                    {t('navigation.myBookings')}
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="dropdown-item" onClick={closeDropdown}>
                      <span className="material-icons">admin_panel_settings</span>
                      {t('navigation.admin')}
                    </Link>
                  )}
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    <span className="material-icons">logout</span>
                    {t('navigation.logout')}
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="login-btn">{t('navigation.login')}</Link>
            <Link to="/register" className="register-btn">{t('navigation.register')}</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;