const express = require('express');
const router = express.Router();
const db = require('../db/connection');


// receives post request to /change from client side click event for changing the category on a task
router.post('/', (req, res) => {
  const category = req.body.category;
  const id = Number(req.body.taskid);
  const value = [category, id];

  const changeQuery = `
  UPDATE tasks SET category = $1
  WHERE id = $2;
  `

  db.query(changeQuery, value)
    .then((result) => {
      res.json({status: 'success'});
    })
    .catch((err) => res.send(err));
})


module.exports = router;
