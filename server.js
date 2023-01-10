// future enhancements: move routes into separate files, potentially utilize cookies in other scenarios, secure login route that validates password and not only email


/*-------------------- Require and web server config code ----------------------*/


// load .env data into process.env
require('dotenv').config();

const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 8080;
const app = express();
const db = require('./db/connection');

app.set('view engine', 'ejs');
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
app.use(cookieParser());

const { categoryCheck, quickstart } = require('./api.js');
const userEmailQueries = require('./db/queries/users');
const userApiRoutes = require('./routes/users-api');
app.use('/api/users', userApiRoutes); // displays users from database
const tasksRoutes = require('./routes/tasks');
app.use('/tasks', tasksRoutes); // displays tasks from database


/*-------------- Route code (see routes folder for other routes) ---------------*/


// renders main page for single page application
app.get('/', (req, res) => {
  res.render('index');
});


// receives post request to /tasks from client side form submit event for creating a task
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

        const values = [category, req.body.tasktext];
        const queryString = `
          INSERT INTO tasks (category, description)
          VALUES ($1, $2)
          RETURNING *;
          `;

        db.query(queryString, values)
          .then((result) => {
            res.json({status: 'success'}); // replaced previous redirect
          })
          .catch((err) => res.send(err));
        })

      .catch((err) => res.send(err));
  }

});


// receives post request to /delete from client side click event for deleting a task
app.post('/delete', function(req, res) {
  const value = [req.body.taskid]
  const deleteQuery = `
  DELETE FROM tasks WHERE id = $1;
  `

  db.query(deleteQuery, value)
  .then((result) => {
    console.log(result.rows[0]);
    res.json({status: 'success'}); // replaced previous redirect
  })
  .catch((err) => res.send(err));
})


// receives post request to /change from client side click event for changing the category on a task
app.post('/change', (req, res) => {
  const value = [req.body.category, req.body.taskid];
  const changeQuery = `
  UPDATE tasks SET category = $1
  WHERE id = $2;
  `

  db.query(changeQuery, value)
    .then((result) => {
      console.log(result.rows[0]);
      res.json({status: 'success'}); // replaced previous redirect
    })
    .catch((err) => res.send(err));
})


// receives post request to /complete from client side click event for completing a task
app.post('/complete', function(req, res) {
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


// receives post request to /login from client side form submit event
app.post('/login', (req, res) => {

  // validation done only by checking email agaist user in database
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


// receives post request to /logout from client side click event
app.post('/logout', (req, res) => {
  res.clearCookie('email');
  res.send({ message: 'Logout', loginSuccess: false });
});


/*---------------------------- Server listen code ------------------------------*/


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

