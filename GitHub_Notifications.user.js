// ==UserScript==
// @name        GitHub
// @namespace   http://userscripts.org/users/delapouite
// @description Nice additions to GitHub notifications
// @include     https://github.com/notifications
// @include     https://github.com/*/*/notifications
// @updateURL   https://github.com/Delapouite/userscripts/raw/master/GitHub_Notifications.user.js
// @downloadURL https://github.com/Delapouite/userscripts/raw/master/GitHub_Notifications.user.js
// @version     2.0
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       unsafeWindow
// ==/UserScript==

'use strict';

// helpers

var $ = document.querySelectorAll.bind(document)

var cache = JSON.parse(GM_getValue('cache', '{}'))

function save () {
	GM_setValue('cache', JSON.stringify(cache))
}

function decorate (notif, createdAt) {
	let s = document.createElement('strong')
	s.textContent = createdAt
	notif.appendChild(s)
}

// not used yet
function addCreatedAt () {
	var notifications = $('.js-notification')

	for (let n of notifications) {
		let href = n.querySelector('.js-notification-target').href
		let [a, b, c, owner, project, d, issueId] = href.split('/')
		issueId = issueId.split('#')[0]
		let notifId = `${owner}/${project}/${issueId}`

		if (cache[notifId]) {
			decorate(n, cache[notifId])
		} else {
			// TODO API rate limit
			fetch(`https://api.github.com/repos/${owner}/${project}/issues/${issueId}`)
			.then(res => res.json())
			.then(res => {
				if (!res.created_at) return
					cache[notifId] = res.created_at
				save()
				decorate(n, res.created_at)
			})
			.catch(err => console.error(err))
		}
	}
}

function addAvatars () {
	var repos = $('.small .filter-item')

	for (let r of repos) {
		let user = r.title.split('/')[0]

		let img = document.createElement('img')
		img.style.display = 'block'
		img.style.float = 'left'
		img.style.height = '1.5em'
		img.style.marginRight = '0.5em'
		img.style.width = '1.5em'

		img.src = `https://avatars.githubusercontent.com/${user}`
		r.insertBefore(img, r.firstChild)
	}
}

addAvatars()
