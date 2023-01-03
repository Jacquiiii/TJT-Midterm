-- Drop and recreate Users table (Example)
CREATE TABLE todos (
  id serial PRIMARY KEY,
  task varchar(255) NOT NULL,
  category varchar(255) NOT NULL,
  completed boolean DEFAULT false
);


CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL
);
