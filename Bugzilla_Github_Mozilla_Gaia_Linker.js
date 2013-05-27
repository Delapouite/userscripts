// ==UserScript==
// @name        Bugzilla - Github - Mozilla Gaia Linker
// @namespace   http://userscripts.org/users/delapouite
// @description Create links from Github issues to their corresponding Bugzilla entries for the Mozilla Gaia project
// @include     https://github.com/mozilla-b2g/gaia/*
// @version     1
// ==/UserScript==

// grab the bug Id in the title
var discussionTitle = document.getElementsByClassName('discussion-topic-title');
if (discussionTitle) {
	discussionTitle = discussionTitle[0];
	var re = /^\[?bug (\d*)\]? (.*)/i;
	var matches = discussionTitle.textContent.match(re);
	if (matches[1]) {
		// create link
		discussionTitle.innerHTML = '<a href="https://bugzilla.mozilla.org/show_bug.cgi?id=' + matches[1] + '">Bug ' + matches[1] + '</a>';
		discussionTitle.innerHTML += ' ' + matches[2];
	}
}