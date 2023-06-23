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
    let parent = $(e.currentTarget).parent();
    let vote_count = $(e.currentTarget).siblings('.post-vote-count');
    let data_vote_count = vote_count.attr('data-vote-count');
    if (parent.attr('data-vote-status') != 1) {
        var diff = 1;
        if (parent.attr('data-vote-status') == -1) diff = 2;
        vote_count.text(nFormatter(parseInt(data_vote_count) + diff, 1));
        vote_count.attr('data-vote-count', parseInt(data_vote_count) + diff);
        parent.attr('data-vote-status', 1);
        $(e.currentTarget).siblings('.post-vote-down').removeClass('active');
    } else {
        parent.attr('data-vote-status', 0);
        vote_count.text(nFormatter(parseInt(data_vote_count) - 1, 1));
        vote_count.attr('data-vote-count', parseInt(data_vote_count) - 1);
    }
}

function handleVoteButtonsDown(e) {
    let parent = $(e.currentTarget).parent();
    let vote_count = $(e.currentTarget).siblings('.post-vote-count');
    let data_vote_count = vote_count.attr('data-vote-count');
    if (parent.attr('data-vote-status') != -1) {
        var diff = 1;
        if (parent.attr('data-vote-status') == 1) diff = 2;
        vote_count.text(nFormatter(parseInt(data_vote_count) - diff, 1));
        vote_count.attr('data-vote-count', parseInt(data_vote_count) - diff);
        parent.attr('data-vote-status', -1);
        $(e.currentTarget).siblings('.post-vote-up').removeClass('active');
    } else {
        parent.attr('data-vote-status', 0);
        vote_count.text(nFormatter(parseInt(data_vote_count) + 1, 1));
        vote_count.attr('data-vote-count', parseInt(data_vote_count) + 1);
    }
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
    $('.post-vote-up, .post-vote-down').click(handleVoteButtons);
    $('.post-vote-up').click(handleVoteButtonUp);
    $('.post-vote-down').click(handleVoteButtonsDown);

    $('#btn-ask').click(function() {
        $('#post-title-form').val('');
        $('#post-content-form').val('');
        $('#post-tags-form').val('');

        $('#post-title-preview').text('');
        $('#post-content-preview').html('');
        $('#tags-preview').html('');
    });

    $('#btn-post-form').click(function() {
        const post_title = $('#post-title-form').val();
        const post_content = $('#post-content-form').val();
        const post_tags_form = $('#post-tags-form').val();

        if (!validateForm(post_title, post_content, post_tags_form)) return;
        $('#modal-question').modal('hide');

        let post_tags = post_tags_form.split(',');

        let post_wrapper = document.createElement("div");
        post_wrapper.classList.add("post-wrapper");

        let post_vote_container = document.createElement("div");
        post_vote_container.classList.add("post-vote-container");

        let post_vote_up = document.createElement("div");
        post_vote_up.classList.add("post-vote-up");

        let icon_vote_up = document.createElement("i");
        icon_vote_up.classList.add("fa", "fa-caret-up");

        post_vote_up.appendChild(icon_vote_up);
        post_vote_up.addEventListener("click", handleVoteButtonUp);
        post_vote_up.addEventListener("click", handleVoteButtons);

        let post_vote_count = document.createElement("div");
        post_vote_count.classList.add("post-vote-count");
        post_vote_count.innerText = "0";
        post_vote_count.setAttribute("data-vote-count", "0");

        let post_vote_down = document.createElement("div");
        post_vote_down.classList.add("post-vote-down");
        post_vote_down.addEventListener("click", handleVoteButtonsDown);
        post_vote_down.addEventListener("click", handleVoteButtons);

        let icon_vote_down = document.createElement("i");
        icon_vote_down.classList.add("fa", "fa-caret-down");

        post_vote_down.appendChild(icon_vote_down);

        post_vote_container.append(post_vote_up, post_vote_count, post_vote_down);

        let post_container = document.createElement("div");
        post_container.classList.add("post-container");

        let post_title_el = document.createElement("h2");
        post_title_el.classList.add("post-title");
        post_title_el.innerText = post_title;

        let post_author_container = document.createElement("div");
        post_author_container.classList.add("post-author-container");

        let post_author_img = document.createElement("img");
        post_author_img.classList.add("post-author-img");
        post_author_img.src = "https://api.dicebear.com/6.x/avataaars/svg?seed=Aaron+Hall";
        post_author_img.alt = "@aaronhall";

        let post_author = document.createElement("div");
        post_author.classList.add("post-author");
        post_author.innerText = "@aaronhall";

        post_author_container.append(post_author_img, post_author);

        let post_content_el = document.createElement("div");
        post_content_el.classList.add("post-content");
        post_content_el.innerHTML = DOMPurify.sanitize(marked.parse(post_content));

        let footer_container = document.createElement("div");
        footer_container.classList.add("footer-container");

        let tags_container = document.createElement("div");
        tags_container.classList.add("tags-container");

        let uniqueTags = [];

        post_tags.forEach((tag) => {
            if (!uniqueTags.includes(tag.trim())) uniqueTags.push(tag.trim());
        });

        let tagCount = 0;
        for (var i = 0; i < uniqueTags.length; i++) {
            if (uniqueTags[i] == "") continue;

            let post_tags_el = document.createElement("div");
            post_tags_el.classList.add("tags");
            post_tags_el.innerText = uniqueTags[i].replaceAll(' ', '-');

            tags_container.append(post_tags_el);

            tagCount++;
            if (tagCount == 5) break;
        };

        let post_answers_count_container = document.createElement("div");
        post_answers_count_container.classList.add("post-answers-count-container");

        let icon_comment = document.createElement("i");
        icon_comment.classList.add("fa", "fa-comment-dots");

        let post_answers_count = document.createElement("div");
        post_answers_count.classList.add("post-answers-count");
        post_answers_count.innerText = "0 answers";

        post_answers_count_container.append(icon_comment, post_answers_count);

        footer_container.append(tags_container, post_answers_count_container);

        post_container.append(post_title_el, post_author_container, post_content_el, footer_container);

        post_wrapper.append(post_vote_container, post_container);

        let posts_container = $('#posts-container');
        posts_container.prepend(post_wrapper);
    });

    $('#post-title-form').on("input", function() {
        $('#post-title-preview').text($(this).val());
    });

    $('#post-content-form').on("input", function() {
        $('#post-content-preview').html(
            DOMPurify.sanitize(marked.parse($(this).val()))
        );
    })

    $('#post-tags-form').on("input", function() {
        let post_tags = $(this).val().trim().split(',');
        let tags_container = document.getElementById('tags-preview');
        tags_container.innerHTML = "";

        let uniqueTags = [];

        post_tags.forEach((tag) => {
            if (!uniqueTags.includes(tag.trim())) uniqueTags.push(tag.trim());
        });

        let tagCount = 0;
        for (let i = 0; i < uniqueTags.length; i++) {
            if (uniqueTags[i] == "") continue;

            let post_tags_el = document.createElement("div");
            post_tags_el.classList.add("tags");
            post_tags_el.innerText = uniqueTags[i].replaceAll(' ', '-');

            tags_container.append(post_tags_el);

            tagCount++;
            if (tagCount == 5) break;
        }
    });

    $('#add-comment-textarea').each(function () {
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
        $('#add-comment-textarea').val('');
        $('#add-comment-controls-container').addClass('d-none');
    })

    $('.post-control-delete').click((e) => {
        $(e.target).closest('.post-wrapper').remove();
    })
});