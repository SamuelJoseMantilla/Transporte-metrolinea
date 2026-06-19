-- ============================================================================
-- MetroLínea Inteligente - Database Schema
-- PostgreSQL 16
-- ============================================================================

-- Create database
CREATE DATABASE metrolinea_db
    WITH OWNER = metrolinea
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TEMPLATE = template0;

-- Create user
CREATE USER metrolinea WITH PASSWORD 'metrolinea_secret';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE metrolinea_db TO metrolinea;

-- Connect to the database
\c metrolinea_db

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO metrolinea;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO metrolinea;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO metrolinea;

-- ============================================================================
-- TABLES
-- ============================================================================

-- Table: users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

COMMENT ON TABLE users IS 'Platform users (admins and regular users)';
COMMENT ON COLUMN users.username IS 'Unique login username';
COMMENT ON COLUMN users.email IS 'Unique email address';
COMMENT ON COLUMN users.hashed_password IS 'bcrypt hashed password';
COMMENT ON COLUMN users.is_admin IS 'Admin privileges flag';

-- Table: routes
CREATE TABLE routes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_routes_name ON routes(name);
CREATE INDEX idx_routes_code ON routes(code);

COMMENT ON TABLE routes IS 'Bus routes (lines) in the transit network';
COMMENT ON COLUMN routes.code IS 'Short code e.g. RN-S';
COMMENT ON COLUMN routes.color IS 'Display color in hex format';

-- Table: stops
CREATE TABLE stops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    latitude FLOAT NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
    longitude FLOAT NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
    address VARCHAR(300),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_stops_name ON stops(name);
CREATE INDEX idx_stops_code ON stops(code);

COMMENT ON TABLE stops IS 'Bus stops (paraderos) with GPS coordinates';
COMMENT ON COLUMN stops.latitude IS 'GPS latitude (-90 to 90)';
COMMENT ON COLUMN stops.longitude IS 'GPS longitude (-180 to 180)';

-- Table: route_stops (junction)
CREATE TABLE route_stops (
    id SERIAL PRIMARY KEY,
    route_id INTEGER NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    stop_id INTEGER NOT NULL REFERENCES stops(id) ON DELETE CASCADE,
    sequence INTEGER NOT NULL,
    distance_from_start_km FLOAT NOT NULL DEFAULT 0.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_route_stop UNIQUE (route_id, stop_id)
);

CREATE INDEX idx_route_stops_route_id ON route_stops(route_id);
CREATE INDEX idx_route_stops_stop_id ON route_stops(stop_id);

COMMENT ON TABLE route_stops IS 'Junction table: stops belonging to routes with ordering';
COMMENT ON COLUMN route_stops.sequence IS 'Order of the stop within the route (1, 2, 3...)';
COMMENT ON COLUMN route_stops.distance_from_start_km IS 'Cumulative distance from route start in km';

-- Table: buses
CREATE TABLE buses (
    id SERIAL PRIMARY KEY,
    plate_number VARCHAR(20) NOT NULL UNIQUE,
    internal_code VARCHAR(30) NOT NULL UNIQUE,
    capacity INTEGER NOT NULL DEFAULT 40,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    route_id INTEGER REFERENCES routes(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_buses_plate_number ON buses(plate_number);
CREATE INDEX idx_buses_internal_code ON buses(internal_code);
CREATE INDEX idx_buses_route_id ON buses(route_id);

COMMENT ON TABLE buses IS 'Fleet vehicles assigned to routes';
COMMENT ON COLUMN buses.plate_number IS 'Vehicle license plate (unique)';
COMMENT ON COLUMN buses.internal_code IS 'Internal fleet code (unique)';
COMMENT ON COLUMN buses.route_id IS 'Assigned route (nullable for unassigned buses)';

-- Table: bus_locations
CREATE TABLE bus_locations (
    id SERIAL PRIMARY KEY,
    bus_id INTEGER NOT NULL REFERENCES buses(id) ON DELETE CASCADE,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    speed_kmh FLOAT NOT NULL DEFAULT 0.0,
    heading FLOAT NOT NULL DEFAULT 0.0,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bus_locations_bus_id ON bus_locations(bus_id);
CREATE INDEX idx_bus_locations_recorded_at ON bus_locations(recorded_at);
CREATE INDEX idx_bus_locations_bus_time ON bus_locations(bus_id, recorded_at DESC);

COMMENT ON TABLE bus_locations IS 'GPS position history for each bus';
COMMENT ON COLUMN bus_locations.speed_kmh IS 'Speed in kilometers per hour';
COMMENT ON COLUMN bus_locations.heading IS 'Direction in degrees (0-360)';
COMMENT ON COLUMN bus_locations.recorded_at IS 'Timestamp of GPS recording';

-- Table: eta_predictions
CREATE TABLE eta_predictions (
    id SERIAL PRIMARY KEY,
    bus_id INTEGER NOT NULL REFERENCES buses(id) ON DELETE CASCADE,
    stop_id INTEGER NOT NULL REFERENCES stops(id) ON DELETE CASCADE,
    eta_seconds INTEGER NOT NULL,
    distance_km FLOAT NOT NULL,
    congestion_factor FLOAT NOT NULL DEFAULT 1.0,
    time_factor FLOAT NOT NULL DEFAULT 1.0,
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_eta_predictions_bus_id ON eta_predictions(bus_id);
CREATE INDEX idx_eta_predictions_stop_id ON eta_predictions(stop_id);

COMMENT ON TABLE eta_predictions IS 'Calculated ETA predictions';
COMMENT ON COLUMN eta_predictions.eta_seconds IS 'Estimated time of arrival in seconds';
COMMENT ON COLUMN eta_predictions.distance_km IS 'Haversine distance to target stop in km';
COMMENT ON COLUMN eta_predictions.congestion_factor IS 'Congestion multiplier (1.0 = normal, 1.5 = peak)';
COMMENT ON COLUMN eta_predictions.time_factor IS 'Time-of-day multiplier (0.8 = night, 1.0 = normal)';

-- Table: alerts
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    bus_id INTEGER REFERENCES buses(id) ON DELETE CASCADE,
    route_id INTEGER REFERENCES routes(id) ON DELETE CASCADE,
    alert_type VARCHAR(30) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'LOW',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    latitude FLOAT,
    longitude FLOAT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    CONSTRAINT chk_alert_type CHECK (alert_type IN ('DELAY', 'CONGESTION', 'BUS_STOPPED', 'MAINTENANCE', 'ROUTE_CHANGE')),
    CONSTRAINT chk_severity CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
);

CREATE INDEX idx_alerts_bus_id ON alerts(bus_id);
CREATE INDEX idx_alerts_route_id ON alerts(route_id);
CREATE INDEX idx_alerts_alert_type ON alerts(alert_type);
CREATE INDEX idx_alerts_is_active ON alerts(is_active);

COMMENT ON TABLE alerts IS 'Operational alerts for buses and routes';
COMMENT ON COLUMN alerts.alert_type IS 'Type: DELAY, CONGESTION, BUS_STOPPED, MAINTENANCE, ROUTE_CHANGE';
COMMENT ON COLUMN alerts.severity IS 'Severity: LOW, MEDIUM, HIGH, CRITICAL';
