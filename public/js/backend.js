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
        const post_title = $('#post-title-form').val();
        const post_content = $('#post-content-form').val();
        const post_tags_form = $('#post-tags-form').val();

        console.log('Backend postTitle:' + post_title);

        if (!validateForm(post_title, post_content, post_tags_form)) return;
        console.log('Btn Successful!');
        $('#modal-question').modal('hide');
        $.get('/getPosts');
    });

    $('#postSearch').keydown(function (event) {
        if(event.key == "Enter") {
            // $.get('/search/' + $('#postSearch').val());
            $.post('/search/' + $('#postSearch').val());
        }
    });
});