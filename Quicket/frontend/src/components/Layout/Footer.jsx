import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../styles/Footer.css";

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="modern-footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-brand-section">
            <div className="footer-brand">
              <h3 className="brand-name">Quicket*</h3>
              <p className="brand-description">
                Система онлайн-продажи билетов на культурные и спортивные
                мероприятия. Откройте для себя прекрасные моменты и
                присоединяйтесь к миру культуры и спорта!
              </p>
            </div>

            <div className="footer-contact">
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-label">Address:</span>
                  <span className="contact-value">
                    Астана қ., Мангилик Ел, C.1.3
                  </span>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Phone:</span>
                  <span className="contact-value">+7 (778) 968 51 07</span>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Email:</span>
                  <span className="contact-value">info@quicket.kz</span>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-links-section">
            <div className="footer-column">
              <h4 className="column-title">Navigation</h4>
              <ul className="footer-links">
                <li>
                  <Link to="/">About Us</Link>
                </li>
                <li>
                  <Link to="/events">Contact</Link>
                </li>
                <li>
                  <Link to="/login">Services</Link>
                </li>
                <li>
                  <Link to="/register">Gallery</Link>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="column-title">Policies</h4>
              <ul className="footer-links">
                <li>
                  <Link to="/">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/">Terms of Service</Link>
                </li>
                <li>
                  <Link to="/">Cookie Policy</Link>
                </li>
                <li>
                  <Link to="/">Disclaimer</Link>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="column-title">Social Media</h4>
              <div className="social-links">
                <a
                  href="#"
                  className="social-link facebook"
                  aria-label="Facebook"
                >
                  <span>Facebook</span>
                </a>
                <a
                  href="#"
                  className="social-link instagram"
                  aria-label="Instagram"
                >
                  <span>Instagram</span>
                </a>
                <a
                  href="#"
                  className="social-link twitter"
                  aria-label="Twitter"
                >
                  <span>Twitter</span>
                </a>
                <a
                  href="#"
                  className="social-link youtube"
                  aria-label="YouTube"
                >
                  <span>YouTube</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">© {year} Quicket. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
