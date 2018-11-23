const Cookies = {
	_protected: [],
	_defaultExpiration: 2592000, //30 days in seconds

	setCookie(name, val, exp = this._defaultExpiration) {
		let d = exp;
		if (!(exp instanceof Date)) {
			d = new Date();
			d.setTime(d.getTime() + exp * 1000);
		}
		document.cookie = `${name}=${val};expires=${d.toGMTString()};path=/;`;
	},

	deleteCookie(name) {
		document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
	},

	deleteAllCookies(deleteProtected = false) {
		document.cookie.split(/; ?/).forEach((c) => {
			const cookieName = c.split('=', 1)[0];
			if (deleteProtected || this._protected.indexOf(cookieName) === -1) {
				this.deleteCookie(cookieName);
			}
		});
	},

	protectCookie(name) {
		this._protected.push(name);
	},

	getCookie(name) {
		let res = null;
		document.cookie.split(/; ?/).some((cookie) => {
			const [cookieName, cookieValue] = cookie.split('=');
			if (cookieName === name) { //Cookie name matches
				res = cookieValue;
				return true;
			}
			return false;
		});
		return res;
	},

	isCookieSet(name) {
		return this.getCookie(name) !== null;
	}
};
