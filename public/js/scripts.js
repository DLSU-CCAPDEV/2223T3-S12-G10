
function handleVoteButtons(e) {
    console.log(e.currentTarget);
    $(e.currentTarget).toggleClass('active');
    let attr = $(e.currentTarget).parent().data('vote-status');
    if (typeof attr !== 'undefined' || attr !== false) {
        $(e.currentTarget).parent().data('vote-status', '0');
    }
    /*let vote_count = $(e.currentTarget).siblings('.post-vote-count');
    let vote_count_attr = vote_count.attr('data-vote-count');
    if (typeof vote_count_attr === 'undefined' || vote_count_attr !== false) {
        vote_count.attr('data-vote-count', vote_count.text());
    }*/
}

function handleVoteButtonUp(e) {
    let mode;
    let ID;
    if (e.currentTarget.classList.contains('post-vote-up') ||
        e.currentTarget.classList.contains('post-vote-down')) {
        mode = '.post';
        ID = $(e.target).parents('.post-vote-container').siblings('.post-container').children('.post-author-container').children('.post_ID').html();
        console.log("Vote Post ID: " + ID);
    } else if (e.currentTarget.classList.contains('comment-vote-up') ||
               e.currentTarget.classList.contains('comment-vote-down')) {
        mode = '.comment';
        ID = $(e.target).parents('.comment-footer-container').siblings('.comment-header-container').children('.comment_ID').html();
        console.log("Comment Post ID: " + ID);
    }
    //Vote button
    function liveupdate(mode, ID) {
        //at this point it should have been updated properly
        //this only does a local change
        //response will either be true or false
        if (mode == '.post') {
                //find the vote container
            let votes= $(".post_ID:contains(" + ID +")").parents('.post-container').siblings('.post-vote-container');
            //votes.children('.post-vote-up').toggleClass('active');
            let upvote = votes.children('.post-vote-count');
            let upvotecount = parseInt(upvote.html());
            upvotecount.html() = upvotecount + 1;
        } else if (mode == '.comment') {
            let votes= $(".comment_ID:contains(" + ID +")").parents('.comment-header-container').siblings('.comment-footer-container').children('.comment-votes-container');
            //votes.children('.comment-vote-up').toggleClass('active');
            let upvote = votes.children('.comment-vote-count');
            let upvotecount = parseInt(upvote.html());
            upvote.html() = upvotecount + 1;
        } else {
            console.log("This SHOULDN'T even be possible.");
        }
        
    };

    function ajaxcall(mode, ID) {
        //check if it's a post or comment event 
        if (mode == '.post') {
            $.ajax({
                url: '/post/upvote',
                type: "POST",
                dataType: "json",
                data: {postID: ID},
                success: function(response) {liveupdate(mode, ID)}
            });
        } else if (mode == '.comment') {
            $.ajax({
                url: '/comment/upvote',
                type: "POST",
                dataType: "json",
                data: {commentID: ID},
                success: function(response) {liveupdate(mode, ID)}
            });

        } else {
            console.log("What, how????");
        }
    }

    ajaxcall(mode, ID);

    // let parent = $(e.currentTarget).parent();
    // let vote_count = $(e.currentTarget).siblings(mode + '-vote-count');
    // let data_vote_count = vote_count.attr('data-vote-count');
    // if (parent.attr('data-vote-status') != 1) {
    //     var diff = 1;
    //     if (parent.attr('data-vote-status') == -1) diff = 2;
    //     vote_count.text(nFormatter(parseInt(data_vote_count) + diff, 1));
    //     vote_count.attr('data-vote-count', parseInt(data_vote_count) + diff);
    //     parent.attr('data-vote-status', 1);
    //     $(e.currentTarget).siblings(mode + '-vote-down').removeClass('active');
    // } else {
    //     parent.attr('data-vote-status', 0);
    //     vote_count.text(nFormatter(parseInt(data_vote_count) - 1, 1));
    //     vote_count.attr('data-vote-count', parseInt(data_vote_count) - 1);
    // }
}

