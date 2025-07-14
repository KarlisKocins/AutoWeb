export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section working-hours">
          <div className="footer-header">
            <h4>Darba laiks</h4>
            <div className="footer-divider"></div>
          </div>
          <ul className="hours-list">
            <li>
              <span className="day">Pirmdiena</span>
              <span className="time">9:00 - 18:00</span>
            </li>
            <li>
              <span className="day">Otrdiena</span>
              <span className="time">9:00 - 18:00</span>
            </li>
            <li>
              <span className="day">Trešdiena</span>
              <span className="time">9:00 - 18:00</span>
            </li>
            <li>
              <span className="day">Ceturtdiena</span>
              <span className="time">9:00 - 18:00</span>
            </li>
            <li>
              <span className="day">Piektdiena</span>
              <span className="time">9:00 - 18:00</span>
            </li>
            <li className="weekend">
              <span className="day">Sestdiena</span>
              <span className="time">Slēgts</span>
            </li>
            <li className="weekend">
              <span className="day">Svētdiena</span>
              <span className="time">Slēgts</span>
            </li>
          </ul>
        </div>
        
        <div className="footer-section contact-info">
          <div className="footer-header">
            <h4>Kontaktinformācija</h4>
            <div className="footer-divider"></div>
          </div>
          <ul className="contact-list">
            <li className="contact-item">
              <div className="contact-icon">📱</div>
              <div className="contact-details">
                <span className="contact-label">Telefons</span>
                <a href="tel:+37166666666" className="contact-value">+371 66 666 666</a>
              </div>
            </li>
            <li className="contact-item">
              <div className="contact-icon">📍</div>
              <div className="contact-details">
                <span className="contact-label">Adrese</span>
                <span className="contact-value">Ziediņu bulvāris 53, LV-6232</span>
              </div>
            </li>
            <li className="contact-item">
              <div className="contact-icon">✉️</div>
              <div className="contact-details">
                <span className="contact-label">E-pasts</span>
                <a href="mailto:autoweb@inbox.lv" className="contact-value">autoweb@inbox.lv</a>
              </div>
            </li>
          </ul>
          
          <div className="social-media">
            <a href="#" className="social-icon">FB</a>
            <a href="#" className="social-icon">IG</a>
            <a href="#" className="social-icon">TW</a>
          </div>
        </div>
        
        <div className="footer-section map-section">
          <div className="footer-header">
            <h4>Kā mūs atrast?</h4>
            <div className="footer-divider"></div>
          </div>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2175.3889!2d24.1234567!3d56.9876543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTbCsDU5JzE1LjYiTiAyNMKwMDcnMjQuNCJF!5e0!3m2!1sen!2slv!4v1234567890"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="copyright">
          <p>© {new Date().getFullYear()} AutoWeb. Visas tiesības aizsargātas.</p>
        </div>
      </div>
    </footer>
  );
}
