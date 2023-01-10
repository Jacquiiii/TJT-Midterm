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


  // login form submit event that posts data entered in email/password fields
  $('#submit-login').on('submit', (event) => {
    event.preventDefault();
    const email = $('.email-input').val();
    const password = $('.password-input').val();

    $.post('/login', { email, password }, (response) => {

      // removes content in the email/password fields and slides the form back up after submit.
      $('.email-input').val('');
      $('.password-input').val('');
      $('.login-button').next('.login-content').slideToggle();

      // if server sends back loginSuccess as true, name and logout button are displayed on the page
      if (response.loginSuccess) {
        $('.user').text(response.data);
        $('.header-right').hide();
        $('.header-right-logged-in').show();
      }
    });
  });

});
