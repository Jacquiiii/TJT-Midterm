const express = require('express');
const router = express.Router();


// receives post request to /logout from client side click event - not working
router.post('/logout', (req, res) => {

  res.clearCookie('name');
  res.send({ message: 'Logout', loginSuccess: false });

});


module.exports = router;
