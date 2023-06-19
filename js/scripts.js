$(document).ready(function() {
    $('.post-vote-up, .post-vote-down').click(function() {
        $(this).toggleClass('active');
        let attr = $(this).parent().attr('data-vote-status');
        if (typeof attr !== 'undefined' || attr !== false) {
            $(this).parent().data('vote-status', '0');
        }
    });
    $('.post-vote-up').click(function() {
        let parent = $(this).parent();
        let vote_count = $(this).siblings('.post-vote-count');
        let data_vote_count = vote_count.attr('data-vote-count');
        if (parent.attr('data-vote-status') != 1) {
            var diff = 1;
            if (parent.attr('data-vote-status') == -1) diff = 2;
            vote_count.text(nFormatter(parseInt(data_vote_count) + diff, 1));
            vote_count.attr('data-vote-count', parseInt(data_vote_count) + diff);
            parent.attr('data-vote-status', 1);
            $(this).siblings('.post-vote-down').removeClass('active');
        } else {
            parent.attr('data-vote-status', 0);
            vote_count.text(nFormatter(parseInt(data_vote_count) - 1, 1));
            vote_count.attr('data-vote-count', parseInt(data_vote_count) - 1);
        }
    });
    $('.post-vote-down').click(function() {
        let parent = $(this).parent();
        let vote_count = $(this).siblings('.post-vote-count');
        let data_vote_count = vote_count.attr('data-vote-count');
        if (parent.attr('data-vote-status') != -1) {
            var diff = 1;
            if (parent.attr('data-vote-status') == 1) diff = 2;
            vote_count.text(nFormatter(parseInt(data_vote_count) - diff, 1));
            vote_count.attr('data-vote-count', parseInt(data_vote_count) - diff);
            parent.attr('data-vote-status', -1);
            $(this).siblings('.post-vote-up').removeClass('active');
        } else {
            parent.attr('data-vote-status', 0);
            vote_count.text(nFormatter(parseInt(data_vote_count) + 1, 1));
            vote_count.attr('data-vote-count', parseInt(data_vote_count) + 1);
        }
    });
});