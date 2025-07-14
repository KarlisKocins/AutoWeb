'use client';

import { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load services');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="app-container">
      <Navbar />
      <main>
        <section className="services-hero">
          <h1>Mūsu Pakalpojumi</h1>
          <p>
            Piedāvājam plašu auto remonta un apkopes pakalpojumu klāstu ar
            konkurētspējīgām cenām
          </p>
        </section>

        <section className="services-grid">
          {services.map((category, index) => (
            <div key={index} className="service-category">
              <h2>{category.category}</h2>
              <div className="service-items">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="service-item">
                    <span className="service-name">{item.name}</span>
                    <span className="service-price">€{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="service-note">
          <p>
            * Norādītās cenas ir aptuvenas un var mainīties atkarībā no auto
            markas, modeļa un nepieciešamo rezerves daļu cenām. Precīzu cenu
            varēsim noteikt pēc auto apskates.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
