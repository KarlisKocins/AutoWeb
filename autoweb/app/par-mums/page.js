import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ParMums() {
  return (
    <>
      <Navbar />
      <main>
        <section className="about-hero">
          <h1>Par AutoWeb</h1>
          <p className="subtitle">
            Jūsu uzticamais auto serviss kopš 2020. gada
          </p>
        </section>

        <section className="about-story">
          <div className="story-content">
            <div className="story-text">
              <h2>Mūsu stāsts</h2>
              <p>
                AutoWeb sāka savu darbību ar vienkāršu mērķi - nodrošināt
                godīgu, caurskatāmu un profesionālu auto servisu Latvijas
                autovadītājiem. Mēs ticam, ka katram auto īpašniekam ir tiesības
                saņemt godīgu un profesionālu servisu par saprātīgu cenu.
              </p>
              <p>
                Mūsu komanda sastāv no sertificētiem mehāniķiem ar vairāk nekā
                15 gadu pieredzi auto remonta jomā. Mēs nepārtraukti
                pilnveidojam savas zināšanas un prasmes, lai varētu piedāvāt
                labāko servisu mūsu klientiem.
              </p>
            </div>
            <div className="story-image">
              <img
                src="/workshop.png"
                alt="AutoWeb darbnīca"
                className="about-img"
              />
            </div>
          </div>
        </section>

        <section className="values">
          <h2>Mūsu vērtības</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Kvalitāte</h3>
              <p>
                Mēs izmantojam tikai augstākās kvalitātes rezerves daļas un
                modernākās diagnostikas iekārtas.
              </p>
            </div>
            <div className="value-card">
              <h3>Godīgums</h3>
              <p>
                Mēs vienmēr sniedzam godīgu novērtējumu un caurskatāmas cenas
                bez slēptām izmaksām.
              </p>
            </div>
            <div className="value-card">
              <h3>Profesionalitāte</h3>
              <p>
                Mūsu mehāniķi regulāri apmeklē apmācības un sertifikācijas
                kursus.
              </p>
            </div>
            <div className="value-card">
              <h3>Klientu serviss</h3>
              <p>
                Mēs lepojamies ar individuālu pieeju katram klientam un viņa
                auto.
              </p>
            </div>
          </div>
        </section>

        <section className="team">
          <h2>Mūsu komanda</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="team-img-container">
                <img src="/team1.png" alt="Jānis Bērziņš" className="team-img" />
              </div>
              <h3>Jānis Bērziņš</h3>
              <p>Galvenais mehāniķis</p>
            </div>
            <div className="team-member">
              <div className="team-img-container">
                <img
                  src="/team2.png"
                  alt="Pēteris Kalniņš"
                  className="team-img"
                />
              </div>
              <h3>Pēteris Kalniņš</h3>
              <p>Diagnostikas speciālists</p>
            </div>
            <div className="team-member">
              <div className="team-img-container">
                <img src="/team3.png" alt="Anna Kļaviņa" className="team-img" />
              </div>
              <h3>Anna Kļaviņa</h3>
              <p>Klientu apkalpošanas vadītāja</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
