// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');

const PORT = process.env.PORT || 8080;
const app = express();
const db = require('./db/connection');

app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static('public'));

const { categoryCheck, quickstart } = require('./api.js');
const userEmailQueries = require('./db/queries/users');

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const userApiRoutes = require('./routes/users-api');
const widgetApiRoutes = require('./routes/widgets-api');
const usersRoutes = require('./routes/users');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/api/users', userApiRoutes);
app.use('/api/widgets', widgetApiRoutes);
app.use('/users', usersRoutes);
// Note: mount other resources here, using the same pattern above

// displays tasks from database
const tasksRoutes = require('./routes/tasks');
app.use('/tasks', tasksRoutes);

app.get('/', (req, res) => {
  res.render('index');
});



// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

// working on reroutes... testing
// const router = require("./routes/tasks");
// app.use("/tasks", router);
// app.post("/tasks", (req, res) => {
//   const taskFormContent = req.body.tasktext;
//   console.log("testing req.body", req.body);
//   // console.log("testing res", res);
// })


app.post('/delete', function(req, res) {
  console.log("delete test!");
  console.log("delete req!", req.body);
  // console.log("delete res!", res);
  const value = [req.body.taskid]
  const deleteQuery = `
  DELETE FROM tasks WHERE id = $1;
  `
  db.query(deleteQuery, value)
  .then((result) => {
    res.redirect("/");
  })
  .catch((err) => res.send(err));
})


// receives email form data from login submit event (post request on client side)and checks it against the database
app.post('/login', (req, res) => {

  userEmailQueries.getUserByEmail(req.body.email)
    .then(data => {
      // If the email exists, show a greeting message with the user's name, else send error message
      if (data.email === req.body.email) {
        console.log('email is correct!');
        res.send(`Hello, ${data.name}! You are now logged in.`);
      } else {
        res.status(404).send('Email does not exist');
      }
    })
    .catch((err) => console.log(err));

});


app.post('/tasks', function(req, res) {

  // synchronous check without api checks if input includes certain words matching specific categories and adds to database if one matches
  const firstCheck = categoryCheck(req.body.tasktext);

  if (firstCheck) {
    const category = firstCheck;
    const values = [category, req.body.tasktext];
    const queryString = `
      INSERT INTO tasks (category, description)
      VALUES ($1, $2)
      RETURNING *;
      `;

    db.query(queryString, values)
      .then((result) => {
        console.log(result.rows[0]);
        res.redirect("/");
      })
      .catch((err) => res.send(err));
  }

  // asynch check calls Google Natural Language API and checks input against response data to determine if it could fall into one of those categories
  else {
    quickstart(req.body.tasktext)
      .then((result) => {
        let category = result;

        if (category === undefined) {
          category = 'unknown';
        }

        console.log('new test:', category);
        const values = [category, req.body.tasktext];
        const queryString = `
          INSERT INTO tasks (category, description)
          VALUES ($1, $2)
          RETURNING *;
          `;

        db.query(queryString, values)
          .then((result) => {
            console.log(result.rows[0]);
            res.redirect("/");
          })
          .catch((err) => res.send(err));
        })
        .catch((err) => res.send(err));
  }

});

// previous version of the above without category checks (remove when project is ready)
// app.post('/tasks', function(req, res) {
//   const category = 'unknown';
//   const values = [category, req.body.tasktext];
//   const queryString = `
//     INSERT INTO tasks (category, description)
//     VALUES ($1, $2)
//     RETURNING *;
//     `;
//   db.query(queryString, values)
//     .then((result) => {
//       console.log(result.rows[0])
//       res.redirect("/")
//     })
//     .catch((err) => res.send(err));
// });


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

