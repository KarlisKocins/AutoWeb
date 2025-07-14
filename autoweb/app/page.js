"use client";

import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Calendar from "./components/Calendar";
import Footer from "./components/Footer";
import ExpertCard from "./components/Expert-card";
import BookingComponent from "./components/Booking";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateSelect = (date, isToday = false) => {
    setSelectedDate(date);
  };

  return (
    <div className="app-container">
      <Navbar />

      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>Laipni lūgti <span className="brand-text">AutoWeb</span></h1>
            <div className="tagline-container">
              <p className="tagline">
                Jūsu uzticamais partneris visām auto remonta vajadzībām
              </p>
              <div className="tagline-divider"></div>
            </div>
            <div className="hero-features">
              <div className="feature">
                <span className="feature-icon">⚡</span>
                <span className="feature-text">Ekspertu serviss</span>
              </div>
              <div className="feature">
                <span className="feature-icon">💰</span>
                <span className="feature-text">Godīgas cenas</span>
              </div>
              <div className="feature">
                <span className="feature-icon">⏱️</span>
                <span className="feature-text">Ātra izpilde</span>
              </div>
            </div>
          </div>
        </section>

        <section className="experts">
          <div className="section-header">
            <h2>Kāpēc izvēlēties mūs</h2>
            <div className="section-divider"></div>
          </div>
          <div className="expert-cards">
            <ExpertCard
              icon="👨‍🔧"
              title="Eksperti mehāniķi"
              description="Mūsu sertificētā komanda nodrošina augstākās kvalitātes servisu jūsu automašīnai ar vairāk nekā 10 gadu pieredzi nozarē."
            />
            <ExpertCard
              icon="🔧"
              title="Modernais aprīkojums"
              description="Izmantojam jaunākās tehnoloģijas un aprīkojumu, lai diagnosticētu un novērstu problēmas efektīvāk un precīzāk."
            />
            <ExpertCard
              icon="⏰"
              title="Ātra apkalpošana"
              description="Cienām jūsu laiku un nodrošinām ātru, bet rūpīgu darba izpildi ar skaidru termiņu un godīgu cenu politiku."
            />
          </div>
        </section>

        <section className="booking">
          <div className="booking-info">
            <div className="section-header">
              <h2>Pieteikties uz apskati</h2>
              <div className="section-divider"></div>
            </div>
            <div className="booking-description">
              <p>
                Ja tava automašīna prasa rūpes vai remontu, mēs esam šeit, lai palīdzētu!
              </p>
              <p className="highlight-text">
                Tavs auto ir pelnījis vislabāko apkopi, un mūsu pieredzējušā komanda ir gatava nodrošināt kvalitatīvus pakalpojumus.
              </p>
            </div>
            <BookingComponent selectedDate={selectedDate} />
          </div>
          <div className="calendar-section">
            <Calendar onDateSelect={handleDateSelect} />
          </div>
        </section>

        <section className="about">
          <div className="section-header">
            <h2>PAR MUMS</h2>
            <div className="section-divider"></div>
          </div>
          <div className="about-content">
            <div className="about-text">
              <p className="about-description">
                Autoserviss <span className="highlight">"AutoWeb"</span> ir jūsu uzticamais partneris automobiļu
                apkopē un remontā. Mēs lepojamies ar mūsu profesionālo komandu,
                kas kopš <span className="highlight">2020. gada</span> ir apkalpojusi simtiem apmierinātu klientu.
              </p>
              <p className="about-description">
                Mūsu kvalificētie speciālisti ir apņēmušies nodrošināt visaugstāko
                kvalitāti un profesionalitāti katrā auto remonta darbā.
              </p>
            </div>
            <div className="about-image">
              <img
                src="/cars.jpg"
                alt="Auto service"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
