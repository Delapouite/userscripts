// ==UserScript==
// @name        MDN - l10n - FR
// @namespace   http://userscripts.org/users/delapouite
// @description Add the number of available languages on the dropdown toggle itself
// @include     https://developer.mozilla.org/en-US/docs/*
// @include     https://developer.mozilla.org/fr/docs/*
// @updateURL   https://github.com/Delapouite/userscripts/raw/master/MDN_l10n_FR.user.js
// @downloadURL https://github.com/Delapouite/userscripts/raw/master/MDN_l10n_FR.user.js
// @version     4
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function() {
	var translationsToggle = document.querySelector('#tools > li:nth-child(2) a');
	var translations = document.querySelectorAll('#translations a');
	var articleLinks = document.querySelectorAll('#wikiArticle a');
	var historyLink = document.querySelector('.page-history a');
	var lastUpdate = document.querySelector('#doc-contributors time').textContent;
	var userState = document.querySelector('.user-state');

	// remove 'Add translation' link from count
	translationsToggle.textContent += ' (' + (translations.length - 1) + ')';

	function addTranslationShortcut(translation) {
		// remove arrow
		translation.style.backgroundImage = 'none';
		var li = document.createElement('li');
		li.className = 'menu';
		li.appendChild(translation);
		document.getElementById('tools').appendChild(li);
	}

	for (var i = 0; i < translations.length; i++) {
		var translation = translations[i];
		// add a FR or US direct access in the nav bar
		if (translation.textContent.match('Français|English')) {
			addTranslationShortcut(translation);
		}
	}
	// turn FR links in green in the content if they point to another FR page
	for (var i = 0; i < articleLinks.length; i++) {
		var articleLink = articleLinks[i];
		if (articleLink.href.match(/\/fr\//)) {
			articleLink.style.background = 'rgba(0, 255, 0, 0.4)';
		}
	}
	// TODO : keep the book icon
	if (historyLink) {
		historyLink.textContent += ' - ' + lastUpdate;
	}

	// add a link to dashboard
	if (userState) {
		var li = document.createElement('li');
		var a = document.createElement('a');
		a.textContent = 'Dashboard';
		a.href = 'https://developer.mozilla.org/en-US/dashboards/revisions?locale=fr';
		li.appendChild(a);
		userState.appendChild(li);
	}
});