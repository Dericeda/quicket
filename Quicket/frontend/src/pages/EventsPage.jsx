import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../contexts/AuthContext";
import apiService from "../services/api";
import EventCard from "../components/Booking/EventCard";
import "../styles/EventCard.css";
import "../styles/FavoriteButton.css";

const EventsPage = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await apiService.getEvents();
        setEvents(data);
        setLoading(false);
      } catch (err) {
        setError(t("events.error"));
        setLoading(false);
      }
    };

    // Загружаем избранные из localStorage
    const loadFavorites = () => {
      const savedFavorites = JSON.parse(
        localStorage.getItem("favoriteEvents") || "[]"
      );
      setFavorites(savedFavorites);
    };

    fetchEvents();
    loadFavorites();
  }, [t]);

  // Фильтрация и сортировка событий
  const filteredAndSortedEvents = events
    .filter((event) => {
      const matchesFilter = filter === "all" || event.type === filter;
      const matchesSearch =
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.venue_name.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.date) - new Date(b.date);
        case "price":
          return a.price - b.price;
        case "priceDesc":
          return b.price - a.price;
        case "name":
          return a.title.localeCompare(b.title);
        case "popularity":
          return (
            b.total_seats -
            b.available_seats -
            (a.total_seats - a.available_seats)
          );
        default:
          return 0;
      }
    });

  // Получаем уникальные типы событий
  const eventTypes = [...new Set(events.map((event) => event.type))];

  // Добавление/удаление из избранных
  const toggleFavorite = (eventId) => {
    let updatedFavorites;

    if (favorites.includes(eventId)) {
      updatedFavorites = favorites.filter((id) => id !== eventId);
    } else {
      updatedFavorites = [...favorites, eventId];
    }

    localStorage.setItem("favoriteEvents", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  // Проверка, находится ли мероприятие в избранном
  const isFavorite = (eventId) => {
    return favorites.includes(eventId);
  };

  // Получение локализованного названия типа события
  const getEventTypeLabel = (type) => {
    const typeKey = `events.filter.${type.toLowerCase()}`;
    return t(typeKey, type);
  };

  return (
    <div className="container mt-4">
      <div className="events-page-header">
        <h1 className="text-center mb-4 eventsSectionMarginTop">
          {t("events.title")}
        </h1>
        <p className="text-center events-subtitle">{t("events.subtitle")}</p>
      </div>

      {error ? (
        <div className="alert alert-danger">
          {error}
          <button
            className="btn btn-link"
            onClick={() => window.location.reload()}
          >
            {t("common.retry")}
          </button>
        </div>
      ) : (
        <>
          {/* Фильтры и поиск */}
          <div className="card p-3 mb-4">
            <div className="events-filters">
              <div className="filter-row">
                <div className="form-group">
                  <label htmlFor="search">{t("events.search.label")}</label>
                  <input
                    type="text"
                    id="search"
                    className="form-control"
                    placeholder={t("events.search.placeholder")}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="filter">{t("events.filter.label")}</label>
                  <select
                    id="filter"
                    className="form-control"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">{t("events.filter.allTypes")}</option>
                    {eventTypes.map((type) => (
                      <option key={type} value={type}>
                        {getEventTypeLabel(type)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="sort">{t("events.sort.label")}</label>
                  <select
                    id="sort"
                    className="form-control"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="date">{t("events.sort.date")}</option>
                    <option value="price">{t("events.sort.priceAsc")}</option>
                    <option value="priceDesc">
                      {t("events.sort.priceDesc")}
                    </option>
                    <option value="name">{t("events.sort.name")}</option>
                    <option value="popularity">
                      {t("events.sort.popularity")}
                    </option>
                  </select>
                </div>
              </div>

              {/* Результаты поиска */}
              {(search || filter !== "all") && (
                <div className="search-results-info">
                  <p>
                    {filteredAndSortedEvents.length > 0
                      ? t("events.showingResults", {
                          showing: filteredAndSortedEvents.length,
                          total: events.length,
                        })
                      : t("events.search.noResults")}
                  </p>
                  {(search || filter !== "all") && (
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        setSearch("");
                        setFilter("all");
                      }}
                    >
                      {t("admin.events.clearFilters")}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="loading-container text-center">
              <div className="spinner"></div>
              <p>{t("events.loading")}</p>
            </div>
          ) : filteredAndSortedEvents.length === 0 ? (
            <div className="no-events-container">
              <div className="alert alert-warning">
                {search || filter !== "all"
                  ? t("events.search.noResults")
                  : t("events.noEvents")}
              </div>
              {(search || filter !== "all") && (
                <div className="text-center">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setSearch("");
                      setFilter("all");
                    }}
                  >
                    {t("events.viewAll")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="events-grid grid grid-3">
                {filteredAndSortedEvents.map((event) => (
                  <div key={event.id} className="event-card-container">
                    <EventCard event={event} />
                    {user && (
                      <button
                        className={`favorite-button ${
                          isFavorite(event.id) ? "is-favorite" : ""
                        }`}
                        onClick={() => toggleFavorite(event.id)}
                        title={
                          isFavorite(event.id)
                            ? t("events.removeFromFavorites")
                            : t("events.addToFavorites")
                        }
                        aria-label={
                          isFavorite(event.id)
                            ? t("events.removeFromFavorites")
                            : t("events.addToFavorites")
                        }
                      >
                        {isFavorite(event.id) ? "★" : "☆"}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Пагинация или кнопка "Загрузить еще" */}
              {filteredAndSortedEvents.length > 12 && (
                <div className="text-center mt-4">
                  <button className="btn btn-outline">
                    {t("events.loadMore")}
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default EventsPage;
