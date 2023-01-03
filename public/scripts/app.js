// Client facing scripts here

$(document).ready(function () {

  console.log("document is ready");

  const escape = (str) => {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  const taskContent = $(".new-task-input")
  // const convertedFormData = taskContent.serialize();
  $(".new-task-input").on("submit", (event) => {
    console.log("onclick test");
    event.preventDefault();
    const formData = $(".new-task-input").val();
    $.post("/tasks", formData, (data) => {
      console.log("data from /post eventlisterner", data)
    });
  })
})
