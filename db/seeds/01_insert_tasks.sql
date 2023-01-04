-- INSERT INTO tasks (category, description, completed, creation_date, completion_date) VALUES
-- (1,'buy', 'Milk', FALSE, NULL, NULL),
-- (1,'read', 'The 100', FALSE, NULL, NULL),
-- (1,'watch','The Godfather', FALSE, NULL, NULL),
-- (1,'eat','Pizza', FALSE, NULL, NULL),
-- (2,'buy', 'Eggs', FALSE, NULL, NULL),
-- (2,'read', 'To Kill a Mockingbird', FALSE, NULL, NULL),
-- (2,'watch','The Dark Knight', FALSE, NULL, NULL),
-- (2,'eat','Sushi', FALSE, NULL, NULL);

INSERT INTO tasks (category, description, completed, creation_date, completion_date)
VALUES ('watch','The Dark Knight', FALSE, NULL, NULL)
RETURNING *;

INSERT INTO tasks (category, description, completed, creation_date, completion_date)
VALUES ('eat','Sushi', FALSE, NULL, NULL)
RETURNING *;

INSERT INTO tasks (category, description, completed, creation_date, completion_date)
VALUES ('read','Atomic Habits', FALSE, NULL, NULL)
RETURNING *;

INSERT INTO tasks (category, description, completed, creation_date, completion_date)
VALUES ('buy','Headphones', FALSE, NULL, NULL)
RETURNING *;


--Example data that can be added
-- Buy:
-- Milk
-- Bread
-- Eggs
-- Read:
-- "The 100"
-- "To Kill a Mockingbird"
-- "Rose Red"
-- Eat:
-- Pizza
-- Chinese food
-- Sushi
-- Watch:
-- "The Shawshank Redemption"
-- "The Godfather"
-- "The Dark Knight"
