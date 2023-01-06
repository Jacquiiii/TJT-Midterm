const db = require('../connection');

// retrieves all user data from the database
const getUsers = () => {
  return db.query('SELECT * FROM users;')
    .then(data => {
      return data.rows;
    });
};

// queries the database to find specific email. This is intended for the login functionality to work based on email only validation.
const getUserByEmail = (email) => {
  return db.query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((data) => {
      return data.rows[0];
    })
    .catch(err => console.log(err));
}

module.exports = { getUsers, getUserByEmail };
