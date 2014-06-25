// ==UserScript==
// @name        Duolingo
// @namespace   http://userscripts.org/users/delapouite
// @description Nice additions to Duolingo
// @include     http://www.duolingo.com/*
// @include     https://www.duolingo.com/*
// @updateURL   https://github.com/Delapouite/userscripts/raw/master/Duolingo.user.js
// @downloadURL https://github.com/Delapouite/userscripts/raw/master/Duolingo.user.js
// @version     1
// ==/UserScript==

var w = unsafeWindow;
setTimeout(function() {
	// tree page only
	if (!w.$('.sidebar-stats strong').length) return;

	// local cache
	var data = GM_getValue('data') || '{}';
	data = JSON.parse(data);

	var from = w.$('body').attr('class').split('-')[1];
	var to = w.$('span.flag').attr('class').split('-')[3];
	var counters = {
		// - 1 to remove the one in sidebar
		finished: w.$('.skill-icon-strength').length - 1,
		total: w.$('.skill-icon').length,
		gold: w.$('.gold').length,
		xp: w.$('.sidebar-stats strong')[0].textContent,
		words: w.$('.sidebar-stats strong')[1].textContent,
		date: Date.now()
	};
	if (!data[from]) {
		data[from] = {};
	}

	data[from][to] = counters;
	GM_setValue('data', JSON.stringify(data));

	// log
	Object.keys(data).forEach(function(from) {
		Object.keys(data[from]).forEach(function(to) {
			var c = data[from][to];
			console.log('From', from, 'to', to, c.finished + '/' + c.total, '(' + c.gold +')', c.xp + 'xp', c.words + 'words')
		});
	});

	console.log(JSON.stringify(data));

}, 6000);