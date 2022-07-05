-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`

DROP TABLE IF EXISTS secret_users;
DROP TABLE IF EXISTS secrets;

CREATE TABLE secret_users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL
);

CREATE TABLE secrets (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  secret VARCHAR NOT NULL
);

INSERT INTO secrets (secret) VALUES 
('Marinette Dupain-Cheng is Ladybug'),
('Arien Agreste is Cat Noir')