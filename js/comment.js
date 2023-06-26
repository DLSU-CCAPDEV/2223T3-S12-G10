/*This is the file for comment section work*/

/******************************/
//THIS IS A REFACTORED VERSION
/******************************/

//Noted, I have brain damage -Raphael
/*
Equivalence Table
comment-section = comments-container
post-comment-container = comment-wrapper
comment-card = comment-container
comment-content = post-content
comment-comment-footer-container = comment-footer-container

*/
function handleReplies(e) {
    console.log("Reply Test");

    //let replybtn = $(e.currentTarget).parent();
    let replybtn = e.target.closest('.comment-container')
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
        inputbox.setAttribute("placeholder", "type here...");
        
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
            //get the inputted value so far then call the post building function
            //pass the replyid
            let parentComment = e.target.closest('.comment-wrapper');
            console.log(parentComment);
            createReply(parentComment, replyid);
            $(e.currentTarget).parents('.inputbox-container').remove(); 
            replybtn.classList.remove('active-reply');
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

function handleEditbutton(e) {
    let comment_content = $(e.target).parents('.comment-footer-container').siblings('.comment-content');
    if (!comment_content.attr('contenteditable') || comment_content.attr('contenteditable') == 'false') {
        comment_content.attr('contenteditable', 'true');
        comment_content.focus();
        e.target.childNodes[0].classList.remove("fa-pen");
        e.target.childNodes[0].classList.add("fa-check");
        e.target.childNodes[1].textContent = "Save";
    } else {
        if (comment_content.text() == '') {
            snackbar({
                text: "Error: You may not leave an empty comment/reply!",
                status: 'error'
            });
            return;
        }

        comment_content.attr('contenteditable', 'false');
        e.target.childNodes[0].classList.remove("fa-check");
        e.target.childNodes[0].classList.add("fa-pen");
        e.target.childNodes[1].textContent = "Edit";
    }
}

function handleShowbutton (e) {
    let parentContainer= e.target.closest('.comment-wrapper');
    
    console.log(parentContainer);
    $(parentContainer).children().toggleClass('opened');
}
function applyEdit(editingComment, editid) {
    let edited_text = document.getElementById(editid).value;
    if (edited_text == '') {
        console.log("Empty Edit, don't change")
    }
    else {
        console.log("Edited Comment: " + edited_text);
        //apply change
        editingComment.innerHTML = edited_text;
    }
    
}

function handleDelete (e) {
    let parentComment = e.target.closest('.comment-container');
    console.log(parentComment);
    let deleteComment = parentComment.querySelector('.comment-content');
    deleteComment.classList.add('deleted-comment');

    //change it
    deleteComment.innerHTML = "This comment has been deleted.";
    parentComment.querySelector('.edit-reply').remove();
}

function createReply(parentComment, replyid) {
    //create the entire format for a reply/comment
    let inputtedtext = document.getElementById(replyid).value;

    /**************************************/
    //this creates another wrapper so that we can nest succeeding comments
    //this gets appended to the main comment's wrapper
    /**************************************/
    let reply_container = document.createElement("div");
    reply_container.classList.add("comment-wrapper", "opened");

    /*let comment_container = document.createElement("div");
    comment_container.classList.add("post-comment-container");*/
    
    let reply_card = document.createElement("div");
    reply_card.classList.add("comment-container");

    let author_container = document.createElement("div");
    author_container.classList.add("comment-header-container");

    let author_img = document.createElement("img");
    author_img.classList.add("comment-author-img");
    author_img.setAttribute("src", "https://api.dicebear.com/6.x/avataaars/svg?seed=Aaron+Hall")
    
    let author_username = document.createElement("div");
    author_username.classList.add("comment-author");
    author_username.innerHTML = "@aaronhall";

    let comment_header_separator = document.createElement("div");
    comment_header_separator.classList.add("comment-header-separator");
    comment_header_separator.innerHTML = "•";

    let comment_timestamp = document.createElement("div");
    comment_timestamp.classList.add("comment-timestamp");
    comment_timestamp.innerHTML = "06/23/2023";

    let comment_content = document.createElement("p");
    comment_content.innerHTML = inputtedtext; //this is the reply
    comment_content.classList.add("comment-content");

    let footer_container = document.createElement("div");
    footer_container.classList.add("comment-footer-container");

    let comment_votes_container = document.createElement("div");
    comment_votes_container.classList.add("comment-votes-container");

    let comment_vote_up = document.createElement("div");
    comment_vote_up.classList.add("comment-vote-up");

    let up_arrow = document.createElement("i");
    up_arrow.classList.add("fa", "fa-arrow-up");

    let comment_vote_count = document.createElement("div");
    comment_vote_count.classList.add("comment-vote-count");
    comment_vote_count.setAttribute("data-vote-count", 46);
    comment_vote_count.innerHTML = 0;

    let comment_vote_down = document.createElement("div");
    comment_vote_down.classList.add("comment-vote-down");

    let down_arrow = document.createElement("i");
    down_arrow.classList.add("fa", "fa-arrow-down");

    let comment_controls_container = document.createElement("div");
    comment_controls_container.classList.add("comment-controls-container");

    //
    let reply_btn = document.createElement("div");
    reply_btn.classList.add("create-reply")
    reply_btn.innerHTML = "Reply";
    //add the event
    reply_btn.addEventListener("click", handleReplies);

    let fa_reply = document.createElement("i");
    fa_reply.classList.add("fa", "fa-reply", "me-2");

    //
    let edit_btn = document.createElement("div");
    edit_btn.classList.add("edit-reply");
    edit_btn.innerHTML = "Edit";
    edit_btn.addEventListener("click", handleEditbutton);

    let fa_pen = document.createElement("i");
    fa_pen.classList.add("fa", "fa-pen", "me-2");

    //
    let delete_btn = document.createElement("div");
    delete_btn.classList.add("delete-reply");
    delete_btn.innerHTML = "Delete";
    delete_btn.addEventListener("click", handleDelete);

    let fa_delete = document.createElement("i");
    fa_delete.classList.add("fa", "fa-trash", "me-2");

    //
    let show_btn = document.createElement("div");
    show_btn.classList.add("show-replies")
    show_btn.innerHTML = "Show More";
    show_btn.addEventListener("click", handleShowbutton);

    let fa_show = document.createElement("i");
    fa_show.classList.add("fa", "fa-caret-down", "me-2");

    //build it
    //the little vote-interactables
    comment_vote_up.append(up_arrow);
    comment_vote_down.append(down_arrow);
    //votes container
    comment_votes_container.append(comment_vote_up, comment_vote_count, comment_vote_down);
    
    //the control-interactables
    reply_btn.prepend(fa_reply);
    edit_btn.prepend(fa_pen);
    delete_btn.prepend(fa_delete);
    show_btn.prepend(fa_show);
    //control container
    comment_controls_container.append(reply_btn, edit_btn, delete_btn, show_btn);
    //make the footer-container
    footer_container.append(comment_votes_container, comment_controls_container);

    //make the header container
    author_container.append(author_img, author_username, comment_header_separator, comment_timestamp);

    //create the reply itself
    reply_card.append(author_container, comment_content, footer_container);
    reply_container.append(reply_card); //built

    //append it to the parent container
    parentComment.append(reply_container);
}

//functions exclusive to post-related control
function handlePostEditbutton(e) {
    console.log("Edit Button");
    /**************************************/
    //for post variant stuff, follow the exact same thought process
    //except if it's for adding a comment
    //    - you will be appending the comment-wrapper into the comments-container instead
    //    -* this is because comments-container is the actual comments section
    /**************************************/
    let editbtn = e.target.closest('.post-container')
    //check if it has a certain class that appears iff reply has been pressed once
    if (editbtn.classList.contains('active-edit')) {
        //do nothing
        console.log("Active edit")
    } else {
        //reply is active, makes it so that clicking reply doesn't create
        editbtn.classList.add('active-edit');
        //create the textbox
        let editbox_container = document.createElement("div");
        editbox_container.classList.add("edit-box");
        let editbox = document.createElement("input");
        editbox.setAttribute("type", "text");
        editbox.setAttribute("placeholder", "type here...");
        let editID = Date.now();
        editbox.setAttribute("id", editID);
        //add a save and cancel button
        let editbox_save = document.createElement("div");
        editbox.classList.add("save-edit");
        editbox_save.innerHTML = "SAVE";
        editbox_save.classList.add("save-button");
        editbox_save.addEventListener("click", function (e) {
            let parentComment = e.target.closest('.post-container');
            let edit_comment = parentComment.querySelector('.post-content');
            console.log(edit_comment);
            console.log("edited innerHTML: " + edit_comment.innerHTML);
            applyEdit(edit_comment, editID);
            $(e.currentTarget).parent().remove();
            editbtn.classList.remove('active-edit');
        })

        let editbox_cancel = document.createElement("div");
        editbox_cancel.innerHTML = "CANCEL";
        editbox_cancel.classList.add("cancel-button");
        editbox_cancel.addEventListener("click", function (e) {
            $(e.currentTarget).parent().remove();
            editbtn.classList.remove('active-edit');     
        })
        //inputbox.classList.add("opened");
        //format box
        //inputbox_container.classList.add('post-content');
        //build the box
        editbox_container.append(editbox);
        editbox_container.append(editbox_save);
        editbox_container.append(editbox_cancel);
        editbtn.append(editbox_container);
    }
}

function handlePostDelete (e) {
    let parentComment = $(e.currentTarget).closest('.post-container');
    console.log(parentComment);
    let deleteComment = parentComment.querySelector('.post-content');
    deleteComment.classList.add('deleted-comment');

    //change it
    deleteComment.innerHTML = "This comment has been deleted.";
    parentComment.querySelector('.edit-post').remove();
    parentComment.querySelector('.delete-post').remove();
}

function createPostReply(parentComment, inputtedtext) {
    //create the entire format for a reply/comment
    

    /**************************************/
    //this creates another wrapper so that we can nest succeeding comments
    //this gets appended to the main comment's wrapper
    /**************************************/
    let reply_container = document.createElement("div");
    reply_container.classList.add("comment-wrapper", "opened", "m-0", "mt-1");

    /*let comment_container = document.createElement("div");
    comment_container.classList.add("post-comment-container");*/
    
    let reply_card = document.createElement("div");
    reply_card.classList.add("comment-container");

    let author_container = document.createElement("div");
    author_container.classList.add("comment-header-container");

    let author_img = document.createElement("img");
    author_img.classList.add("comment-author-img");
    author_img.setAttribute("src", "https://api.dicebear.com/6.x/avataaars/svg?seed=Aaron+Hall")
    
    let author_username = document.createElement("div");
    author_username.classList.add("comment-author");
    author_username.innerHTML = "@aaronhall";

    let comment_header_separator = document.createElement("div");
    comment_header_separator.classList.add("comment-header-separator");
    comment_header_separator.innerHTML = "•";

    let comment_timestamp = document.createElement("div");
    comment_timestamp.classList.add("comment-timestamp");
    comment_timestamp.innerHTML = "06/23/2023";

    let comment_content = document.createElement("p");
    comment_content.innerHTML = inputtedtext; //this is the reply
    comment_content.classList.add("comment-content");

    let footer_container = document.createElement("div");
    footer_container.classList.add("comment-footer-container");

    let comment_votes_container = document.createElement("div");
    comment_votes_container.classList.add("comment-votes-container");

    let comment_vote_up = document.createElement("div");
    comment_vote_up.classList.add("comment-vote-up");

    let up_arrow = document.createElement("i");
    up_arrow.classList.add("fa", "fa-arrow-up");

    let comment_vote_count = document.createElement("div");
    comment_vote_count.classList.add("comment-vote-count");
    comment_vote_count.setAttribute("data-vote-count", 46);
    comment_vote_count.innerHTML = 0;

    let comment_vote_down = document.createElement("div");
    comment_vote_down.classList.add("comment-vote-down");

    let down_arrow = document.createElement("i");
    down_arrow.classList.add("fa", "fa-arrow-down");

    let comment_controls_container = document.createElement("div");
    comment_controls_container.classList.add("comment-controls-container");

    //
    let reply_btn = document.createElement("div");
    reply_btn.classList.add("create-reply")
    reply_btn.innerHTML = "Reply";
    //add the event
    reply_btn.addEventListener("click", handleReplies);

    let fa_reply = document.createElement("i");
    fa_reply.classList.add("fa", "fa-reply", "me-2");

    //
    let edit_btn = document.createElement("div");
    edit_btn.classList.add("edit-reply");
    edit_btn.innerHTML = "Edit";
    edit_btn.addEventListener("click", handleEditbutton);

    let fa_pen = document.createElement("i");
    fa_pen.classList.add("fa", "fa-pen", "me-2");

    //
    let delete_btn = document.createElement("div");
    delete_btn.classList.add("delete-reply");
    delete_btn.innerHTML = "Delete";
    delete_btn.addEventListener("click", handleDelete);

    let fa_delete = document.createElement("i");
    fa_delete.classList.add("fa", "fa-trash", "me-2");

    //
    let show_btn = document.createElement("div");
    show_btn.classList.add("show-replies")
    show_btn.innerHTML = "Show More";
    show_btn.addEventListener("click", handleShowbutton);

    let fa_show = document.createElement("i");
    fa_show.classList.add("fa", "fa-caret-down", "me-2");

    //build it
    //the little vote-interactables
    comment_vote_up.append(up_arrow);
    comment_vote_down.append(down_arrow);
    //votes container
    comment_votes_container.append(comment_vote_up, comment_vote_count, comment_vote_down);
    
    //the control-interactables
    reply_btn.prepend(fa_reply);
    edit_btn.prepend(fa_pen);
    delete_btn.prepend(fa_delete);
    show_btn.prepend(fa_show);
    //control container
    comment_controls_container.append(reply_btn, edit_btn, delete_btn, show_btn);
    //make the footer-container
    footer_container.append(comment_votes_container, comment_controls_container);

    //make the header container
    author_container.append(author_img, author_username, comment_header_separator, comment_timestamp);

    //create the reply itself
    reply_card.append(author_container, comment_content, footer_container);
    reply_container.append(reply_card); //built

    //append it to the parent container
    parentComment.append(reply_container);
}
    
$(document).ready(function () {
    //open and hide replies
    $('.show-replies').click(handleShowbutton);
    $('.create-reply').click(handleReplies);
    $('.edit-reply').click(handleEditbutton);
    $('.delete-reply').click(handleDelete);

    $('.edit-post').click(handlePostEditbutton);
    $('.delete-post').click(handlePostDelete);
});