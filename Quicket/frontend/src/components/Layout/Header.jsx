import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../contexts/AuthContext";
import { ThemeContext } from "../../contexts/ThemeContext";
import apiService from "../../services/api";
import "../../styles/Header.css";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch notifications count for the badge
  useEffect(() => {
    if (user) {
      const fetchUnreadCount = async () => {
        try {
          const response = await apiService.getUnreadNotificationsCount(
            user.id
          );
          if (response.success) {
            setUnreadCount(response.count);
          }
        } catch (error) {
          console.error("Error fetching unread notifications count:", error);
        }
      };

      fetchUnreadCount();
      // Set up interval to refresh unread count every minute
      const interval = setInterval(fetchUnreadCount, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo">
          <Link to="/">
            <img src="/logo_q.png" alt="Quicket Logo" />
            <span className="logo-text">QUICKET</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="header-nav desktop-nav">
          <Link to="/" className="nav-link">
            <span className="nav-icon">🏠</span>
            {t("navigation.home")}
          </Link>
          <Link to="/events" className="nav-link">
            <span className="nav-icon">🎭</span>
            {t("navigation.events")}
          </Link>

          {user && (
            <>
              <Link to="/notifications" className="nav-link">
                <span className="nav-icon">🔔</span>
                {t("navigation.notifications")}
                {unreadCount > 0 && (
                  <span className="header-notification-badge">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <Link to="/profile" className="nav-link">
                <span className="nav-icon">👤</span>
                {t("sidebar.myProfile")}
              </Link>

              {/* Admin Panel link - only visible for admin users */}
              {user.role === "admin" && (
                <Link to="/admin" className="nav-link">
                  <span className="nav-icon">⚙️</span>
                  {t("sidebar.adminPanel")}
                </Link>
              )}
            </>
          )}
        </nav>

        {/* User Actions */}
        <div className="header-actions">
          {!user ? (
            <div className="auth-buttons">
              <Link to="/login" className="auth-link login-link">
                {t("navigation.login")}
              </Link>
              <Link to="/register" className="auth-link register-link">
                {t("navigation.register")}
              </Link>
            </div>
          ) : (
            <div className="user-menu">
              <div className="user-info-header">
                <div className="user-avatar-header">
                  {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="user-name-header">
                  {user.username || user.name || "User"}
                </span>
              </div>
              <button onClick={handleLogout} className="logout-button">
                <span className="nav-icon">🚪</span>
                {t("navigation.logout")}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <>
          <div className="mobile-overlay" onClick={toggleMobileMenu}></div>
          <nav className="mobile-nav">
            <Link to="/" className="mobile-nav-link" onClick={toggleMobileMenu}>
              <span className="nav-icon">🏠</span>
              {t("navigation.home")}
            </Link>
            <Link
              to="/events"
              className="mobile-nav-link"
              onClick={toggleMobileMenu}
            >
              <span className="nav-icon">🎭</span>
              {t("navigation.events")}
            </Link>

            {user && (
              <>
                <Link
                  to="/notifications"
                  className="mobile-nav-link"
                  onClick={toggleMobileMenu}
                >
                  <span className="nav-icon">🔔</span>
                  {t("navigation.notifications")}
                  {unreadCount > 0 && (
                    <span className="header-notification-badge">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/profile"
                  className="mobile-nav-link"
                  onClick={toggleMobileMenu}
                >
                  <span className="nav-icon">👤</span>
                  {t("sidebar.myProfile")}
                </Link>

                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="mobile-nav-link"
                    onClick={toggleMobileMenu}
                  >
                    <span className="nav-icon">⚙️</span>
                    {t("sidebar.adminPanel")}
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="mobile-nav-link logout-mobile"
                >
                  <span className="nav-icon">🚪</span>
                  {t("navigation.logout")}
                </button>
              </>
            )}

            {!user && (
              <>
                <Link
                  to="/login"
                  className="mobile-nav-link"
                  onClick={toggleMobileMenu}
                >
                  <span className="nav-icon">🔑</span>
                  {t("navigation.login")}
                </Link>
                <Link
                  to="/register"
                  className="mobile-nav-link"
                  onClick={toggleMobileMenu}
                >
                  <span className="nav-icon">📝</span>
                  {t("navigation.register")}
                </Link>
              </>
            )}
          </nav>
        </>
      )}
    </header>
  );
};

export default Header;
