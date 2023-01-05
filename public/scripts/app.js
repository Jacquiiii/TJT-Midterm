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

    for (const task of tasks.tasks) {
      const $task = createTaskElement(task);
      if (task.category === "watch") {
        $('.watch').prepend($task);
      }
      if (task.category === "eat") {
        $('.eat').prepend($task);
      }
      if (task.category === "buy") {
        $('.buy').prepend($task);
      }
      if (task.category === "read") {
        $('.read').prepend($task);
      }
      if (task.category === "unknown")
      $('.unknown').prepend($task);
    }

  };

  const createTaskElement = function(task) {

    const $task = `
      <div class="task">
      <div class="task-content">
        <li><input type="text" class="text" value="To-do: ${escape(task.description)}" readonly /></li>
        <li><input type="text" class="text" value="Category: ${escape(task.category)}" readonly /></li>
      </div>
      <div class="task-buttons">
        <button class="edit">Edit</button>
        <form method="POST" action="/delete">
          <input type="hidden" name="taskid" value="${task.id}"/>
          <button class="delete" type="submit">Delete</button>
        </form>
        <button class="change-category">Change Category
        <select>
          <option value=""> </option>
          <option value="Buy">Buy</option>
          <option value="Read"</option>
          <option value="Eat"</option>
          <option value="Watch"</option>
        </select>
        </button>
      </div>
      </div>
      `;
    return $task;
  };


  // const taskContent = $(".new-task-input")
  // const convertedFormData = taskContent.serialize();
  $(".new-task-input").on("submit", (event) => {
    console.log("onclick test");
    event.preventDefault();
    const formData = $(".new-task-input").val();

    if (!formData) {
      alert("Please wite a task!");
      return;
    }

    $.post("/tasks", formData, (data) => {
      console.log("data from /post eventlisterner", data);
      $(".new-task-input").val("");
      loadTasks();
    });
  });
  loadTasks();

})
