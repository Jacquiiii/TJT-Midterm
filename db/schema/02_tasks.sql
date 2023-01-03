DROP TABLE IF EXISTS tasks CASCADE;

-- CREATE TABLE tasks (
--   id SERIAL PRIMARY KEY NOT NULL,
--   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
--   username VARCHAR(255) NOT NULL,
--   password VARCHAR(255) NOT NULL,
--   email VARCHAR(255) NOT NULL,
--   first_name VARCHAR(255) NOT NULL,
--   last_name VARCHAR(255) NOT NULL,
--   category VARCHAR(255),
--   description TEXT NOT NULL,
--   completed BOOLEAN DEFAULT FALSE,
--   creation_date TIMESTAMP,
--   completion_date TIMESTAMP

-- );

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  username VARCHAR(255),
  password VARCHAR(255),
  email VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  category VARCHAR(255),
  description TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  creation_date TIMESTAMP,
  completion_date TIMESTAMP
);

