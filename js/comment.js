function handleReplies(e) {
    let parentComment = e.target.closest('.post-comment-container');

    console.log(parentComment);

    parentComment.children().classList.toggleClass('opened');
}

$(document).ready(function name(params) {
   $('.show-replies').click(handleReplies);
   /*
   $('.edit-reply').click(handleEdits);
   $('.delete-reply').click(handleEdits);
   $('.create-reply').click(handleEdits);*/
});