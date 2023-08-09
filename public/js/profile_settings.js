function showError(error_text) {
    let error_container = $('#error-container');

    if (error_text == '') {
        error_container.attr('data-error-status', 'normal');
        error_container.text(error_text);
        return;
    }

    error_container.attr('data-error-status', 'error');
    error_container.css('animation', 'shake ease-in-out 0.375s');
    setTimeout(function() {
        $('#error-container').css('animation', '');
    }, 500);
    error_container.text(error_text);
}

$(document).ready(function() {
    $('#profile_settings').on("submit", function(e) {
        let displayName = $('#display_name').val();
        let username = $('#username').val();
        let newPassword = $('#new_password').val();

        if (displayName.length == 0) {
            e.preventDefault();
            showError('Please enter a display name!');
        } else if (displayName.length > 16) {
            e.preventDefault();
            showError('Display name is too long!');
        }

        let pattern = "^(?=.{3,16}$)[a-zA-Z0-9_]+$";
        if (!username.match(pattern)) {
            e.preventDefault();

            if (username.length < 3) showError('Username is too short!');
            else if (username.length > 16) showError('Username is too long!');
            else if (username.indexOf(' ') >= 0) showError('Username cannot contain spaces!');
            else showError('Username can only contain alphanumeric characters and underscores!');
        }

        if (newPassword.length != 0 && newPassword.length < 8) {
            e.preventDefault();
            showError('Password should contain at least 8 characters!');
        }

        $.get('/checkUsername', {username: username}, function(result) {
            if (result.username == username) {
                e.preventDefault();
                showError('Username is already taken!');
            }
        });
    });

    $('#profile_settings #username').on("keyup", function() {
        let pattern = "^(?=.{3,16}$)[a-zA-Z0-9_]+$";
        let username = $(this).val();

        if (!username.match(pattern)) {
            $(this).addClass('form-input-error');
        } else {
            $(this).removeClass('form-input-error');
        }

        $.get('/checkUsernameAsync', {username: username}, function(result) {
            if (result.username == username) {
                $('#profile_settings #username').addClass('form-input-error');
                showError('Username is already taken!');
            } else {
                $('#profile_settings #username').removeClass('form-input-error');
                showError('');
            }
        });
    });

    $('#profile_settings #display_name').on("keyup", function() {
        let displayName = $(this).val();

        if (displayName.length == 0 || displayName.length > 16) {
            $(this).addClass('form-input-error');
        } else {
            $(this).removeClass('form-input-error');
        }
    });

    $('#profile_settings #new_password').on("keyup", function() {
        let password = $(this).val();

        if (password.length != 0 && password.length < 8) {
            $(this).addClass('form-input-error');
        } else {
            $(this).removeClass('form-input-error');
        }
    });
})