const express = require('express');
const router = express.Router();
const taskQueries = require('../db/queries/tasks');

// gets task data from the database by leveraging query function getTasks
router.get('/', (req, res) => {
  taskQueries.getTasks()
    .then(tasks => {
      res.json({ tasks });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;
