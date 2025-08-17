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

  // Массив фоновых изображений
  const backgroundImages = [
    "https://cdn.cosmos.so/2eb2f595-4d5f-4b03-8ceb-dcd0346a1e9b?format=jpeg",
    "https://cdn.cosmos.so/fc222248-2b51-4525-8235-38499e78a6cc?format=jpeg",
    "https://cdn.cosmos.so/ae491fd6-725b-4b87-8d30-b3c11ceaefac?format=jpeg",
  ];

  // Автоматический слайдер
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide === backgroundImages.length - 1 ? 0 : prevSlide + 1
      );
    }, 4000); // Меняется каждые 4 секунды

    return () => clearInterval(slideInterval);
  }, [backgroundImages.length]);

  useEffect(() => {
    const fetchRecentEvents = async () => {
      try {
        const events = await apiService.getEvents();
        setRecentEvents(events.slice(0, 8)); // Увеличиваем до 8 карточек
        setLoading(false);
      } catch (err) {
        setError(t("homepage.events.errorLoading"));
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
          {/* Слайдер фоновых изображений */}
          {backgroundImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={t("homepage.slider.goToSlide", { number: index + 1 })}
              className={`hero-bg-image ${
                index === currentSlide ? "active" : ""
              }`}
            />
          ))}
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content">
          <div className="hero-text">
            <h1>{t("app.name")}</h1>
            <p>{t("homepage.hero.description")}</p>
          </div>
        </div>

        {/* Индикаторы слайдера */}
        <div className="slider-indicators">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              className={`slider-dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={t("homepage.slider.goToSlide", { number: index + 1 })}
            />
          ))}
        </div>
      </section>

      {/* Events Section */}
      <section className="events-section">
        <div className="container">
          <div className="section-header">
            <h2>{t("homepage.events.exploreMore")}</h2>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>{t("homepage.events.loadingEvents")}</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : recentEvents.length === 0 ? (
            <div className="no-events-container">
              <p>{t("homepage.events.noEvents")}</p>
              <Link to="/events" className="btn btn-primary">
                {t("homepage.hero.findEvents")}
              </Link>
            </div>
          ) : (
            <div className="events-grid">
              {recentEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          <div className="events-navigation">
            <button
              className="events-nav-arrow events-nav-prev"
              aria-label={t("homepage.slider.previousSlide")}
            >
              <span>❮</span>
            </button>
            <button
              className="events-nav-arrow events-nav-next"
              aria-label={t("homepage.slider.nextSlide")}
            >
              <span>❯</span>
            </button>
          </div>

          {/* View All Events Link */}
          <div className="view-all-container">
            <Link to="/events" className="view-all-btn">
              {t("homepage.events.allEvents")}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>{t("homepage.features.title")}</h2>
            <p>{t("homepage.features.subtitle")}</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>{t("homepage.features.simpleBooking.title")}</h3>
              <p>{t("homepage.features.simpleBooking.description")}</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💳</div>
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

            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>{t("homepage.features.securePayments.title")}</h3>
              <p>{t("homepage.features.securePayments.description")}</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎧</div>
              <h3>{t("homepage.features.customerSupport.title")}</h3>
              <p>{t("homepage.features.customerSupport.description")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>{t("homepage.cta.title")}</h2>
            <p>{t("homepage.cta.description")}</p>
            <div className="cta-buttons">
              <Link to="/register" className="cta-btn primary">
                {t("homepage.cta.register")}
              </Link>
              <Link to="/events" className="cta-btn secondary">
                {t("homepage.cta.learnMore")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
