-- ============================================================================
-- MetroLínea Inteligente - Seed Data
-- Coordenadas basadas en Bucaramanga, Colombia
-- ============================================================================

-- Admin user (password: admin123 - bcrypt hash)
INSERT INTO users (username, email, hashed_password, full_name, is_active, is_admin)
VALUES (
    'admin',
    'admin@metrolinea.com',
    '$2b$12$LJ3m4ys3Lk0TSwHjmz0VOeUtEdHdJOE3BjBQp3/7Vp1PfK4YHq3We',
    'Administrador MetroLinea',
    TRUE,
    TRUE
);

-- ============================================================================
-- ROUTES (4 rutas)
-- ============================================================================

INSERT INTO routes (id, name, code, description, color) VALUES
(1, 'Ruta Norte-Sur',       'RN-S', 'Corredor principal norte-sur de Bucaramanga',              '#EF4444'),
(2, 'Ruta Centro-Oriental', 'RC-O', 'Conecta el centro con el oriente de la ciudad',             '#3B82F6'),
(3, 'Ruta Universitaria',   'RU',   'Servicio universitario UdeA - Sotavento',                   '#10B981'),
(4, 'Ruta Metropolitana',   'RM',   'Ruta metropolitana interurbana',                            '#F59E0B');

-- ============================================================================
-- STOPS (19 paraderos en Bucaramanga)
-- ============================================================================

INSERT INTO stops (id, name, code, latitude, longitude, address) VALUES
(1,  'Terminal del Norte',          'TN01', 7.1450, -73.1215, 'Av. 33 #18-50'),
(2,  'Centro Comercial Santander', 'TN02', 7.1380, -73.1190, 'Cra 27 #35-20'),
(3,  'Parque Santander',           'TN03', 7.1310, -73.1230, 'Plaza de Bolivar'),
(4,  'Pilar Antioqueño',           'TN04', 7.1250, -73.1185, 'Av. Santander #32-15'),
(5,  'Centro Histórico',           'TN05', 7.1200, -73.1210, 'Cra 9 #32-16'),
(6,  'Catedral Basílica',          'TN06', 7.1170, -73.1250, 'Cra 9 #32-10'),
(7,  'Hospital Universitario',     'TN07', 7.1120, -73.1310, 'Calle 32 #12-50'),
(8,  'Universidad Industrial',     'TN08', 7.1060, -73.1340, 'Cra 27 #36-80'),
(9,  'Barrio Sotomayor',           'TN09', 7.1000, -73.1290, 'Av. Sotomayor'),
(10, 'La Flora',                   'TN10', 7.0940, -73.1240, 'Cra 30 #23-10'),
(11, 'Kenedy',                     'TN11', 7.0900, -73.1190, 'Av. Kenedy #5-20'),
(12, 'Terminal del Sur',           'TN12', 7.0850, -73.1150, 'Cra 25 #1-50'),
(13, 'Ciudadela Oriental',         'CO01', 7.1320, -73.1080, 'Av. Oriental #40-50'),
(14, 'La Concordia',               'CO02', 7.1280, -73.1130, 'Cra 15 #40-20'),
(15, 'San Alonso',                 'RU01', 7.1400, -73.1280, 'Cra 27 #42-10'),
(16, 'Universidad Autónoma',       'RU02', 7.1350, -73.1320, 'Cra 52 #60-30'),
(17, 'Sotavento',                  'RU03', 7.1300, -73.1370, 'Av. Sotavento'),
(18, 'Chipatá',                    'RM01', 7.0900, -73.1050, 'Km 2 Vía Girón'),
(19, 'Floridablanca',              'RM02', 7.0700, -73.0800, 'Autopista Floridablanca');

SELECT setval('stops_id_seq', 19);

-- ============================================================================
-- ROUTE_STOPS (asociaciones ruta-paradero con secuencia y distancia)
-- ============================================================================

