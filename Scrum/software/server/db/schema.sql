\c users_db

CREATE TABLE IF NOT EXISTS usuarios(
	id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	dpi VARCHAR(32) NOT NULL,
	location VARCHAR(255) NOT NULL,
	profile_picture BYTEA,
	has_agreed_to_privacy_policy BOOLEAN NOT NULL,
	enable_2fa BOOLEAN DEFAULT FALSE
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
ALTER TABLE usuarios ADD COLUMN two_factor_code VARCHAR(6);
ALTER TABLE usuarios ADD COLUMN two_factor_expires_at TIMESTAMP;


