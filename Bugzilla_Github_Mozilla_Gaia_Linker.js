// ==UserScript==
// @name        Bugzilla - Github - Mozilla Gaia Linker
// @namespace   http://userscripts.org/users/delapouite
// @description Create links from Github issues to their corresponding Bugzilla entries for the Mozilla Gaia project
// @include     https://github.com/mozilla-b2g/gaia/*
// @version     1
// ==/UserScript==

var re = /^\[?bug (\d*)\]? (.*)/i;

// View issue page : grab the bug Id in the title
var discussionTitle = document.getElementsByClassName('discussion-topic-title');
if (discussionTitle.length !== 0) {
	discussionTitle = discussionTitle[0];
	var matches = discussionTitle.textContent.match(re);
	if (matches[1]) {
		// create link
		discussionTitle.innerHTML = '<a href="https://bugzilla.mozilla.org/show_bug.cgi?id=' + matches[1] + '">Bug ' + matches[1] + '</a>';
		discussionTitle.innerHTML += ' ' + matches[2];
	}
}

// Notifications page
var notifications = document.querySelectorAll('.js-notification h4');
if (notifications.length !== 0) {
	Array.prototype.forEach.call(notifications, function (notification) {
		// move icons out of the way
		var icon = notification.getElementsByClassName('type-icon')[0];
		var link = notification.getElementsByTagName('a')[0];
		var clonedIcon = icon.cloneNode();
		clonedIcon.style.margin = '12px 6px 12px 0';
		clonedIcon.style.cssFloat = 'left';
		notification.insertBefore(clonedIcon, link);
		icon.remove();
	});
}