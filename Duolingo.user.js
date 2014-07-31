// ==UserScript==
// @name        Duolingo
// @namespace   http://userscripts.org/users/delapouite
// @description Nice additions to Duolingo
// @include     http://www.duolingo.com/*
// @include     https://www.duolingo.com/*
// @updateURL   https://github.com/Delapouite/userscripts/raw/master/Duolingo.user.js
// @downloadURL https://github.com/Delapouite/userscripts/raw/master/Duolingo.user.js
// @version     1.2
// @grant       GM_setValue
// @grant       GM_getValue
// ==/UserScript==

/* globals console, document, setTimeout */
/* globals GM_setValue, GM_getValue */

// helper
var $ = document.querySelectorAll.bind(document);

var createSkillsCounters = function(counters) {
	var h1 = $('h1')[0];
	h1.textContent += ' ' + counters.finished + ' / ' + counters.total + ' (' + counters.gold + ')';
};

var scan = function() {
	try {
	// tree page only
	if (!$('.sidebar-stats strong').length) {
		return;
	}

	// local cache
	var data = JSON.parse(GM_getValue('data', '{}'));

	var from = document.body.classList[0].split('-')[1];
	var to = $('span.flag')[0].classList[2].split('-')[1];
	var counters = {
		// - 1 to remove the one in sidebar
		finished: $('.skill-icon-strength').length - 1,
		total: $('.skill-icon').length,
		gold: $('.gold').length,
		xp: $('.points strong')[0].textContent,
		words: $('#word-count')[0].textContent,
		currentLevel: $('.level-current')[0].textContent,
		levelProgress: $('.language-progress-bar-small')[0].title.split(' ')[0],
		date: Date.now()
	};

	// save
	if (!data[from]) {
		data[from] = {};
	}

	data[from][to] = counters;
	GM_setValue('data', JSON.stringify(data));

	// enhance UI
	createSkillsCounters(counters);

	// log
	Object.keys(data).forEach(function(from) {
		Object.keys(data[from]).forEach(function(to) {
			var c = data[from][to];
			console.info(
				from + ' -> ' + to,
				c.finished + '/' + c.total + '(' + c.gold + ')',
				c.xp + 'xp',
				c.words + 'w',
				c.currentLevel + 'Lvl(' + c.levelProgress + ')'
			);
		});
	});

	console.info(JSON.stringify(data));

	} catch (ex) {
		console.error(ex);
	}
};

// wait for full async load
setTimeout(scan, 6000);
