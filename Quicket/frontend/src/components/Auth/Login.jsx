import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../contexts/AuthContext";
import apiService from "../../services/api";
import "../../styles/Auth.css";

const Login = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Простая валидация
    if (!username || !password) {
      setError(t("auth.login.error.fill_all"));
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await apiService.login(username, password);

      if (response.success) {
        login(response.user);

        // Показываем сообщение об успешном входе
        const successMessage =
          t("auth.login.success.welcome") + ", " + response.user.username + "!";

        // Можно добавить toast уведомление
        console.log(successMessage);

        navigate("/");
      } else {
        setError(response.message || t("auth.login.error.login_error"));
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(t("auth.login.error.wrong_credentials"));
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-form">
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

      <form onSubmit={handleSubmit}>
        <div className="auth-input-group">
          <label htmlFor="username">{t("auth.login.username")}</label>
          <span className="auth-input-icon">👤</span>
          <input
            type="text"
            id="username"
            className="auth-input-field"
            placeholder={t("auth.login.username_placeholder")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            autoComplete="username"
            required
          />
        </div>

        <div className="auth-input-group">
          <label htmlFor="password">{t("auth.login.password")}</label>
          <span className="auth-input-icon">🔒</span>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className="auth-input-field"
            placeholder={t("auth.login.password_placeholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={togglePasswordVisibility}
            aria-label={
              showPassword ? t("common.hidePassword") : t("common.showPassword")
            }
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>

        <div className="auth-options">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
            />
            <span className="checkmark"></span>
            {t("auth.login.rememberMe")}
          </label>
        </div>

        <button
          type="submit"
          className="auth-submit-btn"
          disabled={loading || !username || !password}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              {t("auth.login.loading")}
            </>
          ) : (
            t("auth.login.button")
          )}
        </button>
      </form>

      <div className="auth-help">
        <p className="auth-help-text">
          {t("auth.login.no_account")}{" "}
          <Link to="/register" className="auth-link">
            {t("auth.login.register_link")}
          </Link>
        </p>

        <div className="auth-divider">
          <span>{t("common.or")}</span>
        </div>

        <Link to="/forgot-password" className="forgot-password-link">
          {t("auth.login.forgotPassword")}
        </Link>
      </div>
    </div>
  );
};

export default Login;
