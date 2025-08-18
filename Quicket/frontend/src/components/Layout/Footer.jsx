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
          <div className="footer-brand">
            <h3 className="brand-name">{t("footer.brand")}*</h3>
            <p className="brand-description">{t("footer.description")}</p>
          </div>

          <div className="footer-column">
            <h4 className="column-title">{t("footer.navigation")}</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">{t("navigation.home")}</Link>
              </li>
              <li>
                <Link to="/events">{t("navigation.events")}</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="column-title">{t("footer.contactInfo")}</h4>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-label">{t("footer.phone")}:</span>
                <span className="contact-value">+7 (778) 968 51 07</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">{t("footer.email")}:</span>
                <span className="contact-value">info@quicket.kz</span>
              </div>
            </div>
          </div>

          
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">{t("footer.copyright", { year })}</p>
            
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
