const express = require('express');
const router  = express.Router();
const userEmailQueries = require('../db/queries/users');

// receives email form data from login submit event and checks it against the database
router.post('/', (req, res) => {

  console.log('req.body', req.body);

  userEmailQueries.getUserByEmail(req.body.email)
  .then(data => {
    console.log(data);
    res.json({ data });
  })
  .catch(err => console.log(err));

});

module.exports = router;

// test data: kira@caribbean.ca, JarOfDirt

// router.get('/login/:id', (req, res) => {
//   res.cookie('user_id', req.params.id);
//   res.redirect('/');
// });

