\c users_db

-- Sección 1: Para crear nuevas tablas, no agregar ningun tipo de constraint
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL,
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
    id SERIAL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    categoria VARCHAR(255) NOT NULL,
    estado VARCHAR(255) NOT NULL,
    imagen_principal VARCHAR(255),
    imagenes_adicionales TEXT[]
);

CREATE TABLE IF NOT EXISTS vendedores (
    vendedor_id SERIAL,
    nombre_vendedor VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS ventas (
    id_venta SERIAL,
    vendedor_id INT,
    monto DECIMAL(10, 2) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    medio_pago VARCHAR(50),
    estado VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS pedidos (
    id_pedido SERIAL,
    usuario_id INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(50) DEFAULT 'pendiente',
    total DECIMAL(10, 2) NOT NULL,
    detalles JSONB,
    direccion_id INT
);

CREATE TABLE IF NOT EXISTS direcciones (
    id SERIAL,
    usuario_id INT,
    direccion_inicio TEXT,
    direccion_entrega TEXT
);

-- Sección 2: Constraints, aqui pueden agregar toda la estructura y relacion entre las tablas
ALTER TABLE usuarios ADD PRIMARY KEY (id);

ALTER TABLE productos ADD PRIMARY KEY (id);

ALTER TABLE vendedores ADD PRIMARY KEY (vendedor_id);

ALTER TABLE ventas ADD PRIMARY KEY (id_venta);
ALTER TABLE ventas ADD FOREIGN KEY (vendedor_id) REFERENCES vendedores (vendedor_id);

ALTER TABLE pedidos ADD PRIMARY KEY (id_pedido);
ALTER TABLE pedidos ADD FOREIGN KEY (usuario_id) REFERENCES usuarios (id);

ALTER TABLE direcciones ADD FOREIGN KEY (usuario_id) REFERENCES usuarios (id);

