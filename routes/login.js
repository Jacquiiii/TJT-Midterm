const express = require('express');
const router = express.Router();
const userEmailQueries = require('../db/queries/users');


// receives post request to /login from client side form submit event
router.post('/', (req, res) => {

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


module.exports = router;
