# 🚗 AutoWeb - Auto Remonta Darbnīcas Pārvaldības Sistēma

## 📖 Projekta Apraksts

AutoWeb ir auto remonta darbnīcas pārvaldības sistēmas prototips, kas izstrādāts ar Next.js. Sistēma nodrošina informatīvu mājaslapu, rezervāciju iespējas, pakalpojumu pārskatu un administratīvo paneli ar darba grafika plānošanu.

## 🗂️ Projekta Struktūra

- **`autoweb/`**: Satur Next.js lietojumprogrammu
  - **`app/`**: Galvenā lietojumprogrammas direktorija
    - **`components/`**: Atkārtoti izmantojami React komponenti (Booking, Calendar, Navbar, Footer, LoginPopup, RegisterPopup, Expert-card, PendingAppointment)
    - **`api/`**: API maršruti un datubāzes konfigurācija
      - **`appointments/`**: Rezervāciju API (approved, book, list, times, update_status)
      - **`services/`**: Pakalpojumu API
      - **`users/`**: Lietotāju reģistrācijas un pieteikšanās API
      - **`autoserviss.sql`**: Datubāzes shēma un sākotnējie dati
      - **`db.js`**: Datubāzes savienojuma konfigurācija
    - **`context/`**: React konteksta faili (piem., AuthContext)
    - **`admin/`**: Administrācijas panelis un darba grafika plānošana (`weekly-schedule`)
    - **`pakalpojumi/`**: Pakalpojumu lapa
    - **`par-mums/`**: Par mums lapa
    - **`globals.css`**: Globālie stili
    - **`layout.js`**: Galvenais izkārtojums
    - **`page.js`**: Mājaslapa
  - **`public/`**: Statiskie faili (attēli, SVG)

## 📦 Priekšnosacījumi

- **Node.js** (v14 vai jaunāka)
- **npm** (v6 vai jaunāka)
- **Git**
- **PostgreSQL** (v13 vai jaunāka)

## ⚙️ Projekta Iestatīšana

1. **Klonējiet savu forku:**
   ```bash
   git clone <REPO URL>
   ```

2. **Pārejiet uz projekta direktoriju:**
   ```bash
   cd AutoWeb/autoweb-files
   ```

3. **Instalējiet atkarības:**
   ```bash
   npm install
   ```

4. **Izveidojiet `.env` failu ar šādām vērtībām:**
   ```
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=AutoWeb
   DB_PORT=5432
   ```

5. **Inicializējiet datubāzi:**
   - Izpildiet SQL skriptu no `app/api/autoserviss.sql` savā PostgreSQL datubāzē.

## 🚀 Lietojumprogrammas Palaišana

1. **Palaidiet izstrādes serveri:**
   ```bash
   npm run dev
   ```

2. **Atveriet pārlūkprogrammu un apmeklējiet:**
   [http://localhost:3000](http://localhost:3000)

## 🔑 Funkcijas

- Informatīva mājaslapa
- Kalendāra komponente rezervācijām
- Pakalpojumu pārskats
- Ekspertu sekcija
- Par mums sekcija
- Lietotāju reģistrācija un pieteikšanās (autentifikācija ar bcryptjs)
- Administratora panelis ar rezervāciju pārskatu un darba grafika plānošanu (`weekly-schedule`)
- Pakalpojumu pārvaldība
- Rezervāciju sistēma ar laika izvēli
- Responsīvs dizains

## 🛠️ Tehnoloģiju Steks

- **Priekšgals**: Next.js (v15), React (v19), CSS Modules
- **Ikonas**: React Icons
- **Datubāze**: PostgreSQL
- **Autentifikācija**: bcryptjs
- **API**: Next.js API Routes, pg

## 📁 Galvenie Komponenti

- `Booking.js` — Rezervāciju forma un laika izvēle
- `Calendar.js` — Kalendāra komponente
- `Navbar.js`, `Footer.js` — Navigācija un kājene
- `LoginPopup.js`, `RegisterPopup.js` — Lietotāju autentifikācijas logi
- `Expert-card.js` — Ekspertu informācijas karte
- `PendingAppointment.js` — Nepabeigtās rezervācijas

## 🗂️ API Maršruti

- `/api/appointments/approved` — Apstiprināto rezervāciju saraksts
- `/api/appointments/book` — Jaunas rezervācijas izveide
- `/api/appointments/list` — Visu rezervāciju saraksts
- `/api/appointments/times` — Pieejamie laiki
- `/api/appointments/update_status` — Rezervācijas statusa atjaunināšana
- `/api/services` — Pakalpojumu saraksts
- `/api/users/register` — Lietotāja reģistrācija
- `/api/users/login` — Lietotāja pieteikšanās

## 🔐 Autentifikācija

- Lietotāju reģistrācija un pieteikšanās
- Administratora piekļuve
- Sesiju pārvaldība ar React kontekstu

## 👨‍💼 Administratora Panelis

- Darbinieku pārvaldība (nākotnē)
- Rezervāciju pārskats
- Darba grafika plānošana (`weekly-schedule`)

## 🖼️ Statiskie Resursi

- Attēli: `public/team1.png`, `public/team2.png`, `public/team3.png`, `public/workshop.png`, `public/cars.jpg`
- SVG ikonas: `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`

## 🐞 Problēmu Novēršana

1. Pārliecinieties, ka visas atkarības ir instalētas `autoweb` direktorijā
2. Pārbaudiet, vai ports 3000 nav aizņemts ar citu lietojumprogrammu
3. Pārbaudiet konsoles izvadi, lai iegūtu detalizētu informāciju par kļūdām
4. Pārliecinieties, ka datubāzes konfigurācija `.env` failā ir pareiza

## 📬 Kontaktinformācija

Ja jums ir jautājumi vai ieteikumi, lūdzu, sazinieties ar projekta uzturētājiem!
