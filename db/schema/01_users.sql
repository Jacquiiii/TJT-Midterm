-- Drop and recreate Users table (Example)
CREATE TABLE todos (
  id serial PRIMARY KEY,
  task varchar(255) NOT NULL,
  category varchar(255) NOT NULL,
  completed boolean DEFAULT false
);
