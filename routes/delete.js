const express = require('express');
const router = express.Router();
const db = require('../db/connection');


// receives post request to /delete from client side click event for deleting a task
router.post('/', function(req, res) {
  const value = [req.body.taskid]
  const deleteQuery = `
  DELETE FROM tasks WHERE id = $1;
  `

  db.query(deleteQuery, value)
  .then((result) => {
    res.json({status: 'success'});
  })
  .catch((err) => res.send(err));
})


module.exports = router;
