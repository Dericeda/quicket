import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../styles/Footer.css";

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-container">
          <div className="footer-brand">
            <h3>Quicket</h3>
            <p>
              Система онлайн-продажи билетов на культурные и спортивные
              мероприятия. Откройте для себя прекрасные моменты и
              присоединяйтесь к миру культуры и спорта!
            </p>
          </div>

          <div className="footer-section">
            <h4>Навигация</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Главная</Link>
              </li>
              <li>
                <Link to="/events">Мероприятия</Link>
              </li>
              <li>
                <Link to="/login">Вход</Link>
              </li>
              <li>
                <Link to="/register">Регистрация</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Контакты</h4>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>Астана қ., Мангилик Ел, C.1.3</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">☎️</span>
                <span>+7 (778) 968 51 07</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>info@quicket.kz</span>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {year} Quicket. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