-- Ruta Norte-Sur (12 paraderos)
INSERT INTO route_stops (route_id, stop_id, sequence, distance_from_start_km) VALUES
(1, 1,  1,  0.0),   -- Terminal del Norte
(1, 2,  2,  1.2),   -- Centro Comercial Santander
(1, 3,  3,  2.5),   -- Parque Santander
(1, 4,  4,  3.8),   -- Pilar Antioqueño
(1, 5,  5,  4.5),   -- Centro Histórico
(1, 6,  6,  5.1),   -- Catedral Basílica
(1, 7,  7,  6.0),   -- Hospital Universitario
(1, 8,  8,  7.2),   -- Universidad Industrial
(1, 9,  9,  8.5),   -- Barrio Sotomayor
(1, 10, 10, 9.8),   -- La Flora
(1, 11, 11, 10.5),  -- Kenedy
(1, 12, 12, 11.5);  -- Terminal del Sur

-- Ruta Centro-Oriental (5 paraderos)
INSERT INTO route_stops (route_id, stop_id, sequence, distance_from_start_km) VALUES
(2, 5,  1, 0.0),   -- Centro Histórico
(2, 13, 2, 1.5),   -- Ciudadela Oriental
(2, 14, 3, 2.3),   -- La Concordia
(2, 4,  4, 3.8),   -- Pilar Antioqueño
(2, 2,  5, 4.5);   -- Centro Comercial Santander

-- Ruta Universitaria (5 paraderos)
INSERT INTO route_stops (route_id, stop_id, sequence, distance_from_start_km) VALUES
(3, 15, 1, 0.0),   -- San Alonso
(3, 16, 2, 1.0),   -- Universidad Autónoma
(3, 17, 3, 2.0),   -- Sotavento
(3, 8,  4, 3.5),   -- Universidad Industrial
(3, 9,  5, 5.0);   -- Barrio Sotomayor

-- Ruta Metropolitana (5 paraderos)
INSERT INTO route_stops (route_id, stop_id, sequence, distance_from_start_km) VALUES
(4, 12, 1, 0.0),   -- Terminal del Sur
(4, 11, 2, 0.8),   -- Kenedy
(4, 10, 3, 2.0),   -- La Flora
(4, 18, 4, 4.0),   -- Chipatá
(4, 19, 5, 7.0);   -- Floridablanca

-- ============================================================================
-- BUSES (10 buses asignados a rutas)
-- ============================================================================

INSERT INTO buses (id, plate_number, internal_code, capacity, is_active, route_id) VALUES
(1,  'ABC-123', 'BUS-001', 45, TRUE, 1),  -- Ruta Norte-Sur
(2,  'DEF-456', 'BUS-002', 40, TRUE, 1),  -- Ruta Norte-Sur
(3,  'GHI-789', 'BUS-003', 40, TRUE, 1),  -- Ruta Norte-Sur
(4,  'JKL-012', 'BUS-004', 35, TRUE, 2),  -- Ruta Centro-Oriental
(5,  'MNO-345', 'BUS-005', 35, TRUE, 2),  -- Ruta Centro-Oriental
(6,  'PQR-678', 'BUS-006', 40, TRUE, 3),  -- Ruta Universitaria
(7,  'STU-901', 'BUS-007', 40, TRUE, 3),  -- Ruta Universitaria
(8,  'VWX-234', 'BUS-008', 50, TRUE, 4),  -- Ruta Metropolitana
(9,  'YZA-567', 'BUS-009', 50, TRUE, 4),  -- Ruta Metropolitana
(10, 'BCD-890', 'BUS-010', 45, TRUE, 1);  -- Ruta Norte-Sur

SELECT setval('buses_id_seq', 10);

-- ============================================================================
-- ALERTS (ejemplos de alertas operativas)
-- ============================================================================

INSERT INTO alerts (bus_id, route_id, alert_type, title, message, severity, is_active, latitude, longitude) VALUES
(1,  1, 'DELAY',        'Retraso Terminal Norte',        'Bus ABC-123 retrasado 10 min por tráfico',           'MEDIUM', TRUE,  7.1450, -73.1215),
(4,  2, 'CONGESTION',   'Congestión Centro',             'Tráfico pesado en Centro Histórico',                  'HIGH',   TRUE,  7.1200, -73.1210),
(8,  4, 'MAINTENANCE',  'Mantenimiento preventivo',      'Bus VWX-234 en mantenimiento programado',            'LOW',    FALSE, 7.0850, -73.1150),
(NULL, 1, 'ROUTE_CHANGE','Cambio de ruta temporal',       'Ruta Norte-Sur desviada por obras',                   'CRITICAL',TRUE, 7.1170, -73.1250);
