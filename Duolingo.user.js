// ==UserScript==
// @name        Duolingo
// @namespace   http://userscripts.org/users/delapouite
// @description Nice additions to Duolingo
// @include     http://www.duolingo.com/*
// @include     https://www.duolingo.com/*
// @updateURL   https://github.com/Delapouite/userscripts/raw/master/Duolingo.user.js
// @downloadURL https://github.com/Delapouite/userscripts/raw/master/Duolingo.user.js
// @version     1.5
// @grant       GM_setValue
// @grant       GM_getValue
// ==/UserScript==

/* globals console, document, setTimeout */
/* globals GM_setValue, GM_getValue */

// helpers

var $ = document.querySelectorAll.bind(document);

var formatDate = function(ts){
	var d = new Date(ts);
	return d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
};

// data already filtered by from
var createSkillsCounters = function(data, to) {
	// dropdown
	var languageChoices = $('.language-choice');
	for (var i = 0; i < languageChoices.length; i++) {
		var li = languageChoices[i];
		var d = data[li.dataset.value];
		// data not yet computed
		if (!d) {
			continue;
		}
		var span = document.createElement('span');
		span.textContent = d.finished + '/' + d.total + '(' + d.gold + ') ' + formatDate(d.date);
		li.appendChild(span);
	}
	// in the main title
	var current = data[to];
	var h1 = $('h1')[0];
	h1.textContent += ' ' + current.finished + ' / ' + current.total + ' (' + current.gold + ')';
};

// to export data
var log = function(data) {
	Object.keys(data).forEach(function(from) {
		console.info('===', from, '===');
		Object.keys(data[from]).forEach(function(to) {
			var c = data[from][to];
			console.info(
				from + ' -> ' + to,
				c.finished + '/' + c.total + '(' + c.gold + ')',
				c.xp + 'xp',
				c.words + 'w',
				c.currentLevel + 'Lvl(' + c.levelProgress + ')',
				formatDate(c.date)
			);
		});
	});
	console.info(JSON.stringify(data));
};

// to handle legacy / new page layouts

var getXps = function() {
	// new layout
	var xps = $('.points strong');
	if (xps.length) {
		return xps[0].textContent;
	}
	return $('.sidebar-stats strong')[0].textContent;
};

var getWords = function() {
	// new layout
	var words = $('#word-count');
	if (words.length) {
		return words[0].textContent;
	}
	return $('.sidebar-stats strong')[1].textContent;
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
	var levelProgress = $('.language-progress-bar-small')[0].title.split(' ')[0];
	var counters = {
		// - 1 to remove the one in sidebar
		finished: $('.skill-icon-strength').length - 1,
		total: $('.skill-icon').length,
		gold: $('.gold').length,
		xp: getXps(),
		currentXp: levelProgress.split('/')[0],
		ceilXp: levelProgress.split('/')[1],
		words: getWords(),
		currentLevel: $('.level-current')[0].textContent,
		levelProgress: levelProgress,
		date: Date.now()
	};

	// save
	if (!data[from]) {
		data[from] = {};
	}

	data[from][to] = counters;
	GM_setValue('data', JSON.stringify(data));

	// enhance UI
	createSkillsCounters(data[from], to);

	// export in console
	log(data);

	} catch (ex) {
		console.error(ex);
	}
};

// wait for full async load
setTimeout(scan, 6000);
