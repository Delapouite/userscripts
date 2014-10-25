// ==UserScript==
// @name        Duolingo
// @namespace   http://userscripts.org/users/delapouite
// @description Nice additions to Duolingo
// @include     http://www.duolingo.com/*
// @include     https://www.duolingo.com/*
// @updateURL   https://github.com/Delapouite/userscripts/raw/master/Duolingo.user.js
// @downloadURL https://github.com/Delapouite/userscripts/raw/master/Duolingo.user.js
// @version     1.8
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       unsafeWindow
// ==/UserScript==

/* globals console, document, setTimeout */
/* globals GM_setValue, GM_getValue, GM_registerMenuCommand, unsafeWindow */

'use strict';

// helpers
var $ = document.querySelectorAll.bind(document);

var formatDate = function(ts) {
	var d = new Date(ts);
	return d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
};

var formatInfos = function(c) {
	return [
		c.finished + '/' + c.total + '(' + c.gold + ')',
		c.xp + 'xp',
		c.words + 'w',
		c.currentLevel + 'Lvl(' + c.levelProgress + ')',
		formatDate(c.date)
	];
};

var createSpan = function(textContent) {
	var span = document.createElement('span');
	span.className = 'gm-duo';
	span.textContent = textContent;
	return span;
};

var deleteSkillsCounters = function() {
	var previousSpans = $('.gm-duo');
	for (let i = 0; i < previousSpans.length; i++) {
		previousSpans[i].remove();
	}
};

// data already filtered by from
var createSkillsCounters = function(data, to) {
	deleteSkillsCounters();
	// dropdown
	var languageChoices = $('.language-choice');
	for (let i = 0; i < languageChoices.length; i++) {
		let li = languageChoices[i];
		let d = data[li.dataset.value];
		// data not yet computed
		if (!d) {
			continue;
		}
		let span = createSpan(d.finished + '/' + d.total + '(' + d.gold + ') ' + formatDate(d.date));
		li.appendChild(span);
	}
	// under the main title
	var current = data[to];
	var levelText = $('.level-text')[0];
	var span = createSpan(' ' + formatInfos(current).join(' | '));
	levelText.appendChild(span);
};

// to export data
var log = function(data) {
	var totalXp = 0;
	Object.keys(data).forEach(function(from) {
		console.info('===', from, '===');
		Object.keys(data[from]).forEach(function(to) {
			var c = data[from][to];
			totalXp += +c.xp;

			var obsolete = Date.now() - c.date > 1000 * 60 * 24 * 7;
			var logLevel = obsolete ? 'error' : 'info';
			var toLog = [from + ' -> ' + to].concat(formatInfos(c));
			console[logLevel](toLog);
		});
	});
	console.info('Total xp', totalXp);
	// export
	console.info(JSON.stringify(data));
};

// skills

var getFinished = function() {
	// - 1 to remove the one in sidebar
	return $('.skill-icon-strength').length - 1;
};

var getTotal = function() {
	return $('.skill-icon').length;
};

var getGold = function() {
	return $('.gold').length;
};

var scan = function() {
	try {

	// tree page only
	if ($('.skill-icon').length < 3) {
		return;
	}

	// local cache
	var data = JSON.parse(GM_getValue('data', '{}'));

	var from = document.body.classList[0].split('-')[1];
	var to = $('span.flag')[0].classList[2].split('-')[1];

	var duoData = unsafeWindow.duo.user.attributes.language_data[to];

	var counters = {
		// skills
		finished: getFinished(),
		total: getTotal(),
		gold: getGold(),
		xp: duoData.points,
		currentXp: duoData.level_progress,
		ceilXp: duoData.level_points,
		words: duoData.word_count,
		currentLevel: duoData.level,
		levelProgress: duoData.level_progress + '/' + duoData.level_points,
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
setTimeout(scan, 4000);

GM_registerMenuCommand('Scan Tree', scan, 'S');
