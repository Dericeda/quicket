// Улучшенный ThemeContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Инициализация темы из localStorage или системных предпочтений
  const [theme, setTheme] = useState(() => {
    // Проверяем localStorage
    const savedTheme = localStorage.getItem("quicket-theme");
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      return savedTheme;
    }

    // Если нет сохраненной темы, проверяем системные предпочтения
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }

    // По умолчанию светлая тема
    return "light";
  });

  // Функция переключения темы
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  // Применение темы к документу и сохранение в localStorage
  useEffect(() => {
    // Сохраняем в localStorage
    localStorage.setItem("quicket-theme", theme);

    // Применяем к document.documentElement (html тег)
    document.documentElement.setAttribute("data-theme", theme);

    // Дополнительно добавляем класс для совместимости
    document.body.className = document.body.className.replace(/theme-\w+/g, "");
    document.body.classList.add(`theme-${theme}`);

    // Мета-тег для браузера (для цвета строки состояния на мобильных)
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        theme === "dark" ? "#0f172a" : "#ffffff"
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.content = theme === "dark" ? "#0f172a" : "#ffffff";
      document.getElementsByTagName("head")[0].appendChild(meta);
    }

    // Уведомляем о смене темы (для аналитики или других компонентов)
    window.dispatchEvent(
      new CustomEvent("themeChanged", { detail: { theme } })
    );
  }, [theme]);

  // Слушаем изменения системных предпочтений
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (e) => {
      // Только если пользователь не выбрал тему вручную
      const savedTheme = localStorage.getItem("quicket-theme");
      if (!savedTheme) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  // Дополнительные утилиты для темы
  const themeUtils = {
    isDark: theme === "dark",
    isLight: theme === "light",
    setLightTheme: () => setTheme("light"),
    setDarkTheme: () => setTheme("dark"),
    resetToSystemTheme: () => {
      localStorage.removeItem("quicket-theme");
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setTheme(systemTheme);
    },
  };

  const value = {
    theme,
    toggleTheme,
    ...themeUtils,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
