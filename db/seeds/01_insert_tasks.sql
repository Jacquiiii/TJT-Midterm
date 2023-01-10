INSERT INTO tasks (category, description, completed, creation_date, completion_date)
VALUES ('eat','Sushi', FALSE, NULL, NULL)
RETURNING *;

INSERT INTO tasks (category, description, completed, creation_date, completion_date)
VALUES ('read','Atomic Habits', FALSE, NULL, NULL)
RETURNING *;

-- INSERT INTO tasks (category, description, completed, creation_date, completion_date)
-- VALUES ('read','The 100', FALSE, NULL, NULL)
-- RETURNING *;

-- INSERT INTO tasks (category, description, completed, creation_date, completion_date)
-- VALUES ('buy','Headphones', TRUE, NULL, NULL)
-- RETURNING *;

-- INSERT INTO tasks (category, description, completed, creation_date, completion_date)
-- VALUES ('buy','Car', FALSE, NULL, NULL)
-- RETURNING *;

-- INSERT INTO tasks (category, description, completed, creation_date, completion_date)
-- VALUES ('buy','Watch', FALSE, NULL, NULL)
-- RETURNING *;
