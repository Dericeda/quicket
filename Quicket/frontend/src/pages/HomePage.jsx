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
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    "https://cdn.cosmos.so/2eb2f595-4d5f-4b03-8ceb-dcd0346a1e9b?format=jpeg",
    "https://cdn.cosmos.so/fc222248-2b51-4525-8235-38499e78a6cc",
    "https://cdn.cosmos.so/fc222248-2b51-4525-8235-38499e78a6cc",
  ];

  useEffect(() => {
    const fetchRecentEvents = async () => {
      try {
        const events = await apiService.getEvents();
        setRecentEvents(events.slice(0, 3));
        setLoading(false);
      } catch (err) {
        setError(t("common.error"));
        setLoading(false);
      }
    };

    fetchRecentEvents();
  }, [t]);

  // Slider auto-change effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-slider">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? "active" : ""}`}
              style={{ backgroundImage: `url(${slide})` }}
            ></div>
          ))}
        </div>
        <div className="hero-content container">
          <div className="hero-text">
            <h1>Бронирование спортивных и культурных мероприятий</h1>
            <p>
              Находите и бронируйте места на спортивные и культурные мероприятия
              с помощью нашего удобного приложения
            </p>
            <div className="hero-buttons">
              <Link to="/events" className="btn-primary">
                Найти мероприятия
              </Link>
              {!localStorage.getItem("user") && (
                <Link to="/register" className="btn-outline">
                  {t("homepage.hero.register")}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="category-nav-section">
        <div className="container">
          <div className="category-nav">
            <Link to="/events?category=sports" className="category-item">
              Sports
            </Link>
            <Link to="/events?category=concerts" className="category-item">
              Concerts
            </Link>
            <Link to="/events?category=theater" className="category-item">
              Theater
            </Link>
            <Link to="/events?category=festivals" className="category-item">
              Festivals
            </Link>
            <Link to="/events?category=top-cities" className="category-item">
              Top Cities
            </Link>
          </div>
        </div>
      </section>

      <section className="recent-events-section container">
        <div className="section-header">
          <h2>{t("homepage.recentEvents.title")}</h2>
          <Link to="/events" className="btn-outline-secondary">
            {t("homepage.recentEvents.viewAll")}
          </Link>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>{t("common.loading")}</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <>
            <div className="events-grid">
              {recentEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {recentEvents.length > 0 && (
              <div className="view-all-container">
                <Link to="/events" className="btn-primary">
                  {t("homepage.recentEvents.allEvents")}
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>{t("homepage.cta.title")}</h2>
            <p>{t("homepage.cta.subtitle")}</p>
            <Link to="/register" className="btn-primary">
              {t("homepage.cta.register")}
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="features-title">{t("homepage.features.title")}</h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>{t("homepage.features.simpleBooking.title")}</h3>
              <p>{t("homepage.features.simpleBooking.description")}</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>{t("homepage.features.onlinePayment.title")}</h3>
              <p>{t("homepage.features.onlinePayment.description")}</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>{t("homepage.features.multilingual.title")}</h3>
              <p>{t("homepage.features.multilingual.description")}</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>{t("homepage.features.mobileAccess.title")}</h3>
              <p>{t("homepage.features.mobileAccess.description")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
