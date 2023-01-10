// future enhancements: error handling


/* ----------------------------- Helper functions ----------------------------- */

// escapes text to prevent cross site scripting when used
const escape = (str) => {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};


// places get request to obtain data from /tasks and uses the render tasks function to load them on the page
const loadTasks = function() {
  $.get('/tasks', (tasks) => {
    renderTasks(tasks);
  });
};


// renders all tasks on page when loaded or when task action is taken
const renderTasks = function(tasks) {

  // empties all containers
  $('.unknown').empty();
  $('.watch').empty();
  $('.eat').empty();
  $('.buy').empty();
  $('.read').empty();
  $('.completed-container').empty();

  // determines which container to prepend task to
  for (const task of tasks.tasks) {
    const $task = createTaskElement(task);
    if (task.category === "watch" && task.completed === false) {
      $('.watch').prepend($task);
    }
    if (task.category === "eat" && task.completed === false) {
      $('.eat').prepend($task);
    }
    if (task.category === "buy" && task.completed === false) {
      $('.buy').prepend($task);
    }
    if (task.category === "read" && task.completed === false) {
      $('.read').prepend($task);
    }
    if (task.category === "unknown" && task.completed === false) {
      $('.unknown').prepend($task);
    }
    if (task.completed === true) {
      $('.completed-container').prepend($task);
    }
  }

};


// takes in a task object and returns HTML for the task
const createTaskElement = function(task) {

  const $task = `
    <div class="task">
    <div class="task-content">
      <li><input type="text" class="text" value="To-do: ${escape(task.description)}" readonly /></li>
      <li><input type="text" class="text" value="Category: ${escape(task.category)}" readonly /></li>
      <input type="text" class="text" value="Completed status: ${escape(task.completed)}" hidden/>
    </div>

    <div class="task-buttons">

      <button class="edit">Edit</button>

      <form class="deletebutton">
        <input type="hidden" name="taskid" />
        <button class="delete" value="${task.id}" >Delete</button>
      </form>
      </form>
      </button>

      <form method="POST" action="/complete" class=complete-form>
        <input type="hidden" name="taskid"/>
        <button class="complete-button" id="complete-id" type="submit" value="${task.id}">Complete</button>
      </form>

      <button class="change-category">Change Category
      <form class="changeform">
      <label for="changecategory">update:</label>
        <select class="changebutton" name="changecategory">
          <option label="" disabled selected></option>
          <option value="buy" data-other-value="${task.id}">Buy</option>
          <option value="read" data-other-value="${task.id}">Read</option>
          <option value="eat" data-other-value="${task.id}">Eat</option>
          <option value="watch" data-other-value="${task.id}">Watch</option>
        </select>
      <input type="hidden" name="taskid" value="${task.id}"></input>
      </button>

    </div>
    </div>
    `;
  return $task;
};


/* ---------------- Task related code that runs when doc is ready ------------- */


$(document).ready(function () {
  // for troubleshooting purposes, console log to remain in code
  console.log("document is ready");

  // click event for delete button
  $(document).on("click", ".delete", function (event) {
    event.preventDefault();
    const formData = { taskid: event.target.value }

    $.post("/delete", formData, (data) => {
      loadTasks();
    });
  });


  // click event for complete button
  $(document).on("click", ".complete-button", function (event) {
    event.preventDefault();
    const formData = { taskid: event.target.value }

    $.post("/complete", formData, (data) => {
      loadTasks();
    });
  });


  // click event for change category button
  $(document).on("change", ".changebutton", function (event) {
    event.preventDefault();

    const category = event.target.value;
    const taskIdVal = $(event.target).find(':selected').data('otherValue');
    const formData = { category: category, taskid: taskIdVal };

    $.post("/change", formData, (data) => {
      console.log("change data from /post eventlistener", data);
      loadTasks();
    });
  });


  // submit event for task submission
  $(".new-task-form-data").on("submit", function (event) {
    console.log("onclick test");
    event.preventDefault();
    const formData = $(this).serialize();
    const text = $(".new-task-input").val();

    if (!text) {
      alert("Please write a task!");
      return;
    }

    $.post("/tasks", formData, (data) => {
      $(".new-task-input").val("");
      loadTasks();
    });
  });


  // loads tasks when page is loaded
  loadTasks();

});
