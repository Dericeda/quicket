import { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../contexts/AuthContext";
import apiService from "../services/api";
import "../styles/NotificationsPage.css";

const NotificationsPage = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  // Загрузка уведомлений при монтировании компонента
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Функция для загрузки уведомлений
  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiService.getUserNotifications();
      console.log("Получены уведомления:", data);

      // Проверяем структуру данных
      let notificationsData = [];

      if (Array.isArray(data)) {
        notificationsData = data;
      } else if (
        data &&
        data.notifications &&
        Array.isArray(data.notifications)
      ) {
        notificationsData = data.notifications;
      } else if (data && data.success && Array.isArray(data.data)) {
        notificationsData = data.data;
      }

      setNotifications(notificationsData);
    } catch (err) {
      console.error("Ошибка при загрузке уведомлений:", err);
      setError(t("notifications.errors.loadingFailed"));
    } finally {
      setLoading(false);
    }
  };

  // Фильтрация уведомлений
  const filteredNotifications = notifications.filter((notification) => {
    switch (filter) {
      case "unread":
        return !notification.read;
      case "read":
        return notification.read;
      case "recent":
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        return new Date(notification.created_at) > threeDaysAgo;
      case "older":
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(notification.created_at) < weekAgo;
      default:
        return true;
    }
  });

  const getNotificationIcon = (type) => {
    const notificationType = (type || "").toLowerCase();

    switch (notificationType) {
      case "booking_created":
        return "🎫";
      case "booking_cancelled":
        return "❌";
      case "booking_reminder":
        return "⏰";
      case "event_updated":
        return "📝";
      case "event_cancelled":
        return "🚫";
      case "system_message":
        return "🔔";
      case "payment_received":
        return "💳";
      case "refund_processed":
        return "💰";
      default:
        return "📩";
    }
  };

  const getNotificationTypeLabel = (type) => {
    const typeKey = `notifications.types.${type}`;
    return t(typeKey, type);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    if (minutes < 1) {
      return t("notifications.justNow");
    } else if (minutes < 60) {
      return t("notifications.minutesAgo", { count: minutes });
    } else if (hours < 24) {
      return t("notifications.hoursAgo", { count: hours });
    } else if (days === 1) {
      return t("datetime.yesterday");
    } else if (days < 7) {
      return t("notifications.daysAgo", { count: days });
    } else if (weeks < 4) {
      return t("notifications.weeksAgo", { count: weeks });
    } else {
      return t("notifications.monthsAgo", { count: months });
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      // Оптимистично обновляем UI
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );

      // Вызываем API
      await apiService.markNotificationAsRead(notificationId);
    } catch (err) {
      console.error("Ошибка при отметке уведомления:", err);
      // В случае ошибки обновляем данные заново
      fetchNotifications();
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (!window.confirm(t("notifications.confirmDelete"))) {
      return;
    }

    try {
      // Оптимистично обновляем UI
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification.id !== notificationId
        )
      );

      // Вызываем API
      await apiService.deleteNotification(notificationId);
    } catch (err) {
      console.error("Ошибка при удалении уведомления:", err);
      // В случае ошибки обновляем данные заново
      fetchNotifications();
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Оптимистично обновляем UI
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          read: true,
        }))
      );

      // Вызываем API
      await apiService.markAllNotificationsAsRead();
    } catch (err) {
      console.error("Ошибка при отметке всех уведомлений:", err);
      // В случае ошибки обновляем данные заново
      fetchNotifications();
    }
  };

  const handleBulkDelete = async () => {
    if (selectedNotifications.length === 0) return;

    if (
      !window.confirm(
        t("notifications.confirmBulkDelete", {
          count: selectedNotifications.length,
        })
      )
    ) {
      return;
    }

    try {
      // Удаляем выбранные уведомления
      await Promise.all(
        selectedNotifications.map((id) => apiService.deleteNotification(id))
      );

      // Обновляем список
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => !selectedNotifications.includes(notification.id)
        )
      );

      setSelectedNotifications([]);
    } catch (err) {
      console.error("Ошибка при массовом удалении:", err);
      fetchNotifications();
    }
  };

  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications((prev) =>
      prev.includes(notificationId)
        ? prev.filter((id) => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id));
    }
  };

  // Если пользователь не авторизован
  if (!user) {
    return (
      <div className="notifications-page">
        <div className="notifications-header">
          <h1>{t("notifications.title")}</h1>
        </div>
        <div className="notifications-error">
          <p>{t("common.unauthorized")}</p>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1>{t("notifications.title")}</h1>

        <div className="notifications-actions">
          {unreadCount > 0 && (
            <button className="mark-all-read-btn" onClick={handleMarkAllAsRead}>
              {t("notifications.markAllAsRead")} ({unreadCount})
            </button>
          )}

          <button
            className="refresh-btn"
            onClick={fetchNotifications}
            disabled={loading}
          >
            {t("common.refresh")}
          </button>
        </div>
      </div>

      {/* Фильтры */}
      <div className="notifications-filters">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            {t("notifications.all")} ({notifications.length})
          </button>
          <button
            className={`filter-btn ${filter === "unread" ? "active" : ""}`}
            onClick={() => setFilter("unread")}
          >
            {t("notifications.unread")} ({unreadCount})
          </button>
          <button
            className={`filter-btn ${filter === "read" ? "active" : ""}`}
            onClick={() => setFilter("read")}
          >
            {t("notifications.read")} (
            {notifications.filter((n) => n.read).length})
          </button>
          <button
            className={`filter-btn ${filter === "recent" ? "active" : ""}`}
            onClick={() => setFilter("recent")}
          >
            {t("notifications.recent")}
          </button>
        </div>

        {filteredNotifications.length > 0 && (
          <div className="bulk-actions">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={
                  selectedNotifications.length === filteredNotifications.length
                }
                onChange={handleSelectAll}
              />
              <span className="checkmark"></span>
              {t("common.selectAll")}
            </label>

            {selectedNotifications.length > 0 && (
              <button className="bulk-delete-btn" onClick={handleBulkDelete}>
                {t("notifications.deleteAll")} ({selectedNotifications.length})
              </button>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="notifications-loading">
          <div className="loading-spinner"></div>
          <p>{t("common.loading")}</p>
        </div>
      ) : error ? (
        <div className="notifications-error">
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchNotifications}>
            {t("common.retry")}
          </button>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="no-notifications">
          <div className="no-notifications-icon">
            {filter === "all" ? "📭" : "🔍"}
          </div>
          <h3>
            {filter === "all"
              ? t("notifications.empty.title")
              : t("notifications.noResults", {
                  filter: t(`notifications.${filter}`),
                })}
          </h3>
          <p>
            {filter === "all"
              ? t("notifications.empty.subtitle")
              : t("notifications.tryDifferentFilter")}
          </p>
          {filter === "all" && (
            <button
              className="btn btn-primary"
              onClick={() => (window.location.href = "/events")}
            >
              {t("notifications.empty.action")}
            </button>
          )}
        </div>
      ) : (
        <div className="notifications-list">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${
                notification.read ? "read" : "unread"
              } ${
                selectedNotifications.includes(notification.id)
                  ? "selected"
                  : ""
              }`}
            >
              <div className="notification-checkbox">
                <input
                  type="checkbox"
                  checked={selectedNotifications.includes(notification.id)}
                  onChange={() => handleSelectNotification(notification.id)}
                />
              </div>

              <div className="notification-icon">
                {getNotificationIcon(
                  notification.notification_type || notification.type
                )}
              </div>

              <div className="notification-content">
                <div className="notification-header">
                  <h3 className="notification-title">{notification.title}</h3>
                  <div className="notification-meta">
                    <span className="notification-type">
                      {getNotificationTypeLabel(
                        notification.notification_type || notification.type
                      )}
                    </span>
                    <span className="notification-date">
                      {formatDate(notification.created_at)}
                    </span>
                  </div>
                </div>
                <p className="notification-message">{notification.message}</p>
                {notification.action_link && (
                  <a
                    href={notification.action_link}
                    className="notification-action"
                  >
                    {notification.action_text || t("notifications.viewDetails")}
                  </a>
                )}
              </div>

              <div className="notification-actions">
                {!notification.read && (
                  <button
                    className="action-btn read-btn"
                    onClick={() => handleMarkAsRead(notification.id)}
                    title={t("notifications.markAsRead")}
                  >
                    ✓
                  </button>
                )}
                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDeleteNotification(notification.id)}
                  title={t("notifications.delete")}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Настройки уведомлений */}
      <div className="notifications-settings">
        <button
          className="settings-btn"
          onClick={() => {
            /* Открыть настройки */
          }}
        >
          ⚙️ {t("notifications.settings.title")}
        </button>
      </div>
    </div>
  );
};

export default NotificationsPage;
