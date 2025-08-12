import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../styles/EventCard.css";

const EventCard = ({ event }) => {
  const { t, i18n } = useTranslation();

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const language = i18n.language || "kz";
    const localeMap = {
      kz: "kk-KZ",
      ru: "ru-RU",
      en: "en-US",
    };
    return new Date(dateString).toLocaleDateString(
      localeMap[language],
      options
    );
  };

  const getSeatsStatusClass = () => {
    if (event.available_seats === 0) return "seats-sold-out";
    if (event.available_seats < 5) return "seats-limited";
    return "seats-available";
  };

  const getSeatsStatusText = () => {
    if (event.available_seats === 0) return t("eventCard.soldOut");
    if (event.available_seats < 5)
      return t("eventCard.limitedSeats", { count: event.available_seats });
    return t("eventCard.availableSeats", { count: event.available_seats });
  };

  return (
    <div className="modern-event-card">
      <div className="card-image-container">
        <img
          src={
            event.image_url ||
            "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop"
          }
          alt={event.title}
          className="card-image"
        />
        <div className="card-badge">
          <span className="badge-text">Featured</span>
        </div>
        <div className="card-overlay">
          <Link to={`/events/${event.id}`} className="overlay-link">
            {t("events.viewDetails")}
          </Link>
        </div>
      </div>

      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{event.title}</h3>
          <div className="card-rating">
            <span className="rating-icon">⭐</span>
            <span className="rating-text">Top Destination</span>
          </div>
        </div>

        <div className="card-details">
          <div className="detail-item">
            <span className="detail-icon">📍</span>
            <span className="detail-text">{event.venue_name}</span>
          </div>

          <div className="detail-item">
            <span className="detail-icon">📅</span>
            <span className="detail-text">{formatDate(event.date)}</span>
          </div>
        </div>

        <div className="card-footer">
          <div className="price-info">
            <span className="price-amount">{event.price} тг</span>
            <span className="price-label">per person</span>
          </div>

          <div className="availability-info">
            <span className={`availability-status ${getSeatsStatusClass()}`}>
              {getSeatsStatusText()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