function handleVoteButtonsDown(e) {
    let mode;
    let ID;
    if (e.currentTarget.classList.contains('post-vote-up') ||
        e.currentTarget.classList.contains('post-vote-down')) {
        mode = '.post';
        ID = $(e.target).parents('.post-vote-container').siblings('.post-container').children('.post-author-container').children('.post_ID').html();
        console.log("Vote Post ID: " + ID);
    } else if (e.currentTarget.classList.contains('comment-vote-up') ||
        e.currentTarget.classList.contains('comment-vote-down')) {
        mode = '.comment';
        ID = $(e.target).parents('.comment-footer-container').siblings('.comment-header-container').children('.comment_ID').html();
        console.log("Comment Post ID: " + ID);
    }

    function liveupdate(mode, ID) {
        //at this point it should have been updated properly
        //this only does a local change
        //response will either be true or false
        if (mode == '.post') {
            let votes= $(".post_ID:contains(" + ID +")").parents('.post-container').siblings('.post-vote-container');
            //votes.children('.post-vote-up').toggleClass('active'); //this is ALREADY handled by Handlevotebuttons
            let downvote = votes.children('.post-vote-count');
            let downvotecount = parseInt(downvote.html());
            downvote.html() = downvotecount - 1;
        } else if (mode == '.comment') {
            let votes= $(".comment_ID:contains(" + ID +")").parents('.comment-header-container').siblings('.comment-footer-container').children('.comment-votes-container');
            //votes.children('.comment-vote-up').toggleClass('active');
            let downvote = votes.children('.comment-vote-count');
            let downvotecount = parseInt(downvote.html());
            downvote.html() = downvotecount - 1;
        } else {
            console.log("This SHOULDN'T even be possible.");
        }
        
    };


    function ajaxcall(mode, ID) {
        //check if it's a post or comment event 
        if (mode == '.post') {
            $.ajax({
                url: '/post/downvote',
                type: "POST",
                dataType: "json",
                data: {postID: ID},
                success: function(response) {liveupdate(mode, ID)}
            });
        } else if (mode == '.comment') {
            $.ajax({
                url: '/comment/downvote',
                type: "POST",
                dataType: "json",
                data: {commentID: ID},
                success: function(response) {liveupdate(mode, ID)}
            });

        } else {
            console.log("What, how????");
        }
    }

    ajaxcall(mode, ID);

    // let parent = $(e.currentTarget).parent();
    // let vote_count = $(e.currentTarget).siblings(mode + '-vote-count');
    // let data_vote_count = vote_count.attr('data-vote-count');
    // if (parent.attr('data-vote-status') != -1) {
    //     var diff = 1;
    //     if (parent.attr('data-vote-status') == 1) diff = 2;
    //     vote_count.text(nFormatter(parseInt(data_vote_count) - diff, 1));
    //     vote_count.attr('data-vote-count', parseInt(data_vote_count) - diff);
    //     parent.attr('data-vote-status', -1);
    //     $(e.currentTarget).siblings(mode + '-vote-up').removeClass('active');
    // } else {
    //     parent.attr('data-vote-status', 0);
    //     vote_count.text(nFormatter(parseInt(data_vote_count) + 1, 1));
    //     vote_count.attr('data-vote-count', parseInt(data_vote_count) + 1);
    // }
}

function validateForm(...forms) {
    let valid = true;
    forms.forEach(form => {
        if (!form.trim().length)
            valid = false;
            return valid;
    });
    return valid;
}

