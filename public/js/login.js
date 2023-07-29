/*function validateLogin(username, password) {
    let valid = false;
    if (username == "admin@gmail.com" && password == "admin12345") {
        valid = true;
    }

    return valid;
}*/

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
    $('#form-login').on("submit", function(e) {
        let username = $('#username').val();
        let password = $('#password').val();

        //let validLogin = validateLogin(username, password);
        let validForm = validateForm(username, password);

        if (!validForm) {
            e.preventDefault();

            /*if (!validLogin) {
                $('#error-container').text('Incorrect username or password!');
            }*/

            if (!validForm) {
                showError('Please enter a username and password!');
            }
            return;
        }

        /*let formAction = $('#form-login').attr('action');
        window.location.href = formAction;*/
    });

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
    });

    $('#confirm_password').on("keyup", function() {
        if ($(this).val() != $('#password').val()) {
            $(this).addClass('form-input-error');
        } else {
            $(this).removeClass('form-input-error');
        }
    });
});