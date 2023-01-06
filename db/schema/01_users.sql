DROP TABLE IF EXISTS todos CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- not currently in use but could be used for future enhancements
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


