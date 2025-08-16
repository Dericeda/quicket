import { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../contexts/AuthContext";
import ThemeToggle from "../theme/ThemeToggle";
import GlobalLanguageSwitcher from "./GlobalLanguageSwitcher";
import NotificationBadge from "./NotificationBadge";
import "../../styles/Header.css";

const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="modern-header">
        <div className="modern-header-container">
          <div className="modern-header-logo">
            <Link to="/">
              <img
                src="https://raw.githubusercontent.com/Dericeda/quicket/98f9f5544a377e614229921bdfece6325d7d982f/Quicket/frontend/public/logo_q.png"
                alt="Quicket Logo"
                className="header-logo-image"
              />
              <div className="logo-brand">QUICKET</div>
            </Link>
          </div>

          {/* Desktop Navigation - показываем кнопки только для авторизованных пользователей */}
          <nav className="modern-header-nav">
            {user && (
              <>
                <Link
                  to="/"
                  className={`modern-nav-link ${
                    location.pathname === "/" ? "active" : ""
                  }`}
                >
                  {t("navigation.home")}
                </Link>
                <Link
                  to="/events"
                  className={`modern-nav-link ${
                    location.pathname.startsWith("/events") ? "active" : ""
                  }`}
                >
                  {t("navigation.events")}
                </Link>
                <Link
                  to="/notifications"
                  className={`modern-nav-link ${
                    location.pathname.startsWith("/notifications")
                      ? "active"
                      : ""
                  }`}
                >
                  {t("navigation.notifications")}
                  <NotificationBadge />
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="modern-header-actions">
            {!isMobile && (
              <>
                <GlobalLanguageSwitcher />
                <ThemeToggle />
              </>
            )}

            {user ? (
              <div className="modern-user-menu">
                <div className="modern-user-info">
                  <Link to="/profile">
                    <div className="modern-user-avatar">
                      {user.username
                        ? user.username.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                  </Link>
                  <Link to="/profile" className="modern-user-name">
                    {user.username}
                  </Link>
                  {user.role === "admin" && (
                    <Link to="/admin" className="modern-nav-link">
                      {t("sidebar.adminPanel")}
                    </Link>
                  )}
                </div>
                <button className="modern-logout-button" onClick={handleLogout}>
                  {t("navigation.logout")}
                </button>
              </div>
            ) : (
              <div className="modern-auth-buttons">
                <Link to="/login" className="modern-login-btn">
                  {t("navigation.login")}
                </Link>
                <Link to="/register" className="modern-signup-btn">
                  {t("navigation.register")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="modern-mobile-toggle" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <>
          <div className="modern-mobile-overlay" onClick={closeMobileMenu} />
          <nav className="modern-mobile-nav">
            <Link
              to="/"
              className="modern-mobile-link"
              onClick={closeMobileMenu}
            >
              {t("navigation.home")}
            </Link>
            <Link
              to="/events"
              className="modern-mobile-link"
              onClick={closeMobileMenu}
            >
              {t("navigation.events")}
            </Link>

            {user ? (
              <>
                <Link
                  to="/notifications"
                  className="modern-mobile-link"
                  onClick={closeMobileMenu}
                >
                  {t("navigation.notifications")}
                </Link>
                <Link
                  to="/profile"
                  className="modern-mobile-link"
                  onClick={closeMobileMenu}
                >
                  {t("navigation.profile")}
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="modern-mobile-link"
                    onClick={closeMobileMenu}
                  >
                    {t("sidebar.adminPanel")}
                  </Link>
                )}

                {/* Mobile Controls */}
                <div
                  style={{
                    padding: "16px 24px",
                    borderTop: "1px solid rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      marginBottom: "16px",
                    }}
                  >
                    <GlobalLanguageSwitcher />
                    <ThemeToggle />
                  </div>
                </div>

                <button
                  className="modern-mobile-link modern-mobile-logout"
                  onClick={handleLogout}
                >
                  {t("navigation.logout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="modern-mobile-link"
                  onClick={closeMobileMenu}
                >
                  {t("navigation.login")}
                </Link>
                <Link
                  to="/register"
                  className="modern-mobile-link"
                  onClick={closeMobileMenu}
                >
                  {t("navigation.register")}
                </Link>

                {/* Mobile Controls */}
                <div
                  style={{
                    padding: "16px 24px",
                    borderTop: "1px solid rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <GlobalLanguageSwitcher />
                    <ThemeToggle />
                  </div>
                </div>
              </>
            )}
          </nav>
        </>
      )}
    </>
  );
};

export default Header;
