// ==UserScript==
// @name        Lodash Documentation Aliases
// @namespace   http://userscripts.org/users/delapouite
// @description Add function aliases in TOC
// @include     http://lodash.com/docs
// @version     1
// ==/UserScript==

// Lodash is available on this page

// TOC is the first div in the page
var TOC = document.querySelector('div');
_.forEach(TOC.getElementsByTagName('a'), function(a) {
	var target = a.href.split('#')[1];
	if (target && !_.contains(a.textContent, target.replace('_', '.'))) {
		var alias = document.createElement('span');
		alias.innerHTML = ' -> ' + target;
		a.getElementsByTagName('code')[0].appendChild(alias);
	}
});