$(document).ready(function() {
    $('.post-vote-up, .post-vote-down, .comment-vote-up, .comment-vote-down').click(handleVoteButtons);
    $('.post-vote-up, .comment-vote-up').click(handleVoteButtonUp);
    $('.post-vote-down, .comment-vote-down').click(handleVoteButtonsDown);

    $('#btn-ask').click(function() {
        $('#modal-question .modal-title').text("Ask Question");

        $('#post_title_form').val('');
        $('#post_content_form').val('');
        $('#post-tags-form').val('');

        $('#post-title-preview').text('');
        $('#post-content-preview').html('');
        $('#tags-preview').html('');
    });

    $('#btn-post-form').click(function() {
        let modal_title = $('#modal-question .modal-title');
        if (modal_title.text() != "Ask Question") return;

        const post_title = $('#post_title_form').val();
        const post_content = $('#post_content_form').val();
        const post_tags_form = $('#post_tags_form').val();

        if (!validateForm(post_title, post_content, post_tags_form)) return;
        $('#modal-question').modal('hide');

        let post_tags = post_tags_form.split(',');

        // let post_wrapper = document.createElement("div");
        // post_wrapper.classList.add("post-wrapper");

        // let post_vote_container = document.createElement("div");
        // post_vote_container.classList.add("post-vote-container");

        // let post_vote_up = document.createElement("div");
        // post_vote_up.classList.add("post-vote-up");

        // let icon_vote_up = document.createElement("i");
        // icon_vote_up.classList.add("fa", "fa-caret-up");

        // post_vote_up.appendChild(icon_vote_up);
        // post_vote_up.addEventListener("click", handleVoteButtonUp);
        // post_vote_up.addEventListener("click", handleVoteButtons);

        // let post_vote_count = document.createElement("div");
        // post_vote_count.classList.add("post-vote-count");
        // post_vote_count.innerText = "0";
        // post_vote_count.setAttribute("data-vote-count", "0");

        // let post_vote_down = document.createElement("div");
        // post_vote_down.classList.add("post-vote-down");
        // post_vote_down.addEventListener("click", handleVoteButtonsDown);
        // post_vote_down.addEventListener("click", handleVoteButtons);

        // let icon_vote_down = document.createElement("i");
        // icon_vote_down.classList.add("fa", "fa-caret-down");

        // post_vote_down.appendChild(icon_vote_down);

        // post_vote_container.append(post_vote_up, post_vote_count, post_vote_down);

        // let post_container = document.createElement("div");
        // post_container.classList.add("post-container");

        // let post_title_el = document.createElement("h2");
        // post_title_el.classList.add("post-title");
        // post_title_el.innerText = post_title;

        // let post_author_container = document.createElement("div");
        // post_author_container.classList.add("post-author-container");

        // let post_author_img = document.createElement("img");
        // post_author_img.classList.add("post-author-img");
        // post_author_img.src = "https://api.dicebear.com/6.x/avataaars/svg?seed=Aaron+Hall";
        // post_author_img.alt = "@aaronhall";

        // let post_author = document.createElement("div");
        // post_author.classList.add("post-author");
        // post_author.innerText = "@aaronhall";

        // post_author_container.append(post_author_img, post_author);

        // let post_content_el = document.createElement("div");
        // post_content_el.classList.add("post-content");
        // post_content_el.innerHTML = DOMPurify.sanitize(marked.parse(post_content));

        // let footer_container = document.createElement("div");
        // footer_container.classList.add("footer-container");

        // let tags_container = document.createElement("div");
        // tags_container.classList.add("tags-container");
        // addTags(post_tags, tags_container);

        // let post_answers_count_container = document.createElement("div");
        // post_answers_count_container.classList.add("post-answers-count-container");

        // let icon_comment = document.createElement("i");
        // icon_comment.classList.add("fa", "fa-comment-dots");

        // let post_answers_count = document.createElement("div");
        // post_answers_count.classList.add("post-answers-count");
        // post_answers_count.innerText = "0 answers";

        // post_answers_count_container.append(icon_comment, post_answers_count);

        // footer_container.append(tags_container, post_answers_count_container);

        // post_container.append(post_title_el, post_author_container, post_content_el, footer_container);

        // post_wrapper.append(post_vote_container, post_container);

        // let posts_container = $('#posts-container');
        // posts_container.prepend(post_wrapper);
    });

    $('#post_title_form').on("input", function() {
        $('#post-title-preview').text($(this).val());
    });

    $('#post_content_form').on("input", function() {
        $('#post-content-preview').html(
            DOMPurify.sanitize(marked.parse($(this).val()))
        );
    })

    $('#post_tags_form').on("input", function() {
        let post_tags = $(this).val().trim().split(',');
        let tags_container = document.getElementById('tags-preview');
        tags_container.innerHTML = "";
        addTags(post_tags, tags_container);
    });

    $('#add_comment_textarea').each(function () {
        this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
    }).on('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';

        if (!this.value == "") {
            $('#add-comment-controls-container').removeClass('d-none');
        } else {
            $('#add-comment-controls-container').addClass('d-none');
        }
    });

    $('#btn-comment-discard').click(function() {
        $('#add_comment_textarea').val('');
        $('#add-comment-controls-container').addClass('d-none');
    })

    $('.post-control-delete').click((e) => {
        $(e.target).closest('.post-wrapper').remove();
    });

    $('#btn-mode-toggle').click(function() {
       let isDark = $('html').attr('dark') != undefined;

       $(this).html("");

       let day_night_icon = document.createElement("i");
       day_night_icon.classList.add("fa");

       if (isDark) {
           $('html').removeAttr('dark');
           day_night_icon.classList.add("fa-sun");
       } else {
           $('html').attr('dark', '');
           day_night_icon.classList.add("fa-moon");
       }

       this.appendChild(day_night_icon);
    });

    $('.edit-post').click(function() {
        let modal_title = $('#modal-question .modal-title');
        modal_title.text('Edit Question');

        let post_title = $(this).parents('.post-controls-container').siblings('.post-title');
        let post_content = $(this).parents('.post-controls-container').siblings('.post-content');
        let post_tags = [];
        $(this).parents('.post-controls-container').siblings('.footer-container').children('.tags-container').children().each((index, value) => post_tags.push(value.innerText));

        let post_title_form = $('#edit_post_title_form');
        let post_content_form = $('#edit_post_content_form');
        let post_tags_form = $('#edit_post_tags_form');

        post_title_form.val(post_title.text());
        post_content_form.val(new TurndownService().turndown(post_content.html()));
        post_tags_form.val(post_tags.join(', '));

        let post_title_preview = $('#post-preview-container > #post-title-preview');
        let post_content_preview = $('#post-preview-container > #post-content-preview');
        let post_tags_preview = $('#post-preview-container > #tags-preview');

        post_title_preview.text(post_title.text());
        post_content_preview.html(post_content.html());
        addTags(post_tags, post_tags_preview);

        const question_modal = new bootstrap.Modal('#modal-question');
        question_modal.show();
    });

    $('#btn-post-form').click(function() {
        let modal_title = $('#modal-question .modal-title');
        if (modal_title.text() != "Edit Question") return;

        let post_title_form = $('#post-title-form');
        let post_content_form = $('#post-content-form');
        let post_tags_form = $('#post-tags-form');

        if (!validateForm(post_title_form.val(), post_content_form.val(), post_tags_form.val())) return;

        let post_title = $('.post-title');
        let post_content = $('.post-content');
        let post_tags = post_tags_form.val().trim().split(',');

        post_title.text(post_title_form.val());
        post_content.html(DOMPurify.sanitize(marked.parse(post_content_form.val())));
        $('.tags-container').html('');
        addTags(post_tags, $('.tags-container'));

        $('#modal-question').modal('hide');
    });
});

function addTags(tags, tags_container) {
    let uniqueTags = [];

    tags.map(tag => tag.trim().replaceAll(' ', '-')).forEach((tag) => {
        if (tag == "") return;
        if (!uniqueTags.includes(tag)) uniqueTags.push(tag);
    });

    let tagCount = 0;
    for (let i = 0; i < uniqueTags.length; i++) {
        let post_tags_el = document.createElement("div");
        post_tags_el.classList.add("tags");
        post_tags_el.innerText = uniqueTags[i];

        tags_container.append(post_tags_el);

        tagCount++;
        if (tagCount == 5) break;
    }
}