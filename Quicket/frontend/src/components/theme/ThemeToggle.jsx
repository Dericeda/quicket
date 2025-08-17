// Улучшенный компонент ThemeToggle.jsx

import React, { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import "../../styles/ThemeToggle.css";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="theme-toggle-container">
      <button
        onClick={toggleTheme}
        className="theme-toggle-button"
        aria-label={`Переключить на ${
          theme === "light" ? "темную" : "светлую"
        } тему`}
        title={`Переключить на ${
          theme === "light" ? "темную" : "светлую"
        } тему`}
      >
        <div className="theme-toggle-slider">
          <div className="theme-toggle-icon-container">
            {theme === "light" ? (
              <svg
                className="theme-icon sun-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg
                className="theme-icon moon-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </div>
          <div className="theme-toggle-track">
            <div
              className={`theme-toggle-thumb ${
                theme === "dark" ? "active" : ""
              }`}
            ></div>
          </div>
        </div>
        <span className="theme-toggle-text">
          {theme === "light" ? "Светлая" : "Темная"}
        </span>
      </button>
    </div>
  );
};

export default ThemeToggle;
