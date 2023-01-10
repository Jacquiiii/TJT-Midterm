$(document).ready(function () {

  // logout button click event
  $('.logout-button').on('click', (event) => {
    event.preventDefault();

    $.post('/logout').done((response) => {

      // if server sends back loginSuccess as false, login/register are displayed on the page
      if (!response.loginSuccess) {
        $('.header-right-logged-in').hide();
        $('.header-right').show();
      }
    });
  });

});
