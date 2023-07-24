/*This is the file for comment section work*/

//const e = require("express");

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

function handleEditbutton(e) {
    let comment_content;
    let isPost;
    if (e.target.classList.contains('edit-post')) {
        comment_content = $(e.target).parents('.post-controls-container').siblings('.post-content');
        isPost = true;
    } else if (e.target.classList.contains('edit-reply')) {
        comment_content = $(e.target).parents('.comment-footer-container').siblings('.comment-content');
        isPost = false;
    }

    if (!comment_content.attr('contenteditable') || comment_content.attr('contenteditable') == 'false') {
        comment_content.attr('contenteditable', 'true');
        comment_content.focus();
        e.target.childNodes[0].classList.remove("fa-pen");
        e.target.childNodes[0].classList.add("fa-check");
        e.target.childNodes[1].textContent = "Save";

        /*comment_original = comment_content.html();

        if (isPost) {
            comment_content.html('');
            comment_content.text(new TurndownService().turndown(comment_original));
        }*/
    } else {
        if (comment_content.text() == '') {
            snackbar({
                text: "Error: You may not leave an empty comment/reply!",
                status: 'error'
            });
            return;
        }

        console.log(comment_content.text());
        if (isPost) comment_content.html(DOMPurify.sanitize(marked.parse(comment_content.html())));

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

function handleDelete (e) {
    let content;
    if (e.target.classList.contains('delete-reply')) {
        content = $(e.target).parents('.comment-footer-container').siblings('.comment-content');
        $(e.target).siblings('.edit-reply').remove();
    } else if (e.target.classList.contains('delete-post')) {
        content = $('.post-content');
        $(e.target).parents('.post-controls-container').remove();
    }
    content.html("This comment has been deleted.");
    content.addClass('deleted-comment');
    if (content.attr('contenteditable') == 'true') {
        content.attr('contenteditable', 'false');
    }
}

function createReply(parentComment, replyid) {
    //create the entire format for a reply/comment
    let inputtedtext = document.getElementById(replyid).value;
    if (inputtedtext == '' || inputtedtext  ==' ') {
        snackbar({
            text: "Error: You may not leave an empty comment/reply!",
            status: 'error'
        });
        return;
    }

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
    comment_vote_up.addEventListener("click", handleVoteButtons);
    comment_vote_up.addEventListener("click", handleVoteButtonUp);

    let up_arrow = document.createElement("i");
    up_arrow.classList.add("fa", "fa-arrow-up");

    let comment_vote_count = document.createElement("div");
    comment_vote_count.classList.add("comment-vote-count");
    comment_vote_count.setAttribute("data-vote-count", 0);
    comment_vote_count.innerHTML = 0;

    let comment_vote_down = document.createElement("div");
    comment_vote_down.classList.add("comment-vote-down");
    comment_vote_down.addEventListener("click", handleVoteButtons);
    comment_vote_down.addEventListener("click", handleVoteButtonsDown);

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

//for directly replying to the post
function handlePostReplies(e) {
    // console.log("Reply Test");
    // let travel_path = $(e.target).parents('#add-comment-wrapper').siblings('#comments-container')
    // //target a parent on the same level as comments-container then search siblings for it

    // //target the comment section "comments-container"=
    // //check if it has a certain class that appears iff reply has been pressed once
    // //reply is active, makes it so that clicking reply doesn't create
    // //another textbox
    // console.log(travel_path);
    // let reply_data = $(e.target).parents('#add-comment-wrapper').children('#add-comment-container').children('#addcomment-textarea');
    // console.log(reply_data);
    // createPostReply(travel_path, reply_data.val()); //parent is the comment section
    $('#addcommenttextarea').val('');
    $('#add-comment-controls-container').addClass('d-none');

}

function createPostReply(parentComment, inputtedtext) {
    //create the entire format for a reply/comment
    

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
    comment_vote_up.addEventListener("click", handleVoteButtons);
    comment_vote_up.addEventListener("click", handleVoteButtonUp);

    let up_arrow = document.createElement("i");
    up_arrow.classList.add("fa", "fa-arrow-up");

    let comment_vote_count = document.createElement("div");
    comment_vote_count.classList.add("comment-vote-count");
    comment_vote_count.setAttribute("data-vote-count", 0);
    comment_vote_count.innerHTML = 0;

    let comment_vote_down = document.createElement("div");
    comment_vote_down.classList.add("comment-vote-down");
    comment_vote_down.addEventListener("click", handleVoteButtons);
    comment_vote_down.addEventListener("click", handleVoteButtonsDown);

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
    $('.edit-reply').click(handleEditbutton);
    $('.delete-reply').click(handleDelete);

    //$('.edit-post').click(handleEditbutton);
    $('.delete-post').click(handleDelete);
    $('.post-reply').click(handlePostReplies)
});