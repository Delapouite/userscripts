// ==UserScript==
// @name        GitHub
// @namespace   http://userscripts.org/users/delapouite
// @description Nice additions to GitHub notifications
// @include     https://github.com/*
// @updateURL   https://github.com/Delapouite/userscripts/raw/master/GitHub_Notifications.user.js
// @downloadURL https://github.com/Delapouite/userscripts/raw/master/GitHub_Notifications.user.js
// @version     3.2
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       unsafeWindow
// ==/UserScript==

'use strict';

// helpers

const $ = document.querySelectorAll.bind(document)

const cache = JSON.parse(GM_getValue('cache', '{}'))

const save = () => GM_setValue('cache', JSON.stringify(cache))

const decorate = (notif, createdAt) => {
	const s = document.createElement('strong')
	s.textContent = createdAt
	notif.appendChild(s)
}

// not used yet
const addCreatedAt = () => {
	const notifications = $('.js-notification')

	for (let n of notifications) {
		const href = n.querySelector('.js-notification-target').href
		const [a, b, c, owner, project, d, issueId] = href.split('/')
		issueId = issueId.split('#')[0]
		const notifId = `${owner}/${project}/${issueId}`

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

const addAvatars = () => {
	const repos = $('.small .filter-item')

	for (let r of repos) {
		const user = r.title.split('/')[0]

		const img = document.createElement('img')
		Object.assign(img.style, {
			display: 'block',
			float: 'left',
			height: '1.5em',
			marginRight: '0.5em',
			width: '1.5em'
		})

		img.src = `https://avatars.githubusercontent.com/${user}`
		r.insertBefore(img, r.firstChild)
	}
}

const addNotifNav = () => {
	const nav = $('.reponav')[0]
	if (!nav) return

	const [_, user, repo] = document.location.pathname.split('/')

	const a = document.createElement('a')
	a.className = 'reponav-item'
	a.textContent = ' Notifications'
	a.href = `${document.location.origin}/${user}/${repo}/notifications`

	const icon = document.createElement('span')
	icon.className = 'octicon octicon-bell'

	a.insertBefore(icon, a.firstChild)
	nav.appendChild(a)
}
if (document.location.pathname.includes('/notifications'))
	addAvatars()

addNotifNav()
