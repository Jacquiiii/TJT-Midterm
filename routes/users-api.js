const express = require('express');
const router  = express.Router();
const userQueries = require('../db/queries/users');

// gets user data from the database by leveraging query function getUsers
router.get('/', (req, res) => {
  userQueries.getUsers()
    .then(users => {
      res.json({ users });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;
