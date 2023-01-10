/*-------------------- Require and web server config code ----------------------*/


// load .env data into process.env
require('dotenv').config();

const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const PORT = process.env.PORT || 8080;
const app = express();
const cookieParser = require('cookie-parser');

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


/*--------------------------------- Route code ---------------------------------*/


// renders main page for single page application
app.get('/', (req, res) => {
  res.render('index');
});

// user data route
const userApiRoute = require('./routes/users-api');
app.use('/api/users', userApiRoute);

// task route
const tasksRoutes = require('./routes/tasks');
app.use('/tasks', tasksRoutes);

// delete task route
const deleteRoute = require('./routes/delete');
app.use('/delete', deleteRoute);

// change task route
const changeRoute = require('./routes/change');
app.use('/change', changeRoute);

// complete task route
const completeRoute = require('./routes/complete');
app.use('/complete', completeRoute);

// login route
const loginRoute = require('./routes/login');
app.use('/login', loginRoute);

// logout route - not working
const logoutRoute = require('./routes/logout');
app.use('/logout', logoutRoute);


/*---------------------------- Server listen code ------------------------------*/


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

