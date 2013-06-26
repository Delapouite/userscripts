// ==UserScript==
// @name        Lodash Documentation Aliases
// @namespace   http://userscripts.org/users/delapouite
// @description Add function aliases in TOC
// @include     http://lodash.com/docs
// @updateURL   https://github.com/Delapouite/userscripts/raw/master/Lodash_Documentation_Aliases.user.js
// @downloadURL https://github.com/Delapouite/userscripts/raw/master/Lodash_Documentation_Aliases.user.js
// @version     2.1
// ==/UserScript==

// Lodash is available on this page

// TOC is the first div in the page
var TOC = document.querySelector('div');
_.forEach(TOC.getElementsByTagName('a'), function(a) {
	var target = a.href.split('#')[1];
	if (target && target !== '_' && a.textContent.trim() !== '_.' + target.replace('_', '.')) {
		var alias = document.createElement('span');
		alias.innerHTML = ' -> ' + target;
		a.style.opacity = 0.5;
		a.getElementsByTagName('code')[0].appendChild(alias);
	}
});