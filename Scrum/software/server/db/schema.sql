
CREATE DATABASE users_database;

\c users_database;

CREATE TABLE IF NOT EXISTS usuarios (
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
