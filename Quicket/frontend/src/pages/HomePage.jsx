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
          {/* Слайдер фоновых изображений */}
          {backgroundImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Background ${index + 1}`}
              className={`hero-bg-image ${
                index === currentSlide ? "active" : ""
              }`}
            />
          ))}
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

        {/* Индикаторы слайдера */}
        <div className="slider-indicators">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              className={`slider-dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Перейти к слайду ${index + 1}`}
            />
          ))}
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
