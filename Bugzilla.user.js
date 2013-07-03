// ==UserScript==
// @name        Bugzilla
// @namespace   http://userscripts.org/users/delapouite
// @description Create links on Product and Component on a bug page
// @include     https://bugzilla.mozilla.org/show_bug.cgi?id=*
// @updateURL   https://github.com/Delapouite/userscripts/raw/master/Bugzilla.user.js
// @downloadURL https://github.com/Delapouite/userscripts/raw/master/Bugzilla.user.js
// @version     1
// ==/UserScript==

function createLink(type) {
	var el = document.getElementById('field_container_' + type);
	var link = document.createElement('a');
	var text = el.childNodes[0].nodeValue;
	el.childNodes[0].nodeValue = '';
	link.href = 'https://bugzilla.mozilla.org/buglist.cgi?' + type + '=' + text;
	link.textContent = text;
	el.appendChild(link);
}

createLink('product');
createLink('component');