/*This is the file for comment section work*/
//Noted, I have brain damage -Raphael
function handleReplies(e) {
    console.log("Reply Test");

    //let replybtn = $(e.currentTarget).parent();
    let replybtn = e.target.closest('.comment-card')
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
        let inputbox = document.createElement("input");
        inputbox.setAttribute("type", "text");
        inputbox.setAttribute("placeholder", "type here...");
        //get unique reply id
        let replyid = Date.now();
        inputbox.setAttribute("id", replyid)
        //add a save and cancel button
        let inputbox_save = document.createElement("div");
        inputbox.classList.add("save");
        inputbox_save.innerHTML = "SAVE";
        inputbox_save.addEventListener("click", function (e) {
            //get the inputted value so far then call the post building function
            //pass the replyid
            let parentComment = e.target.closest('.post-comment-container');
            console.log(parentComment);
            createReply(parentComment, replyid);
            $(e.currentTarget).parent().remove();
            replybtn.classList.remove('active-reply');
        })
        let inputbox_cancel = document.createElement("div");
        inputbox_cancel.innerHTML = "CANCEL";
        inputbox_cancel.addEventListener("click", function (e) {
            replybtn.classList.remove('active-reply');
            $(e.currentTarget).parent().remove();            
        })
        //inputbox.classList.add("opened");
        //format box
        inputbox_container.classList.add('post-content');
        //build the box
        inputbox_container.append(inputbox_save);
        inputbox_container.append(inputbox_cancel);
        inputbox_container.append(inputbox);
        replybtn.append(inputbox_container);
    }
    
}

function handleEditbutton(e) {
    console.log("Edit Button");
    //let replybtn = $(e.currentTarget).parent();
    let editbtn = e.target.closest('.comment-card')
    let editcomment = e.target.closest('.post-comment');
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
        console.log(editcomment);
        editbox.classList.add("save-edit");
        editbox_save.innerHTML = "SAVE";
        editbox_save.addEventListener("click", function (e) {
            let parentComment = e.target.closest('.comment-card');
            let edit_comment = parentComment.querySelector('.post-content');
            console.log("edited innerHTML: " + edit_comment.innerHTML);
            applyEdit(edit_comment, editID);
            $(e.currentTarget).parent().remove();
            editbtn.classList.remove('active-edit');
        })
        let editbox_cancel = document.createElement("div");
        editbox_cancel.innerHTML = "CANCEL";
        editbox_cancel.addEventListener("click", function (e) {
            $(e.currentTarget).parent().remove();
            editbtn.classList.remove('active-edit');     
        })
        //inputbox.classList.add("opened");
        //format box
        //inputbox_container.classList.add('post-content');
        //build the box
        editbox_container.append(editbox_save);
        editbox_container.append(editbox_cancel);
        editbox_container.append(editbox);
        editbtn.append(editbox_container);
    }
}

function handleShowbutton (e) {
    let parentContainer= e.target.closest('.post-comment-container');
    
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
    let parentComment = e.target.closest('.comment-card');
    console.log(parentComment);
    let deleteComment = parentComment.querySelector('.post-content');
    deleteComment.classList.add('deleted-comment');

    //change it
    deleteComment.innerHTML = "This comment has been deleted.";
}

function createReply(parentComment, replyid) {
    //create the entire format for a reply/comment
    let inputtedtext = document.getElementById(replyid).value;

    let reply_container = document.createElement("div");
    reply_container.classList.add("post-comment-container", "opened");

    /*let comment_container = document.createElement("div");
    comment_container.classList.add("post-comment-container");*/
    
    let reply_card = document.createElement("div");
    reply_card.classList.add("comment-card");

    let author_container = document.createElement("div");
    author_container.classList.add("post-author-container");

    let author_img = document.createElement("img");
    author_img.classList.add("post-author-img");

    
    let author_username = document.createElement("div");
    author_username.classList.add("post-author");
    author_username.innerHTML = "@username";

    let post_content = document.createElement("p");
    post_content.innerHTML = inputtedtext; //this is the reply
    post_content.classList.add("post-content");

    let footer_container = document.createElement("div");
    footer_container.classList.add("footer-container");

    let reply_btn = document.createElement("div");
    reply_btn.classList.add("create-reply", "comment-actions")
    reply_btn.innerHTML = "Reply";
    //add the event
    reply_btn.addEventListener("click", handleReplies);

    let edit_btn = document.createElement("div");
    edit_btn.classList.add("edit-reply","comment-actions");
    edit_btn.innerHTML = "Edit";
    edit_btn.addEventListener("click", handleEditbutton);

    let delete_btn = document.createElement("div");
    delete_btn.classList.add("delete-reply", "comment-actions");
    delete_btn.innerHTML = "Delete";
    delete_btn.addEventListener("click", handleDelete);

    let show_btn = document.createElement("div");
    show_btn.classList.add("show-replies", "comment-actions")
    show_btn.innerHTML = "Show More";
    show_btn.addEventListener("click", handleShowbutton);

    //build it
    footer_container.append(reply_btn, edit_btn, delete_btn, show_btn)
    author_container.append(author_img, author_username);
    reply_card.append(author_container, post_content, footer_container);
    reply_card.append(footer_container);
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
});