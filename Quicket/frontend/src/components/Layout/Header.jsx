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
    <header className="modern-header">
      <div className="modern-header-container">
        {/* Logo */}
        <div className="modern-header-logo">
          <Link to="/">
            <span className="logo-brand">QUICKET</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="modern-header-nav">
          <Link to="/" className="modern-nav-link">
            {t("navigation.home")}
          </Link>
          <Link to="/events" className="modern-nav-link">
            {t("navigation.events")}
          </Link>

          {user && (
            <>
              <Link to="/notifications" className="modern-nav-link">
                {t("navigation.notifications")}
                {unreadCount > 0 && (
                  <span className="modern-notification-badge">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <Link to="/profile" className="modern-nav-link">
                {t("sidebar.myProfile")}
              </Link>

              {/* Admin Panel link - only visible for admin users */}
              {user.role === "admin" && (
                <Link to="/admin" className="modern-nav-link">
                  {t("sidebar.adminPanel")}
                </Link>
              )}
            </>
          )}
        </nav>

        {/* User Actions */}
        <div className="modern-header-actions">
          {!user ? (
            <div className="modern-auth-buttons">
              <Link to="/login" className="modern-login-btn">
                {t("navigation.login")}
              </Link>
              <Link to="/register" className="modern-signup-btn">
                {t("navigation.register")}
              </Link>
            </div>
          ) : (
            <div className="modern-user-menu">
              <div className="modern-user-info">
                <div className="modern-user-avatar">
                  {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="modern-user-name">
                  {user.username || user.name || "User"}
                </span>
              </div>
              <button onClick={handleLogout} className="modern-logout-button">
                {t("navigation.logout")}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="modern-mobile-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <>
          <div
            className="modern-mobile-overlay"
            onClick={toggleMobileMenu}
          ></div>
          <nav className="modern-mobile-nav">
            <Link
              to="/"
              className="modern-mobile-link"
              onClick={toggleMobileMenu}
            >
              {t("navigation.home")}
            </Link>
            <Link
              to="/events"
              className="modern-mobile-link"
              onClick={toggleMobileMenu}
            >
              {t("navigation.events")}
            </Link>

            {user && (
              <>
                <Link
                  to="/notifications"
                  className="modern-mobile-link"
                  onClick={toggleMobileMenu}
                >
                  {t("navigation.notifications")}
                  {unreadCount > 0 && (
                    <span className="modern-notification-badge">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/profile"
                  className="modern-mobile-link"
                  onClick={toggleMobileMenu}
                >
                  {t("sidebar.myProfile")}
                </Link>

                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="modern-mobile-link"
                    onClick={toggleMobileMenu}
                  >
                    {t("sidebar.adminPanel")}
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="modern-mobile-link modern-mobile-logout"
                >
                  {t("navigation.logout")}
                </button>
              </>
            )}

            {!user && (
              <>
                <Link
                  to="/login"
                  className="modern-mobile-link"
                  onClick={toggleMobileMenu}
                >
                  {t("navigation.login")}
                </Link>
                <Link
                  to="/register"
                  className="modern-mobile-link"
                  onClick={toggleMobileMenu}
                >
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
