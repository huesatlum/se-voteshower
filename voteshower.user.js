// ==UserScript==
// @name         Vote shower
// @version      0.1
// @description  View vote counts on all Stack Exchange sites
// @author       NinjaBearMonkey
// @grant        none
// @match       *://*.askubuntu.com/*
// @match       *://*.mathoverflow.net/*
// @match       *://*.serverfault.com/*
// @match       *://*.stackapps.com/*
// @match       *://*.stackexchange.com/*
// @match       *://*.stackoverflow.com/*
// @match       *://*.superuser.com/*
// ==/UserScript==

if($) {
$('.vote-count-post')
  .attr('title', 'View upvote and downvote totals')
  .css('cursor', 'pointer')
  .click(function(){
    var votesElem = $(this),
        site = location.hostname.replace(/(?:\.stackexchange)?\.com$/g, ''),
        isAnswer = votesElem.parents('.answer').length,
        ajaxUrl;

    if(isAnswer) {
      var answerId = votesElem.parents('.answer').data('answerid');
      ajaxUrl = '//api.stackexchange.com/2.2/answers/' + answerId +
            '?site=' + site +
            '&filter=!)Q29lpdRHRpfMsqq*ySFJsQT';
    } else {
      var questionId = votesElem.parents('.question').data('questionid');
      ajaxUrl = '//api.stackexchange.com/2.2/questions/' + questionId +
            '?site=' + site +
            '&filter=!-MOiNm409htl4uNYt6LSSHfqe-dMsG*D*';
    }

    $.ajax(ajaxUrl)
      .done(function(data) {
        var upNum = data.items[0].up_vote_count,
            downNum = data.items[0].down_vote_count;

        votesElem.empty()
          .attr('title', upNum + ' up / ' + downNum + ' down')
          .css('cursor', 'default');

        if(upNum > 0) {
          upNum = '+' + upNum;
        }
        if(downNum > 0) {
          downNum = '-' + downNum;
        }

        $('<div>')
          .css('color', 'green')
          .text(upNum)
          .appendTo(votesElem);

        $('<div>')
          .addClass('vote-count-separator')
          .appendTo(votesElem);

        $('<div>')
          .css('color', 'maroon')
          .text(downNum)
          .appendTo(votesElem);
      });
  });
}
