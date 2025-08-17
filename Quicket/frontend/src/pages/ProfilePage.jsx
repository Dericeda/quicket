import { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import apiService from '../services/api';
import EventCard from '../components/Booking/EventCard';
import '../styles/EventCard.css';


const ProfilePage = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelStatus, setCancelStatus] = useState({ id: null, status: null, message: '' });
  const [activeTab, setActiveTab] = useState('bookings');
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    eventsAttended: 0,
    favoriteCategory: ''
  });

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      
      try {
        const data = await apiService.getUserBookings(user.id);
        setBookings(data);
        
        // Подсчитываем статистику
        const totalSpent = data.reduce((sum, booking) => sum + (booking.total_price || 0), 0);
        const eventsAttended = data.filter(booking => booking.status === 'completed').length;
        
        setStats(prevStats => ({
          ...prevStats,
          totalBookings: data.length,
          totalSpent,
          eventsAttended
        }));
        
        setLoading(false);
      } catch (err) {
        console.error('Ошибка при загрузке бронирований:', err);
        
        if (typeof err === 'string' && (err.includes('авторизац') || err.includes('сессия'))) {
          setError(t('common.sessionExpired'));
          
          setTimeout(() => {
            if (typeof logout === 'function') {
              logout();
            } else {
              localStorage.removeItem('user');
              localStorage.removeItem('authToken');
            }
            navigate('/login');
          }, 2000);
        } else {
          setError(t('bookings.error'));
        }
        
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      try {
        const favoriteIds = JSON.parse(localStorage.getItem('favoriteEvents') || '[]');
        
        if (favoriteIds.length > 0) {
          const allEvents = await apiService.getEvents();
          const favorites = allEvents.filter(event => favoriteIds.includes(event.id));
          setFavoriteEvents(favorites);
          
          // Определяем любимую категорию
          if (favorites.length > 0) {
            const categories = favorites.map(event => event.type);
            const categoryCount = categories.reduce((acc, cat) => {
              acc[cat] = (acc[cat] || 0) + 1;
              return acc;
            }, {});
            const favoriteCategory = Object.keys(categoryCount).reduce((a, b) => 
              categoryCount[a] > categoryCount[b] ? a : b
            );
            
            setStats(prevStats => ({
              ...prevStats,
              favoriteCategory
            }));
          }
        } else {
          setFavoriteEvents([]);
        }
      } catch (err) {
        console.error('Ошибка при загрузке избранных мероприятий:', err);
        setFavoriteEvents([]);
      }
    };

    fetchBookings();
    fetchFavorites();
  }, [user, t, navigate, logout]);

  // Форматирование даты с учетом языка
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const language = i18n.language || 'ru';
    const localeMap = {
      kz: 'kk-KZ',
      ru: 'ru-RU',
      en: 'en-US'
    };
    return new Date(dateString).toLocaleDateString(localeMap[language], options);
  };

  // Отмена бронирования
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm(t('bookings.cancel.confirm'))) {
      return;
    }

    try {
      const response = await apiService.cancelBooking(bookingId, user.id);
      
      if (response.success) {
        const updatedBookings = bookings.map(booking => {
          if (booking.id === bookingId) {
            return { ...booking, status: 'cancelled' };
          }
          return booking;
        });
        
        setBookings(updatedBookings);
        
        setCancelStatus({
          id: bookingId,
          status: 'success',
          message: t('bookings.cancel.success')
        });
      } else {
        if (response.message && (response.message.includes('авторизац') || response.message.includes('сессия'))) {
          setCancelStatus({
            id: bookingId,
            status: 'error',
            message: t('common.sessionExpired')
          });
          
          setTimeout(() => {
            logout();
            navigate('/login');
          }, 2000);
        } else {
          setCancelStatus({
            id: bookingId,
            status: 'error',
            message: response.message || t('bookings.cancel.error')
          });
        }
      }
    } catch (err) {
      setCancelStatus({
        id: bookingId,
        status: 'error',
        message: t('bookings.cancel.error')
      });
    }
  };

  // Удаление из избранного
  const handleRemoveFromFavorites = (eventId) => {
    const favoriteIds = JSON.parse(localStorage.getItem('favoriteEvents') || '[]');
    const updatedFavorites = favoriteIds.filter(id => id !== eventId);
    
    localStorage.setItem('favoriteEvents', JSON.stringify(updatedFavorites));
    setFavoriteEvents(favoriteEvents.filter(event => event.id !== eventId));
  };

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="loading-spinner"></div>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          {error}
          <button 
            className="btn btn-link"
            onClick={() => window.location.reload()}
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  // Группировка бронирований по статусу
  const activeBookings = bookings.filter(booking => booking.status === 'confirmed');
  const cancelledBookings = bookings.filter(booking => booking.status === 'cancelled');
  const completedBookings = bookings.filter(booking => booking.status === 'completed');

  return (
    <div className="container mt-4 profile-page">
      <div className="profile-header">
        <div className="profile-user-info">
          <div className="profile-avatar">
            {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="profile-details">
            <h1 className="profile-title">{t('profile.title')}</h1>
            <p className="profile-username">{user.username}</p>
            <p className="profile-email">{user.email}</p>
            <p className="profile-member-since">
              {t('profile.info.memberSince')}: {formatDate(user.created_at || new Date())}
            </p>
          </div>
        </div>

        {/* Статистика пользователя */}
        <div className="profile-stats">
          <div className="stat-item">
            <div className="stat-value">{stats.totalBookings}</div>
            <div className="stat-label">{t('profile.stats.totalBookings')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.totalSpent} {t('currency.symbol')}</div>
            <div className="stat-label">{t('profile.stats.totalSpent')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.eventsAttended}</div>
            <div className="stat-label">{t('profile.stats.eventsAttended')}</div>
          </div>
          {stats.favoriteCategory && (
            <div className="stat-item">
              <div className="stat-value">{stats.favoriteCategory}</div>
              <div className="stat-label">{t('profile.stats.favoriteCategory')}</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Вкладки */}
      <div className="profile-tabs">
        <button 
          className={`profile-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          {t('profile.tabs.bookings')}
          {bookings.length > 0 && <span className="tab-badge">{bookings.length}</span>}
        </button>
        <button 
          className={`profile-tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          {t('profile.tabs.favorites')}
          {favoriteEvents.length > 0 && <span className="tab-badge">{favoriteEvents.length}</span>}
        </button>
        <button 
          className={`profile-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          {t('profile.tabs.settings')}
        </button>
      </div>
      
      <div className="profile-content">
        {activeTab === 'bookings' && (
          <div className="bookings-section">
            {bookings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🎫</div>
                <h3>{t('bookings.no_bookings')}</h3>
                <p>{t('bookings.no_bookings_description')}</p>
                <Link to="/events" className="btn btn-primary">
                  {t('bookings.view_events')}
                </Link>
              </div>
            ) : (
              <>
                {activeBookings.length > 0 && (
                  <div className="bookings-group">
                    <h2 className="bookings-group-title">
                      {t('bookings.active_bookings')} ({activeBookings.length})
                    </h2>
                    
                    <div className="bookings-grid">
                      {activeBookings.map(booking => (
                        <div key={booking.id} className="booking-card">
                          <div className="booking-header">
                            <h3 className="booking-title">{booking.event_title}</h3>
                            <span className={`booking-status ${booking.status}`}>
                              {t(`bookings.status.${booking.status}`)}
                            </span>
                          </div>
                          
                          <div className="booking-details">
                            <div className="booking-detail">
                              <span className="detail-label">{t('bookings.event_info.date')}:</span>
                              <span className="detail-value">{formatDate(booking.event_date)}</span>
                            </div>
                            <div className="booking-detail">
                              <span className="detail-label">{t('bookings.event_info.time')}:</span>
                              <span className="detail-value">{booking.event_time}</span>
                            </div>
                            <div className="booking-detail">
                              <span className="detail-label">{t('bookings.event_info.venue')}:</span>
                              <span className="detail-value">{booking.venue_name}</span>
                            </div>
                            <div className="booking-detail">
                              <span className="detail-label">{t('bookings.event_info.seats')}:</span>
                              <span className="detail-value">{booking.seats}</span>
                            </div>
                            <div className="booking-detail total">
                              <span className="detail-label">{t('bookings.event_info.total')}:</span>
                              <span className="detail-value">{booking.total_price} {t('currency.symbol')}</span>
                            </div>
                          </div>
                          
                          <div className="booking-actions">
                            {cancelStatus.id === booking.id && (
                              <div className={`alert ${cancelStatus.status === 'success' ? 'alert-success' : 'alert-danger'} mb-3`}>
                                {cancelStatus.message}
                              </div>
                            )}
                            
                            <button 
                              className="btn btn-outline"
                              onClick={() => navigate(`/events/${booking.event_id}`)}
                            >
                              {t('bookings.actions.viewDetails')}
                            </button>
                            
                            <button 
                              className="btn btn-danger"
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              {t('bookings.cancel.button')}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {cancelledBookings.length > 0 && (
                  <div className="bookings-group">
                    <h2 className="bookings-group-title">
                      {t('bookings.cancelled_bookings')} ({cancelledBookings.length})
                    </h2>
                    
                    <div className="bookings-grid">
                      {cancelledBookings.map(booking => (
                        <div key={booking.id} className="booking-card cancelled">
                          <div className="booking-header">
                            <h3 className="booking-title">{booking.event_title}</h3>
                            <span className="booking-status cancelled">
                              {t('bookings.event_info.cancelled')}
                            </span>
                          </div>
                          
                          <div className="booking-details">
                            <div className="booking-detail">
                              <span className="detail-label">{t('bookings.event_info.date')}:</span>
                              <span className="detail-value">{formatDate(booking.event_date)}</span>
                            </div>
                            <div className="booking-detail">
                              <span className="detail-label">{t('bookings.event_info.total')}:</span>
                              <span className="detail-value">{booking.total_price} {t('currency.symbol')}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="favorites-section">
            <h2 className="section-title">{t('profile.favoriteEvents')}</h2>
            
            {favoriteEvents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">⭐</div>
                <h3>{t('profile.noFavorites')}</h3>
                <p>{t('profile.noFavorites.description')}</p>
                <Link to="/events" className="btn btn-primary">
                  {t('profile.findEvents')}
                </Link>
              </div>
            ) : (
              <div className="favorites-grid grid grid-3">
                {favoriteEvents.map(event => (
                  <div key={event.id} className="favorite-event-container">
                    <EventCard event={event} />
                    <button 
                      className="btn-remove-favorite"
                      onClick={() => handleRemoveFromFavorites(event.id)}
                      title={t('profile.removeFavorite')}
                      aria-label={t('profile.removeFavorite')}
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-section">
            <h2 className="section-title">{t('profile.accountSettings')}</h2>
            
            <div className="settings-grid">
              <div className="settings-card">
                <h3>{t('profile.personalInfo')}</h3>
                <div className="settings-content">
                  <div className="info-item">
                    <label>{t('profile.info.username')}:</label>
                    <span>{user.username}</span>
                  </div>
                  <div className="info-item">
                    <label>{t('profile.info.email')}:</label>
                    <span>{user.email}</span>
                  </div>
                  <button className="btn btn-outline">
                    {t('profile.edit.title')}
                  </button>
                </div>
              </div>

              <div className="settings-card">
                <h3>{t('profile.preferences.notifications')}</h3>
                <div className="settings-content">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span className="checkmark"></span>
                    {t('profile.preferences.emailNotifications')}
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span className="checkmark"></span>
                    {t('profile.preferences.smsNotifications')}
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span className="checkmark"></span>
                    {t('profile.preferences.marketingEmails')}
                  </label>
                </div>
              </div>

              <div className="settings-card">
                <h3>{t('profile.security.changePassword')}</h3>
                <div className="settings-content">
                  <button className="btn btn-outline">
                    {t('profile.security.changePassword')}
                  </button>
                  <button className="btn btn-outline">
                    {t('profile.security.twoFactorAuth')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;