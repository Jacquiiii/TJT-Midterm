// Client facing scripts here

$(document).ready(function () {

  console.log("document is ready");

  const escape = (str) => {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  const $taskSection = $(".tasks-container");

  // const loadTasks = () => {
  //   $.get("/tasks", (data) => {
  //     console.log("data from loadTasks:", data);
  //     renderTasks(data);
  //   })
  // }

  const loadTasks = function() {

    $.get('/tasks', (tasks) => {
      renderTasks(tasks);
    });

  };

  // const renderTasks = (tasks) => {
  //   for (const task of tasks) {
  //     const $task = createTaskElement(task);
  //     $taskSection.prepend($task);
  //   }
  // }

  const renderTasks = function(tasks) {
    $('.unknown').empty();
    $('.watch').empty();
    $('.eat').empty();
    $('.buy').empty();
    $('.read').empty();

    // completed test
    $('.completed-container').empty();

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

      // completed test
      if (task.completed === true) {
        $('.completed-container').prepend($task);
      }
    }

  };

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
        <form method="POST" action="/delete">
          <input type="hidden" name="taskid" value="${task.id}"/>
          <button class="delete" type="submit">Delete</button>
        </form>
        </form>
        </button>

        <form method="POST" action="/complete" class=complete-form>
          <input type="hidden" name="taskid"/>
          <button class="complete-button" type="submit" value="${task.id}">Complete</button>
        </form>

        <button class="change-category">Change Category
        <form method="POST" action="/change">
        <label for="changecategory">update:</label>
        <select name="changecategory" onchange="this.form.submit();">
        <option label="" disabled selected></option>
        <option value="buy">Buy</option>
        <option value="read">Read</option>
        <option value="eat">Eat</option>
        <option value="watch">Watch</option>
        </select>
        <input type="hidden" name="taskid" value="${task.id}"></input>
      </div>
      </div>
      `;
    return $task;
  };

   //code to apply change of option chosen - not functional yet

  // const selectElement = document.querySelector('.change-category select');

  // selectElement.addEventListener('change', (event) => {

  //   const selectedValue = event.target.value;

  //   switch (selectedValue) {
  //     case 'Buy':
  //       // Code to handle the "Buy" option
  //       break;
  //     case 'Read':
  //       // Code to handle the "Read" option
  //       break;
  //     case 'Eat':
  //       // Code to handle the "Eat" option
  //       break;
  //     case 'Watch':
  //       // Code to handle the "Watch" option
  //       break;
  //   }
  // });


  // const taskContent = $(".new-task-input")
  // const convertedFormData = taskContent.serialize();
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
      console.log("data from /post eventlistener", data);
      $(".new-task-input").val("");
      loadTasks();
    });
  });


  // completed test
  $(document).on("click", ".complete-button", function (event) {
    console.log("complete onclick test");
    event.preventDefault();
    const formData = { taskid: event.target.value }

    $.post("/complete", formData, (data) => {
      console.log("complete data from /post eventlistener", data);
      loadTasks();
    });
  });

  loadTasks();

})
