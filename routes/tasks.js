const express = require('express');
const router = express.Router();
const taskQueries = require('../db/queries/tasks');
const db = require('../db/connection');
const { assignCategoryWithoutAPI, assignCategoryWithAPI } = require('../lib/api.js');


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


// receives post request to /tasks from client side form submit event for creating a task
router.post('/', function(req, res) {

  // synchronous check without api checks if input includes certain words matching specific categories and adds to database if one matches
  const firstCheck = assignCategoryWithoutAPI(req.body.tasktext);

  if (firstCheck) {
    const category = firstCheck;
    const values = [category, req.body.tasktext];
    const queryString = `
      INSERT INTO tasks (category, description)
      VALUES ($1, $2)
      RETURNING *;
      `;

    db.query(queryString, values)
      .then((result) => {
        console.log(result.rows[0]);
        res.json({status: 'success'}); // replaced previous redirect
      })
      .catch((err) => res.send(err));
  }

  // asynch check calls Google Natural Language API and checks input against response data to determine if it could fall into one of those categories
  else {
    assignCategoryWithAPI(req.body.tasktext)
      .then((result) => {
        let category = result;

        if (category === undefined) {
          category = 'unknown';
        }

        const values = [category, req.body.tasktext];
        const queryString = `
          INSERT INTO tasks (category, description)
          VALUES ($1, $2)
          RETURNING *;
          `;

        db.query(queryString, values)
          .then((result) => {
            res.json({status: 'success'}); // replaced previous redirect
          })
          .catch((err) => res.send(err));
        })

      .catch((err) => res.send(err));
  }

});


module.exports = router;
