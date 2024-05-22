\c users_db

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    dpi VARCHAR(32) NOT NULL,
    location VARCHAR(255) NOT NULL,
    profile_picture BYTEA,
    has_agreed_to_privacy_policy BOOLEAN NOT NULL,
    enable_2fa BOOLEAN DEFAULT FALSE,
    two_factor_code VARCHAR(6),
    two_factor_expires_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    categoria VARCHAR(255) NOT NULL,
    estado VARCHAR(255) NOT NULL,
    imagen_principal VARCHAR(255),
    imagenes_adicionales TEXT[]
);

CREATE TABLE IF NOT EXISTS vendedores (
    vendedor_id SERIAL PRIMARY KEY,
    nombre_vendedor VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS ventas (
    id_venta SERIAL PRIMARY KEY,
    vendedor_id INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    medio_pago VARCHAR(50),
    estado VARCHAR(50)
    -- FOREIGN KEY (vendedor_id) REFERENCES vendedores (vendedor_id)
);

CREATE TABLE IF NOT EXISTS pedidos (
    id_pedido SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(50) DEFAULT 'pendiente',
    total DECIMAL(10, 2) NOT NULL,
    detalles JSONB
    -- FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
);

