// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser'); // delete if we aren't going to use and do npm uninstall cookie-parser

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
app.use(cookieParser()); // delete if we aren't going to use

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
  // console.log("delete test!");
  console.log("delete req!", req.body);
  // console.log("delete res!", res);

  const value = [req.body.taskid]
  const deleteQuery = `
  DELETE FROM tasks WHERE id = $1;
  `
  db.query(deleteQuery, value)
  // .then((result) => {
  //   // res.json({status: 'success'});
  //   res.redirect("/");
  // })
  .then((result) => {
    console.log(result.rows[0]);
    res.json({status: 'success'}); // replaced previous redirect
  })
  .catch((err) => res.send(err));
})


app.post('/change', (req, res) => {
  console.log("testing req.body", req.body);
  const value = [req.body.category, req.body.taskid];
  const changeQuery = `
  UPDATE tasks SET category = $1
  WHERE id = $2;
  `
  db.query(changeQuery, value)
    // .then((result) => {
    //   res.redirect("/");
    // })
    .then((result) => {
      console.log(result.rows[0]);
      res.json({status: 'success'}); // replaced previous redirect
    })
    .catch((err) => res.send(err));
})

// test for complete task
app.post('/complete', function(req, res) {

  console.log("testing' req.body", req.body);
  const value = [true, req.body.taskid];
  const completeQuery = `
  UPDATE tasks SET completed = $1
  WHERE id = $2;
  `

  db.query(completeQuery, value)
    .then((result) => {
      res.json({status: 'success'}); // replaced previous redirect
    })
    .catch((err) => res.send(err));
})


// receives post request to /login from server side
app.post('/login', (req, res) => {
  userEmailQueries.getUserByEmail(req.body.email)
    .then(data => {

      if (data.email === req.body.email) {
        // Set a cookie with the user's email
        res.cookie('email', req.body.email, { maxAge: 900000, httpOnly: true });
        // Send a response to the client
        res.json({ data: data.first_name, loginSuccess: true });

      } else {
        res.send({ message: 'Email does not exist', loginSuccess: false });
      }

    })
    .catch((err) => console.log(err));
});


// receives post requst to /logout from server side
app.post('/logout', (req, res) => {
  res.clearCookie('email');
  res.send({ message: 'Logout', loginSuccess: false });
});


app.post('/tasks', function(req, res) {

  console.log(req.body);
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
        res.json({status: 'success'}); // replaced previous redirect
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
            res.json({status: 'success'}); // replaced previous redirect
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

