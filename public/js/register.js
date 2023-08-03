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
            showError('Please enter a username and password!');
        } else if (password != confirm_password) {
            e.preventDefault();
            showError('Passwords do not match!');
        } else if (password.length < 8) {
            e.preventDefault();
            showError('Password should contain at least 8 characters!');
        }

        let pattern = "^(?=.{3,16}$)[a-zA-Z0-9_]+$";
        if (!username.match(pattern)) {
            e.preventDefault();

            if (username.length < 3) showError('Username is too short!');
            else if (username.length > 16) showError('Username is too long!');
            else if (username.indexOf(' ') >= 0) showError('Username cannot contain spaces!');
            else showError('Username can only contain\nalphanumeric characters and underscores!');
        }
    });

    $('#confirm_password').on("keyup", function() {
        if ($(this).val() != $('#password').val()) {
            $(this).addClass('form-input-error');
        } else {
            $(this).removeClass('form-input-error');
        }
    });

    $('#form-register #username').on("keyup", function() {
        let pattern = "^(?=.{3,16}$)[a-zA-Z0-9_]+$";
        let username = $(this).val();

        if (!username.match(pattern)) {
            $(this).addClass('form-input-error');
        } else {
            $(this).removeClass('form-input-error');
        }
    });
});
