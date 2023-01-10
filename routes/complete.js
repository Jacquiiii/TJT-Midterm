const express = require('express');
const router = express.Router();
const db = require('../db/connection');


// receives post request to /complete from client side click event for completing a task
router.post('/', function(req, res) {
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


module.exports = router;
