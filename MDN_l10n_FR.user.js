// ==UserScript==
// @name        MDN - l10n - FR
// @namespace   http://userscripts.org/users/delapouite
// @description Add the number of available languages on the dropdown toggle itself
// @include     https://developer.mozilla.org/en-US/docs/*
// @version     1
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function() {
	var languagesToggle = document.querySelector('#tools > li:nth-child(2) a');
	var translations = document.querySelectorAll('#translations a');
	// remove 'Add translation' link from count
	languagesToggle.textContent += ' (' + (translations.length - 1) + ')';
	for (var i = 0; i < translations.length; i++) {
		var translation = translations[i];
		// add a FR direct access
		if (translation.textContent.match('Français')) {
			var frLink = document.createElement('a');
			frLink.textContent = 'FR';
			frLink.href = translation.href;
			var li = document.createElement('li');
			li.className = 'menu';
			li.appendChild(frLink);
			document.getElementById('tools').appendChild(li);
		}
	}
});