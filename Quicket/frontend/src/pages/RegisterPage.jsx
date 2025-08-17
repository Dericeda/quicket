import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import apiService from "../services/api";
import "../styles/Auth.css";

const RegisterPage = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  // Валидация email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Проверка силы пароля
  const getPasswordStrength = (password) => {
    if (password.length < 6) return "weak";
    if (password.length < 8) return "medium";
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return "medium";
    return "strong";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валидация
    if (!username || !email || !password || !confirmPassword) {
      setError(t("auth.register.error.fill_all"));
      return;
    }

    if (!isValidEmail(email)) {
      setError(t("auth.register.error.email_invalid"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("auth.register.error.passwords_not_match"));
      return;
    }

    if (password.length < 6) {
      setError(t("auth.register.error.password_length"));
      return;
    }

    if (!agreeToTerms) {
      setError(t("auth.register.error.terms_required"));
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await apiService.register(username, email, password);

      if (response.success) {
        setSuccess(true);
        // Перенаправление на страницу входа через 2 секунды
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(response.message || t("auth.register.error.register_error"));
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(t("auth.register.error.username_email_exists"));
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🚀</div>
          <h2 className="auth-title">{t("auth.register.title")}</h2>
          <p className="auth-subtitle">{t("auth.register.subtitle")}</p>
        </div>

        <div className="auth-content">
          {error && (
            <div className="alert alert-danger">
              {error}
              <button
                className="alert-close"
                onClick={() => setError("")}
                aria-label={t("common.close")}
              >
                ×
              </button>
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <div className="success-icon">✅</div>
              <div>
                <h4>{t("auth.register.success")}</h4>
                <p>{t("auth.register.redirecting")}</p>
              </div>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label htmlFor="username">{t("auth.register.username")}</label>
              <span className="auth-input-icon">👤</span>
              <input
                type="text"
                id="username"
                className="auth-input-field"
                placeholder={t("auth.register.username_placeholder")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading || success}
                autoComplete="username"
                required
              />
            </div>

            <div className="auth-input-group">
              <label htmlFor="email">{t("auth.register.email")}</label>
              <span className="auth-input-icon">✉️</span>
              <input
                type="email"
                id="email"
                className="auth-input-field"
                placeholder={t("auth.register.email_placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || success}
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-input-group">
              <label htmlFor="password">{t("auth.register.password")}</label>
              <span className="auth-input-icon">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="auth-input-field"
                placeholder={t("auth.register.password_placeholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || success}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword
                    ? t("common.hidePassword")
                    : t("common.showPassword")
                }
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>

              {password && (
                <div className={`password-strength ${passwordStrength}`}>
                  <div className="strength-indicator">
                    <div className="strength-bar"></div>
                  </div>
                  <span className="strength-text">
                    {passwordStrength === "weak" &&
                      t("auth.register.password.weak")}
                    {passwordStrength === "medium" &&
                      t("auth.register.password.medium")}
                    {passwordStrength === "strong" &&
                      t("auth.register.password.strong")}
                  </span>
                </div>
              )}
            </div>

            <div className="auth-input-group">
              <label htmlFor="confirmPassword">
                {t("auth.register.confirm_password")}
              </label>
              <span className="auth-input-icon">🔐</span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className="auth-input-field"
                placeholder={t("auth.register.confirm_password_placeholder")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading || success}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword
                    ? t("common.hidePassword")
                    : t("common.showPassword")
                }
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>

              {confirmPassword && password !== confirmPassword && (
                <div className="validation-message error">
                  {t("auth.register.error.passwords_not_match")}
                </div>
              )}
            </div>

            <div className="auth-checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  disabled={loading || success}
                  required
                />
                <span className="checkmark"></span>
                <span className="checkbox-text">
                  {t("auth.register.agreeToTerms")}{" "}
                  <Link to="/terms" className="auth-link" target="_blank">
                    {t("auth.register.termsAndConditions")}
                  </Link>{" "}
                  {t("common.and")}{" "}
                  <Link to="/privacy" className="auth-link" target="_blank">
                    {t("auth.register.privacyPolicy")}
                  </Link>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading || success || !agreeToTerms}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  {t("auth.register.loading")}
                </>
              ) : (
                t("auth.register.button")
              )}
            </button>
          </form>

          <div className="auth-redirect">
            {t("auth.register.has_account")}{" "}
            <Link to="/login">{t("auth.register.login_link")}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
