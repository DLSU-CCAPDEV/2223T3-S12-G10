function showError(error_text) {
    let error_container = $('#error-container');
    error_container.attr('data-error-status', 'error');
    error_container.css('animation', 'shake ease-in-out 0.375s');
    setTimeout(function() {
        $('#error-container').css('animation', '');
    }, 500);
    error_container.text(error_text);
}


$(document).ready(function() {
  
    $('#form-register').on("submit", function(e) {
        let username = $('#username').val();
        let password = $('#password').val();
        let confirm_password = $('#confirm_password').val();

        if (!validateForm(username, password, confirm_password)) {
            e.preventDefault();
            showError('Please enter a username and password!1');
        } else if (password != confirm_password) {
            e.preventDefault();
            showError('Passwords do not match!');
        } else if (password.length < 8) {
            e.preventDefault();
            showError('Password should contain at least 8 characters!');
        }
    });

    $('#confirm_password').on("keyup", function() {
        if ($(this).val() != $('#password').val()) {
            $(this).addClass('form-input-error');
        } else {
            $(this).removeClass('form-input-error');
        }
    });
});
