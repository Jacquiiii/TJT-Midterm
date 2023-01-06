// object where logged in user data can be stored
let user = {};

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
  $('#submit-login').on('submit', (event) => {
    event.preventDefault();
    const email = $('.email-input').val();
    const password = $('.password-input').val();

    $.post('/login', { email, password }, (response) => {

      // removes content in the email/password fields and slides the form back up after submit
      $('.email-input').val('');
      $('.password-input').val('');
      $('.login-button').next('.login-content').slideToggle();

      // adds email to user object so it can be used to display email when logged in
      user.email = email;

      // if server sends back loginSuccess as true, name and logout button are displayed on the page
      if (response.loginSuccess) {
        $('.user').text(response.data);
        $('.header-right').hide();
        $('.header-right-logged-in').show();
      }
    });

  });


  // listens for logout button submit event
  $('.logout-button').on('click', (event) => {
    event.preventDefault();

    $.post('/logout').done((response) => {
      // if server sends back loginSuccess as false, login/register are displayed on the page
      if (!response.loginSuccess) {
        // $('.user').text('');
        $('.header-right-logged-in').hide();
        $('.header-right').show();
        user = {};
      }
    });
  });

});
