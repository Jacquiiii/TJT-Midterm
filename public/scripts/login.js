$(document).ready(function () {

  // toggles login form
  $('.login-button').on('click', function() {
    $(this).next('.login-content').slideToggle();
    $(this).toggleClass('active');
  })

  // toggles signup form
  $('.signup-button').on('click', function() {
    $(this).next('.signup-content').slideToggle();
    $(this).toggleClass('active');
  })


  // listens for login form submit event and posts data entered in email field
  $("#submit-login").on("submit", (event) => {
    event.preventDefault();

    const email = $(".email-input").val();

    $.post("/login", { email }, () => {
      $(".email-input").val("");
    });

  });

});
