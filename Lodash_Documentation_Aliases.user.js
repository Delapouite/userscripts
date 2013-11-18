// ==UserScript==
// @name        Lodash Documentation Aliases
// @namespace   http://userscripts.org/users/delapouite
// @description Add function aliases in TOC
// @include     http://lodash.com/docs*
// @updateURL   https://github.com/Delapouite/userscripts/raw/master/Lodash_Documentation_Aliases.user.js
// @downloadURL https://github.com/Delapouite/userscripts/raw/master/Lodash_Documentation_Aliases.user.js
// @version     4.0
// ==/UserScript==

// Lodash is available on this page
/* global _ */

// TOC is the first div in the page
var TOC = document.getElementsByTagName('div')[0],
	main = document.querySelectorAll('body > div')[1],
	nav = document.getElementsByTagName('h1')[0];

// add faded aliases
_.forEach(TOC.getElementsByTagName('a'), function(a) {
	var target = a.href.split('#')[1];
	if (target && target !== '_' && a.textContent.trim() !== '_.' + target.replace('_', '.')) {
		var alias = document.createElement('span');
		alias.innerHTML = ' -> ' + target;
		a.style.opacity = 0.5;
		a.className = 'alias';
		a.getElementsByTagName('code')[0].appendChild(alias);
	}
});

// add link to home
var homeLink = document.createElement('a');
homeLink.textContent = 'Lo-Dash';
homeLink.href = '//lodash.com';
homeLink.style.marginRight = '0.5em';
nav.childNodes[0].textContent = '';
nav.insertBefore(homeLink, nav.firstChild);

// build categories top menu
var categoryLinks = document.createElement('span');
categoryLinks.style.fontSize = '0.5em';
_.forEach(TOC.getElementsByTagName('h2'), function(h2) {
	h2.id = h2.textContent;
	var a = document.createElement('a');
	a.textContent = h2.textContent;
	a.href = '#' + h2.textContent;
	a.style.margin = '0 1em';
	categoryLinks.appendChild(a);
});
nav.appendChild(categoryLinks);

// add classes for display toggling
_.forEach(main.querySelectorAll('h3'), function(h3) {
	h3.className = 'signature';
});

_.forEach(main.querySelectorAll('ol'), function(h3) {
	h3.className = 'IO';
});

_.forEach(main.querySelectorAll('p:last-of-type'), function(p) {
	p.className = 'IO';
});

_.forEach(main.querySelectorAll('pre'), function(pre) {
	pre.className = 'example';
});

_.forEach(main.querySelectorAll('h4'), function(h4) {
	switch(h4.textContent.trim()) {
		case 'Aliases':
			h4.className = 'description';
			break;
		case 'Arguments':
		case 'Returns':
			h4.className = 'IO';
			break;
		case 'Example':
			h4.className = 'example';
			break;
	}
});

// remaining paragraphs
_.forEach(main.querySelectorAll('p'), function(p) {
	if (!p.className)
		p.className = 'description';
});

// add display checkboxes to top menu
var checkboxes = document.createElement('span');
checkboxes.style.borderLeft = '1px solid #CCC';
checkboxes.style.color = '#333';
checkboxes.style.fontSize = '0.5em';
checkboxes.style.paddingLeft = '0.5em';

var labelTexts = ['signature', 'description', 'IO', 'example'];
_.forEach(labelTexts, function(labelText) {
	var label = document.createElement('label');
	label.style.marginRight = '1em';
	var cb = document.createElement('input');
	cb.type = 'checkbox';
	cb.checked = true;
	cb.id = 'display-' + labelText;
	label.textContent = labelText;
	label.appendChild(cb);
	checkboxes.appendChild(label);

	// toggle event
	var elts = document.getElementsByClassName(labelText);
	cb.addEventListener('click', function() {
		_.forEach(elts, function(elt) {
			elt.style.display = this.checked ? 'block' : 'none';
		}.bind(this));
	});
});
nav.appendChild(checkboxes);

// methods count by category in TOC
_.forEach(TOC.getElementsByTagName('div'), function(section) {
	var entriesCount = section.getElementsByTagName('li').length,
		aliasCount = section.getElementsByClassName('alias').length;
	section.querySelector('h2 code').innerHTML += ' (' + (entriesCount - aliasCount) + '/' + entriesCount + ')';
});