import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../contexts/ThemeContext";
import apiService from "../services/api";
import EventCard from "../components/Booking/EventCard";
import "../styles/HomePage.css";

const HomePage = () => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentEvents = async () => {
      try {
        const events = await apiService.getEvents();
        setRecentEvents(events.slice(0, 8)); // Увеличиваем до 8 карточек
        setLoading(false);
      } catch (err) {
        setError(t("common.error"));
        setLoading(false);
      }
    };

    fetchRecentEvents();
  }, [t]);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <img
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400&h=800&fit=crop"
            alt="Sports background"
            className="hero-bg-image"
          />
          <div className="hero-overlay"></div>
        </div>

       

        <div className="hero-content">
          <div className="hero-text">
            <h1>Quicket</h1>
            <p>
              Находите и бронируйте места на спортивные и культурные мероприятия
              с помощью нашего удобного приложения. Откройте для себя мир
              развлечений и незабываемых впечатлений.
            </p>
          </div>

        
        </div>


      </section>

      {/* Events Section */}
      <section className="events-section">
        <div className="container">
          <div className="section-header">
            <h2>Explore More Destination</h2>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>{t("common.loading")}</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div className="events-grid">
              {recentEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          <div className="events-navigation">
            <button className="events-nav-arrow events-nav-prev">
              <span>❮</span>
            </button>
            <button className="events-nav-arrow events-nav-next">
              <span>❯</span>
            </button>
          </div>
        </div>
      </section>


    </div>
  );
};

export default HomePage;
