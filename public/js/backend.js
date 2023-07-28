function validateForm(...forms) {
    let valid = true;
    forms.forEach(form => {
        if (!form.trim().length)
            valid = false;
            return valid;
    });
    return valid;
}

function handleReplies(e) {
    console.log("Reply Test");

    //let replybtn = $(e.currentTarget).parent();
    let replybtn = e.target.closest('.comment-container');
    console.log(replybtn);
    //check if it has a certain class that appears iff reply has been pressed once
    if (replybtn.classList.contains('active-reply')) {
        //do nothing
        console.log("Active reply")
    } else {
        //reply is active, makes it so that clicking reply doesn't create
        //another textbox
        replybtn.classList.add('active-reply');
        //create the textbox
        let inputbox_container = document.createElement("div");
        inputbox_container.classList.add("inputbox-container");
        inputbox_container.classList.add("mt-3");

        let inputbox = document.createElement("input");
        inputbox.classList.add("form-control", "replybox");
        inputbox.setAttribute("type", "text");
        inputbox.setAttribute("placeholder", "Type here …");
        
        //get unique reply id
        let replyid = Date.now();
        inputbox.setAttribute("id", replyid)
        //create a container for the reply controls
        let inputbox_controls = document.createElement('div');
        inputbox_controls.classList.add('inputbox-controls');

        //add a save and cancel button
        let inputbox_save = document.createElement("button");
        inputbox_save.classList.add("save", "btn", "btn-success");
        inputbox_save.classList.add("save-button");
        inputbox_save.addEventListener("click", function (e) {
            let parentCommentID = $(e.currentTarget).parents('.inputbox-container').siblings('.comment-header-container').children('.comment_ID').html();
            console.log(parentCommentID);
            let replyText = $(e.currentTarget).parents('.inputbox-controls').siblings('.replybox').val();
            console.log('Reply Text: ' + replyText);
            //get the inputted value so far then call the post building function
            //pass the replyid
            // let parentComment = $(e.currentTarget).parents('.inputbox-container').siblings('.comment-header-container').children('.comment_ID').innerHTML;
            // console.log('Parent Comment ID: ' + parentComment);

            var url = $(location).attr('href');

            //parse the URL
            var parsedURL = url.split('/');
            console.log(parsedURL);

            
            $(e.currentTarget).parents('.inputbox-container').remove(); 
            replybtn.classList.remove('active-reply');

            //send a http post request
            var details = {
                parentID: parentCommentID,
                Body: replyText, 
                postID: parsedURL[4]
            };
            
            $.post('/post/replyComment', details);
        })
        //add an internal symbol style
        let save_symbol = document.createElement('i');
        save_symbol.classList.add('fa-solid', 'fa-floppy-disk', "me-2");
        
        inputbox_save.innerHTML = "Save";
        inputbox_save.prepend(save_symbol);
        

        //
        let inputbox_cancel = document.createElement("button");
        inputbox_cancel.classList.add("cancel-button", 'btn', 'btn-danger');
        inputbox_cancel.addEventListener("click", function (e) {
            replybtn.classList.remove('active-reply');
            $(e.currentTarget).parents('.inputbox-container').remove();            
        })
        //internal discard symbol
        let cancel_symbol = document.createElement('i');
        cancel_symbol.classList.add('fa', 'fa-times', 'me-2');

        inputbox_cancel.innerHTML = "Cancel";
        inputbox_cancel.prepend(cancel_symbol);

        //inputbox.classList.add("opened");
        //format box
        //inputbox_container.classList.add('post-content');
        //build the box
        inputbox_container.append(inputbox);
        inputbox_controls.append(inputbox_save, inputbox_cancel)
        inputbox_container.append(inputbox_controls);
        
        replybtn.append(inputbox_container);
    }
    
}

//This file will largely be for backend purposes, most $.get will be here
$(document).ready(function(){
    //empty for now
    $('#btn-post-form').click(function () {
        const post_title = $('#post_title_form').val();
        const post_content = $('#post_content_form').val();
        const post_tags_form = $('#post_tags_form').val();

        var post_tags = post_tags_form.trim().split(',');

        console.log("The tags are: " + post_tags);

        console.log('Backend postTitle:' + post_title);

        if (!validateForm(post_title, post_content, post_tags_form)) return;
        console.log('Btn Successful!');
        $('#modal-question').modal('hide');
        //$.get('/');
    });

    /*
        Portion for Updates

    */

    $('#edit_post_title_form').on("input", function() {
        $('#post-title-preview').text($(this).val());
    });

    $('#edit_post_content_form').on("input", function() {
        $('#post-content-preview').html(
            DOMPurify.sanitize(marked.parse($(this).val()))
        );
    })

    $('#edit_post_tags_form').on("input", function() {
        let post_tags = $(this).val().trim().split(',');
        let tags_container = document.getElementById('tags-preview');
        tags_container.innerHTML = "";
        addTags(post_tags, tags_container);
    });

    $('#btn-edit-post-form').click(function () {
        //this is the updateform
        //get the posts's id
        var postID = $('.post_id').html();

        console.log("The post ID is: " + postID);

        //get the data
        var editedTitle = $('#edit_post_title_form').val();
        var editedText = $('#edit_post_content_form').val();
        var editedTags = $('#edit_post_tags_form').val();
        $('#modal-question').modal('hide');

        //after getting the data put it into a variable
        var editeddata = {
            postID: postID,
            editedTitle: editedTitle,
            editedText: editedText,
            editedTags: editedTags,
        }

        //pass the data, we'll use it
        $.post('/post/editPost', editeddata);
   
    });

    $('#submit-register').click(function () {
        //for signing up and creating users
        const username = $('#username').val();
        const password = $('#password').val();
        const confirmpassword = $('#confirm_password').val();

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

    $('#post_search').keydown(function (event) {
        if(event.key == "Enter") {
            // $.get('/search/' + $('#postSearch').val());
            $.post('/search/' + $('#postSearch').val());
        }
    });

    $('#btn_comment_send').click(function (req, res) {
        console.log("Commenting......")
        console.log('Text Area data: ' + $('#add_comment_textarea').val());
        console.log('Current Page url' + $(location).attr('href'));
        var url = $(location).attr('href');

        //parse the URL
        var parsedURL = url.split('/');
        console.log(parsedURL);
        var comment = $('#add_comment_textarea').val();
        $('#add_comment_textarea').val('');
        $('#add-comment-controls-container').addClass('d-none');
        var passdata = {
            Body: comment,
            postID: parsedURL[4]
        };

        $.post('/post/postComment', passdata);
    });

    $('.create-reply').click(handleReplies);
    
});