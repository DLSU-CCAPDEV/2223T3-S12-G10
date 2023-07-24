function validateForm(...forms) {
    let valid = true;
    forms.forEach(form => {
        if (!form.trim().length)
            valid = false;
            return valid;
    });
    return valid;
}
//This file will largely be for backend purposes, most $.get will be here
$(document).ready(function(){
    //empty for now
    $('#btn-post-form').click(function () {
        const post_title = $('#postTitle').val();
        const post_content = $('#postContent').val();
        const post_tags_form = $('#postTags').val();

        console.log('Backend postTitle:' + post_title);

        if (!validateForm(post_title, post_content, post_tags_form)) return;
        console.log('Btn Successful!');
        $('#modal-question').modal('hide');
        //$.get('/');
    });

    $('#submit-register').click(function () {
        //for signing up and creating users
        const username = $('#username').val();
        const password = $('#password').val();
        const confirmpassword = $('#confirm_passowrd').val();

        if (password !== confirm_password) {
            password_error.sinnerHTML = "Passwords do not match.";
            return;
        } 

        $.post('/register');
    });

    $('#cancel-register').click(function () {
        //reset field values
        $('#username').val('');
        $('#password').val('');
        $('#confirm_password').val('');
    });

    $('#postSearch').keydown(function (event) {
        if(event.key == "Enter") {
            // $.get('/search/' + $('#postSearch').val());
            $.post('/search/' + $('#postSearch').val());
        }
    });

    $('#btn_comment_send').click(function (req, res) {
        console.log("Commenting......")
        console.log('Text Area data: ' + $('#addcommenttextarea').val());
        console.log('Current Page url' + $(location).attr('href'));
        var url = $(location).attr('href');

        //parse the URL
        var parsedURL = url.split('/');
        console.log(parsedURL);
        var comment = $('#addcommenttextarea').val();
        var passdata = {
            Body: comment,
            postID: parsedURL[4]
        };

        $.post('/post/postComment', passdata);
    });
});