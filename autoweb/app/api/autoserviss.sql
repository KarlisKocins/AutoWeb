CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    password_hash VARCHAR(255),
    name VARCHAR(50) NOT NULL,
    identification_num VARCHAR(20),
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    price_low DECIMAL(10, 2) NOT NULL,
    price_high DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Populate services table with Latvian data
INSERT INTO services (name, category, description, price_low, price_high)
VALUES
('Eļļas maiņa', 'Apkope', 'Motoreļļas un filtra nomaiņa', 20.00, 40.00),
('Bremžu sistēmas pārbaude', 'Diagnostika', 'Bremžu kluču, disku un šķidruma pārbaude', 15.00, 35.00),
('Riepu maiņa', 'Riepas', 'Riepu nomaiņa un balansēšana', 10.00, 30.00),
('Dzinēja diagnostika', 'Diagnostika', 'Dzinēja elektronikas pārbaude ar datoru', 25.00, 60.00),
('Gaisa filtra maiņa', 'Apkope', 'Gaisa filtra nomaiņa', 5.00, 15.00),
('Aizmugurējo lukturu remonts', 'Elektrība', 'Aizmugurējo lukturu remonts vai nomaiņa', 10.00, 25.00);


CREATE TABLE cars (
    id SERIAL PRIMARY KEY,
    make VARCHAR(50),
    model VARCHAR(50),
    year INT,
    VIN VARCHAR(17),
    license_plate VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);


CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES user_profiles(id),
    service_id INTEGER REFERENCES services(id),
    car_id INTEGER REFERENCES cars(id),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES user_profiles(id),
    worker_id INTEGER REFERENCES user_profiles(id),
    service_id INTEGER REFERENCES services(id),
    car_id INTEGER REFERENCES cars(id),
    status VARCHAR(20) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);