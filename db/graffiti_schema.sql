DROP TABLE IF EXISTS images;

DROP TABLE IF EXISTS publicGraffiti;
DROP TABLE IF EXISTS privateGraffiti;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS chat;

CREATE TABLE publicGraffiti (
  id SERIAL PRIMARY KEY,
  grid_block VARCHAR UNIQUE NOT NULL,
  imageURL TEXT
  );

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(30) UNIQUE NOT NULL,
  email VARCHAR(256) NOT NULL,
  hashed_password VARCHAR NOT NULL,
  walls VARCHAR[]
  );

CREATE TABLE privateGraffiti (
id SERIAL PRIMARY KEY,
owner VARCHAR REFERENCES users(username),
imageURL TEXT
);

CREATE TABLE chat (
  id SERIAL PRIMARY KEY,
  message VARCHAR (256)
);
