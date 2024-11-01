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
    imagenes_adicionales TEXT[],
    peso DECIMAL(10,2),
    dimensiones VARCHAR(50)
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
    direccion_id INT,
    costo_envio DECIMAL(10,2),
    tiempo_estimado_entrega TIMESTAMP,
    estado_envio VARCHAR DEFAULT 'En proceso...',
    devolucion BOOLEAN DEFAULT false,
    opcion_envio VARCHAR(50)

);

CREATE TABLE IF NOT EXISTS direcciones (
    id SERIAL,
    usuario_id INT,
    direccion_inicio TEXT,
    direccion_entrega TEXT
);

CREATE TABLE IF NOT EXISTS envios (
    id_envio SERIAL,
    pedido_id INT NOT NULL,
    proveedor_envio VARCHAR(64) NOT NULL,
    numero_rastreo VARCHAR(32),
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_envio VARCHAR(50) DEFAULT 'En tránsito'
);

CREATE TABLE IF NOT EXISTS metodos_pago (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo_metodo VARCHAR(50) NOT NULL, -- Ej: PayPal, Transferencia, Pago contra entrega
    detalles JSONB -- Detalles del método (ej. datos bancarios, cuenta PayPal)
);




CREATE TABLE IF NOT EXISTS calificaciones (
    id SERIAL PRIMARY KEY,
    producto_id INT NOT NULL,
    usuario_id INT NOT NULL,
    calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
    comentario TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
);



CREATE TABLE cupones (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,     
    descuento DECIMAL(5, 2) NOT NULL,       
    producto_id INT NOT NULL,               
    fecha_expiracion DATE NOT NULL,         
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);



-- Sección 2: Constraints, aquí pueden agregar toda la estructura y relación entre las tablas
ALTER TABLE usuarios ADD PRIMARY KEY (id);

ALTER TABLE productos ADD COLUMN usuario_id INT;
ALTER TABLE productos ADD PRIMARY KEY (id);
ALTER TABLE productos ADD CONSTRAINT fk_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE;

ALTER TABLE vendedores ADD PRIMARY KEY (vendedor_id);
ALTER TABLE envios ADD PRIMARY KEY (id_envio);

ALTER TABLE ventas ADD PRIMARY KEY (id_venta);
ALTER TABLE ventas ADD FOREIGN KEY (vendedor_id) REFERENCES vendedores (vendedor_id);

ALTER TABLE direcciones ADD PRIMARY KEY (id);
ALTER TABLE pedidos ADD PRIMARY KEY (id_pedido);
ALTER TABLE pedidos ADD FOREIGN KEY (usuario_id) REFERENCES usuarios (id);
ALTER TABLE pedidos ADD FOREIGN KEY (direccion_id) REFERENCES direcciones (id);

ALTER TABLE direcciones ADD FOREIGN KEY (usuario_id) REFERENCES usuarios (id);
ALTER TABLE envios ADD FOREIGN KEY (pedido_id) REFERENCES pedidos (id_pedido);

