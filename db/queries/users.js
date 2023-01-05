const db = require('../connection');

const getUsers = () => {
  return db.query('SELECT * FROM users;')
    .then(data => {
      return data.rows;
    });
};

// queries database to find specific email
const getUserByEmail = (email) => {
  return db.query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((data) => {
      return data.rows[0];
    })
    .catch(err => console.log(err));
}

module.exports = { getUsers, getUserByEmail };
