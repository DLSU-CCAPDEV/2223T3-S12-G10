function validateLogin(username, password) {
    let valid = false;
    if (username == "admin@gmail.com" && password == "admin12345") {
        valid = true;
    }

    return valid;
}

$(document).ready(function() {
    $('#form-login').on("submit", function(e) {
        let username = $('#username').val();
        let password = $('#password').val();

        let validLogin = validateLogin(username, password);
        let validForm = validateForm(username, password);

        if (!validLogin || !validForm) {
            $('#error-container').attr('data-error-status', 'error');
            $('#error-container').css('animation', 'shake ease-in-out 0.375s');
            e.preventDefault();
            setTimeout(function() {
                $('#error-container').css('animation', '');
            }, 500);

            if (!validLogin) {
                $('#error-container').text('Incorrect username or password!');
            }

            if (!validForm) {
                $('#error-container').text('Please enter a username and password!');
            }
            return;
        }

        let formAction = $('#form-login').attr('action');
        window.location.href = formAction;
    });
});