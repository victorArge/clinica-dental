-- Base de datos Clínica Dental
CREATE DATABASE clinica_dental;
\c clinica_dental;

-- Tabla Pacientes
CREATE TABLE pacientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    direccion TEXT,
    fecha_nacimiento DATE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado BOOLEAN DEFAULT TRUE
);

-- Tabla Médicos
CREATE TABLE medicos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    especialidad VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    matricula VARCHAR(50) UNIQUE NOT NULL,
    estado BOOLEAN DEFAULT TRUE
);

-- Tabla Citas
CREATE TABLE citas (
    id SERIAL PRIMARY KEY,
    paciente_id INTEGER REFERENCES pacientes(id) ON DELETE CASCADE,
    medico_id INTEGER REFERENCES medicos(id) ON DELETE CASCADE,
    fecha_hora TIMESTAMP NOT NULL,
    duracion_minutos INTEGER DEFAULT 30,
    motivo TEXT,
    estado VARCHAR(20) DEFAULT 'programada',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla Disponibilidad (horarios de médicos)
CREATE TABLE disponibilidad (
    id SERIAL PRIMARY KEY,
    medico_id INTEGER REFERENCES medicos(id) ON DELETE CASCADE,
    dia_semana INTEGER NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    estado BOOLEAN DEFAULT TRUE
);

-- Índices para mejor rendimiento
CREATE INDEX idx_citas_fecha ON citas(fecha_hora);
CREATE INDEX idx_citas_paciente ON citas(paciente_id);
CREATE INDEX idx_citas_medico ON citas(medico_id);
CREATE INDEX idx_disponibilidad_medico ON disponibilidad(medico_id);

-- Datos de prueba
INSERT INTO medicos (nombre, apellido, especialidad, telefono, email, matricula) VALUES
('Juan', 'Pérez', 'Ortodoncia', '555-1234', 'juan.perez@clinica.com', 'MAT-001'),
('María', 'García', 'Endodoncia', '555-5678', 'maria.garcia@clinica.com', 'MAT-002'),
('Carlos', 'López', 'Cirugía Oral', '555-9012', 'carlos.lopez@clinica.com', 'MAT-003');

INSERT INTO pacientes (nombre, apellido, telefono, email, direccion, fecha_nacimiento) VALUES
('Ana', 'Martínez', '555-1111', 'ana.martinez@email.com', 'Calle 123 #45-67', '1990-05-15'),
('Pedro', 'Rodríguez', '555-2222', 'pedro.rodriguez@email.com', 'Carrera 45 #12-34', '1985-08-22'),
('Laura', 'Sánchez', '555-3333', 'laura.sanchez@email.com', 'Avenida 78 #90-12', '1995-12-10');

-- Disponibilidad: 1=Lunes a 5=Viernes, 9am a 5pm
INSERT INTO disponibilidad (medico_id, dia_semana, hora_inicio, hora_fin) VALUES
(1, 1, '09:00', '17:00'),
(1, 2, '09:00', '17:00'),
(1, 3, '09:00', '17:00'),
(1, 4, '09:00', '17:00'),
(1, 5, '09:00', '17:00'),
(2, 1, '08:00', '16:00'),
(2, 2, '08:00', '16:00'),
(2, 3, '08:00', '16:00'),
(2, 4, '08:00', '16:00'),
(2, 5, '08:00', '16:00'),
(3, 2, '10:00', '18:00'),
(3, 4, '10:00', '18:00');
